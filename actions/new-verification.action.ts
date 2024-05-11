"use server"

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";
import { OtpSchema } from "@/schemas";
import { redirect } from "next/navigation";
import * as z from  "zod";

export const newVerification = async (value: z.infer<typeof OtpSchema>) => {
    try {
        const validatedFields = OtpSchema.safeParse(value);

        //@ts-ignore
        const { code } = validatedFields.data;

        const existingToken = await getVerificationTokenByToken(code)

        if(!existingToken){
            return {
                error: "Token does not exist"
            }
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if(hasExpired){
            return {
                error: "Token has expired"
            }
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if(!existingUser){
            return {
                error: "Email does not exist"
            }
        }

        await db.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                emailVerified: new Date(),
                email: existingUser.email,
            }
        })

        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            }
        })

        return {
            success: "Email verified, redirecting to login...",
            redirect: true,
        }


    } catch {
        return null;
    }
}