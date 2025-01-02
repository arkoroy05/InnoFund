import { useState, useCallback } from 'react';

export function useReadMore(text: string, maxLength: number) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const displayText = isExpanded ? text : text.slice(0, maxLength);
  const shouldShowReadMore = text.length > maxLength;

  return { displayText, isExpanded, toggleReadMore, shouldShowReadMore };
}

