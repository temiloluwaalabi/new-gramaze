"use client";
import { Info, Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useSession from "@/hooks/use-session";
import { useUserStore } from "@/store/user-store";

type Props = {
  trigger: React.ReactNode;
};
export const LogoutModal = (props: Props) => {
  const { clientLogoutSession } = useSession();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await clientLogoutSession().then(() => {
      toast("Logged out successfully");
      // useUserStore.getState().clearStore();
      useUserStore.getState().logout();
      setOpenDialog(false);
      setLoading(false);
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild className="">
        {props.trigger}
      </DialogTrigger>
      <DialogContent className="dark:bg-dark-200 flex flex-col gap-3 border-none">
        <DialogHeader>
          <DialogTitle className="dark:text-light-700 flex items-center space-x-2 text-base">
            <Info className="me-2 size-4" />
            Sign out of Gramaze Home Healthcare
          </DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Are you sure you want to logout? We&apos;ll sign you out and remove
            any offline data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-3 flex w-full justify-between gap-1">
          <div className="flex justify-between gap-6">
            <DialogClose asChild className="">
              <Button
                disabled={loading}
                variant={"ghost"}
                className="light-border-2 text-dark400_light500 flex w-full cursor-pointer items-center gap-2 rounded-md border p-2 px-4 text-sm"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
          <Button
            disabled={loading}
            className="hover:bg-primary-500 dark:bg-maroon-700 flex cursor-pointer items-center justify-center gap-2"
            onClick={handleLogout}
          >
            {loading && <Loader2 className="ms-2 size-4 animate-spin" />}

            {loading ? "Logging Out..." : "Sign Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
