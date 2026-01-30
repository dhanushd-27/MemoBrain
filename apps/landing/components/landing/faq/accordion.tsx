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
    <div
      className={cn(
        "group border border-border/50 rounded-2xl bg-surface/40 overflow-hidden transition-all duration-300",
        isOpen
          ? "border-border-strong bg-surface shadow-sm"
          : "hover:border-border-strong hover:bg-surface-hover/60",
      )}
    >
      <button
        className="flex w-full items-center justify-between px-8 py-5 text-left transition-colors"
        onClick={onClick}
      >
        <span className="text-lg font-medium text-foreground font-serif group-hover:text-primary transition-colors">
          {question}
        </span>
        <span
          className={cn(
            "ml-6 flex h-6 w-6 items-center justify-center text-muted-foreground transition-transform duration-300 ease-out",
            isOpen && "rotate-180 text-foreground",
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
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
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-8 pb-6 pt-0 text-base leading-relaxed text-muted-foreground max-w-2xl">
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
