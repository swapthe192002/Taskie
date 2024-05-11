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

enum STEPS{
    TITLE = 0,
    PRIORITY = 1,
    DUE_DATE = 2,
}


export const TaskModal = () => {

    const router = useRouter();
    const form = useForm<z.infer<typeof TaskSchema>>({
        defaultValues: {
          title: "",
          priority: "LOW",
          dueDate: new Date(),
        },
    });

  
    const { isOpen, onClose, type } = useModal();
    const [step, setStep] = useState(STEPS.TITLE);
    const [description, setDescription] = useState('Enter book name');
    const [priority, setPriority] = useState('Priority');
    const [dueDate, setDueDate] = useState<Date>();
    const [loading, setLoading] = useState(false);
    const [validInput, setValidInput] = useState(false);

    
    const handlePrioritySelect = (priority : string) => {
        setPriority(priority);
        form.setValue('priority', priority);
    }

    const isModalOpen = isOpen && type === "taskModal"



    const onBack = () => {
        setStep((value) => value - 1);
    }
    const onNext = async () => {
        if (step === STEPS.TITLE) {
            const isTitleValid = await form.trigger('title');
            if (isTitleValid) {
                setStep((value) => value + 1);
            }
        } else if (step === STEPS.PRIORITY) {
            const isPriorityValid = await form.trigger('priority');
            if (isPriorityValid) {
                setStep((value) => value + 1);
            }
        } else if (step === STEPS.DUE_DATE) {
            const isDueDateValid = await form.trigger('dueDate');
            if (isDueDateValid) {
                setStep((value) => value + 1);
            }
        }
    }

    const actionLabel = useMemo(() => {
        if(step === STEPS.DUE_DATE){
            return 'Create'
        }
        return 'Next'
    }, [step]);
    
    
    const secondaryActionLabel = useMemo(() => {
        if(step === STEPS.TITLE){
            return 'Cancel';
        }
        return 'Back'
    }, [step]);



    const onSubmit = async (values: z.infer<typeof TaskSchema>) => {
        if (step !== STEPS.DUE_DATE) {
            onNext();
        } else {
            setLoading(true);
            axios.post('/api/tasks', values)
                .then(() => {
                    router.refresh();
                    toast.success('Success');
                }) .catch((error) => {
                    toast.error(error.response.data);
                }) .finally(() => {
                    setLoading(false);
                    handleClose()
                })
        }
    }
    

    useEffect(() => {
        if (step === STEPS.TITLE){
            setDescription('Give your task a name');
        } else if (step === STEPS.PRIORITY){
            setDescription('Set priority');
        }
        else{
            setDescription('Set due date');
        }
    })
    
    useEffect(() => {
        if (dueDate) {
            form.setValue("dueDate", dueDate);
        }
    }, [dueDate, form.setValue]);


    const handleClose = useCallback(() => {
        setPriority('Priority')
        form.setValue('priority', priority);

        setDueDate(undefined);
        //@ts-ignore
        form.setValue('dueDate', dueDate);

        form.reset()
        onClose();
        setStep(STEPS.TITLE);
    }, []);


    let bodyContent = (
        <div key="title">
            <Form {...form}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                    className="focus-visible:ring-transparent focus:ring-0" 
                                    placeholder="Title" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </Form>
        </div>
    )

    if(step === STEPS.PRIORITY){
        bodyContent = (
            <AnimatedDiv key="priority">
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <DropdownInput
                                    label={priority}
                                    menuItems={["LOW", "MEDIUM", "HIGH"]}
                                    onSelect={handlePrioritySelect}
                                    className="w-[29rem]"
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </Form>
            </AnimatedDiv>
        )
    }

    if(step === STEPS.DUE_DATE){
        bodyContent = (
            <AnimatedDiv key="dueDate">
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
            </AnimatedDiv>
        )
    }

    return (
        <div>
            <Modal
                title="Create a new task"
                description={description}
                onClose={handleClose}
                onSubmit={form.handleSubmit(onSubmit)}
                actionLabel={actionLabel}
                currentStep={step}
                totalSteps={Object.keys(STEPS).length / 2}
                secondaryAction={step == STEPS.TITLE ? handleClose : onBack}
                secondaryActionLabel={secondaryActionLabel}
                isOpen={isModalOpen}
                body={bodyContent}
                disabled={loading}
            />
        </div>
    )
}