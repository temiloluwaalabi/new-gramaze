import { Clock } from "lucide-react";
import React from "react";

type Props = {
  notification: {
    id: string;
    title: string;
    message: string;
    time: string;
    sender: string;
    read: boolean;
  };
};

export default function NotificationBox({ notification }: Props) {
  return (
    <div
      key={notification.id}
      className="flex cursor-pointer border-b py-4 hover:bg-gray-50"
    >
      <div className="mr-3 flex size-[42px] flex-shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] p-2">
        <Clock className="h-5 w-5 text-gray-500" />
      </div>
      <div className="relative flex-grow pr-8">
        <h3 className="text-[#333333 text-base font-medium">
          {notification.title}
        </h3>
        <p className="text-sm font-normal text-[#787878]">
          {notification.message}
        </p>
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <span>{notification.time}</span>
          <span className="mx-1">•</span>
          <span>{notification.sender}</span>
        </div>
        {!notification.read && (
          <div className="absolute top-1/2 right-0 size-[12px] -translate-y-1/2 rounded-full bg-[#358600]"></div>
        )}
      </div>
    </div>
  );
}
