'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  content: string;
  isEditMode: boolean;
  onSave: (newValue: string) => void;
  className?: string;
  multiline?: boolean;
}

export function EditableText({
  content,
  isEditMode,
  onSave,
  className,
  multiline = false
}: EditableTextProps) {
  const [value, setValue] = useState(content);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setValue(content);
  }, [content]);

  const handleBlur = () => {
    if (textRef.current) {
      const newValue = textRef.current.innerText;
      if (newValue !== content) {
        onSave(newValue);
      }
    }
  };

  if (!isEditMode) {
    return <span className={className}>{content}</span>;
  }

  return (
    <span className="group relative inline-flex items-center gap-2">
      <span
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        className={cn(
          "inline-block rounded-md border border-dashed border-primary/40 px-2 py-1 outline-none transition-all focus:border-solid focus:bg-primary/5 focus:ring-2 focus:ring-primary/20",
          className
        )}
      >
        {value}
      </span>
      <Pencil className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-40" />
    </span>
  );
}
