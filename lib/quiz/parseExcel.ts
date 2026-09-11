import * as XLSX from "xlsx";

export type ParsedQuestion = {
  question_text: string;
  points: number;
  options: { option_text: string; is_correct: boolean; order_index: number }[];
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

        // Required columns
        const required = ["question", "option_a", "option_b", "correct"];
        const firstRow = rows[0];
        const missing = required.filter((c) => !(c in firstRow));
        if (missing.length > 0) {
          reject(
            new Error(
              `Missing columns: ${missing.join(", ")}. Check the template.`,
            ),
          );
          return;
        }

        const parsed: ParsedQuestion[] = rows.map((r, i) => {
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
            question_text: String(r.question).trim(),
            points: Number(r.points) || 1,
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
