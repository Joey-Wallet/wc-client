'use client';

import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import wc from '@joey-wallet/wc-client/react';
import core from '@joey-wallet/wc-client/core';

import { Button } from '~/components/ui/button';
import { Index as Logo } from '~/components/logo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Index as CopyContainer } from '~/components/containers/copy';
import { Index as Loader } from '~/components/ui/loaders/spinner';

import useMobileDetect from '~/hooks/useMobileDetect';
import useUnifiedProvider from '~/hooks/useUnifiedProvider';

const form_name = 'onboarding';
export const header = <h2 className="text-lg font-semibold">Joey Connection Details</h2>;

export interface Props {
  uri: string;
  openModal: boolean;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handleConnect = async (opts: {
  provider: wc.typings.Provider;
  actions: wc.typings.IActions;
  openModal: boolean;
  isMobile: boolean;
  triggerModal?: (boolean: boolean) => void;
}) => {
  const { provider, actions, openModal, isMobile = false, triggerModal = () => {} } = opts;

  const generate = await actions.generate({
    openModal,
    walletId: core.constants.wallets.joey.projectId,
  });

  // Get raw uri from generate function and manufacture deeplink for mobile
  const uri = generate.data?.uri;
  const deeplink = generate.data?.deeplink;

  if (isMobile) {
    const openDeeplink = (link: string) => (window.location.href = link);
    if (deeplink) openDeeplink(deeplink);
  } else {
    openModal && triggerModal(true);
  }

  return new Promise((resolve, reject) => {
    // Listen for connect event to capture session and URI
    const onConnect = () => {
      resolve(true);
      // Clean up listener
      provider.off('connect', onConnect);
    };

    // Handle provider errors
    const onError = () => {
      triggerModal(false); // Close modal on error
      reject(new Error(`Failed to connect`));
      provider.off('error', onError);
    };

    // Register event listeners
    provider.on('connect', onConnect);
    provider.on('error', onError);
  });
};

export const JoeyDialog = (props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uri: string;
}) => {
  const { open, setOpen, uri } = props;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[500px] w-full overflow-hidden p-6">
        <DialogHeader className="w-full">
          <DialogTitle className="text-lg font-semibold">
            <div className="flex gap-2 items-center">
              {/* <div className="flex justify-center items-center h-8 w-8 shrink-0">
                <Logo />
              </div> */}
              Scan to Connect with Joey
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm text-color11">
            Scan the QR code below with your Joey app to connect.
          </DialogDescription>
        </DialogHeader>
        {uri && (
          <div className="flex flex-col items-center justify-center p-4 gap-4 w-full">
            <div className="relative bg-white rounded-xl p-2 flex justify-center items-center">
              <QRCodeCanvas value={`${uri}`} size={300} />
              <div className="absolute flex justify-center items-center h-12 w-12 shrink-0 p-1 bg-white rounded-4">
                <Logo />
              </div>
            </div>
            <CopyContainer content={uri}>{uri}</CopyContainer>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const Index = (props: Props) => {
  const { openDialog: open, setOpenDialog: setOpen } = props;

  const { isMobile, isClient } = useMobileDetect();
  const { uri } = useUnifiedProvider();

  const deeplink = uri ? `joey://settings/wc?uri=${encodeURIComponent(uri)}` : undefined;

  const openDeeplink = (link: string) => (window.location.href = link);

  const isLoading = !uri || !deeplink || open;

  return (
    <>
      <div className="flex flex-col justify-start gap-5 grow">
        {isLoading && (
          <div className="flex grow h-full w-full items-center justify-center shrink-0">
            <div className="h-1/2 w-1/2 max-w-[100px] max-h-[100px] justify-center">
              <Loader />
            </div>
          </div>
        )}
        {!isLoading && (
          <div className="flex flex-col">
            <div>
              <div className="grow p-1 flex gap-2 items-center">WalletConnect URI</div>
              <div className="border-b w-full border-color3"></div>
            </div>
            <CopyContainer content={uri} children={uri} />
          </div>
        )}
        {!isLoading && (
          <div className="flex flex-col">
            <div>
              <div className="grow p-1 flex gap-2 items-center">Deeplink</div>
              <div className="border-b w-full border-color3"></div>
            </div>
            <CopyContainer content={deeplink} children={deeplink} />
          </div>
        )}
        <div className="grow h-full"></div>
        {!isLoading && isMobile() && (
          <Button type="button" theme={'Accent'} onClick={() => openDeeplink(deeplink)}>
            Open on mobile
          </Button>
        )}
      </div>
      {uri && <JoeyDialog open={open} setOpen={setOpen} uri={uri ?? ''} />}
    </>
  );
};
