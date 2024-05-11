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
import { EditModal } from "@/components/modals/edit-modal"



export const EditTaskModal = () => {

    const { isOpen, onClose, type, task, taskId } = useModal();

    const router = useRouter();
    const form = useForm({
        defaultValues: {
            taskId: task?.id,
            title: task?.title,
            priority: task?.priority || "Priority",
            dueDate: task?.dueDate,
        },
    });

    const [priority, setPriority] = useState("Priority");
    const [dueDate, setDueDate] = useState<Date>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            form.setValue('title', task.title || '');
            form.setValue('priority', task.priority || '');
            form.setValue('dueDate', task.dueDate);
        }
    }, [task]);


    
    const handlePrioritySelect = (priority : any) => {
        setPriority(priority);
        form.setValue('priority', priority);
    }

    const isModalOpen = isOpen && type === "editTaskModal"

    const handleClose = useCallback(() => {
        form.reset();
        onClose();
    }, [])


    const onSubmit = async (values: any) => {
        setLoading(true);
        const updatedValues = { ...values, taskId: taskId };
        axios.put('/api/tasks', updatedValues)
            .then(() => {
                router.refresh();
                toast.success('Success');
            }) .catch((error) => {
                toast.error(error.response.data);
            }) .finally(() => {
                setLoading(false);
                handleClose()
            })
        console.log(task?.id)
        console.log(values)
    }
    
    
    useEffect(() => {
        if (dueDate) {
            form.setValue("dueDate", dueDate);
        }
    }, [dueDate, form.setValue]);


    let bodyContent = (
        <div className="w-full flex flex-col mt-6 mb-6">
            <div key="title">
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input  placeholder="Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Form>
            </div>

            <div key="priority">
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <DropdownInput
                                    label={priority!}
                                    menuItems={["LOW", "MEDIUM", "HIGH"]}
                                    onSelect={handlePrioritySelect}
                                    className="w-[21rem]"
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </Form>
            </div>

            <div key="dueDate">
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <DateInput
                                    label="Due date"
                                    selectedDate={dueDate}
                                    onSelect={setDueDate}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </Form>
            </div>

        </div>
    )

    return (
        <div>
            <EditModal
                title="Edit task"
                description={"Update task details"}
                onClose={handleClose}
                onSubmit={form.handleSubmit(onSubmit)}
                actionLabel={"Update"}
                secondaryAction={handleClose}
                secondaryActionLabel={"Cancel"}
                isOpen={isModalOpen}
                body={bodyContent}
                disabled={loading}
            />
        </div>
    )
}