"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { HealthNote } from "@/types";

import { QuillPreview } from "../ui/quill-preview";

type ViewNoteDialogProps = {
  note: HealthNote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Helper function to get file extension icon
const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "📄";
    case "doc":
    case "docx":
      return "📝";
    case "jpg":
    case "jpeg":
    case "png":
      return "🖼️";
    default:
      return "📎";
  }
};
export const handleDownloadAttachment = async (
  attachmentUrl: string,
  fileName: string
) => {
  try {
    // Implement download logic based on your backend
    const link = document.createElement("a");
    link.href = attachmentUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading attachment:", error);
  }
};
// Helper to check if file is an image
export const isImageFile = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "");
};

export function ViewNoteDialog({
  note,
  open,
  onOpenChange,
}: ViewNoteDialogProps) {
  if (!note) return null;

  // const attachmentsArray = Array.isArray(attachmentsArray)
  //   ? note.attachments
  //   : note.attachments
  //   ? [note.attachments]
  //   : [];

  const attachmentsArray: string[] =
    typeof note.attachments === "string"
      ? JSON.parse(note.attachments)
      : note.attachments;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Note Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Note Header */}
          <div className="flex items-start gap-4">
            <div className="flex size-[60px] items-center justify-center rounded-[8px] bg-blue-100 text-3xl">
              📝
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Added {formatDate(note.created_at)}</span>
                <span>•</span>
                <span>By {note.created_by_name || "Unknown"}</span>
              </div>
              {note.health_record_id && (
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    Health Record #{note.health_record_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-[#E8E8E8]" />

          {/* Note Content */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-[#787878]">
              Note Content
            </h4>
            <div className="rounded-[6px] border border-[#E8E8E8] bg-white p-4">
              <QuillPreview
                value={note.notes}
                className="prose prose-sm dark:text-light-200/80 dark:[&_p]:text-light-400 dark:[&_span]:!text-light-400 -mt-2 line-clamp-2 max-w-none text-sm text-[#303030] group-hover:text-blue-600 [&_.ql-editor]:flex [&_.ql-editor]:flex-col [&_.ql-editor]:gap-2 [&_.ql-editor]:!p-0 [&_.ql-editor]:px-0 [&_.ql-editor]:text-sm [&_h2]:hidden [&_h4]:text-sm [&_li]:text-sm [&_p]:text-sm [&_p]:leading-[25px] [&_p]:font-normal [&_p]:tracking-wide [&_p]:!text-black [&_p_br]:hidden [&_p:first-of-type]:line-clamp-2 [&_p:not(:first-of-type)]:hidden [&_span]:!bg-transparent [&_span]:!text-black [&_ul]:space-y-3"
              />
            </div>
          </div>

          {/* Attachments Section */}
          {attachmentsArray && attachmentsArray.length > 0 && (
            <>
              <Separator className="bg-[#E8E8E8]" />
              <div>
                <h4 className="mb-3 text-sm font-medium text-[#787878]">
                  Attachments ({attachmentsArray.length})
                </h4>
                <div className="space-y-3">
                  {attachmentsArray.map((attachment, index) => {
                    const fileName =
                      attachment.split("/").pop() || `attachment-${index}`;
                    const isImage = isImageFile(fileName);

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-[6px] border border-[#E8E8E8] bg-[#F9FAFB] p-3"
                      >
                        <div className="flex items-center gap-3">
                          {isImage ? (
                            <div className="relative size-12 overflow-hidden rounded">
                              <Image
                                src={attachment}
                                alt={fileName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <span className="text-2xl">
                              {getFileIcon(fileName)}
                            </span>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#303030]">
                              {fileName.length > 40
                                ? `${fileName.substring(0, 40)}...`
                                : fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {isImage ? "Image" : "Document"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownloadAttachment(attachment, fileName)
                          }
                          className="flex items-center gap-2"
                        >
                          <Download className="size-4" />
                          Download
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <Separator className="bg-[#E8E8E8]" />

          {/* Actions */}
          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="outline"
              className="!h-[45px]"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
