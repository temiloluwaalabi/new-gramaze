// @flow
import * as React from "react";

import { initialsFromName } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
type Props = {
  avatarImage: string;
  name: string;
  email: string;
  showFall?: boolean;
};
export const AvatarNameEmail = (props: Props) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-[40px] border-2 border-blue-500 bg-blue-100">
        {props.showFall ? (
          <AvatarFallback className="bg-blue-100 text-blue-500">
            {initialsFromName([props.email].filter(Boolean).join(" ").trim())}
          </AvatarFallback>
        ) : (
          <AvatarImage src={props.avatarImage} alt={props.name} />
        )}
      </Avatar>

      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-[#303030]">{props.name}</h3>
        <p className="max-w-[150px] text-xs text-gray-600">{props.email}</p>
      </div>
    </div>
  );
};
