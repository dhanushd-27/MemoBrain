export type TextContent = {
  text: string;
};

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type TodoContent = {
  items: TodoItem[];
};

export type LinkContent = {
  url: string;
  note: string;
  source: string;
};

export type QAContent = {
  question: string;
  answer: string;
};

export type CodeContent = {
  language: string;
  code: string;
  note: string;
};

export type MemoContent =
  | TextContent
  | TodoContent
  | LinkContent
  | QAContent
  | CodeContent;
