'use client';
import React, { useEffect } from 'react';

import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

import { Menu, Moon, SunIcon } from 'lucide-react';

import { useStore } from '~/lib/zustand';
import { useVersion } from '~/hooks/useVersion';

import Configuration from '~/components/form/configuration';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/sidebar';
import { Separator } from '~/components/ui/separator';

export const Index = (props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { open, setOpen } = props;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[500px] w-full overflow-hidden p-6 px-0 flex flex-col">
        <DialogHeader className="w-full h-fit px-6">
          <DialogTitle className="text-lg font-semibold">
            <div className="flex gap-2 items-center">Configuration</div>
          </DialogTitle>
          <DialogDescription className="text-sm text-color11">
            Adjust the configuration your walletconnect settings.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-3" orientation="horizontal" />
        <div className="h-full w-full grow overflow-y-auto px-6">
          <Configuration />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Index;
