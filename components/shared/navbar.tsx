"use client"

import { UserAvatar } from "@/components/shared/user-avatar"
import { UserMenu } from "@/components/shared/user-menu"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "next/navigation"
import { User } from "@prisma/client"

interface NavbarProps{
    user: User;
}
export const Navbar = ({
    user,
} : NavbarProps) => {

    const { onOpen } = useModal();
    const router = useRouter();

    const handleAddTaskClick = () => {
        if(!user){
            router.push('/auth/login')
            return
        }
        else {
            onOpen('taskModal')
        }
    }

    return (
        <nav className="
            fixed h-16 w-full 
            shadow-sm px-4 md:px-14 flex
            items-center justify-between
        ">
            <h1 className="text-2xl font-bold text-blue-500">Tasks.io</h1>
            <div className="flex items-center gap-4">
                <Button onClick={handleAddTaskClick}>
                    Add task
                </Button>
                <ThemeToggle/>
                {user && (
                    <UserMenu user={user}/>
                )}
            </div>
        </nav>
    )
}