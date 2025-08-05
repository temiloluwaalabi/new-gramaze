// @flow
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
type Props = {
  avatarImage: string;
  name: string;
  email: string;
};
export const AvatarNameEmail = (props: Props) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-[40px] border-2 border-amber-200 bg-amber-100">
        <AvatarImage src={props.avatarImage} alt={props.name} />
        <AvatarFallback className="bg-amber-200 text-amber-800">
          {props.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-[#303030]">{props.name}</h3>
        <p className="max-w-[150px] text-xs text-gray-600">{props.email}</p>
      </div>
    </div>
  );
};
