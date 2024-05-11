"use client"

import { Task, User } from "@prisma/client"
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useCurrentUser } from "@/hooks/use-current-user";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";

interface TasksClientProps{
    tasks: Task[];
    user: User[]
}

export const TasksClient = ({
    tasks,
    user,
} : TasksClientProps) => {

    if(!user) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <EmptyState
                    title = "You are not logged in"
                    subtitle = "Login to view tasks"
                    showLogin
                />
                
            </div>
        )
    }

    if(tasks?.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <EmptyState/>
            </div>
        )
    }


    return (
        <div className="w-full h-full  flex flex-col">
            <div className="h-[10%] w-full flex items-center">
                <h1 className="text-3xl font-bold">Current tasks</h1>
            </div>
            <div className="h-[90%] w-full overflow-hidden overflow-y-scroll">
                <DataTable columns={columns} data={tasks}/>
            </div>
        </div>
    )
} 