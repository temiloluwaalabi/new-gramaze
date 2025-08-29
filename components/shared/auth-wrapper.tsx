"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Logo } from "./logo"; 
import { Button } from "../ui/button";

type Props = {
  authTitle: string;
  bgImage: string;
  authDesc?: React.ReactNode;
  form: React.ReactNode;
  wrapper: string;
};
export const AuthWrapper = (props: Props) => {
  return (
    <div className={cn("!h-screen p-4 md:p-0", props.wrapper)}>
      <div className="grid h-full grid-cols-12">
        <div className="relative col-span-12 hidden h-[300px] w-full md:col-span-7 md:flex md:h-full">
          <Button className="absolute top-0 right-0 z-50 mt-3 mr-3 flex !h-[45px] items-center gap-1 text-[14px]">
            <Link href={"/"} className="absolute top-0 left-0 z-30 size-full" />
            <ArrowLeft />
            Back to website
          </Button>
          <Image
            src={props.bgImage}
            fill
            alt={props.authTitle}
            className="object-start rounded-md object-cover"
          />
        </div>
        <div className="col-span-12 flex w-full flex-col items-end justify-start space-y-8 py-10 md:col-span-5">
          <div className="flex w-full items-center justify-end pr-16">
            <Button
              variant={"outline"}
              className="relative mr-auto flex !h-fit items-center gap-1 border-none !p-0 text-[14px] shadow-none md:hidden"
            >
              <Link
                href={"/"} 
                className="absolute top-0 left-0 z-30 size-full"
              />
              <ArrowLeft />
              Back
            </Button>
            <Logo
              logoLink="https://res.cloudinary.com/davidleo/image/upload/v1744665654/gramaze-logo_yt4zo6.png"
              className="flex h-[70px] w-[240px] items-end justify-end md:h-[75px] md:w-[249px]"
            />
          </div>
          <div className="custom-scrollbar h-full w-full space-y-2 overflow-y-auto px-0 md:px-16">
            <div className="space-y-1">
              <h2 className="text-[25px] font-bold text-gray-800 md:text-[30px]">
                {props.authTitle}
              </h2>
              <div className="text-xs">
                {typeof props.authDesc === "string" ? (
                  <p>{props.authDesc}</p>
                ) : (
                  props.authDesc
                )}
              </div>
            </div>
            <div>{props.form}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
