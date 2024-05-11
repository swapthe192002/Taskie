"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorEmail } from "@/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";
import bcrypt from "bcryptjs";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success){
        return {
            error: "Invalid fields!"
        }
    }

    const { email, password, code } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    
    if(!existingUser || !existingUser.email || !existingUser.password){
        return {
            error: "Email does not exist"
        }
    }

    const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password,
    )

    if(!passwordMatch){
        return {
            error: "Incorrect password"
        }
    }


    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);
        
        return {
            success: "Verification code sent again",
            redirect: true,
        }
    }





    if(existingUser.isTwoFactorEnabled && existingUser.email){

        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if(!twoFactorToken){
                return {
                    error: "Invalid code"
                }
            }

            if(twoFactorToken.token !== code){
                return {
                    error: "Invalid code"
                }
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if(hasExpired){
                return {
                    error: "Code expired"
                }
            }

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id
                    }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            });

        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorEmail(
                twoFactorToken.email,
                twoFactorToken.token
            )

            return {
                twofactor: true
            };
        }
    }



    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    } catch (error){
        if(error instanceof AuthError){
            switch (error.type){
                case "CredentialsSignin":
                    return { error: "Invalid credentials" }
                default:
                    return { error: "Something went wrong!" }
            }
        }

        throw error;
    }

    return {
        success: "Email sent!",
        redirect: true,
    }
}