import { File } from "lucide-react";
import React from "react";

import CalendarBlankIcon from "@/icons/calendar-blank";
import CreditCardICon from "@/icons/credit-card";
import DashboardIcon from "@/icons/dashboard";
import GearSixIcon from "@/icons/gear";
import HeartbeatIcon from "@/icons/heartbeat";
import QuestionIcon from "@/icons/question";
import UserThreeIcon from "@/icons/user-three-icon";
import WeChatIcon from "@/icons/we-chat";

import { allRoutes } from "./routes";

export const ROLES = {
  USER: "USER",
  CAREGIVER: "CAREGIVER",
} as const;

export interface SidebarItem {
  name: string;
  href?: string;
  isActive?: boolean;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  roles?: string[];
  dropdownItems?: {
    name: string;
    href: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    roles: string[];
  }[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: "Main Menu",
  },
  {
    name: "Dashboard",
    href: allRoutes.user.dashboard.home.url,
    icon: DashboardIcon,
  },
  {
    name: "Appointment",
    href: allRoutes.user.dashboard.appointment.url,
    icon: CalendarBlankIcon,
  },
  {
    name: "Health tracker",
    href: allRoutes.user.dashboard.healthTracker.url,
    icon: HeartbeatIcon,
  },
  {
    name: "Care givers history",
    href: allRoutes.user.dashboard.caregiverHistory.url,
    icon: File,
  },
  {
    name: "Message",
    href: allRoutes.user.dashboard.message.url,
    icon: WeChatIcon,
  },
  {
    name: "Others",
  },
  {
    name: "Billing",
    href: allRoutes.user.dashboard.billing.url,
    icon: CreditCardICon,
  },
  {
    name: "Support",
  },
  {
    name: "Settings",
    href: allRoutes.user.dashboard.settings.url,
    icon: GearSixIcon,
  },
  {
    name: "Help Center",
    href: allRoutes.user.dashboard.helpCenter.url,
    icon: QuestionIcon,
  },
];
export const CAREGIVER_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: "Main Menu",
  },
  {
    name: "Dashboard",
    href: allRoutes.caregiver.home.url,
    icon: DashboardIcon,
  },
  {
    name: "Appointment",
    href: allRoutes.caregiver.appointments.url,
    icon: CalendarBlankIcon,
  },
  {
    name: "Patients",
    href: allRoutes.caregiver.patients.url,
    icon: UserThreeIcon,
  },
  {
    name: "Message",
    href: allRoutes.caregiver.messages.url,
    icon: WeChatIcon,
  },
  {
    name: "Support",
  },
  {
    name: "Settings",
    href: allRoutes.caregiver.settings.url,
    icon: GearSixIcon,
  },
  {
    name: "Help Center",
    href: allRoutes.caregiver.helpCenter.url,
    icon: QuestionIcon,
  },
];
