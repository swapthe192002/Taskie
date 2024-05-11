"use client"

import { Task } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Check, Cross, MoreHorizontal, Pencil, Trash, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { useModal } from "@/hooks/use-modal-store"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"


interface MarkProps{
    taskId: string;
}

const MarkComplete = ({
    taskId,
} : MarkProps) => {

    const router = useRouter();

    const markAsComplete = async() => {
        axios.put(`/api/tasks/${taskId}`, { updatedStatus: true })
        .then(() => {
            router.refresh();
            toast.success('Marked as complete');
        }) .catch((error) => {
            toast.error(error.response.data);
        })
    }

    return (
        <div 
            className="w-full h-full flex items-center gap-2"
            onClick={markAsComplete}
        >
            <Check size={20}/>
            <p>Mark as complete</p>
        </div>
    )
}


const MarkInComplete = ({
    taskId,
} : MarkProps) => {

    const router = useRouter();

    const markAsInComplete = async() => {
        axios.put(`/api/tasks/${taskId}`, { updatedStatus: false })
        .then(() => {
            router.refresh();
            toast.success('Marked as incomplete');
        }) .catch((error) => {
            toast.error(error.response.data);
        })
    }

    return (
        <div 
            className="w-full h-full flex items-center gap-2"
            onClick={markAsInComplete}
        >
            <X size={20}/>
            <p>Mark as incomplete</p>
        </div>
    )
}


interface DeleteTaskProps{
    taskId: string;
}
const DeleteTask = ({
    taskId,
} : DeleteTaskProps) => {

    const { onOpen } = useModal();
    const router = useRouter();

    return (
        <div 
            className="w-full h-full flex items-center gap-2"
            onClick={() => onOpen('deleteModal', taskId)}
        >
            <Trash2 size={20}/>
            <p>Delete Task</p>
        </div>
    )
}

interface EditTaskProps{
    taskId: string;
    task: Task;
}
const EditTask = ({
    taskId,
    task
} : EditTaskProps) => {

    const { onOpen } = useModal();
    const router = useRouter();

    return (
        <div 
            className="w-full h-full flex items-center gap-2"
            onClick={() => onOpen('editTaskModal', taskId, task)}
        >
            <Pencil size={20}/>
            <p>Edit Task</p>
        </div>
    )
}


export const columns: ColumnDef<Task>[] = [

  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const task = row.original

        return (
            <span className="font-bold px-4">
                {task.title}
            </span>
        );
    }
  },

  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const task = row.original

        return (
            <span className="px-4">
                {task.priority}
            </span>
        );
    }
  },

  {
    accessorKey: "dueDate",
    header: "Due date",
    cell: ({ row }) => {
        const task = row.original

        return (
            <span className="">
                {format(new Date(task.dueDate), "MMM do yyyy")}
            </span>
        );
    }
  },
  {
    accessorKey: "hasCompleted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const task = row.original

        return (
            <span className="px-4">
                {task.hasCompleted ? (
                    <Badge className="bg-emerald-500/15 text-green-600">
                        Complete
                    </Badge>
                ) : (
                    <Badge className="bg-destructive/15 text-destructive">
                        Incomplete
                    </Badge>
                )}
            </span>
        );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const task = row.original

      const taskId = task.id;


 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
            >
             <EditTask task={task} taskId={taskId} />
            </DropdownMenuItem>

            {!task.hasCompleted ? (
                <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <MarkComplete taskId={taskId}/>
                </DropdownMenuItem>
            ) : (
                <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <MarkInComplete taskId={taskId}/>
                </DropdownMenuItem>
            )}
            

            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="text-destructive flex items-center gap-2 cursor-pointer"
            >
                <DeleteTask taskId={taskId} />
            </DropdownMenuItem>


          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]