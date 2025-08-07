import React from "react";

import MessagesUserDashboardClient from "@/components/pages/messages-user-dashboard";
import { allRoutes } from "@/config/routes";

export default function MessagesUserDashboard() {
  return (
    <MessagesUserDashboardClient
      url={allRoutes.user.dashboard.messageChat.url}
    />
  );
}
 