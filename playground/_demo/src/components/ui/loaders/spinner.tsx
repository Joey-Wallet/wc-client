'use client';
import React from 'react';

import { Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';

export const Index = (props: { className?: string }) => (
  <Loader2
    data-variant="Accent"
    className={cn('h-full w-full text-color9/50 animate-spin origin-center', props?.className)}
  />
);
