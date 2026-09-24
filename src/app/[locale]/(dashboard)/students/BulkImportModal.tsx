"use client";

import { useState, useTransition, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Users,
  X,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Printer,
  Copy,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  bulkImportStudents,
  type BulkRow,
  type BulkResult,
} from "./bulk-actions";
import { Button } from "@/components/ui/Button";

type Stage = "upload" | "preview" | "processing" | "results";

export default function BulkImportModal() {
  const t = useTranslations("BulkImport");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("upload");
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [results, setResults] = useState<BulkResult[]>([]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setStage("upload");
    setRows([]);
    setResults([]);
    setError(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleOpen() {
    reset();
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(reset, 200);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (raw.length === 0) {
        setError(t("noData"));
        return;
      }

      const first = raw[0];
      if (!("full_name" in first) || !("email" in first)) {
        setError(t("missingColumns"));
        return;
      }

      const parsed: BulkRow[] = raw
        .map((r) => ({
          full_name: String(r.full_name ?? "").trim(),
          email: String(r.email ?? "")
            .trim()
            .toLowerCase(),
          grade_level: String(r.grade_level ?? "").trim() || undefined,
          section: String(r.section ?? "").trim() || undefined,
        }))
        .filter((r) => r.full_name && r.email);

      if (parsed.length === 0) {
        setError(t("noValidRows"));
        return;
      }

      if (parsed.length > 100) {
        setError(t("maxRows"));
        return;
      }

      setRows(parsed);
      setStage("preview");
    } catch (err: any) {
      setError(err.message ?? t("readError"));
    }
  }

  function handleImport() {
    setError(null);
    setStage("processing");

    startTransition(async () => {
      const res = await bulkImportStudents(rows);
      if (res?.error) {
        setError(res.error);
        setStage("preview");
        return;
      }
      setResults(res.results ?? []);
      setStage("results");
      router.refresh();
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors shrink-0"
      >
        <Upload className="w-3.5 h-3.5" />
        {t("buttonLabel")}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-xl border border-border p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">{t("title")}</h2>
              <p className="text-xs text-muted-foreground">
                {stage === "upload" && t("subtitleUpload")}
                {stage === "preview" &&
                  t("subtitlePreview", { count: rows.length })}
                {stage === "processing" && t("subtitleProcessing")}
                {stage === "results" && t("subtitleResults")}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={pending}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {stage === "upload" && (
          <>
            <a
              href="/students-template.csv"
              download
              className="flex items-center gap-2 p-3 rounded-xl bg-muted hover:bg-border transition-colors text-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{t("downloadTemplate")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("downloadTemplateHint")}
                </p>
              </div>
            </a>

            <label
              className={`relative flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                fileName
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                  : "border-border hover:border-emerald-500 hover:bg-muted/50"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFile}
                className="sr-only"
              />
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">
                {fileName ?? t("tapToSelect")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("supportedFiles")}
              </p>
            </label>

            <div className="bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 p-3 rounded-xl text-xs space-y-1">
              <p className="font-medium">⚠️ {t("beforeImport")}</p>
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                <li>{t("beforeImportBullet1")}</li>
                <li>{t("beforeImportBullet2")}</li>
                <li>{t("beforeImportBullet3")}</li>
              </ul>
            </div>
          </>
        )}

        {/* Stage: Preview */}
        {stage === "preview" && (
          <>
            <div className="max-h-64 overflow-y-auto border border-border rounded-xl">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium">#</th>
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-left p-2 font-medium">Email</th>
                    <th className="text-left p-2 font-medium">Grade</th>
                    <th className="text-left p-2 font-medium">Section</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2 text-muted-foreground">{i + 1}</td>
                      <td className="p-2 truncate max-w-[100px]">
                        {r.full_name}
                      </td>
                      <td className="p-2 text-muted-foreground truncate max-w-[130px]">
                        {r.email}
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {r.grade_level ?? "—"}
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {r.section ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={reset}
                disabled={pending}
                className="flex-1"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleImport}
                loading={pending}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {pending
                  ? t("importing")
                  : t("importN", { count: rows.length })}
              </Button>
            </div>
          </>
        )}

        {stage === "processing" && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-sm font-medium">{t("processing")}</p>
            <p className="text-xs text-muted-foreground">
              {t("processingHint")}
            </p>
          </div>
        )}

        {stage === "results" && (
          <>
            <div className="grid grid-cols-2 gap-2 no-print">
              <div className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-xl p-3 text-center">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xl font-bold">
                  {results.filter((r) => r.status === "created").length}
                </p>
                <p className="text-[10px] uppercase tracking-wide">
                  {t("created")}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-xl p-3 text-center">
                <AlertCircle className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xl font-bold">
                  {results.filter((r) => r.status === "failed").length}
                </p>
                <p className="text-[10px] uppercase tracking-wide">
                  {t("failed")}
                </p>
              </div>
            </div>

            <div className="print-area">
              <div className="print-header">
                <h1>{t("printHeader")}</h1>
                <p>
                  {t("printGeneratedOn")}{" "}
                  {new Date().toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p style={{ marginTop: "4px", fontSize: "10px" }}>
                  {t("printHint")}
                </p>
              </div>

              <p className="text-xs font-medium mb-1.5 no-print">
                {t("credentialsFor")}
              </p>

              <div className="max-h-64 overflow-y-auto border border-border rounded-xl bg-muted/30 print:max-h-none print:overflow-visible print:border-0 print:bg-transparent print:p-0">
                <table className="w-full text-xs print-table">
                  <thead className="bg-muted sticky top-0 print:static print:bg-transparent">
                    <tr>
                      <th className="text-left p-2 font-medium">#</th>
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-left p-2 font-medium">Email</th>
                      <th className="text-left p-2 font-medium">Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results
                      .filter((r) => r.status === "created")
                      .map((r, i) => (
                        <tr
                          key={i}
                          className="border-t border-border print:border-black"
                        >
                          <td className="p-2 text-muted-foreground print:text-black">
                            {i + 1}
                          </td>
                          <td className="p-2 truncate max-w-[100px] print:max-w-none print:whitespace-normal">
                            {r.full_name}
                          </td>
                          <td className="p-2 text-muted-foreground truncate max-w-[130px] print:max-w-none print:text-black print:whitespace-normal">
                            {r.email}
                          </td>
                          <td className="p-2 font-mono font-medium password-cell">
                            {r.password}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {results.filter((r) => r.status === "failed").length > 0 && (
                  <div className="mt-4 text-xs hidden print:block">
                    <p className="font-bold">{t("failedRowsPrint")}</p>
                    <ul style={{ marginTop: "4px", paddingLeft: "16px" }}>
                      {results
                        .filter((r) => r.status === "failed")
                        .map((r, i) => (
                          <li key={i}>
                            {r.full_name} ({r.email}) — {r.error}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 no-print">
              <Button
                onClick={() => window.print()}
                variant="secondary"
                className="w-full"
              >
                <Printer className="w-4 h-4" />
                {t("printCredentials")}
              </Button>
              <Button onClick={handleClose} className="w-full">
                {t("done")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
