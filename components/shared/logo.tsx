// @flow
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
type Props = {
  className: string;
  logoLink: string;
};
export const Logo = (props: Props) => {
  return (
    <div className={cn("relative", props.className)}>
      <Link href={"/"} className="absolute top-0 left-0 z-30 size-full" />
      <Image
        src={props.logoLink}
        alt="logo"
        fill
        className="object-contain object-left"
      />
    </div>
  );
};
