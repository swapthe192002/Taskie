import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

interface IParams {
    taskId?: string;
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
    try {

        const user = currentUser();

        if(!user){
            return new Response('User not found', { status: 404 });
        }

        const { taskId } = params;

        if(!taskId){
            return new Response('No task ID provided', { status: 404 });
        }

        await db.task.delete({
            where: {
                id: taskId
            }
        })

        return new Response('Task deleted', { status: 200 });
        

    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        } else {
            return new Response('An unknown error occurred', { status: 500 });
        }
    }
}


export async function PUT(request: Request, { params }: { params: IParams }) {
    try {

        const user = currentUser();

        const body = await request.json();
        const { updatedStatus } = body;

        if(!user){
            return new Response('User not found', { status: 404 });
        }

        const { taskId } = params;

        if(!taskId){
            return new Response('No task ID provided', { status: 404 });
        }

        await db.task.update({
            where: {
                id: taskId
            },
            data: {
                hasCompleted: updatedStatus
            }
        })

        return new Response('Status updated', { status: 200 });
        

    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        } else {
            return new Response('An unknown error occurred', { status: 500 });
        }
    }
}