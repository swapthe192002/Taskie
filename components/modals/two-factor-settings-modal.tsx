"use client"

import { User } from "@prisma/client"
import { Modal } from "@/components/modals/modal";
import { useCallback, useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { useForm } from "react-hook-form";
import ShieldAnimation from "@/public/animations/shield.json"
import Lottie from "lottie-react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";


export const TwoFactorSettingsModal = () => {

    
    const { isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === "twoFactorSettingsModal";
    const [loading, setLoading] = useState(false);

    const form = useForm();
    const router = useRouter();

    const handleClose = useCallback(() => {
        onClose();
    }, []);

    const onSubmit = async () => {
        const values = { setMarked : true }
        setLoading(true);
        axios.patch('/api/user/two-factor', values)
            .then(() => {})
            .catch(() => {})
            .finally(() => {
                onClose();
                router.refresh();
            })
    }

    const bodyContent = (
        <div className="flex flex-col">
            <div className="block dark:hidden h-[12rem] rounded-lg w-full ">
                <div className="h-full rounded-lg w-full border-[1px] border-neutral-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative">
                    <Image
                        src='/images/2fa_light.png'
                        alt="background"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                    />
                </div>
            </div>

            <div className="dark:block hidden h-[12rem] rounded-lg w-full ">
                <div className="h-full rounded-lg w-full border-[1px] border-neutral-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative">
                    <Image
                        src='/images/2fa_dark.png'
                        alt="background"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                    />
                </div>
            </div>

            <div className="w-full flex flex-col">
                <p className="text-md font-semibold text-primary mt-4">Two factor authentication can be enabled in settings</p>
            </div>
        </div>
    );



    return (
        <div>
            <Modal
                title=""
                description={''}
                onSubmit={onSubmit}
                actionLabel={'Done'}
                secondaryAction={handleClose}
                secondaryActionLabel={''}
                isOpen={isModalOpen}
                body={bodyContent}
                disabled={loading}
            />
        </div>
    )
}