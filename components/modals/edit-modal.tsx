"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { ProgressBar } from "@/components/ui/progress-bar";

interface EditModalProps {
    title?: string;
    description?: string;
    currentStep?: number;
    totalSteps?: number; 
    isOpen? : boolean;
    onClose: () => void;
    onSubmit: () => void;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel?: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
    actionLabelVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const EditModal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    description,
    body,
    footer,
    actionLabel,
    currentStep,
    totalSteps,
    disabled,
    secondaryAction,
    actionLabelVariant = 'default',
    secondaryActionLabel,
}: EditModalProps) => {

    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }


    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>

                <SheetHeader>
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                        {description}
                    </SheetDescription>
                </SheetHeader>

                <div>
                    {totalSteps! > 1 ? (
                        <div className="flex flex-col gap-12 items-center">
                            <div className="w-[95%] mt-6 dark:bg-neutral-800 bg-gray-200 h-[2px] rounded-full">
                                <ProgressBar currentStep={currentStep!} totalSteps={totalSteps!} />
                            </div>
                            <div className="w-full">
                                {body}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {body}
                        </div>
                    )}
                    
                </div>

                <SheetFooter className="gap-2">
                    {secondaryActionLabel && (
                        <Button 
                            className="w-full"
                            variant={'outline'} onClick={secondaryAction}
                            disabled={disabled}
                        >
                            {secondaryActionLabel}
                        </Button>
                    )}
                    <Button 
                        className="w-full"
                        //@ts-ignore
                        variant={actionLabelVariant} 
                        onClick={onSubmit}
                        disabled={disabled}
                    >
                        {actionLabel}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}