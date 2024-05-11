"use client"

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { User } from "@prisma/client"

interface UserAvatarProps{
    user: User;
}
export const UserAvatar = ({
    user,
} : UserAvatarProps) => {

    return (
        <Avatar>
            <AvatarImage src={user?.image ? user.image : "https://github.com/shadcn.png"} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )
}