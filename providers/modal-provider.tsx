"use client"

import { DeleteModal } from "@/components/modals/delete-modal"
import { EditTaskModal } from "@/components/modals/edit-task-modal"
import { ProfileModal } from "@/components/modals/profile-modal";
import { TaskModal } from "@/components/modals/task-modal"
import { TwoFactorModal } from "@/components/modals/two-factor-modal";
import { TwoFactorSettingsModal } from "@/components/modals/two-factor-settings-modal";
import { useModal } from "@/hooks/use-modal-store";
import { User } from "@prisma/client"
import { useEffect } from "react";


interface ModalProviderProps{
    currentUser: User;
}
export const ModalProvider = ({
    currentUser,
} : ModalProviderProps) => {

    const { onOpen } = useModal();

    useEffect(() => {
        if(currentUser && !currentUser?.isTwoFactorEnabled && !currentUser?.isTwoFactorPopupShown){
            onOpen('twoFactorModal')
        }
    }, [])
    
    return (
        <>
            <ProfileModal currentUser={currentUser}/>
            <TwoFactorModal currentUser={currentUser}/>
            <TwoFactorSettingsModal/>
            <TaskModal/>
            <DeleteModal/>
            <EditTaskModal/>
        </>
    )
}