import { z } from "zod";

export const createBrainZodSchema = z.object({
  type: z.string(),
  url: z.string(),
  title: z.string(),
  tags: z.array(z.string())
})

export type createBrainSchema = z.infer<typeof createBrainZodSchema>

export type responseBrainType = {
  adminId: string;
  id: number;
  type: string;
  url: string;
  title: string;
  tags: string[];
}

export type BrainCardType = createBrainSchema & {
  id: number
}

export const FormBrainZodSchema = z.object({
  title: z.string({ message: "Title is a required field" }).min(1, { message: "Length of Title should be more than 1" }),
  type: z.string({ message: "Type is a required field" }).min(1, { message: "Length of Title should be more than 1" }),
  url: z.string({ message: "Link is a required field" }).min(1, { message: "Length of Title should be more than 1" }),
  tags: z.string({message: "Tags is a required field"})
});

export type FormBrainType = z.infer<typeof FormBrainZodSchema>;