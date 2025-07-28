import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:cursor-pointer
  border
  `,
  {
    variants: {
      variant: {
        default: 'bg-color8 text-color12 shadow-xs hover:bg-color8/90 border-transparent',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'border border-color5 bg-color1 shadow-xs hover:bg-color2 hover:text-color12',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-color8 hover:text-color12',
        link: 'text-color12 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 gap-2-5 px-3 py-2 has-[>svg]:px-3',
        sm: 'h-fit rounded-md gap-2 px-2 has-[>svg]:px-2.5',
        lg: 'h-fit rounded-md gap-3 px-4 has-[>svg]:px-4',
        icon: 'size-9',
      },
      theme: {
        Default: '',
        Accent: 'text-white',
        Green: '',
        Red: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      theme: 'Default',
    },
  }
);

function Button({
  className,
  variant,
  theme,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={theme}
      className={cn(buttonVariants({ variant, theme, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
