import { CommonSupplement } from "@/types";


export function filterSuggestions(input: string, suggestionsSource: CommonSupplement[]) {
  if (!input.trim()) return [];
  return suggestionsSource
    .filter(cs => cs.name.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 5);
}

export function getLocalDateKey(date = new Date()) {
  // Returns YYYY-MM-DD in local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}