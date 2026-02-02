"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, cn } from "@repo/ui";
import { createMemo, updateMemo } from "../../../services/memo.service";
import { TbLoader, TbX, TbPlus, TbTrash } from "react-icons/tb";
import { motion, AnimatePresence } from "motion/react";
import type { MemoType, Memo } from "@repo/types";
import type { CreateMemoRequest } from "../../../services/memo.service";

// --- Sub-components (Inlined) ---

const MEMO_TYPES: { value: MemoType; label: string }[] = [
  { value: "TEXT", label: "Text Note" },
  { value: "TODO", label: "Todo List" },
  { value: "LINK", label: "Bookmark / Link" },
  { value: "QA", label: "Q&A" },
  { value: "CODE", label: "Code Snippet" },
];

const BrainTypeSelector = ({
  currentType,
  onSelect,
  disabled,
}: {
  currentType: MemoType;
  onSelect: (type: MemoType) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {MEMO_TYPES.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onSelect(t.value)}
          disabled={disabled}
          className={cn(
            "flex flex-col items-center justify-center py-3 px-1 rounded-lg border text-xs font-medium transition-all",
            currentType === t.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-input hover:bg-muted text-muted-foreground",
            disabled &&
              currentType !== t.value &&
              "opacity-50 cursor-not-allowed text-muted-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface BrainFormContentProps {
  type: "TEXT" | "LINK" | "QA" | "CODE" | "TODO";
  // Text
  textContent: string;
  setTextContent: (value: string) => void;
  // Link
  linkUrl: string;
  setLinkUrl: (value: string) => void;
  linkNote: string;
  setLinkNote: (value: string) => void;
  // QA
  qaQuestion: string;
  setQaQuestion: (value: string) => void;
  qaAnswer: string;
  setQaAnswer: (value: string) => void;
  // Code
  codeLanguage: string;
  setCodeLanguage: (value: string) => void;
  codeSnippet: string;
  setCodeSnippet: (value: string) => void;
  codeNote: string;
  setCodeNote: (value: string) => void;
  // Todo
  todoItems: TodoItem[];
  setTodoItems: (items: TodoItem[]) => void;
}

const BrainFormContent = ({
  type,
  textContent,
  setTextContent,
  linkUrl,
  setLinkUrl,
  linkNote,
  setLinkNote,
  qaQuestion,
  setQaQuestion,
  qaAnswer,
  setQaAnswer,
  codeLanguage,
  setCodeLanguage,
  codeSnippet,
  setCodeSnippet,
  codeNote,
  setCodeNote,
  todoItems,
  setTodoItems,
}: BrainFormContentProps) => {
  // Todo helpers
  const addTodoItem = () => {
    setTodoItems([
      ...todoItems,
      { id: crypto.randomUUID(), text: "", completed: false },
    ]);
  };

  const removeTodoItem = (id: string) => {
    setTodoItems(todoItems.filter((item) => item.id !== id));
  };

  const updateTodoItem = (id: string, text: string) => {
    setTodoItems(
      todoItems.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Content
      </h3>

      {type === "TEXT" && (
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Write something..."
          className="flex min-h-50 w-full rounded-2xl border-[1.5px] border-input bg-background px-4 py-2 text-body-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      )}

      {type === "LINK" && (
        <>
          <Input
            label="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            required
            type="url"
            className="bg-background"
          />
          <textarea
            value={linkNote}
            onChange={(e) => setLinkNote(e.target.value)}
            placeholder="Add a note about this link..."
            className="flex min-h-25 w-full rounded-2xl border-[1.5px] border-input bg-background px-4 py-2 text-body-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </>
      )}

      {type === "QA" && (
        <>
          <Input
            label="Question"
            value={qaQuestion}
            onChange={(e) => setQaQuestion(e.target.value)}
            placeholder="What is the question?"
            required
            className="bg-background"
          />
          <textarea
            value={qaAnswer}
            onChange={(e) => setQaAnswer(e.target.value)}
            placeholder="And the answer..."
            className="flex min-h-37.5 w-full rounded-2xl border-[1.5px] border-input bg-background px-4 py-2 text-body-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </>
      )}

      {type === "CODE" && (
        <>
          <Input
            label="Language"
            value={codeLanguage}
            onChange={(e) => setCodeLanguage(e.target.value)}
            placeholder="typescript, python, etc."
            required
            className="bg-background"
          />
          <textarea
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="Paste your code here..."
            className="flex min-h-50 w-full rounded-2xl border-[1.5px] border-input bg-background px-4 py-2 text-sm font-mono shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
          <Input
            label="Note (Optional)"
            value={codeNote}
            onChange={(e) => setCodeNote(e.target.value)}
            placeholder="Context about this snippet..."
            className="bg-background"
          />
        </>
      )}

      {type === "TODO" && (
        <div className="space-y-2">
          {todoItems.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-center">
              <span className="text-muted-foreground text-sm w-4">
                {index + 1}.
              </span>
              <Input
                label=""
                value={item.text}
                onChange={(e) => updateTodoItem(item.id, e.target.value)}
                placeholder="Todo item..."
                className="flex-1 bg-background"
                containerClassName="gap-0"
              />
              <button
                type="button"
                onClick={() => removeTodoItem(item.id)}
                className="p-2 text-muted-foreground hover:text-destructive"
              >
                <TbTrash />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="outlined"
            onClick={addTodoItem}
            className="mt-2 h-8 px-3 text-xs"
          >
            <TbPlus className="mr-2" /> Add Item
          </Button>
        </div>
      )}
    </div>
  );
};

interface CreateBrainDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sliceId: string;
  initialData?: Memo | null;
}

export function CreateBrainDialog({
  isOpen,
  onClose,
  onSuccess,
  sliceId,
  initialData,
}: CreateBrainDialogProps) {
  const [type, setType] = useState<MemoType>("TEXT");
  const [title, setTitle] = useState("");
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Content states
  const [textContent, setTextContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkNote, setLinkNote] = useState("");
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("typescript");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeNote, setCodeNote] = useState("");
  const [todoItems, setTodoItems] = useState<
    { id: string; text: string; completed: boolean }[]
  >([{ id: crypto.randomUUID(), text: "", completed: false }]);

  useEffect(() => {
    if (initialData && isOpen) {
      setType(initialData.type);
      setTitle(initialData.title || "");
      setPinned(initialData.pinned || false);

      // Reset all content states first
      setTextContent("");
      setLinkUrl("");
      setLinkNote("");
      setQaQuestion("");
      setQaAnswer("");
      setCodeLanguage("typescript");
      setCodeSnippet("");
      setCodeNote("");
      setTodoItems([{ id: crypto.randomUUID(), text: "", completed: false }]);

      const content = initialData.content as any;
      switch (initialData.type) {
        case "TEXT":
          setTextContent(content.text || "");
          break;
        case "LINK":
          setLinkUrl(content.url || "");
          setLinkNote(content.note || "");
          break;
        case "QA":
          setQaQuestion(content.question || "");
          setQaAnswer(content.answer || "");
          break;
        case "CODE":
          setCodeLanguage(content.language || "typescript");
          setCodeSnippet(content.code || "");
          setCodeNote(content.note || "");
          break;
        case "TODO":
          setTodoItems(
            content.items || [
              { id: crypto.randomUUID(), text: "", completed: false },
            ],
          );
          break;
      }
    } else if (!isOpen) {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    if (!initialData) {
      setType("TEXT");
      setTitle("");
      setPinned(false);
      setTextContent("");
      setLinkUrl("");
      setLinkNote("");
      setQaQuestion("");
      setQaAnswer("");
      setCodeLanguage("typescript");
      setCodeSnippet("");
      setCodeNote("");
      setTodoItems([{ id: crypto.randomUUID(), text: "", completed: false }]);
    }
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let content: any = {};

      switch (type) {
        case "TEXT":
          content = { text: textContent };
          break;
        case "LINK":
          content = { url: linkUrl, note: linkNote, source: "manual" };
          break;
        case "QA":
          content = { question: qaQuestion, answer: qaAnswer };
          break;
        case "CODE":
          content = {
            language: codeLanguage,
            code: codeSnippet,
            note: codeNote,
          };
          break;
        case "TODO":
          content = {
            items: todoItems.filter((item) => item.text.trim().length > 0),
            // Preserve other properties like completed status if needed, but for creation/update usually we just send items
          };
          if (content.items.length === 0) {
            throw new Error("Add at least one todo item");
          }
          break;
      }

      const payload: CreateMemoRequest = {
        type,
        title: title || undefined,
        content,
        sliceId,
        pinned,
      };

      if (initialData) {
        await updateMemo(initialData.id, payload);
      } else {
        await createMemo(payload);
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error("Failed to save brain", err);
      setError(
        err.message ||
          `Failed to ${initialData ? "update" : "create"} brain. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={handleClose}
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-card w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl pointer-events-auto border overflow-hidden bg-background">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-h4-bold">
                  {initialData ? "Edit Brain" : "Create New Brain"}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-muted rounded-full"
                >
                  <TbX className="text-xl" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form
                  id="create-brain-form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  {/* Type Selection */}
                  <BrainTypeSelector
                    currentType={type}
                    onSelect={setType}
                    disabled={!!initialData}
                  />

                  {/* Common Fields */}
                  <div className="space-y-4">
                    <Input
                      label="Title (Optional)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your brain a name..."
                      className="bg-background"
                    />

                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer w-fit">
                      <input
                        type="checkbox"
                        checked={pinned}
                        onChange={(e) => setPinned(e.target.checked)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      Pin this brain
                    </label>
                  </div>

                  <div className="h-px bg-border w-full" />

                  {/* Dynamic Fields */}
                  <BrainFormContent
                    type={type}
                    textContent={textContent}
                    setTextContent={setTextContent}
                    linkUrl={linkUrl}
                    setLinkUrl={setLinkUrl}
                    linkNote={linkNote}
                    setLinkNote={setLinkNote}
                    qaQuestion={qaQuestion}
                    setQaQuestion={setQaQuestion}
                    qaAnswer={qaAnswer}
                    setQaAnswer={setQaAnswer}
                    codeLanguage={codeLanguage}
                    setCodeLanguage={setCodeLanguage}
                    codeSnippet={codeSnippet}
                    setCodeSnippet={setCodeSnippet}
                    codeNote={codeNote}
                    setCodeNote={setCodeNote}
                    todoItems={todoItems}
                    setTodoItems={setTodoItems}
                  />

                  {error && (
                    <div className="text-destructive text-sm font-medium">
                      {error}
                    </div>
                  )}
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="create-brain-form"
                  variant="contained"
                  disabled={loading}
                  className="min-w-32"
                >
                  {loading ? <TbLoader className="animate-spin mr-2" /> : null}
                  {initialData ? "Save Changes" : "Create Brain"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
