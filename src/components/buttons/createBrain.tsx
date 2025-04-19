"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { createBrainType, createBrainZodSchema } from "@/types/brainType/brain"
import { zodResolver } from "@hookform/resolvers/zod"
import { createBrain } from "@/actions/post/create-brain"
import { isErrorResponse } from "@/utils/api/api-response-handler"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

export function CreateBrain() {
  const form = useForm<createBrainType>({
    resolver: zodResolver(createBrainZodSchema),
    defaultValues: {
      tags: ["something"],
      type: "",
      title: "",
      url: ""
    }
  });

  async function onSubmit(values: createBrainType) {
    const response = await createBrain(values);

    if(isErrorResponse(response)){
      toast.error(response.errorInformation.message);
    } else {
      toast.success(response.message);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Brain</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Brain</DialogTitle>
          <DialogDescription>
            Create brain and store important information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={ form.handleSubmit(onSubmit) } className="flex flex-col gap-4">
            <FormField 
              control={ form.control }
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter Brain Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={ form.control }
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select 
                      {...field} 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select you brain type"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="tweet">Tweet</SelectItem>
                        <SelectItem value="docs">Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField 
              control={ form.control }
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Brain Url" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={ form.control }
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brain tag" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                Add Brain
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}