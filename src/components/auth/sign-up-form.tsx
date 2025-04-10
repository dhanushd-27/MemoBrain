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

export default function SignUpForm() {

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(SignUpZodSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  async function onSubmit(values: SignUpSchema) {
    const response = await SignUpAction(values);

    if('error' in response && response.error) {
      toast.error(response.errorInformation.message);
      return;
    } else if('message' in response) {
      toast.success(response.message);
      return;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={ form.handleSubmit(onSubmit)} className='flex flex-col gap-6 px-6 py-4 border rounded-xl'>
        <FormField
          control={ form.control }
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField 
          control={ form.control }
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Enter your Email' {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
          
        <FormField 
          control={ form.control }
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Enter your password' {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
