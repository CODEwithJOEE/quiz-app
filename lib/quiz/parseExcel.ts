import * as XLSX from "xlsx";

export type ParsedQuestion = {
  question_text: string;
  question_type: "multiple_choice" | "essay";
  points: number;
  options: {
    option_text: string;
    is_correct: boolean;
    order_index: number;
  }[];
  word_limit_min?: number | null;
  word_limit_max?: number | null;
  rubric?: string | null;
};

export function parseQuizExcel(file: File): Promise<ParsedQuestion[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (rows.length === 0) {
          reject(new Error("Walang laman ang file."));
          return;
        }

        const firstRow = rows[0];
        if (!("question" in firstRow)) {
          reject(new Error("Missing 'question' column. Check the template."));
          return;
        }

        // Check if new format has question_type
        const hasTypeColumn = "question_type" in firstRow;

        const parsed: ParsedQuestion[] = rows.map((r, i) => {
          // Determine question type
          const type = hasTypeColumn
            ? String(r.question_type ?? "multiple_choice")
                .trim()
                .toLowerCase()
            : "multiple_choice";

          if (!["multiple_choice", "essay"].includes(type)) {
            throw new Error(
              `Row ${i + 2}: Invalid question_type "${r.question_type}". Use "multiple_choice" or "essay".`,
            );
          }

          const questionText = String(r.question ?? "").trim();
          if (!questionText) {
            throw new Error(`Row ${i + 2}: Question text is required.`);
          }

          const points = Number(r.points) || 1;

          if (type === "essay") {
            // Essay parsing
            return {
              question_text: questionText,
              question_type: "essay",
              points,
              options: [],
              word_limit_min: r.word_limit_min
                ? Number(r.word_limit_min)
                : null,
              word_limit_max: r.word_limit_max
                ? Number(r.word_limit_max)
                : null,
              rubric: String(r.rubric ?? "").trim() || null,
            };
          }

          // MCQ parsing (existing logic)
          const correctLetter = String(r.correct ?? "")
            .trim()
            .toUpperCase();
          if (!["A", "B", "C", "D"].includes(correctLetter)) {
            throw new Error(
              `Row ${i + 2}: 'correct' must be A, B, C, or D (got "${r.correct}")`,
            );
          }

          const rawOptions = [
            { text: r.option_a, letter: "A" },
            { text: r.option_b, letter: "B" },
            { text: r.option_c, letter: "C" },
            { text: r.option_d, letter: "D" },
          ];

          const opts = rawOptions
            .filter((o) => String(o.text).trim() !== "")
            .map((o, idx) => ({
              option_text: String(o.text).trim(),
              is_correct: o.letter === correctLetter,
              order_index: idx,
            }));

          if (opts.length < 2) {
            throw new Error(`Row ${i + 2}: at least 2 options required`);
          }

          if (!opts.some((o) => o.is_correct)) {
            throw new Error(
              `Row ${i + 2}: correct answer "${correctLetter}" not found in options`,
            );
          }

          return {
            question_text: questionText,
            question_type: "multiple_choice",
            points,
            options: opts,
          };
        });

        resolve(parsed);
      } catch (err: any) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}
