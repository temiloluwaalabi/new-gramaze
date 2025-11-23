/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { HelpCircle, Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ArrowUpIcon from "@/icons/arrow-up";
import { cn } from "@/lib/utils";

export type UploadedFile = {
  file: File;
  preview: string;
  size: number;
  name: string;
  date: Date;
  id?: string;
};

type ImageUploadProps = {
  className?: string;
  fieldName?: string;
  dialogTitle?: string;
  maxSize?: number;
  allowedTypes?: Record<string, string[]>;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;

  // Dialog related props
  isDialog?: boolean;
  trigger?: React.ReactNode;

  // Form related props
  form?: UseFormReturn<any>;

  // Standalone mode props
  standalone?: boolean;
  onFileSelect?: (files: UploadedFile | UploadedFile[]) => void;
  onSubmit?: (files: UploadedFile | UploadedFile[]) => Promise<void>;
  actionLabel?: string;
  showActions?: boolean;

  initialFileLinks?: string[];
  initialFiles?: UploadedFile[];
};

export const ImageUpload = ({
  className,
  fieldName = "image",
  dialogTitle = "Upload Image",
  maxSize = 5, // 5MB default
  allowedTypes = { "image/jpeg": [], "image/png": [], "image/jpg": [] },
  maxFiles = 1,
  isDialog = true,
  initialFileLinks = [],
  trigger,
  multiple = false,
  disabled,
  form,
  standalone = false,
  onFileSelect,
  onSubmit,
  actionLabel = "Submit",
  showActions = true,
  initialFiles = [],
}: ImageUploadProps) => {
  // const pathname = usePathname();
  const maxSizeBytes = maxSize * 1024 * 1024;
  console.log("INITIAL FILES", initialFiles);
  console.log("FORM FILES", form?.getValues(fieldName));

  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [isPending, startTransition] = useTransition();
  const [opemImageDialog, setOpemImageDialog] = useState(false);
  // Generate a unique ID for each file

  console.log("FILES", files);
  const generateId = () =>
    `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleDrop = React.useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (!multiple && acceptedFiles.length > 1) {
        acceptedFiles = [acceptedFiles[0]];
      }

      if (multiple && files?.length + acceptedFiles.length > maxFiles) {
        toast.error(`You can only upload a maximum of ${maxFiles} files`);
        // Only take the number of files that fit within the limit
        acceptedFiles = acceptedFiles.slice(0, maxFiles - files.length);
      }

      //   if (acceptedFiles.length > maxFiles) {
      //     toast.error(`You can only upload ${maxFiles} file${maxFiles > 1 ? 's' : ''}`);
      //     return;
      //   }

      if (acceptedFiles.length > 0) {
        const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          size: file.size,
          name: file.name,
          date: new Date(),
          id: generateId(),
        }));

        const updatedFiles = multiple ? [...files, ...newFiles] : [newFiles[0]];
        setFiles(updatedFiles);

        // Update form field if form is provided
        if (form && fieldName) {
          form.setValue(
            fieldName,
            multiple ? updatedFiles.map((f) => f.file) : updatedFiles[0].file,
            { shouldValidate: true }
          );
        }

        // Call callback if provided
        if (onFileSelect) {
          onFileSelect(multiple ? updatedFiles : updatedFiles[0]);
        }

        // Close dialog if standalone and no submit action needed
        if (standalone && !onSubmit && !multiple) {
          setOpemImageDialog(false);
        }

        // toast.success("Image uploaded successfully");
      }

      if (fileRejections.length > 0) {
        fileRejections.forEach((rejection) => {
          const { errors } = rejection;

          errors.forEach((error: { code: string }) => {
            if (error.code === "file-too-large") {
              toast.error(`Image is too large, Maximum size is ${maxSize}MB`);
            } else if (error.code === "file-invalid-type") {
              toast.error(
                `Invalid file type. Only ${Object.keys(allowedTypes).join(", ")} files are allowed`
              );
            }
          });
        });
      }
    },
    [
      multiple,
      files,
      maxFiles,
      form,
      fieldName,
      onFileSelect,
      standalone,
      onSubmit,
      maxSize,
      allowedTypes,
    ]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: allowedTypes,
    maxFiles: multiple ? maxFiles : 1,
    maxSize: maxSizeBytes,
    onDrop: handleDrop,
  });

  useEffect(() => {
    if (
      form?.getValues(fieldName) &&
      Array.isArray(form.getValues(fieldName)) &&
      form.getValues(fieldName).length > 0
    ) {
      const newFiles: UploadedFile[] = form
        .getValues(fieldName)
        .map((file: File) => ({
          file,
          preview: URL.createObjectURL(file),
          size: file.size,
          name: file.name,
          date: new Date(),
          id: generateId(),
        }));

      setFiles(newFiles);
    }
  }, [fieldName, form]);

  const handleSubmit = () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    startTransition(async () => {
      if (onSubmit) {
        try {
          await onSubmit(multiple ? files : files[0]);
          setOpemImageDialog(false);
        } catch (error) {
          toast.error("Failed to upload image");
          console.error(error);
        }
      }
    });
  };

  const removeFile = (idToRemove: string) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.id !== idToRemove);

      // Update form if needed
      if (form && fieldName) {
        form.setValue(
          fieldName,
          multiple
            ? updatedFiles.map((f) => f.file)
            : updatedFiles.length > 0
              ? updatedFiles[0].file
              : null,
          { shouldValidate: true }
        );
      }

      // Call callback if provided
      if (onFileSelect) {
        onFileSelect(multiple ? updatedFiles : updatedFiles[0]);
      }

      return updatedFiles;
    });
  };

  const resetFiles = () => {
    // Revoke all the preview URLs
    files.forEach((file) => {
      URL.revokeObjectURL(file.preview);
    });

    setFiles([]);

    if (form && fieldName) {
      form.setValue(fieldName, multiple ? [] : null, { shouldValidate: true });
    }
  };

  // Cleanup preview URLs when unmounting
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  const renderSingleImageUpload = () => (
    <div
      {...getRootProps({
        className:
          "border dark:light-border-2 bg-white dark:bg-transparent flex flex-col items-center justify-center gap-4 border-dashed h-[216px] border-[#CCCCCC] rounded-[4px] py-[33px] px-[14px] cursor-pointer",
      })}
    >
      {files.length === 0 ? (
        <>
          <UploadCloud className="text-primary size-16" />
          <input {...getInputProps()} disabled={isPending || disabled} />
          <div className="space-y-1 text-center">
            <Button
              type="button"
              variant="link"
              disabled={isPending || disabled}
              className="text-primary h-fit border-none bg-transparent p-0 text-xs font-normal underline shadow-none"
            >
              Click here to choose a file
            </Button>
            <p className="dark:text-light-400 max-w-[225px] text-center text-xs text-[#2d2d2d]/60">
              or drag a file in here
            </p>
            <p className="text-muted-foreground text-xs">
              Max file size: {maxSize}MB
            </p>
          </div>
        </>
      ) : (
        <div className="flex size-full flex-col items-center justify-center">
          <div className="relative size-32 overflow-hidden rounded-md">
            <Image
              src={files[0].preview || initialFileLinks[0]}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              resetFiles();
            }}
            className="mt-2"
          >
            Change
          </Button>
        </div>
      )}
    </div>
  );

  const renderMultipleImagesUpload = () => (
    <div className="space-y-4">
      <div
        {...getRootProps({
          className:
            "border dark:light-border-2 bg-gray-50 dark:bg-transparent flex flex-col items-center justify-center gap-4 border-dashed h-[122px] border-gray-300 rounded-[6px] py-[20px] px-[14px] cursor-pointer",
        })}
      >
        {/* <UploadCloud className="size-12 text-primary" /> */}
        <input {...getInputProps()} disabled={isPending || disabled} />
        {/* <div className="space-y-1 text-center">
          <Button
            type="button"
            variant="link"
            disabled={isPending || disabled}
            className="h-fit border-none bg-transparent p-0 text-xs font-normal text-primary underline shadow-none"
          >
            Click here to choose files
          </Button>
          <p className="max-w-[225px] text-center text-xs text-[#2d2d2d]/60 dark:text-light-400">
            or drag files in here
          </p>
          <p className="text-xs text-muted-foreground">
            Max {maxFiles} files, {maxSize}MB each
          </p>
        </div> */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="relative z-40 flex size-[32px] items-center justify-center rounded-[6px] bg-gray-400">
              <ArrowUpIcon />
            </div>
            <div className="absolute top-0 left-0 z-10 mt-2 -ml-2 size-[32px] rounded-[6px] border border-dashed border-gray-400 bg-gray-100" />
          </div>
          <div className="flex items-center gap-1 text-base font-medium">
            <p className="text-gray-600">Drag & drop files here</p>
            <div className="h-3 border border-gray-300" />
            <span className="text-blue-500">Browse files</span>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Uploaded Images ({files.length}/{maxFiles})
            </h3>
            {files.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFiles}
                className="h-7 cursor-pointer px-2 text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative h-24 w-full overflow-hidden rounded-md border"
              >
                <Image
                  src={file.preview}
                  alt={file.name}
                  fill
                  className="object-cover"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-fit cursor-pointer bg-transparent !p-0 opacity-90"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (file.id) removeFile(file.id);
                  }}
                >
                  <X className="size-5 text-blue-500" />
                </Button>
                <div className="absolute bottom-0 w-full bg-black/60 p-1 text-[10px] text-white">
                  {file.name.length > 15
                    ? `${file.name.substring(0, 15)}...`
                    : file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderFilesInfo = () => {
    if (files.length === 0) return null;

    return multiple ? (
      <div className="text-muted-foreground text-sm">
        {files.length} file{files.length !== 1 ? "s" : ""} selected,
        {(
          files.reduce((acc, file) => acc + file.size, 0) /
          1024 /
          1024
        ).toFixed(2)}
        MB total
      </div>
    ) : (
      <div className="relative mt-4 flex flex-col items-start gap-2 rounded-md border border-[#F3A218] bg-[#FEF6E7] px-3 py-2">
        <div className="flex items-center gap-4">
          <div className="dark:text-black">
            <p className="text-sm font-medium dark:text-black">File Preview:</p>
            <p className="text-xs font-normal dark:text-black">
              {files[0].name} | {(files[0].size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      </div>
    );
  };

  const uploadContent = (
    <div className={cn("space-y-6", className)}>
      {multiple ? renderMultipleImagesUpload() : renderSingleImageUpload()}

      {renderFilesInfo()}

      {showActions && standalone && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-4 text-[#8E8E93]" />
            <span className="text-sm font-normal text-[#8E8E93]">
              Help center
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isDialog && (
              <DialogClose>
                <Button
                  disabled={isPending || disabled}
                  variant="outline"
                  className="border-none bg-[#E4E4E4] text-black shadow-none hover:text-white"
                >
                  Cancel
                </Button>
              </DialogClose>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isPending || disabled || files.length === 0}
              className="flex items-center"
            >
              {isPending ||
                (disabled && <Loader2 className="me-2 size-4 animate-spin" />)}
              {actionLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  // Form integration with react-hook-form
  const formField =
    form && fieldName ? (
      <Controller
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <div>
            {uploadContent}
            <input type="hidden" {...field} />
          </div>
        )}
      />
    ) : (
      uploadContent
    );

  // Return dialoged or non-dialoged version based on props
  return isDialog ? (
    <Dialog open={opemImageDialog} onOpenChange={setOpemImageDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={multiple ? "sm:max-w-xl" : undefined}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {formField}
      </DialogContent>
    </Dialog>
  ) : (
    formField
  );
};
