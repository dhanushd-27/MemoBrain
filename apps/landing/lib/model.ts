import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { Memo, Slice } from "@repo/types";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});

/**
 * Formats memo data for LLM consumption, extracting only relevant information
 * and limiting content length to manage token usage
 */
function formatMemoForDescription(memo: Memo): string {
  const parts: string[] = [];
  
  // Add type and title if available
  if (memo.title) {
    parts.push(`[${memo.type}] ${memo.title}`);
  } else {
    parts.push(`[${memo.type}]`);
  }
  
  // Add pinned indicator
  if (memo.pinned) {
    parts.push("⭐ PINNED");
  }
  
  // Extract relevant content based on type
  switch (memo.type) {
    case "TEXT": {
      const text = memo.content.text;
      // Limit text length to ~500 chars to manage tokens
      parts.push(text.length > 500 ? `${text.substring(0, 500)}...` : text);
      break;
    }
      
    case "TODO": {
      const todos = memo.content.items;
      const completedCount = todos.filter(t => t.completed).length;
      parts.push(`${completedCount}/${todos.length} completed`);
      // Include todo items (limit to first 5)
      const todoTexts = todos.slice(0, 5).map(t => `- ${t.text}${t.completed ? ' ✓' : ''}`).join('\n');
      parts.push(todoTexts);
      if (todos.length > 5) parts.push(`... and ${todos.length - 5} more items`);
      break;
    }
      
    case "LINK": {
      parts.push(`URL: ${memo.content.url}`);
      if (memo.content.note) {
        const note = memo.content.note.length > 200 
          ? `${memo.content.note.substring(0, 200)}...` 
          : memo.content.note;
        parts.push(`Note: ${note}`);
      }
      if (memo.content.source) {
        parts.push(`Source: ${memo.content.source}`);
      }
      break;
    }
      
    case "QA": {
      parts.push(`Q: ${memo.content.question}`);
      const answer = memo.content.answer.length > 300 
        ? `${memo.content.answer.substring(0, 300)}...` 
        : memo.content.answer;
      parts.push(`A: ${answer}`);
      break;
    }
      
    case "CODE": {
      parts.push(`Language: ${memo.content.language}`);
      if (memo.content.note) {
        parts.push(`Note: ${memo.content.note}`);
      }
      // Include first few lines of code (limit to ~300 chars)
      const codePreview = memo.content.code.split('\n').slice(0, 10).join('\n');
      const codeText = codePreview.length > 300 
        ? `${codePreview.substring(0, 300)}...` 
        : codePreview;
      parts.push(`Code:\n${codeText}`);
      break;
    }
  }
  
  return parts.join('\n');
}

/**
 * Generates a concise, informative description for a slice based on its memos/brains
 * 
 * @param slice - The slice object (includes name and current description)
 * @param memos - Array of memos/brains in the slice
 * @returns Generated description string
 */
export const generateSliceDescription = async (
  slice: Slice,
  memos: Memo[]
): Promise<string> => {
  // Handle empty slice
  if (memos.length === 0) {
    return `A collection called "${slice.name}". Currently empty.`;
  }

  // Limit memos to prevent token overflow (process up to 20 most recent/pinned)
  // Prioritize pinned memos, then recent ones
  const sortedMemos = [...memos]
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 20);

  // Format memos into readable text
  const memosText = sortedMemos
    .map((memo, idx) => `Memo ${idx + 1}:\n${formatMemoForDescription(memo)}`)
    .join('\n\n---\n\n');

  // Count memo types for context
  const typeCounts = memos.reduce((acc, memo) => {
    acc[memo.type] = (acc[memo.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeSummary = Object.entries(typeCounts)
    .map(([type, count]) => `${count} ${type}`)
    .join(', ');

  const systemPrompt = `You are an expert at creating concise, informative descriptions for knowledge collections. 
Your task is to analyze the content of a collection (called a "slice") and generate a brief, engaging description (2-3 sentences max) that captures:
- The main themes and topics covered
- The types of content included
- The overall purpose or focus

Be specific and informative, but keep it concise. Avoid generic phrases like "various topics" - instead mention actual themes you observe.`;

  const userPrompt = `Slice Name: "${slice.name}"
Current Description: ${slice.description || "None"}

Total Memos: ${memos.length}
Content Types: ${typeSummary}
${sortedMemos.length < memos.length ? `\n(Showing ${sortedMemos.length} most relevant memos)` : ''}

Memo Content:
${memosText}

Generate a concise description (2-3 sentences) for this slice based on the content above.`;

  try {
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);
    
    const content = typeof response.content === 'string' 
      ? response.content 
      : String(response.content);
    
    // Clean up the response (remove quotes if wrapped, trim whitespace)
    return content.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error("Failed to generate slice description:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
};