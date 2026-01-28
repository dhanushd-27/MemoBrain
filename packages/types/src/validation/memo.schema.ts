import { z } from "zod";

// Content Schemas
const textContentSchema = z.object({
  text: z.string().min(1, "Text content is required"),
});

const todoItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
});

const todoContentSchema = z.object({
  items: z.array(todoItemSchema).min(1, "At least one todo item is required"),
});

const linkContentSchema = z.object({
  url: z.string().url("Invalid URL"),
  note: z.string(),
  source: z.string(),
});

const qaContentSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

const codeContentSchema = z.object({
  language: z.string().min(1, "Language is required"),
  code: z.string().min(1, "Code is required"),
  note: z.string(),
});

// Memo Type Enum
const memoTypeEnum = z.enum(["TEXT", "TODO", "LINK", "QA", "CODE"]);

// Create Memo
export const createMemoSchema = z.object({
  type: memoTypeEnum,
  title: z.string().max(255).optional(),
  content: z.union([
    textContentSchema,
    todoContentSchema,
    linkContentSchema,
    qaContentSchema,
    codeContentSchema,
  ]),
  sliceId: z.string().uuid("Invalid slice ID"),
  pinned: z.boolean().optional(),
});

export type CreateMemoInput = z.infer<typeof createMemoSchema>;

// Update Memo
export const updateMemoSchema = z
  .object({
    type: memoTypeEnum.optional(),
    title: z.string().max(255).optional(),
    content: z
      .union([
        textContentSchema,
        todoContentSchema,
        linkContentSchema,
        qaContentSchema,
        codeContentSchema,
      ])
      .optional(),
    pinned: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.type !== undefined ||
      data.title !== undefined ||
      data.content !== undefined ||
      data.pinned !== undefined,
    { message: "At least one field must be provided" },
  );

export type UpdateMemoInput = z.infer<typeof updateMemoSchema>;

// Memo ID Param
export const memoIdParamSchema = z.object({
  id: z.string().uuid("Invalid memo ID"),
});

export type MemoIdParam = z.infer<typeof memoIdParamSchema>;
