import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useModal = create<ModalState>()(
  persist(
    (set) => ({
      isOpen: false,
      onOpen: () => set({ isOpen: true }),
      onClose: () => set({ isOpen: false }),
    }),
    { name: "modal", storage: createJSONStorage(() => localStorage) },
  ),
);
