"use client"


import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Modal } from "@/components/modals/modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useModal } from "@/hooks/use-modal-store"
import { AnimatedDiv } from "@/components/ui/animated-div"
import { useRouter } from "next/navigation"
import { TaskSchema } from "@/schemas";
import * as z from 'zod';
import { DropdownInput } from "@/components/inputs/dropdown-input"
import DateInput from "@/components/inputs/date-input"
import axios from "axios"
import toast from "react-hot-toast"
import { User } from "@prisma/client"
import { Switch } from "@/components/ui/switch"

interface ProfileModalProps{
    currentUser: User;
}

export const ProfileModal = ({
    currentUser,
} : ProfileModalProps) => {

    const router = useRouter();
    const form = useForm();

  
    const { isOpen, onClose, type } = useModal();
    const [priority, setPriority] = useState('Priority');
    const [dueDate, setDueDate] = useState<Date>();
    const [loading, setLoading] = useState(false);
    const [validInput, setValidInput] = useState(false);
    const [enableTwoFactor, setEnableTwoFactor] = useState(currentUser?.isTwoFactorEnabled);

    const isModalOpen = isOpen && type === "profileModal"

    const handleTwoFactorToggle = () => {
        if(enableTwoFactor){
            setEnableTwoFactor(false);
        } else {
            setEnableTwoFactor(true);
        }
    }

    const handleClose = useCallback(() => {
        onClose();
    }, []);



    const onSubmit = async (data: any) => {
        const updatedValues = { twoFactorStatus : enableTwoFactor };
        setLoading(true);
        console.log(updatedValues);
        axios.post('/api/user', updatedValues)
            .then(() => {
                toast.success("Changes saved")
            }) .catch (() => {
                toast.error("Something went wrong")
            }) .finally(() => {
                handleClose();
                router.refresh();
                setLoading(false)
            })
        // console.log(updatedValues)
    }



    let bodyContent = (
        <div key="flex flex-col items-center gap-2">
            <div className="w-full flex items-center justify-between mt-6">
                <h1 className="text-md">Two factor authentication</h1>
                <Switch
                    checked={enableTwoFactor}
                    onCheckedChange={handleTwoFactorToggle}
                />
            </div>
        </div>
    )



    return (
        <div>
            <Modal
                title="Your profile"
                description={"Make sure to save after making changes"}
                onClose={handleClose}
                onSubmit={form.handleSubmit(onSubmit)}
                actionLabel={"Save"}
                secondaryAction={handleClose}
                secondaryActionLabel={"Cancel"}
                isOpen={isModalOpen}
                body={bodyContent}
                disabled={loading}
            />
        </div>
    )
}