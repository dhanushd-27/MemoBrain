"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { SignUpSchema, SignUpZodSchema } from '@/types/user.types'
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { SignUpAction } from '@/actions/post/sign-up-action'
import { toast } from 'sonner'
import { isErrorResponse } from '@/utils/api/api-response-handler'
import { ActionResponse } from '@/types/response-request.types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils"
import { redirect } from 'next/navigation'


export default function SignUpForm({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"div">) {

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(SignUpZodSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  async function onSubmit(values: SignUpSchema) {
    const response: ActionResponse = await SignUpAction(values);
    
    if(isErrorResponse(response)) {
      toast.error(response.errorInformation.message);
      return;
    } else {
      toast.success(response.message);
      redirect("/login");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Enter your details below to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 px-6 py-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Submit</Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </Form>
    </div>
  )
}
