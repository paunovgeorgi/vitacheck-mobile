import { CommonSupplement } from "@/types";


export function filterSuggestions(input: string, suggestionsSource: CommonSupplement[]) {
  if (!input.trim()) return [];
  return suggestionsSource
    .filter(cs => cs.name.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 5);
}