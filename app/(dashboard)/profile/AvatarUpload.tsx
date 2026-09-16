"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { uploadAvatar } from "./avatar-actions";
import ImageCropModal from "./ImageCropModal";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function AvatarUpload({
  currentUrl,
  pending,
  rejectedReason,
  role,
}: {
  currentUrl?: string | null;
  pending: boolean;
  rejectedReason?: string | null;
  role: "super_admin" | "teacher" | "student";
}) {
  const router = useRouter();
  const [pendingUpload, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // =====================================================
  // Step 1: File selected → validate → open crop modal
  // =====================================================
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    // Client-side validation
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `Sobra ang laki (${(file.size / 1024 / 1024).toFixed(1)} MB). Max ${MAX_FILE_SIZE / 1024 / 1024} MB lang.`,
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("JPEG, PNG, o WebP lang ang supported.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Read as data URL for crop
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
    };
    reader.onerror = () => {
      setError("Hindi ma-read ang file.");
    };
    reader.readAsDataURL(file);
  }

  // =====================================================
  // Step 2: User confirmed crop → upload blob
  // =====================================================
  async function handleCropComplete(croppedBlob: Blob) {
    setCropImageSrc(null); // close modal
    setUploading(true);

    const formData = new FormData();
    formData.append(
      "file",
      new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" }),
    );

    startTransition(async () => {
      const res = await uploadAvatar(formData);
      setUploading(false);

      if (res?.error) {
        setError(res.error);
        return;
      }

      setSuccess(true);
      router.refresh();
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleCropCancel() {
    setCropImageSrc(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const isProcessing = uploading || pendingUpload;

  return (
    <>
      {/* Crop modal overlay */}
      {cropImageSrc && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          onCancel={handleCropCancel}
          onCropComplete={handleCropComplete}
        />
      )}

      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          disabled={isProcessing}
          className="sr-only"
          id="avatar-upload"
        />

        <label
          htmlFor="avatar-upload"
          className={`inline-flex items-center gap-1.5 text-xs text-brand hover:underline font-medium cursor-pointer ${
            isProcessing ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              {uploading ? "Uploading..." : "Processing..."}
            </>
          ) : (
            <>
              <Camera className="w-3 h-3" />
              {currentUrl ? "Change photo" : "Upload photo"}
            </>
          )}
        </label>

        <p className="text-[10px] text-muted-foreground">
          Max 2 MB • JPEG, PNG, WebP • Crop sa 500×500
        </p>

        {pending && role === "student" && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            ⏳ Pending approval ng teacher mo.
          </p>
        )}

        {rejectedReason && (
          <div className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
            <span>
              <b>Rejected:</b> {rejectedReason}
            </span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-1.5 text-xs text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" />
            <span>
              {role === "student"
                ? "Na-upload! Hintayin ang approval ng teacher."
                : "Photo updated!"}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
}
