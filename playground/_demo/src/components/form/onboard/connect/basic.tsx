'use client';

import React from 'react';

import { Button } from '~/components/ui/button';

import useMobileDetect from '~/hooks/useMobileDetect';

import { Index as CopyContainer } from '~/components/containers/copy';

import wc from '@joey-wallet/wc-client/react';
import useUnifiedProvider from '~/hooks/useUnifiedProvider';

const form_name = 'onboarding';
export const header = <h2 className="text-lg font-semibold">Basic Connection Details</h2>;

export interface Props {
  openModal: boolean;
}

export const handleConnect = async (opts: { actions: wc.typings.IActions; openModal: boolean }) => {
  const { actions, openModal } = opts;
  const result = await actions.connect({
    openModal,
  });
  return result.data;
};

export const Index = (props: Props) => {
  const { isMobile, isClient } = useMobileDetect();
  const { uri } = useUnifiedProvider();

  const deeplink = uri ? `wc://${uri}` : undefined;
  const openDeeplink = (link: string) => (window.location.href = link);

  return (
    <div className="flex flex-col justify-start gap-5 grow">
      {uri && (
        <div className="flex flex-col">
          <div>
            <div className="grow p-1 flex gap-2 items-center">WalletConnect URI</div>
            <div className="border-b w-full border-color3"></div>
          </div>
          <CopyContainer content={uri} children={uri} />
        </div>
      )}
      {deeplink && (
        <div className="flex flex-col">
          <div>
            <div className="grow p-1 flex gap-2 items-center">Deeplink</div>
            <div className="border-b w-full border-color3"></div>
          </div>
          <CopyContainer content={deeplink} children={deeplink} />
        </div>
      )}
      <div className="grow h-full"></div>
      {isMobile() && deeplink && (
        <Button type="button" theme={'Accent'} onClick={() => openDeeplink(deeplink)}>
          Open on mobile
        </Button>
      )}
    </div>
  );
};
