'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={props.theme}
      className="toaster group bg-color1 text-color12 border border-color3"
      {...props}
    />
  );
};

export { Toaster };
