"use client"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { SignInSchema, SignInZodSchema } from "@/types/user.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { SignInAction } from "@/actions/post/sign-in-action"
import { isErrorResponse } from "@/utils/api/api-response-handler"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import Link from "next/link"

export default function SignInForm({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(SignInZodSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: SignInSchema) {
    const response = await SignInAction(values);

    if(isErrorResponse(response)){
      toast.error(response.errorInformation.message);
    } else {
      toast.success(response.message);
      redirect("/dashboard");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>       
           <Form { ...form } >
            <form onSubmit={ form.handleSubmit(onSubmit) }className='flex flex-col gap-6 px-6 py-4 rounded-xl'>
              <FormField 
                control={ form.control }
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" { ...field }/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField 
                control={ form.control }
                name="password"
                render={ ({ field }) => (
                  <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" { ...field } />
                  </FormControl>
                    <FormMessage />
                    </FormItem>
                  ) }
                />

              <Button type="submit">Log In</Button>
            </form>
          </Form>
             
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href={'/signup'} className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}