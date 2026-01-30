"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@repo/ui";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: AccordionItemProps) => {
  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-surface-hover"
        onClick={onClick}
      >
        <span className="text-subtitle-regular font-medium text-foreground">
          {question}
        </span>
        <span
          className={cn(
            "ml-6 flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180 bg-surface-elevated text-foreground",
          )}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-4 pt-0 text-body-regular text-muted-foreground">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  items: { question: string; answer: string }[];
}

export const Accordion = ({ items }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  );
};
