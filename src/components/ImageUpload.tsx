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

export default function ImageUpload({
  endpoint,
  value,
  onChange,
  label = "Upload image",
  aspectRatio = "wide",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) onChange(res[0].ufsUrl);
      setIsUploading(false);
    },
    onUploadError: () => setIsUploading(false),
  });

  const aspectClass =
    aspectRatio === "square" ? "aspect-square" :
    aspectRatio === "portrait" ? "aspect-[2/3]" : "aspect-[16/9]";

  return (
    <div className="w-full">
      {value ? (
        <div className={`relative w-full ${aspectClass} rounded-xl overflow-hidden group`}>
          <img src={value} alt="cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 rounded-full text-sm font-medium text-white"
              style={{ background: "var(--purple)" }}
            >
              Change
            </button>
            <button
              onClick={() => onChange("")}
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
          style={{ borderColor: "var(--border)", color: "var(--sakura)" }}
        >
          {isUploading ? (
            <span className="text-sm">Uploading...</span>
          ) : (
            <>
              <span className="text-2xl">🖼️</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs opacity-60">Click to browse</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setIsUploading(true);
          await startUpload([file]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
