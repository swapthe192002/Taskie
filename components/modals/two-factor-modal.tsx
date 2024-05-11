"use client"

import { User } from "@prisma/client"
import { Modal } from "@/components/modals/modal";
import { useCallback, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { useForm } from "react-hook-form";
import ShieldAnimation from "@/public/animations/shield.json"
import Lottie from "lottie-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface TwoFactorModalProps{
    currentUser: User;
}

export const TwoFactorModal = ({
    currentUser,
} : TwoFactorModalProps) => {

    
    const { onOpen, isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === "twoFactorModal";
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm();

    const handleClose = useCallback(() => {
        onClose();
        onOpen('twoFactorSettingsModal')
    }, []);


    const onSubmit = async () => {
        const values = { twoFactorStatus : true, setMarked: true };
        setLoading(true);
        axios.post('/api/user/two-factor', values)
            .then(() => {
                toast.success("Two factor authentication enabled")
            }) .catch(() => {
                toast.error("Something went wrong")
            }) .finally(() => {
                router.refresh();
                setLoading(false);
                onClose();
            })
    }

    const bodyContent = (
        <div className="flex flex-col">
            <div className="h-full rounded-lg w-full border-[1px] border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                <Lottie className="h-[16rem] w-[16rem]" animationData={ShieldAnimation}/>
            </div>
            <div className="w-full flex flex-col">
                <h1 className="font-bold text-xl mt-5 text-primary">Enable two factor authentication?</h1>
                <p className="text-sm text-primary mt-2">Tasks.io has support for two factor authentication that prevents unauthorised access</p>
            </div>
        </div>
    )


    return (
        <div>
            <Modal
                title=""
                description={''}
                onSubmit={form.handleSubmit(onSubmit)}
                actionLabel={'Enable'}
                secondaryAction={handleClose}
                secondaryActionLabel={'Skip'}
                isOpen={isModalOpen}
                body={bodyContent}
                disabled={loading}
            />
        </div>
    )
}