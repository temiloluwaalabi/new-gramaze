import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "../ui/button"; 

type Props = {
  url: string;
}; 

export default function MessagesUserDashboardClient(props: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <Image
        src="https://res.cloudinary.com/davidleo/image/upload/v1745315401/Message_bnbben.png"
        alt="newConvo"
        width={318}
        height={257}
        className="object-cover"
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <h4 className="text-xl font-medium text-[#13180B] lg:text-2xl">
            No conversations yet
          </h4>
          <p className="text-center text-sm font-normal text-[#66666B] lg:text-base">
            Your messages will appear here.
          </p>
        </div>
        <Button className="relative !h-[49px] w-[198px] text-sm font-normal">
          <Link
            href={props.url}
            className="absolute top-0 left-0 z-20 size-full"
          />
          Start a conversation
        </Button>
      </div>
    </div>
  );
}
