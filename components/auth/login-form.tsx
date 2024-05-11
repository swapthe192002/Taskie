"use client";

import { CardWrapper } from "@/components/auth/card-wrapper"
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas";
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login.action";
import Link from "next/link";
import { 
    InputOTP, 
    InputOTPGroup,
    InputOTPSeparator, 
    InputOTPSlot 
} from "@/components/ui/input-otp";

export const LoginForm = () => {

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with a different provider" : "";

    const form = useForm<z.infer<typeof LoginSchema>> ({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        startTransition(() => {
            login(values)
                .then((data) => {
                    if(data?.error!){
                        form.reset();
                        setError(data?.error!)
                    }
                    if(data?.success!){
                        form.reset();
                        setSuccess(data?.success!)
                    }
                    
                    if(data?.redirect){
                        router.push('/auth/new-verification')
                    }
                    if(data?.twofactor){
                        setShowTwoFactor(true);
                    }
                })
        })
    }
    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {showTwoFactor && (

                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two factor code code</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center justify-center">
                                                <InputOTP 
                                                    maxLength={6}
                                                    disabled={isPending}
                                                    {...field}
                                                    
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot className="w-[3.7rem]" index={0} />
                                                        <InputOTPSlot className="w-12" index={1} />
                                                        <InputOTPSlot className="w-12" index={2} />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot className="w-12" index={3} />
                                                        <InputOTPSlot className="w-12" index={4} />
                                                        <InputOTPSlot className="w-[3.7rem]" index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>

                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                        )}
                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    disabled={isPending}
                                                    {...field}
                                                    placeholder="john.doe@example.com"
                                                    type="email"
                                                />
                                            </FormControl>
                                                
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    disabled={isPending}
                                                    {...field}
                                                    placeholder="********"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <Button
                                                size={"sm"}
                                                variant={"link"}
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                <Link href={"/auth/reset"}>
                                                    Forgot password?
                                                </Link>
                                            </Button>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button
                        disabled={isPending} 
                        className="w-full"
                        type="submit"
                    >
                        {showTwoFactor ? "Confirm" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}