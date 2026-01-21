"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { parsePdf } from "@/actions/parse-pdf";

type ResumeUploadProps = {
  onSuccess: (text: string, fileName: string) => void;
};

export default function ResumeUpload({ onSuccess }: ResumeUploadProps) {
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        toast.error("PDF must be under 10MB");
        return;
      }

      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        const res = await parsePdf(formData);
        if (!res.success || !res.text) {
          throw new Error("Parsing failed");
        }

        setUploadedFile(file.name);
        onSuccess(res.text, file.name);
      } catch {
        toast.error("Failed to read resume");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full border rounded-lg p-4 bg-white transition-all">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className="w-full min-h-[160px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
        >
          <input {...getInputProps()} />
          <FileText className="h-8 w-8 text-gray-500" />
          <p className="text-sm text-gray-500 mt-2 text-center">
            {loading ? "Processing resume..." : "Upload your resume (PDF)"}
          </p>
        </div>
      ) : (
        <div className="w-full min-h-[160px] flex flex-col justify-center text-sm text-gray-700">
          <p className="font-medium">Uploaded:</p>
          <p className="mt-1 truncate">{uploadedFile}</p>
          <button
            onClick={() => setUploadedFile(null)}
            className="mt-3 text-blue-600 underline self-start"
          >
            Upload another file
          </button>
        </div>
      )}
    </div>
  );
}
