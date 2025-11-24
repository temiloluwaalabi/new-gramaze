import {
  CheckIcon,
  LayersIcon,
  LogOut,
  MenuIcon,
  UserIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { LogoutModal } from "@/components/dialogs/logout-modal";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/onboarding-context";
import CalendarBlankIcon from "@/icons/calendar-blank";
import HeartbeatIcon from "@/icons/heartbeat";
import UserFocusIcon from "@/icons/user-focus";
import { useUserStore } from "@/store/user-store";

import { Logo } from "../logo";

type Step = {
  id: string;
  label: string;
  description: string;
};

const OnboardingSidebar = ({ steps }: { steps: Step[] }) => {
  const { currentStep, completedSteps, goToStep } = useOnboarding();
  const { user } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Handle screen size detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Mobile header that shows current step and menu toggle
  const MobileHeader = () => (
    <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
      <Logo
        logoLink="https://res.cloudinary.com/davidleo/image/upload/v1744665654/gramaze-logo_yt4zo6.png"
        className="flex h-[40px] w-[150px] items-end justify-end"
      />
      <button
        onClick={toggleMobileMenu}
        className="flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
      >
        {isMobileMenuOpen ? (
          <X className="size-6" />
        ) : (
          <MenuIcon className="size-6" />
        )}
      </button>
    </div>
  );
  const stepsWithStatus = steps.map((step) => ({
    ...step,
    completed: completedSteps.includes(step.id),
    current: currentStep === step.id,
  }));
  return (
    <>
      <MobileHeader />

      {/* Mobile menu overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop version is fixed, mobile version slides in */}
      <div
        className={` ${isMobile ? "fixed top-0 right-0 z-50 w-3/4 max-w-xs transform transition-transform duration-300 ease-in-out" : "fixed top-0 left-0 hidden w-[300px] lg:flex xl:w-[348px]"} ${isMobile && !isMobileMenuOpen ? "translate-x-full" : "translate-x-0"} flex min-h-screen flex-col items-start justify-between border-r bg-gray-50 p-4 lg:p-8`}
      >
        {/* Hide desktop logo on mobile as we have it in the header */}
        <div className="mb-[40px] hidden lg:block 2xl:mb-[62px]">
          <Logo
            logoLink="https://res.cloudinary.com/davidleo/image/upload/v1744665654/gramaze-logo_yt4zo6.png"
            className="flex h-[65.81px] w-[245px] items-end justify-end"
          />
        </div>

        {/* Current step indicator for mobile */}
        {isMobile && (
          <div className="mb-6 w-full rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-700">
              Step: {stepsWithStatus.findIndex((s) => s.current) + 1} of{" "}
              {steps.length} - {stepsWithStatus.find((s) => s.current)?.label}
            </p>
          </div>
        )}

        <div className="w-full space-y-8 lg:space-y-14">
          {stepsWithStatus.map((step, index) => {
            const isCurrent = currentStep === step.id;

            return (
              <div className="relative" key={step.id}>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute bottom-0 left-4 -mb-6 h-6 w-0.5 lg:-mb-12 lg:h-10 2xl:left-6 ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                  />
                )}

                <div
                  className="flex cursor-pointer items-start"
                  onClick={() => {
                    if (step.completed || step.current) {
                      goToStep(step.id);
                      if (isMobile) setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  <div
                    className={`flex size-8 flex-shrink-0 items-center justify-center rounded-[4px] lg:size-[32px] 2xl:size-[46px] ${step.completed ? "bg-green-100 text-green-600" : isCurrent ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"}`}
                  >
                    {step.completed ? (
                      <CheckIcon className="size-4 2xl:size-6" />
                    ) : step.id === "plan" ? (
                      <LayersIcon className="size-4 2xl:size-6" />
                    ) : step.id === "bio-data" ? (
                      <UserFocusIcon className="size-4 2xl:size-6" />
                    ) : step.id === "medical-history" ? (
                      <HeartbeatIcon className="size-4 2xl:size-6" />
                    ) : (
                      <CalendarBlankIcon className="size-4 2xl:size-6" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium 2xl:text-base">
                      {step.label}
                    </h3>
                    <p className="text-[11px] text-gray-500 2xl:text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto w-full pt-6 lg:pt-10">
          <div className="rounded-lg border border-gray-300 bg-gray-100 p-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="size-5 text-gray-600 lg:size-6" />
              <p>
                <span>
                  {user?.first_name} {user?.last_name}
                </span>
              </p>
            </div>
            <div className="mt-2 flex flex-col">
              <LogoutModal
                trigger={
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="flex !h-fit w-full cursor-pointer items-center justify-end bg-red-800 px-2 !py-2 hover:bg-red-900"
                  >
                    <LogOut className="!size-5 rotate-180 text-white group-data-[collapsible=icon]:-ml-[2px]" />
                    <span className="hover:text-primary ms-1 truncate text-sm font-normal text-white hover:font-medium dark:text-gray-300">
                      Logout
                    </span>
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingSidebar;
