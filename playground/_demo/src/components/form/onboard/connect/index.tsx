'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import utils from '@joey-wallet/wc-client/utils';
import core from '@joey-wallet/wc-client/core';

import { Switch } from '~/components/ui/switch';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '~/components/ui/tooltip';

import useMobileDetect from '~/hooks/useMobileDetect';

import { Copy, Globe, Info, Settings, Settings2, Terminal } from 'lucide-react';

import { useStore } from '~/lib/zustand';
import { useFormNavigation } from '~/lib/zustand/form';

import { FormItem, FormControl } from '~/components/ui/form';
import { FormRenderProps as Props } from '~/components/template/form-hook';
import { Index as CopyContainer } from '~/components/containers/copy';

import * as Basic from './basic';
import * as Joey from './joey';

import useUnifiedProvider from '~/hooks/useUnifiedProvider';

const form_name = 'onboarding';
export const header = <h2 className="text-lg font-semibold">Connect Setup</h2>;

export const NetworkDetailContainer = (details: core.typings.ChainDetails) => {
  const { config } = useUnifiedProvider();

  const { activeNetwork } = useStore();

  return (
    activeNetwork && (
      <CopyContainer
        content={JSON.stringify(
          utils.namespace.getNamespaces({ chain: activeNetwork, namespaces: config.namespaces })
        )}>
        <div className="grid grid-cols-[84px_1fr] gap-2">
          <div className="font-semibold">Namespace</div>
          <div>{details.id}</div>
          <div className="font-semibold">Name</div>
          <div>{details.name}</div>
          <div className="font-semibold">HTTP</div>
          <div>{details.http}</div>
          <div className="font-semibold">WS</div>
          <div>{details.ws}</div>
        </div>
      </CopyContainer>
    )
  );
};

export const Selector = (props: {
  setType: React.Dispatch<React.SetStateAction<undefined | 'wc' | 'joey'>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { setType, openModal, setOpenModal } = props;
  const { config } = useUnifiedProvider();
  const { isMobile } = useMobileDetect();

  const { activeNetwork, setActiveNetwork, theme } = useStore();

  const networkDetail =
    activeNetwork &&
    utils.namespace.getChainDetails({ chain: activeNetwork, namespaces: config.namespaces });

  const handleSelection = ({ type }: { type: 'wc' | 'joey' }) => setType(type);

  return (
    <div className="flex flex-col justify-start gap-5 grow">
      {networkDetail && (
        <div className="flex flex-col gap-2">
          <div>
            <div className="grow p-1 flex gap-2 items-center">
              <Globe className="h-5 text-color12 hover:cursor-pointer" />
              Active Network
            </div>
            <div className="border-b w-full border-color3"></div>
          </div>
          <NetworkDetailContainer {...networkDetail} />
        </div>
      )}

      <div className="flex flex-col">
        <div>
          <div className="grow p-1 flex gap-2 items-center">
            <Settings2 className="h-5 text-color12 hover:cursor-pointer" />
            Configuration
          </div>
          <div className="border-b w-full border-color3"></div>
        </div>
        <div className="py-2 flex flex-col gap-2">
          <div className="flex w-full items-center">
            <div className="flds-typography-typography-heading-h2-semibold grow">
              Show popup modal with QR Code
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex gap-2 items-center">
                <Switch disabled={isMobile()} checked={openModal} onCheckedChange={setOpenModal} />
              </div>

              {!isMobile() && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 text-color11 hover:cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[200px]">
                      In some circumstances, developers may want to copy and paste the raw
                      connection uri (wc://...) for debugging purposes.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grow h-full"></div>
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          theme={'Accent'}
          className={`px-5 py-5`}
          onClick={() => handleSelection({ type: 'joey' })}>
          <div
            className={`
                  h-6 w-6 
                  flex justify-center items-center overflow-hidden 
                `}>
            <Image
              className="h-full w-full"
              width={36}
              height={36}
              src={'/assets/joey-transparent.png'}
              alt="Joey logo"
            />
          </div>
          Connect with Joey
        </Button>
        <Button
          type="button"
          className={`py-5 px-5 bg-color3`}
          onClick={() => handleSelection({ type: 'wc' })}>
          <div
            className={`
                  rounded-full h-6 w-6 
                  flex justify-center items-center overflow-hidden 
                `}>
            <Image
              className="h-full w-full"
              width={36}
              height={36}
              src={'/assets/wc-logo.png'}
              alt="WalletConnect logo"
            />
          </div>
          Connect with WalletConnect
        </Button>
      </div>
    </div>
  );
};

export const Index = (props: Props) => {
  const { isMobile } = useMobileDetect();
  const { uri, actions, provider } = useUnifiedProvider();

  const [type, setType] = React.useState<undefined | 'wc' | 'joey'>(undefined);

  const [openModal, setOpenModal] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);

  const { theme } = useStore();
  const { clearForm } = useFormNavigation(form_name);

  const details = uri ? { uri, openModal, openDialog, setOpenDialog } : undefined;

  const connectOpts = {
    actions,
    openModal,
    isMobile: isMobile(),
    triggerModal: setOpenDialog,
    theme: theme.toLowerCase() as 'light' | 'dark',
  };

  const handleType = async (type: 'wc' | 'joey') => {
    switch (type) {
      case 'wc': {
        const session = await Basic.handleConnect(connectOpts);
        if (session) {
          // setActiveSession(session);
          clearForm(); // Reset form after successful connection
        }
        break;
      }
      case 'joey': {
        if (!provider) throw 'Provider not found';
        await Joey.handleConnect({ provider, ...connectOpts });
        // if (provider?.session) setActiveSession(provider.session);
        clearForm(); // Reset form after successful approval

        break;
      }
      default: {
        console.log('[handleType] Unknown type:', type);
        break;
      }
    }
  };

  useEffect(() => {
    if (!type) return;
    void handleType(type);
  }, [type]);

  return (
    <form className="flex flex-col justify-start gap-5 grow">
      {type == undefined && (
        <Selector setType={setType} openModal={openModal} setOpenModal={setOpenModal} />
      )}
      {type == 'wc' && details && <Basic.Index {...details} />}
      {type == 'joey' && details && <Joey.Index {...details} />}
    </form>
  );
};
