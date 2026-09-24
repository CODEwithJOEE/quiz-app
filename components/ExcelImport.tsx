"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { parseQuizExcel } from "@/lib/quiz/parseExcel";
import { bulkInsertQuestions } from "@/src/app/[locale]/(dashboard)/quiz/[quizId]/question-actions";
import { Card } from "@/components/ui/Card";

export default function ExcelImport({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [parsing, setParsing] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage(null);
    setFileName(file.name);
    setParsing(true);

    try {
      const parsed = await parseQuizExcel(file);
      setParsing(false);

      startTransition(async () => {
        const res = await bulkInsertQuestions(quizId, parsed);
        if (res?.error) {
          setMessage({ type: "err", text: res.error });
        } else {
          setMessage({
            type: "ok",
            text: `Imported ${res.inserted} question(s) successfully.`,
          });
          router.refresh();
        }
        // Reset
        setFileName(null);
        if (inputRef.current) inputRef.current.value = "";
      });
    } catch (err: any) {
      setParsing(false);
      setFileName(null);
      if (inputRef.current) inputRef.current.value = "";
      setMessage({ type: "err", text: err.message });
    }
  }

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center">
          <FileSpreadsheet className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-semibold text-sm">Import from Excel / CSV</h2>
          <p className="text-xs text-muted-foreground">
            Bulk-add questions in one shot
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
            message.type === "ok"
              ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
          }`}
        >
          {message.type === "ok" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Template download */}
      <a
        href="/quiz-template.csv"
        download
        className="flex items-center gap-2 p-3 rounded-xl bg-muted hover:bg-border transition-colors text-sm"
      >
        <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shrink-0">
          <Download className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">Download template</p>
          <p className="text-xs text-muted-foreground">
            CSV format — fill then upload
          </p>
        </div>
      </a>

      {/* Drop zone / File picker */}
      <label
        className={`relative flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
          pending || parsing
            ? "border-brand bg-blue-50 dark:bg-blue-950"
            : "border-border hover:border-brand hover:bg-muted/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          disabled={pending || parsing}
          className="sr-only"
        />

        {pending || parsing ? (
          <>
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
            <p className="text-sm font-medium">
              {parsing ? "Parsing file..." : "Importing..."}
            </p>
            {fileName && (
              <p className="text-xs text-muted-foreground">{fileName}</p>
            )}
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Tap to select file</p>
            <p className="text-xs text-muted-foreground">
              .xlsx, .xls, or .csv
            </p>
          </>
        )}
      </label>

      {/* Format hint */}
      <div className="bg-muted/50 rounded-xl p-3 space-y-1.5">
        <p className="text-xs font-semibold">Required columns:</p>
        <div className="flex flex-wrap gap-1">
          {[
            "question",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
            "correct",
            "points",
          ].map((col) => (
            <code
              key={col}
              className="text-[10px] px-1.5 py-0.5 rounded bg-card border border-border"
            >
              {col}
            </code>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          <code className="text-[10px]">correct</code> = A / B / C / D.
          <code className="text-[10px] ml-1">option_c</code> and{" "}
          <code className="text-[10px]">option_d</code> optional.
        </p>
      </div>
    </Card>
  );
}
