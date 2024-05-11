'use client';

import { useRouter } from "next/navigation";
import Lottie from "lottie-react";

import Heading from "@/components/heading";
import animationData from '@/public/assets/empty-state.json'
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showLogin?: boolean;
}

const EmptyState = ({
    title = "No tasks found",
    subtitle = "Start adding tasks",
    showLogin
} : EmptyStateProps) => {

    const router = useRouter();

    return ( 
        <div 
            className="
                h-[60vh]
                flex 
                flex-col 
                gap-4
                justify-center 
                items-center 
            "
            >
            <Lottie animationData={animationData} className="w-48"/>
            <Heading
                center
                title={title}
                subtitle={subtitle}
            />
            {showLogin && (
                <Button
                    onClick={() => {
                        router.push('/auth/login')
                    }}
                >
                    Login
                </Button>
            )}
            
        </div>
    );
}
 
export default EmptyState;