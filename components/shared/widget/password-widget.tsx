/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CustomPasswordInputProps {
  isPending?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  field: any;
  label?: string;
  placeholder?: string;
}

const CustomPasswordInput = ({
  isPending,
  field,
  label,
  placeholder,
  labelClassName,
  inputClassName,
}: CustomPasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative flex w-full items-center gap-1 rounded-md bg-transparent p-0">
      {label && (
        <Label
          className={cn(
            "absolute top-0 left-0 mt-[-12px] translate-x-3 bg-white px-2 py-1",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
      <Input
        disabled={isPending}
        placeholder={placeholder || "Enter your password"}
        type={showPassword ? "text" : "password"}
        className={cn(
          "no-focus dark:placeholder:text-dark-400/70 dark:text-dark-300 mb-[8px] h-[40px] w-full rounded-[10px] border-none bg-[#BFA0F71A] px-[15px] outline-none placeholder:text-sm placeholder:font-medium placeholder:text-[#2A0C3133] focus:border-white focus:outline-none md:h-[58px] dark:bg-white",
          inputClassName
        )}
        {...field}
      />
      <Button
        variant={"ghost"}
        type="button"
        size={"icon"}
        className="absolute top-1/2 right-0 h-fit w-fit -translate-x-4 -translate-y-1/2 p-0 hover:bg-transparent dark:hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={isPending}
      >
        {!showPassword ? (
          <EyeIcon
            className="dark:text-light-500 text-primary size-4"
            aria-hidden
          />
        ) : (
          <EyeOffIcon
            className="dark:text-light-500 text-primary size-4"
            aria-hidden
          />
        )}
        {/* <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span> */}
      </Button>
    </div>
  );
};

export default CustomPasswordInput;
