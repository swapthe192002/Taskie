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

        const { twoFactorStatus, setMarked } = body;

        const updatedUser = await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                isTwoFactorEnabled: twoFactorStatus,
                isTwoFactorPopupShown: setMarked,
            }
        })

        return new Response(JSON.stringify(updatedUser), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        } else {
            return new Response('An unknown error occurred', { status: 500 });
        }
    }
}


export async function PATCH(request: Request) {
    try {

        const user = await currentUser();

        if(!user){
            return new Response('User not found', { status: 404 });
        }

        const body = await request.json();

        const { setMarked } = body;

        const updatedUser = await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                isTwoFactorPopupShown: setMarked,
            }
        })

        return new Response(JSON.stringify(updatedUser), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        } else {
            return new Response('An unknown error occurred', { status: 500 });
        }
    }
}