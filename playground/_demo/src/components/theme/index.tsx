'use client';
import type { PropsWithChildren } from 'react';
import React from 'react';

import { useStore } from '~/lib/zustand';
import { cn } from '~/lib/utils';

export const Theme = ({ children }: PropsWithChildren) => {
  const { theme } = useStore();
  const [isMounted, setIsMounted] = React.useState(false);

  const className = `Globals w-full h-full flex flex-col`;

  // Sync theme with data-theme attribute and localStorage on mount
  React.useEffect(() => {
    setIsMounted(true);
    // Update the data-theme attribute on the html element
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn(className, `${theme === 'Dark' ? 'Dark' : 'Light'}`)} data-theme={theme}>
      {children}
    </div>
  );
};
