'use client';
import React, { useState, useEffect } from 'react';
import type { SessionTypes } from '@walletconnect/types';
import { config } from '~/common/config';
import { Theme } from '~/components/theme';
import { Index as Selector } from '~/components/nav/session';
import { Index as Navbar } from '~/components/nav';
import * as advanced from '~/context/advanced';
import * as standalone from '~/context/standalone';
import { Index as OnboardForm } from '~/components/form/onboard';
import { Index as SessionForm } from '~/components/form/session';
import { Toaster } from '~/components/ui/sonner';
import { useStore } from '~/lib/zustand';
import useUnifiedProvider from '~/hooks/useUnifiedProvider';

import Splash from '~/components/splash';

const Layout = () => {
  const { session } = useUnifiedProvider();
  const { theme } = useStore();

  return (
    <div className={`h-full w-full bg-color2 text-color12 flex flex-col`}>
      <Navbar />
      <Selector
        sessions={session ? [session] : []}
        setActiveSession={(session: SessionTypes.Struct | undefined) => {}}
        activeSession={session}
      />
      <Component />
      <Toaster theme={theme === 'Light' ? 'dark' : 'light'} />
    </div>
  );
};

const Component = () => {
  const { session } = useUnifiedProvider();

  return (
    <div
      className={`
        w-full grow flex flex-col 
        justify-center items-center 
        bg-color2 overflow-scroll-auto p-0 m-0
      `}>
      <div
        className={`
          h-full w-full flex flex-col 
          justify-center items-center 
          text-color12 p-0
        `}>
        {!session ? <OnboardForm /> : <SessionForm />}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <>
      <Splash />
      <Theme>
        <advanced.Provider>
          <standalone.Provider>
            <Layout />
          </standalone.Provider>
        </advanced.Provider>
      </Theme>
    </>
  );
}
