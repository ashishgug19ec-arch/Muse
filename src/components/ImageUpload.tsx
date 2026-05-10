"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { useState, useRef } from "react";

type Endpoint = "poemCover" | "fanficCover" | "avatar" | "banner";

interface ImageUploadProps {
  endpoint: Endpoint;
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "wide" | "portrait";
}

const SIZE_LABELS: Record<Endpoint, string> = {
  avatar: "2 MB max",
  poemCover: "4 MB max",
  fanficCover: "4 MB max",
  banner: "8 MB max",
};

export default function ImageUpload({
  endpoint,
  value,
  onChange,
  label = "Upload image",
  aspectRatio = "wide",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.ufsUrl ?? (res?.[0] as any)?.url;
      if (url) {
        onChange(url);
        setError(null);
      } else {
        setError("Upload succeeded but URL was missing. Try again.");
      }
      setIsUploading(false);
    },
    onUploadError: (err) => {
      setError(err.message ?? "Upload failed. Check file size and try again.");
      setIsUploading(false);
    },
  });

  const aspectClass =
    aspectRatio === "square" ? "aspect-square" :
    aspectRatio === "portrait" ? "aspect-[2/3]" : "aspect-[16/9]";

  async function handleFile(file: File) {
    setError(null);
    setIsUploading(true);
    try {
      await startUpload([file]);
    } catch (e: any) {
      setError(e?.message ?? "Upload failed.");
      setIsUploading(false);
    }
  }

  return (
    <div className="w-full" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {value ? (
        <div className={`relative w-full ${aspectClass} rounded-xl overflow-hidden group`}>
          <img src={value} alt="cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 rounded-full text-sm font-medium text-white"
              style={{ background: "var(--purple)" }}
            >
              {isUploading ? "Uploading…" : "Change"}
            </button>
            <button
              onClick={() => onChange("")}
              disabled={isUploading}
              className="px-4 py-2 rounded-full text-sm font-medium text-white bg-red-500/80"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={`w-full ${aspectClass} rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors`}
          style={{ borderColor: error ? "#e05080" : "var(--border)", color: "var(--sakura)" }}
        >
          {isUploading ? (
            <>
              <span style={{ fontSize: 20 }}>⏳</span>
              <span className="text-sm">Uploading…</span>
            </>
          ) : (
            <>
              <span className="text-2xl">🖼️</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs opacity-60">{SIZE_LABELS[endpoint]} · Click to browse</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p style={{ fontSize: 11, color: "#e05080", margin: 0 }}>{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
