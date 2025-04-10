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

export default function SignUpForm() {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(SignUpZodSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  function onSubmit(values: SignUpSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
