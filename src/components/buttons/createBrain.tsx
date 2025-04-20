"use client"

import { useState } from "react";
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
import { FormBrainType, FormBrainZodSchema } from "@/types/brainType/brain"
import { zodResolver } from "@hookform/resolvers/zod"
import { createBrain } from "@/actions/post/create-brain"
import { isErrorResponse } from "@/utils/api/api-response-handler"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import Tag from "../Tag";
import { tagColorPalette } from "@/utils/other/colorStore";

export function CreateBrain() {
  const [tagsArray, setTagsArray] = useState<string[]>([]);

  const form = useForm<FormBrainType>({
    resolver: zodResolver(FormBrainZodSchema),
    defaultValues: {
      tags: "",
      type: "",
      title: "",
      url: ""
    }
  });

  const handleTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key != "Enter") return;
    e.preventDefault();

    const target = e.target as HTMLInputElement;
    const value = target.value;

    if(value == "") return;

    setTagsArray(t => [...t, value]);

    target.value = ""
    target.focus();
  }

  async function onSubmit(values: FormBrainType) {
    const response = await createBrain({
      type: values.type,
      title: values.title,
      url: values.url,
      tags: tagsArray
    });

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
                  <FormMessage />
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
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brain tag" onKeyDown={ (e) => { handleTags(e) } }/>
                  </FormControl>
                  <FormMessage />
                  <div className="flex gap-2 flex-wrap">
                    { tagsArray.map((tag, index) => (
                      <Tag key={ index } tagTitle={ tag } color={ tagColorPalette[index%4] } />
                    )) }
                  </div>
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