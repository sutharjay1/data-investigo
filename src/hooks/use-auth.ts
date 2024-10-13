import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  userId: number;
  username: string;
  email: string;
  isVerified: boolean;
  image: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  username: string;
  email: string;
  is_verified: boolean;
  image: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (data: AuthResponse) => {
        set({
          token: data.access_token,
          user: {
            userId: data.user_id,
            username: data.username,
            email: data.email,
            isVerified: data.is_verified,
            image: "",
          },
        });
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
