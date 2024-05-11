import { Task } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "taskModal" | "deleteModal" | "editTaskModal" | "profileModal"
                        | "twoFactorModal" | "twoFactorSettingsModal";

interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    taskId: string | null;
    task: Task | null;
    onOpen: (type: ModalType, taskId?: string, task?: Task) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    taskId: null,
    task: null,
    onOpen: (type, taskId, task) => set({ type, isOpen: true, taskId, task }),
    onClose: () => set({ type: null, isOpen: false, taskId: null, task: null }),
}));
