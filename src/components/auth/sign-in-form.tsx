"use client"
// import { SignInAction } from "@/actions/post/sign-in-action"
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

export default function SignInForm() {
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
    }
  }

  return (
    <Form { ...form } >
      <form onSubmit={ form.handleSubmit(onSubmit) }className='flex flex-col gap-6 px-6 py-4 border rounded-xl'>
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
