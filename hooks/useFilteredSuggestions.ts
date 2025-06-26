import { filterSuggestions } from '@/lib/utils';
import { CommonSupplement } from '@/types';
import { useEffect, useState } from 'react';

export function useFilteredSuggestions(input: string, sourceList: CommonSupplement[]) {
  const [suggestions, setSuggestions] = useState<CommonSupplement[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const filtered = filterSuggestions(input, sourceList);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [input, sourceList]);

  return { suggestions, showSuggestions, setShowSuggestions };
}
