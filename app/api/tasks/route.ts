import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TaskSchema } from "@/schemas";
import * as z from "zod";

export async function POST(request: Request) {
    try {

        const user = await currentUser();

        if(!user){
            return new Response('User not found', { status: 404 });
        }

        const body = await request.json();

        const { title, priority, dueDate } = body;
        const taskPriority = priority ? priority : 'LOW';


        const validatedFields = TaskSchema.safeParse(body);

        if(!title || !taskPriority || !dueDate){
            return new Response('Missing fields', { status: 404 });
        }

        const newTask = await db.task.create({
            //@ts-ignore
            data: {
                title: title,
                priority: taskPriority,
                dueDate: dueDate,
                hasCompleted: false,
                userId: user.id
            }
        })

        return new Response(JSON.stringify(newTask), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        } else {
            return new Response('An unknown error occurred', { status: 500 });
        }
    }
}

export async function PUT(request: Request) {
    try {

        const user = await currentUser();

        if(!user){
            return new Response('User not found', { status: 404 });
        }

        const body = await request.json();

        const { taskId, title, priority, dueDate } = body;
        console.log(body)

        if(!taskId || !title || !priority || !dueDate){
            return new Response('Missing fields', { status: 404 });
        }

        const existingTask = await db.task.findUnique({
            where: {
                id: taskId
            }
        })

        if(!existingTask){
            return new Response('Task not found', { status: 404 });
        }

        const updatedTask = await db.task.update({
            where: {
                id: existingTask.id,
            },
            data: {
                title: title,
                priority: priority,
                dueDate: dueDate
            }
        })

        return new Response(JSON.stringify(updatedTask), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        } else {
            return new Response('An unknown error occurred', { status: 500 });
        }
    }
}