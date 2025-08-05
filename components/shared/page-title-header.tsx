/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn, removeS } from "@/lib/utils";

import { Button, buttonVariants } from "../ui/button";

interface PageTitleHeaderProps {
  page: string;
  pageDesc?: string;

  addLink?: string;
  onAddClick?: () => void;
  addLabel?: string;
  showCrumbs?: boolean;
  showBtn?: boolean;
  secondBtn?: React.ReactNode;
  breadcrumbFormatter?: (crumb: string, index: number) => string;
  homeCrumb?: { label: string; href: string };
  className?: string;
  addType?: string;
  showbtn?: boolean;
  isNotDash?: boolean;
  notLink?: string;
  addDialog?: boolean;
  dialogContent?: React.ReactNode;
}
const defaultFormatter = (crumb: string) => {
  return crumb
    .replace(/[-_]/g, " ")
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toUpperCase() : word.toLowerCase()
    );
};

const PageTitleHeader = ({
  page,
  addLink,
  pageDesc,
  addType,
  showCrumbs,
  showbtn,
  addLabel,
  notLink,
  isNotDash,
  onAddClick,
  showBtn = !!addLink || !!onAddClick,
  homeCrumb = { label: "Home", href: "/dashboard" },
  addDialog,
  breadcrumbFormatter = defaultFormatter,
  className,
  dialogContent,
  secondBtn,
}: PageTitleHeaderProps) => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  parts.shift();
  const breadcrumbs = parts;

  const AddButton = () => {
    const label = addLabel || `Add New ${removeS(page)}`;
    const buttonClass = cn(
      buttonVariants({ variant: "default" }),
      "gap-2 hover:bg-red-900 !h-[42px] text-sm"
    );

    if (addLink) {
      return (
        <Link href={addLink} className={buttonClass}>
          <Plus className="size-4" />
          <span>{label}</span>
        </Link>
      );
    }

    return (
      <Button onClick={onAddClick} className={buttonClass}>
        <Plus className="size-4" />
        <span>{label}</span>
      </Button>
    );
  };

  return (
    <section
      className={cn(
        "flex flex-wrap items-center justify-between gap-4",
        className
      )}
    >
      {" "}
      <div className="items- flex flex-col">
        <h1 className="dark:text-light-200 text-sm font-bold tracking-tight md:text-2xl">
          {page}
        </h1>
        <p className="text-xs font-normal text-[#6B7280] lg:text-sm">
          {pageDesc}
        </p>

        {showCrumbs && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={homeCrumb.href}>
                  {homeCrumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                const href = isNotDash
                  ? `${notLink}/`
                  : `/dashboard/${breadcrumbs.slice(0, index + 1).join("/")}`;
                const formattedCrumb = breadcrumbFormatter(crumb, index);

                return (
                  <React.Fragment key={crumb}>
                    <BreadcrumbItem>
                      {!isLast ? (
                        <BreadcrumbLink href={href}>
                          {formattedCrumb}
                        </BreadcrumbLink>
                      ) : (
                        <span className="text-foreground font-medium">
                          {formattedCrumb}
                        </span>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {secondBtn}
        {showBtn && <AddButton />}
        {dialogContent}
      </div>
      {/* <div className="my-2 flex gap-2 md:my-0 md:ml-auto">
        {addLink && !addDialog && (
          <Link
            href={addLink}
            className="light-border-2 text-dark400_light500 flex items-center gap-2 rounded-md  border p-2"
          >
            <Plus />
            Add New {removeS(page)}
          </Link>
        )}
        <div>{secondBtn}</div>
      </div> */}
      {/* {dialogContent} */}
    </section>
  );
};

export default PageTitleHeader;
