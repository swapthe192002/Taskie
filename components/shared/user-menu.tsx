"use client"

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

import { UserAvatar } from "@/components/shared/user-avatar"
import { logout } from "@/actions/logout.action"
import { useRouter } from "next/navigation"
import { User } from "@prisma/client"
import { useModal } from "@/hooks/use-modal-store"
import { LogOut, UserRound } from "lucide-react"

interface UserMenuProps{
    user: User;
}
export const UserMenu = ({
    user,
} : UserMenuProps) => {

    const router = useRouter();
    const { onOpen } = useModal();

    const handleLogout = () => {
        logout()
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar user={user}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">

                <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2" 
                    onClick={() => onOpen('profileModal')}
                >
                    <UserRound size={20}/>
                    <p>Profile</p>
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem 
                    className="cursor-pointer text-destructive flex items-center gap-2" 
                    onClick={handleLogout}
                >
                    <LogOut size={20}/>
                    <p>Logout</p>
                </DropdownMenuItem>


            </DropdownMenuContent>
        </DropdownMenu>
    )
}