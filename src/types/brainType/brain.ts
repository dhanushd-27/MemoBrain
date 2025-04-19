import { z } from "zod";

export type createBrainSchema = {
  type: string,
  url: string,
  title: string,
  tags: string[],
}

export type responseBrainType = {
  adminId: string;
  id: number;
  type: string;
  url: string;
  title: string;
  tags: string[];
}

export const createBrainZodSchema = z.object({
  title: z.string({ message: "Title is a required field" }).min(1, { message: "Length of Title should be more than 1" }),
  type: z.string({ message: "Type is a required field" }).min(1, { message: "Length of Title should be more than 1" }),
  url: z.string({ message: "Link is a required field" }).min(1, { message: "Length of Title should be more than 1" }),
  tags: z.string({message: "Tags is a required field"})
});

export type createBrainType = z.infer<typeof createBrainZodSchema>;