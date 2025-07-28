'use client';
import React, { useEffect } from 'react';

import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

import { Menu, Moon, SunIcon } from 'lucide-react';

import { useStore } from '~/lib/zustand';
import { useVersion } from '~/hooks/useVersion';

import Sidebar from './sidebar';

export const Index = () => {
  const { theme, setTheme, type, setType } = useStore();
  const { version } = useVersion();

  const [isSidebarOpen, setSideBarOpen] = React.useState(false);

  return (
    <div className="bg-color1 w-full h-fit py-4 overflow-x-auto overflow-y-hidden">
      <div className="w-full h-fit flex gap-4 px-4 items-center">
        <div className="flex justify-center items-center h-8 w-8 shrink-0">
          <Image
            className="h-full w-full"
            width={200}
            height={200}
            src={'/assets/joey-primary.png'}
            alt="XRPL logo"
          />
        </div>
        <Tabs
          value={type}
          onValueChange={(value) => {
            console.log('[Tabs] Changing type to:', value);
            setType(value as 'advanced' | 'standalone');
          }}>
          <TabsList>
            <TabsTrigger value="advanced" className="hover:cursor-pointer">
              Advanced
            </TabsTrigger>
            <TabsTrigger value="standalone" className="hover:cursor-pointer">
              Standalone
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="w-full grow"></div>
        <div className="w-fit shrink-0 max-sm:hidden">{version}</div>
        {
          <div className="max-sm:hidden flex gap-3 w-fit h-ft shrink-0 hover:cursor-pointer">
            {theme === 'Dark' ? (
              <Moon className="h-5 w-5 text-color12" onClick={() => setTheme('Light')} />
            ) : (
              <SunIcon className="h-5 w-5 text-color12" onClick={() => setTheme('Dark')} />
            )}
          </div>
        }
        <Menu
          className="h-5 w-5 text-color12 shrink-0 hover:cursor-pointer"
          onClick={() => setSideBarOpen(!isSidebarOpen)}
        />
      </div>
      <Sidebar open={isSidebarOpen} setOpen={setSideBarOpen} />
    </div>
  );
};
