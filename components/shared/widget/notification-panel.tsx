// NotificationsPanel.tsx
import { CheckCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GearSixIcon from "@/icons/gear";

import NotificationBox from "./notification-box";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  sender: string;
  read: boolean;
}

export default function NotificationsPanel() {
  const [activeTab, setActiveTab] = useState("inbox");

  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Notifications from Mrs victor",
      message:
        "You have an unread message from mrs victor, tap to review and respond",
      time: "2 hours ago",
      sender: "Mrs victor",
      read: false,
    },
    {
      id: "2",
      title: "Notifications from Mrs victor",
      message:
        "You have an unread message from mrs victor, tap to review and respond",
      time: "2 hours ago",
      sender: "Mrs victor",
      read: false,
    },
    {
      id: "3",
      title: "Notifications from Mrs victor",
      message:
        "You have an unread message from mrs victor, tap to review and respond",
      time: "2 hours ago",
      sender: "Mrs victor",
      read: false,
    },
    {
      id: "4",
      title: "Notifications from Mrs victor",
      message:
        "You have an unread message from mrs victor, tap to review and respond",
      time: "2 hours ago",
      sender: "Mrs victor",
      read: false,
    },
    {
      id: "5",
      title: "Notifications from Mrs victor",
      message:
        "You have an unread message from mrs victor, tap to review and respond",
      time: "2 hours ago",
      sender: "Mrs victor",
      read: false,
    },
    {
      id: "6",
      title: "Notifications from Mrs victor",
      message:
        "You have an unread message from mrs victor, tap to review and respond",
      time: "2 hours ago",
      sender: "Mrs victor",
      read: false,
    },
    {
      id: "7",
      title: "Notifications from Mrs victor",
      message:
        "You have an unread message from mrs victor, tap to review and respond",
      time: "2 hours ago",
      sender: "Mrs victor",
      read: false,
    },
  ]);

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  );
  const unreadCount = unreadNotifications.length;

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <div className="">
      <div className="w-full bg-white">
        <div className="p-2">
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="custom-scrollbar mb-2 h-fit w-full gap-3 overflow-hidden overflow-x-scroll rounded-none border-[#F0F2F5] bg-transparent p-0 lg:mb-4">
            <div className="h-full w-full space-x-6">
              <TabsTrigger
                value="inbox"
                className="w-fit cursor-pointer rounded-none text-base font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-green-600 data-[state=active]:font-medium data-[state=active]:text-green-600 data-[state=active]:shadow-none"
              >
                Inbox ({unreadCount})
              </TabsTrigger>
              <TabsTrigger
                className="w-fit cursor-pointer rounded-none text-base font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-green-600 data-[state=active]:font-medium data-[state=active]:text-green-600 data-[state=active]:shadow-none"
                value="unread"
              >
                Unread
              </TabsTrigger>
              <TabsTrigger
                className="w-fit cursor-pointer rounded-none text-base font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-green-600 data-[state=active]:font-medium data-[state=active]:text-green-600 data-[state=active]:shadow-none"
                value="all"
              >
                All
              </TabsTrigger>
            </div>
            <div className="ml-auto flex items-center justify-end">
              <Button
                className="!size-6 cursor-pointer"
                variant="ghost"
                size="icon"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-5 w-5" />
              </Button>
              <Button
                className="!size-6 cursor-pointer"
                variant="ghost"
                size="icon"
              >
                <GearSixIcon className="h-5 w-5" />
              </Button>
            </div>
          </TabsList>

          <TabsContent value="inbox" className="m-0">
            {notifications.map((notification) => (
              <NotificationBox
                key={notification.id}
                notification={notification}
              />
            ))}
          </TabsContent>

          <TabsContent value="unread" className="m-0">
            {unreadNotifications.map((notification) => (
              <NotificationBox
                key={notification.id}
                notification={notification}
              />
            ))}
          </TabsContent>

          <TabsContent value="all" className="m-0">
            {notifications.map((notification) => (
              <NotificationBox
                key={notification.id}
                notification={notification}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
