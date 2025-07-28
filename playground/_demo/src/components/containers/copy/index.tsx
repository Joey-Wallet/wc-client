'use client';

import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '~/lib/utils';

interface CopyableContainerProps {
  children: React.ReactNode;
  content: string;
  className?: string;
  buttonClassName?: string;
  ariaLabel?: string;
  title?: string;
}

export const Index = ({
  children,
  content,
  className,
  buttonClassName,
  ariaLabel = 'Copy content',
  title = 'Copy to clipboard',
}: CopyableContainerProps) => {
  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard.');
    } catch (error) {
      toast.error('Failed to copy content.');
      console.error('Copy error:', error);
    }
  };

  return (
    <div
      className={cn(
        'relative group bg-color2 rounded-lg p-2 px-4 text-sm overflow-auto w-full',
        className
      )}>
      <button
        className={cn(
          'absolute top-2 right-2 p-1 opacity-40 group-hover:opacity-100 hover:bg-color5 rounded hover:cursor-pointer border border-color11/50',
          buttonClassName
        )}
        onClick={handleCopy}
        aria-label={ariaLabel}
        title={title}>
        <Copy className="h-4 w-4 text-color11 group-hover:text-color12" />
      </button>
      <div className="p-2 text-sm break-all"> {children}</div>
    </div>
  );
};

export default Index;
