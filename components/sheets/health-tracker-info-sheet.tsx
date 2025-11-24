// @flow
import { Download, Mail, Paperclip, Share } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { getFileIcon } from "@/lib/health-report-notes-utils";
import { formatDate } from "@/lib/utils";
import { HealthNote } from "@/types";

import {
  handleDownloadAttachment,
  isImageFile,
} from "../dialogs/view-note-dialog";
import { Button } from "../ui/button";
import { QuillPreview } from "../ui/quill-preview";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

type Props = {
  sheetTrigger: React.ReactNode;
  healthNote: HealthNote;
};
export const HealthTrackerInfoSheet = ({ sheetTrigger, healthNote }: Props) => {
  const allAttachments: string[] =
    typeof healthNote.attachments === "string"
      ? JSON.parse(healthNote.attachments)
      : healthNote.attachments;
  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer">{sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[596px] max-w-full border-none bg-transparent p-5 md:!max-w-[596px]">
        {" "}
        <div className="custom-scrollbar flex h-full flex-col gap-4 overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
          <div className="flex flex-col gap-[21px]">
            <h2 className="text-lg font-medium text-[#333333] md:text-xl lg:text-2xl">
              {healthNote.title} Title
            </h2>
            <div className="flex flex-col gap-2">
              <span className="space-x-6">
                <span className="text-base font-normal text-[#66666B]">
                  Created by
                </span>
                <span className="text-base font-medium text-[#333333]">
                  {healthNote.caregiver?.first_name}{" "}
                  {healthNote.caregiver?.last_name}
                </span>
              </span>
              <span className="space-x-6">
                <span className="text-base font-normal text-[#66666B]">
                  Uploaded
                </span>
                <span className="text-base font-medium text-[#333333]">
                  {formatDate(healthNote.created_at)}
                </span>
              </span>
            </div>
          </div>
          <Separator className="bg-[#E8E8E8]" />
          <div className="flex flex-col gap-[14px]">
            <QuillPreview
              value={healthNote.notes}
              className="prose prose-sm dark:text-light-200/80 dark:[&_p]:text-light-400 dark:[&_span]:!text-light-400 -mt-2 line-clamp-2 max-w-none text-sm text-[#303030] group-hover:text-blue-600 [&_.ql-editor]:flex [&_.ql-editor]:flex-col [&_.ql-editor]:gap-2 [&_.ql-editor]:!p-0 [&_.ql-editor]:px-0 [&_.ql-editor]:text-sm [&_h2]:hidden [&_h4]:text-sm [&_li]:text-sm [&_p]:text-sm [&_p]:leading-[25px] [&_p]:font-normal [&_p]:tracking-wide [&_p]:!text-black [&_p_br]:hidden [&_p:first-of-type]:line-clamp-2 [&_p:not(:first-of-type)]:hidden [&_span]:!bg-transparent [&_span]:!text-black [&_ul]:space-y-3"
            />
          </div>
          <Separator className="bg-[#E8E8E8]" />

          <div>
            <h6 className="flex items-center text-sm font-normal text-[#333] lg:text-base">
              Attachments <Paperclip className="ms-2 size-5 text-[#66666B]" />
            </h6>

            <div className="mt-4 flex flex-wrap items-center gap-[12px]">
              {allAttachments.map((attachment, index) => {
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
          <Separator className="bg-[#E8E8E8]" />

          <div className="flex w-full flex-col items-start gap-[6px] lg:flex-row lg:items-center">
            <Button className="flex h-[48px] w-full items-center gap-[12px] bg-[#F2F2F2] lg:rounded-[26px]">
              <span className="flex size-[32px] items-center justify-center rounded-full bg-white">
                <Mail className="size-[20px] text-black" />
              </span>
              <span className="text-sm font-medium text-[#333]">
                Message Caregiver
              </span>
            </Button>
            <Button className="flex h-[48px] w-full items-center gap-[12px] bg-[#F2F2F2] lg:rounded-[26px]">
              <span className="flex size-[32px] items-center justify-center rounded-full bg-white">
                <Share className="size-[20px] text-black" />
              </span>
              <span className="text-sm font-medium text-[#333]">
                Share note
              </span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
