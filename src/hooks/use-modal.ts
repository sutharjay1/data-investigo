import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ModalState {
  isOpen: boolean;
  type?: "TAGS";
  onOpen: (type?: "TAGS") => void;
  onClose: () => void;
}

export const useModal = create<ModalState>()(
  persist(
    (set) => ({
      isOpen: false,
      type: undefined,
      onOpen: (type) =>
        set((prev) => ({
          isOpen: !prev.isOpen,
          type: type || prev.type,
        })),
      onClose: () => set({ isOpen: false, type: undefined }),
    }),
    {
      name: "modal",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
