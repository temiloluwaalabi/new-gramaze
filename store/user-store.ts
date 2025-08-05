import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "@/types";
interface UserState {
  user: User | null;
  isAutheticated: boolean;
  isOnboarded: boolean;

  // ACTIONS
  setUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
  setIsOnboarded: (isOnboarded: boolean) => void;
  checkOnboardingStatus: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAutheticated: false,
      isOnboarded: false,
      setUser: (user) =>
        set(() => ({
          user: user as User,
          isAutheticated: !!user,
        })),
      setIsOnboarded: (isOnboarded) =>
        set(() => ({
          isOnboarded,
        })),
      checkOnboardingStatus: () => {
        const state = get();
        return state.isOnboarded;
      },
      login: (userData) =>
        set(() => ({
          user: userData,
          isAutheticated: true,
        })),
      logout: () =>
        set(() => ({
          user: null,
          isAutheticated: false,
        })),
    }),
    {
      name: "gramaze-user-storage",
      partialize: (state) => ({
        user: state.user,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);
