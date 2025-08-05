"use client";
import { Bell, Laptop, User } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import SecurityIcon from "@/icons/security-icon";
import { useUserStore } from "@/store/user-store";

import UpdateAccountDataForm from "../forms/update-account-data-form";
import PasswordResetConfirmation from "../shared/password-reset-confirmation";
import { PageTitleHeader } from "../shared/widget/page-title-header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
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

export const CaregiverSettingsClientPage = () => {
  const { user } = useUserStore();
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

  const [email, setEmail] = React.useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset requested for:", email);
  };

  const handlePasswordResetRequest = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setFlowStep("confirmation");
  };

  const handleCheckEmail = () => {
    // In a real app, this might redirect to email provider or back to login
    console.log("Redirecting to email client...");
    // For demo purposes, we'll go back to the form
    setFlowStep("form");
  };
  const handleSignOut = (deviceId: string) => {
    // Handle device sign out logic
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
          return {
            ...category,
            [channel === "sms" ? "smsEnabled" : "emailEnabled"]: value,
          };
        }
        return category;
      })
    );
  };
  return (
    <section className="max-w-5xl space-y-3 !bg-white px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <PageTitleHeader
        title="Settings"
        description="Change your account settings"
      />
      <section className="mt-4 flex w-full gap-5">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="custom-scrollbar mb-2 flex h-auto w-fit items-start justify-start gap-3 overflow-hidden overflow-x-scroll rounded-none border-b border-[#F0F2F5] bg-transparent p-0 pb-0 lg:mb-4">
            <TabsTrigger
              value="profile"
              className="!mb-0 cursor-pointer rounded-none !pb-0 text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
            >
              <User />
              Profile
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
              value="notifications-settings"
            >
              <Bell />
              Notification Settings
            </TabsTrigger>

            <TabsTrigger
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
              value="security"
            >
              <SecurityIcon />
              Security & Privacy
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="profile"
            className="mt-2 w-full !max-w-full space-y-5 bg-white"
          >
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <Image
                    src="https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg"
                    width={96}
                    height={96}
                    className="size-[70px] rounded-full object-cover md:size-[96px]"
                    alt="mainImage"
                  />
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-[#303030]">
                      Ebiwariamachree@gmail.com
                    </h4>
                    <p className="text-sm font-normal text-[#66666B]">
                      Member since January 2025
                    </p>
                  </div>
                </div>
                <Button className="!h-[38px] text-sm font-normal">
                  Edit Profile
                </Button>
              </div>
              <Separator className="bg-[#E8E8E8]" />
              {user && <UpdateAccountDataForm user={user} />}
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
                              className="data-[state=checked]:bg-gray-200"
                            />
                            <span className="text-sm font-medium">SMS</span>
                          </div>

                          <div className="flex items-center justify-between space-x-6">
                            <Switch
                              checked={category.emailEnabled}
                              onCheckedChange={(checked) =>
                                handleToggle(category.id, "email", checked)
                              }
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
              </div>
            </div>
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
                      />
                      <Button
                        onClick={() => handlePasswordResetRequest(email)}
                        className="relative mt-4 ml-auto flex !h-[38px] text-sm font-normal"
                      >
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
                        <Switch
                          checked={twoFactorEnabled}
                          onCheckedChange={setTwoFactorEnabled}
                          className="data-[state=checked]:bg-blue-600"
                        />
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
        </Tabs>
      </section>
    </section>
  );
};
