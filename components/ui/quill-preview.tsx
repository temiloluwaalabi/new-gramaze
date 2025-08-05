"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
  className?: string;
}

export const QuillPreview = ({ value, className }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    [],
  );
  // const quillMod = {
  //   toolbar: false, // Or whatever toolbar configuration you use
  //   // ... your other Quill modules
  //   // Explicitly set font size for paragraphs (p)
  //   "text-size": {
  //     options: [
  //       "8px",
  //       "9px",
  //       "10px",
  //       "11px",
  //       "12px",
  //       "14px",
  //       "16px",
  //       "18px",
  //       "20px",
  //       "24px",
  //       "30px",
  //       "36px",
  //       "42px",
  //       "48px",
  //       "54px",
  //       "60px",
  //       "72px",
  //     ],
  //   },
  // };
  return (
    <ReactQuill
      // modules={quillMod}
      className={cn(className)}
      theme="bubble"
      value={value}
      readOnly
    />
  );
};
