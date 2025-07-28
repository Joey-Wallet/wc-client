'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

import utils from '@joey-wallet/wc-client/utils';
import core from '@joey-wallet/wc-client/core';

import { Switch } from '~/components/ui/switch';
import { Button } from '~/components/ui/button';

import { Info } from 'lucide-react';

import { useStore } from '~/lib/zustand';
import { useFormNavigation } from '~/lib/zustand/form';
import { Tooltip, TooltipTrigger, TooltipContent } from '~/components/ui/tooltip';

import { FormItem, FormControl } from '~/components/ui/form';
import { FormRenderProps as Props } from '~/components/template/form-hook';
import useMobileDetect from '~/hooks/useMobileDetect';
import useUnifiedProvider from '~/hooks/useUnifiedProvider';
import { chains } from '../../../../../../packages/core/dist/esm/src/common/constants';

const form_name = 'onboarding';
export const header = <h2 className="text-lg font-semibold">Network Setup</h2>;

export const Index = (props: Props) => {
  const { setChain, chains, config } = useUnifiedProvider();
  const [onlyTestnet, setOnlyTestnet] = React.useState(false);
  const { activeNetwork, setActiveNetwork, type } = useStore();
  const { isMobile } = useMobileDetect();

  const { form, step, steps, handleBack, handleNext, isLastStep } = props;
  const {
    control,
    formState: { errors },
  } = form;

  // Example handler to change the network
  const handleClick = (network: core.typings.ChainDetails) => {
    setActiveNetwork(network.id);
    setChain(network.id);
    handleNext();
  };

  const chainDetails =
    config && utils.namespace.getChainsDetailFromNamspaces(config.namespaces ?? {});

  return (
    <form className="flex flex-col justify-start gap-3">
      <div className="flex items-center flex-col w-full py-4">
        <div className="w-fit text-3xl font-extrabold flex max-sm:flex-col items-center gap-2">
          <div
            className={`
                  rounded-full h-6 w-6 max-sm:h-9 max-sm:w-9
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
          WalletConnect Toolkit
        </div>
        <div className="w-fit text-lg font-regular text-color11 pb-4">
          For the XRP Ledger and Joey Wallet
        </div>
        {/* <div className="w-fit text-sm font-regular text-color11/60 capitalize pt-2 pb-4">{`[ ${type} ]`}</div> */}
      </div>

      <div className="flex w-full items-center gap-3">
        <div className="grow">Select Chain:</div>
        <div className="flex gap-2 items-center">
          <div>Only Testnet</div>
          <Switch checked={onlyTestnet} onCheckedChange={setOnlyTestnet} />
          {isMobile() && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 text-color11 hover:cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Only display networks that are for testing purposes.</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {chainDetails
        ?.filter((details) => {
          if (onlyTestnet) return details.isDev === onlyTestnet;
          return true;
        })
        .map((details) => (
          <Button
            type="button"
            variant={'outline'}
            key={details.id}
            onClick={() => handleClick(details)}
            className="py-5">
            <div
              className={`
                  rounded-full h-6 w-6 
                  flex justify-center items-center overflow-hidden 
                `}>
              <Image
                className="h-full w-full"
                width={36}
                height={36}
                src={
                  details.isDev
                    ? '/assets/chains/xrpl/info/xrp-icon-dark.png'
                    : '/assets/chains/xrpl/info/xrp-icon-light.png'
                }
                alt="XRPL logo"
              />
            </div>

            <div>{details.name}</div>
          </Button>
        ))}
    </form>
  );
};
