"use client"

import { Modal } from "./modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useCallback, useState, useTransition } from "react"
import { useModal } from "@/hooks/use-modal-store"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"


export const DeleteModal = () => {

    const { isOpen, onClose, type, taskId } = useModal();
    const isModalOpen = isOpen && type === "deleteModal";
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleClose = useCallback(() => {
        onClose();
    }, [])

    const onSubmit = async () => {
        setLoading(true)
        axios.delete(`/api/tasks/${taskId}`)
        .then(() => {
            router.refresh();
            toast.success('Deleted');
        }) .catch((error) => {
            toast.error(error.response.data);
        }) .finally(() => {
            setLoading(false)
            handleClose()
        })
    }
    
    return (
        <div>
            <Modal
                title="Delete task"
                description="Are you sure you want to delete this task?"
                onClose={handleClose}
                onSubmit={onSubmit}
                actionLabel="Delete"
                secondaryAction={handleClose}
                secondaryActionLabel="Cancel"
                isOpen={isModalOpen}
                actionLabelVariant="destructive"
                disabled={loading}
            />
        </div>
    )
}