import React from "react";

import { cn } from "@/lib/utils";

interface MaxWidthContainerProps {
  children: React.ReactNode;
  className?: string;
  innerClass?: string;
}

const MaxWidthContainer = ({
  children,
  className,
  innerClass,
}: MaxWidthContainerProps) => {
  return (
    <section
      className={cn(
        "overflow-hidden px-[6px] py-[20px] md:px-[30px] md:py-[25px] lg:px-[40px] lg:py-[30px] 2xl:px-[96px] 2xl:py-[40px]",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto size-full max-w-screen-xl px-[10px] lg:px-[30px] 2xl:px-[30px]",
          innerClass
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default MaxWidthContainer;
