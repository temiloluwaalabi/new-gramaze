"use client";
import {
  Bell,
  FileText,
  Laptop,
  Loader2,
  Paperclip,
  Plus,
  SquarePen,
  User,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

import HeartbeatIcon from "@/icons/heartbeat";
import SecurityIcon from "@/icons/security-icon";
import UserThreeIcon from "@/icons/user-three-icon";
import { REPORT_TYPE_CONFIGS } from "@/lib/health-record-types";
import {
  useInitiatePasswordReset,
  useUpdate2FA,
  useUpdateNotificationSetting,
} from "@/lib/queries/use-auth-queries";
import { formatDate, initialsFromName } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import { HealthRecordRow } from "@/types";

import MedicalFilesDisplay from "./medical-files";
import UpdateProfileImageDialog from "../dialogs/update-profile-image-dialog";
import UpdateAccountDataForm from "../forms/update-account-data-form";
import { getStatusBadge } from "../shared/health-record/health-record-list";
import PasswordResetConfirmation from "../shared/password-reset-confirmation";
import { PageTitleHeader } from "../shared/widget/page-title-header";
import { UpdateMedicalRecordSheet } from "../sheets/update-medical-record-sheet";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
}
export interface ConnectedDevice {
  id: string;
  name: string;
  os: string;
  type: string;
  lastActivity: string;
  location: string;
}

// ✅ Loading Skeleton Component
export const SettingsLoadingSkeleton = () => {
  return (
    <section className="max-w-5xl space-y-3 !bg-white px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <section className="mt-4 flex w-full gap-5">
        <div className="w-full space-y-4">
          {/* Tabs Skeleton */}
          <div className="mb-2 flex h-auto w-full items-start justify-start gap-3 overflow-hidden rounded-none border-b border-[#F0F2F5] bg-transparent pb-2 lg:mb-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-44" />
          </div>

          {/* Profile Section Skeleton */}
          <div className="mt-2 w-full space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="size-[70px] rounded-full md:size-[96px]" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-[38px] w-40" />
            </div>

            <Separator className="bg-[#E8E8E8]" />

            {/* Form Fields Skeleton */}
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

interface SettingsClientPageProps {
  healthRecords: HealthRecordRow[];
}

export const SettingsClientPage = ({
  healthRecords,
}: SettingsClientPageProps) => {
  const { user, setUser } = useUserStore();
  const [categories, setCategories] = React.useState<NotificationCategory[]>([
    {
      id: "messages",
      title: "Messages",
      description:
        "Receive important messages from caregivers, doctors, or support regarding your care and appointments.",
      smsEnabled: false,
      emailEnabled: true,
    },
    {
      id: "reminders",
      title: "Reminders",
      description:
        "Stay on track with upcoming appointments, health check-ins, and medication reminders.",
      smsEnabled: false,
      emailEnabled: true,
    },
    {
      id: "activity",
      title: "Activity & updates",
      description:
        "Get notified about caregiver assignments, new health reports, and important account updates.",
      smsEnabled: false,
      emailEnabled: true,
    },
  ]);
  const [flowStep, setFlowStep] = React.useState<"form" | "confirmation">(
    "form"
  );
  const { isPending, mutate: UpdateNotification } =
    useUpdateNotificationSetting();
  const { isPending: TWOFAPending, mutate: Update2FA } = useUpdate2FA();

  const { isPending: InitiatePending, mutate: InitiatePasswordReset } =
    useInitiatePasswordReset();

  const [email, setEmail] = React.useState(user?.email || "");
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(
    user?.factor_authentication === "yes"
  );
  const [connectedDevices, setConnectedDevices] = React.useState<
    ConnectedDevice[]
  >([
    {
      id: "1",
      name: "Chrome 110.0.0.0",
      os: "Mac OS",
      type: "web browser",
      lastActivity: "1 minute ago",
      location: "LA, Nigeria",
    },
  ]);

  // ✅ Update email when user loads
  React.useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePasswordResetRequest = async (submittedEmail: string) => {
    setEmail(submittedEmail);

    InitiatePasswordReset(
      {
        email: submittedEmail,
      },
      {
        onSuccess: async (data) => {
          toast.success(data.message);
          setFlowStep("confirmation");
        },
      }
    );
  };

  const handleCheckEmail = () => {
    setFlowStep("form");
  };

  const handleSignOut = (deviceId: string) => {
    setConnectedDevices(
      connectedDevices.filter((device) => device.id !== deviceId)
    );
  };

  const handleToggle = (
    categoryId: string,
    channel: "sms" | "email",
    value: boolean
  ) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          // If enabling a channel, disable the other one
          if (value) {
            return {
              ...category,
              smsEnabled: channel === "sms",
              emailEnabled: channel === "email",
            };
          } else {
            // If disabling, just disable that specific channel
            return {
              ...category,
              [channel === "sms" ? "smsEnabled" : "emailEnabled"]: false,
            };
          }
        }
        return category;
      })
    );
  };

  const handleNotification = async () => {
    const messages = categories.find(
      (cat) => cat.id.toLowerCase() === "messages"
    );
    const activity = categories.find(
      (cat) => cat.id.toLowerCase() === "activity"
    );
    const reminder = categories.find(
      (cat) => cat.id.toLowerCase() === "reminders"
    );

    const getNotificationType = (category: typeof messages) => {
      if (!category) return "sms";
      if (category.emailEnabled) return "email";
      if (category.smsEnabled) return "sms";
      return "sms";
    };

    const JSON_VALUE = {
      message_notification: getNotificationType(messages),
      activities_notification: getNotificationType(activity),
      reminder_notification: getNotificationType(reminder),
    };

    try {
      UpdateNotification(JSON_VALUE, {
        onSuccess: (data) => {
          toast.success(data.message);
        },
        onError: (error) => {
          toast.error(
            error.message || "Failed to update notification settings"
          );
        },
      });
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handle2FAToggle = async (checked: boolean) => {
    setTwoFactorEnabled(checked);

    if (checked) {
      Update2FA(
        {
          factor_authentication: "yes",
        },
        {
          onSuccess: (data) => {
            toast.message(data.message);
            setUser(data.user!);
          },
          onError: () => {
            // Revert the toggle if API call fails
            setTwoFactorEnabled(false);
          },
        }
      );
    } else {
      // Handle disabling 2FA if needed
      Update2FA(
        {
          factor_authentication: "no",
        },
        {
          onSuccess: (data) => {
            toast.message(data.message);
            setUser(data.user!);
          },
          onError: () => {
            // Revert the toggle if API call fails
            setTwoFactorEnabled(true);
          },
        }
      );
    }
  };
  // ✅ Show loading skeleton if user is not loaded
  if (!user) {
    return <SettingsLoadingSkeleton />;
  }

  return (
    <section className="max-w-5xl space-y-3 !bg-white px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <PageTitleHeader
        title="Settings"
        description="Change your account settings"
      />

      <section className="mt-4 flex w-full gap-5">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="custom-scrollbar mb-2 flex h-auto w-full items-start justify-start gap-3 overflow-hidden overflow-x-scroll rounded-none border-b border-[#F0F2F5] bg-transparent p-0 pb-0 lg:mb-4">
            <TabsTrigger
              value="profile"
              disabled={isPending || TWOFAPending}
              className="!mb-0 cursor-pointer rounded-none !pb-0 text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
            >
              <User />
              Profile
            </TabsTrigger>
            <TabsTrigger
              disabled={isPending || TWOFAPending}
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
              value="notifications-settings"
            >
              <Bell />
              Notification Settings
            </TabsTrigger>
            <TabsTrigger
              disabled={isPending || TWOFAPending}
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
              value="health-records"
            >
              <HeartbeatIcon />
              Health Records
            </TabsTrigger>
            <TabsTrigger
              disabled={isPending || TWOFAPending}
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
              value="security"
            >
              <SecurityIcon />
              Security & Privacy
            </TabsTrigger>
            <TabsTrigger
              disabled={isPending || TWOFAPending}
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
              value="dependent-management"
            >
              <UserThreeIcon />
              Dependent Management
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="profile"
            className="mt-2 w-full !max-w-full space-y-5 bg-white"
          >
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      width={96}
                      height={96}
                      className="size-[70px] rounded-full object-cover md:size-[96px]"
                      alt="mainImage"
                    />
                  ) : (
                    <div className="flex size-[70px] items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 md:size-[96px]">
                      {initialsFromName(
                        [user?.first_name, user?.last_name]
                          .filter(Boolean)
                          .join(" ")
                          .trim()
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-[#303030]">
                      {user?.email}
                    </h4>
                    <p className="text-sm font-normal text-[#66666B]">
                      Member since {formatDate(user?.created_at || "")}
                    </p>
                  </div>
                </div>
                <UpdateProfileImageDialog
                  dialogTrigger={
                    <Button className="!h-[38px] text-sm font-normal">
                      Edit Profile Image
                    </Button>
                  }
                />
              </div>
              <Separator className="bg-[#E8E8E8]" />
              <UpdateAccountDataForm user={user} />
            </div>
          </TabsContent>
          <TabsContent
            value="notifications-settings"
            className="mt-2 w-full !max-w-full space-y-5 bg-white"
          >
            <div className="">
              <h1 className="mb-6 text-xl font-semibold">
                Notification settings
              </h1>

              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={category.id}>
                    <div className="py-4">
                      <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <h2 className="text-base font-medium">
                            {category.title}
                          </h2>
                          <p className="mt-1 pr-4 text-sm text-gray-500">
                            {category.description}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-col space-y-3 md:mt-0">
                          <div className="flex items-center justify-between space-x-8">
                            <Switch
                              checked={category.smsEnabled}
                              onCheckedChange={(checked) =>
                                handleToggle(category.id, "sms", checked)
                              }
                              disabled={isPending || TWOFAPending}
                              className="data-[state=checked]:bg-blue-600"
                            />
                            <span className="text-sm font-medium">SMS</span>
                          </div>

                          <div className="flex items-center justify-between space-x-6">
                            <Switch
                              checked={category.emailEnabled}
                              onCheckedChange={(checked) =>
                                handleToggle(category.id, "email", checked)
                              }
                              disabled={isPending || TWOFAPending}
                              className="data-[state=checked]:bg-blue-600"
                            />
                            <span className="text-sm font-medium">Email</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < categories.length - 1 && <Separator />}
                  </div>
                ))}
                <Button
                  onClick={handleNotification}
                  disabled={isPending || TWOFAPending}
                  className="flex items-center gap-2"
                >
                  {isPending && (
                    <Loader2 className="me-2 size-4 animate-spin" />
                  )}
                  Update Settings
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="health-records"
            className="mt-2 w-full !max-w-full space-y-5 bg-white"
          >
            <div className="flex w-fit flex-col items-start justify-between gap-3 rounded-[6px] border border-[#E8E8E8] bg-[#F9F9F9] p-[18px] md:flex-row md:items-center md:p-[24px]">
              <div className="flex items-center gap-4">
                <div className="flex size-[48px] items-center justify-center rounded-full bg-blue-100">
                  <Image
                    src={
                      "https://res.cloudinary.com/davidleo/image/upload/v1745320515/Vector_1_rio4vl.png"
                    }
                    alt="plan"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#333] lg:text-lg">
                    The Gold Care Plan
                  </h3>
                  <p className="text-xs font-medium text-[#999] lg:text-sm">
                    Your subscription will renew on April 4
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-[#333]">
                Health Records
              </h4>
              {healthRecords.length > 0 ? (
                healthRecords.slice(0, 6).map((record) => {
                  const config = REPORT_TYPE_CONFIGS[
                    record.record_type as keyof typeof REPORT_TYPE_CONFIGS
                  ] ?? { label: String(record.record_type || "Unknown") };
                  return (
                    <div
                      key={record.id}
                      className="group relative flex cursor-pointer items-center gap-4 rounded-[6px] border border-[#E8E8E8] p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      {/* <Link
                        href={`/caregiver/health-records/${record.id}`}
                        className="absolute top-0 left-0 size-full"
                      /> */}
                      <span className="hidden size-[42px] items-center justify-center rounded-full bg-[#F5F5F5] group-hover:bg-blue-500 group-hover:text-white md:flex">
                        <SquarePen className="size-5" />
                      </span>
                      <div className="grid w-full grid-cols-12 gap-4">
                        <div className="col-span-12 w-full space-y-1 md:col-span-7">
                          <h6 className="line-clamp-1 max-w-prose text-sm font-medium text-ellipsis text-[#333]">
                            {record.title}
                          </h6>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <p className="text-xs font-normal text-[#66666b] md:text-sm">
                              Uploaded{" "}
                              <span>{formatDate(record.created_at)}</span>
                            </p>
                            <div className="flex items-center gap-1">
                              <span>
                                By {record.creator.first_name || "Unknown"}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        <div className="col-span-12 flex w-full flex-col justify-center gap-2 md:col-span-5 md:items-end">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(record.status)}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <FileText className="size-3" />
                              <span>{record.reports.length} report(s)</span>
                            </div>

                            {record.notes.length > 0 && (
                              <div className="flex items-center gap-1">
                                <FileText className="size-3" />
                                <span>{record.notes.length} note(s)</span>
                              </div>
                            )}

                            {record.health_tracker_ids &&
                              record.health_tracker_ids.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <FileText className="size-3" />
                                  <span>
                                    {record.health_tracker_ids.length} vital(s)
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 rounded-[6px] border border-dashed border-[#E8E8E8] bg-[#FAFCFF] p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <SquarePen className="h-6 w-6" />
                  </div>

                  <h5 className="text-md font-semibold text-[#212121]">
                    No health records yet
                  </h5>
                  <p className="max-w-xs text-sm text-[#66666B]">
                    A central health record hasn&apos;t been created for you
                    yet. Our care team or provider will create and manage this
                    record on your behalf. Contact our provider or support if
                    you need a record created or to share files.
                  </p>
                </div>
              )}
            </div>
            <Separator className="bg-[#E8E8E8]" />

            <div>
              <h6 className="flex items-center text-base font-normal text-[#333]">
                Attachments <Paperclip className="ms-2 size-5 text-[#66666B]" />
              </h6>
              <MedicalFilesDisplay
                medicalFiles={user?.medical_file || ""}
                className="mt-6"
              />
            </div>

            <UpdateMedicalRecordSheet
              sheetTrigger={
                <Button className="tetx-sm flex !h-[45px] w-fit items-center justify-center gap-2 border-black py-6 font-normal text-white">
                  <Plus className="h-5 w-5" />
                  <span className="text-sm">Update medical record</span>
                </Button>
              }
            />
          </TabsContent>
          <TabsContent
            value="security"
            className="mt-2 w-full !max-w-full space-y-5 bg-white"
          >
            <div className="w-full">
              {flowStep === "form" ? (
                <div className="py-2">
                  <h1 className="mb-2 text-xl font-semibold">
                    Change password
                  </h1>
                  <p className="mb-6 text-gray-600">
                    A reset password link will be sent to you.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label
                        htmlFor="email"
                        className="mb-2 block text-sm text-gray-500"
                      >
                        Email address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-3"
                        placeholder="Enter your email"
                        required
                        disabled={true}
                      />
                      <Button
                        disabled={InitiatePending || TWOFAPending}
                        onClick={() => handlePasswordResetRequest(email)}
                        className="relative mt-4 ml-auto flex !h-[38px] text-sm font-normal"
                      >
                        {InitiatePending && (
                          <Loader2 className="me-2 size-4 animate-spin" />
                        )}
                        Send Link
                      </Button>
                    </div>

                    <Separator className="bg-[#E8E8E8]" />

                    <div className="pt-2">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <h2 className="font-medium">
                            Two-factor authentication
                          </h2>
                          <p className="mt-1 text-sm text-gray-600">
                            To help keep your account secure, we&apos;ll ask you
                            to submit a code when using a new device to log in.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={twoFactorEnabled}
                            onCheckedChange={handle2FAToggle}
                            disabled={TWOFAPending}
                            className="data-[state=checked]:bg-blue-600"
                          />
                          {TWOFAPending && (
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Updating...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Separator className="bg-[#E8E8E8]" />

                    <div className="pt-4">
                      <h2 className="mb-4 text-xl font-bold">
                        Connected Devices
                      </h2>

                      {connectedDevices.map((device) => (
                        <div
                          key={device.id}
                          className="mb-2 flex items-center justify-between rounded-[6px] border border-[#E8E8E8] px-4 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-md bg-gray-100 p-2">
                              <Laptop className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {device.name}, {device.os}
                              </p>
                              <p className="text-xs text-gray-500">
                                Last activity: {device.lastActivity} •{" "}
                                {device.location}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            type="button"
                            size="sm"
                            onClick={() => handleSignOut(device.id)}
                            className="text-sm font-medium text-gray-700 hover:text-gray-900"
                          >
                            Sign out
                          </Button>
                        </div>
                      ))}
                    </div>
                  </form>
                </div>
              ) : (
                <PasswordResetConfirmation
                  email={email}
                  onCheckEmail={handleCheckEmail}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent
            value="dependent-management"
            className="w-full !max-w-full space-y-5 bg-white"
          >
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-[#212121]">
                Manage Profiles
              </h4>
              {user?.dependents ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-4 rounded-[6px] border border-[#E8E8E8] p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg"
                        width={42}
                        height={42}
                        className="size-[42px] rounded-full object-cover"
                        alt="mainImage"
                      />
                      <div className="space-y-1">
                        <h4 className="text-bassme font-medium text-[#333]">
                          Temidayo Olanrewaju{" "}
                        </h4>
                        <p className="text-xs font-normal text-[#66666B]">
                          Relationship: Mother
                        </p>
                      </div>
                    </div>
                    <Button
                      className="!h-[34px] rounded-[6px]"
                      variant={"outline"}
                    >
                      View details
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4 rounded-[6px] border border-[#E8E8E8] p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg"
                        width={42}
                        height={42}
                        className="size-[42px] rounded-full object-cover"
                        alt="mainImage"
                      />
                      <div className="space-y-1">
                        <h4 className="text-bassme font-medium text-[#333]">
                          Temidayo Olanrewaju{" "}
                        </h4>
                        <p className="text-xs font-normal text-[#66666B]">
                          Relationship: Mother
                        </p>
                      </div>
                    </div>
                    <Button
                      className="!h-[34px] rounded-[6px]"
                      variant={"outline"}
                    >
                      View details
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  role="status"
                  className="flex flex-col items-center justify-center gap-4 rounded-[6px] border border-dashed border-[#E8E8E8] bg-[#FAFCFF] p-6 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Plus className="h-6 w-6" />
                  </div>

                  <h5 className="text-md font-semibold text-[#212121]">
                    No dependents yet
                  </h5>
                  <p className="max-w-xs text-sm text-[#66666B]">
                    Add family members or dependents to manage their profiles,
                    medical records, and appointments.
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      className="flex !h-[38px] items-center gap-2 text-sm"
                      onClick={() => {
                        // TODO: open "Add Dependent" sheet/modal
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Add dependent
                    </Button>
                    <Button variant="ghost" className="!h-[38px]">
                      Learn more
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
};
