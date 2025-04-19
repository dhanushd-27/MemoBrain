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
  title: z.string({ message: "Title is a required field" }),
  type: z.string({ message: "Type is a required field" }),
  url: z.string({ message: "Link is a required field" }),
  tags: z.array(z.string(), {message: "Tags is a required field"})
});

export type createBrainType = z.infer<typeof createBrainZodSchema>;