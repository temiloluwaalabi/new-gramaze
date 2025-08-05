import { Clock } from 'lucide-react';
import React from 'react';

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
    <div key={notification.id} className="flex py-4 border-b hover:bg-gray-50 cursor-pointer">
      <div className="flex-shrink-0 size-[42px] flex items-center justify-center bg-[#F5F5F5] rounded-full p-2 mr-3">
        <Clock className="h-5 w-5 text-gray-500" />
      </div>
      <div className="flex-grow pr-8 relative">
        <h3 className="font-medium text-base text-[#333333">{notification.title}</h3>
        <p className="text-[#787878] font-normal text-sm">{notification.message}</p>
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <span>{notification.time}</span>
          <span className="mx-1">•</span>
          <span>{notification.sender}</span>
        </div>
        {!notification.read && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 size-[12px] bg-[#358600] rounded-full"></div>
        )}
      </div>
    </div>
  );
}
