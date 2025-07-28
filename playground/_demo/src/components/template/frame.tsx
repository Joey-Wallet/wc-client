import React, { ReactNode } from 'react';

import Image from 'next/image';
import Logo from '@monorepo/assets/src/images/png/icon.png';
import Titleblock from '@monorepo/assets/src/images/png/titleblock.png';
import Theme from '../theme/element';

import { signinRoute } from '@/routes/paths/index.routes';

import Icons from '@monorepo/icons/next';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useStoreContext } from '@/context';
import { useSessionContext } from '@/context/session';

interface Props {
  children?: JSX.Element | JSX.Element[] | ReactNode;
  header?: JSX.Element | JSX.Element[] | ReactNode;
  back?: boolean;
  theme?: boolean;
  padded?: boolean;
}

const Form = (props: Props) => {
  const repo = useStoreContext().repo;
  const session = useSessionContext().session;
  const nav = useNavigate();
  const router = useRouter();

  return (
    <div
      className={`tw-relative tw-flex tw-h-3/4 tw-max-h-[800px] tw-w-3/4 tw-max-w-[500px] tw-select-none tw-flex-col tw-items-center tw-overflow-hidden tw-rounded-xl tw-border tw-border-br1 tw-bg-b1 tw-shadow-[0_0_24px_0] tw-shadow-s1 max-sm:tw-w-5/6 max-xs:tw-h-full max-xs:tw-max-h-none max-xs:tw-w-full max-xs:tw-rounded-none max-xs:tw-border-none ${props.padded && 'tw-pb-4 xs:tw-pb-6'}`}>
      <div
        className={`tw-relative tw-flex tw-h-fit tw-min-h-14 tw-w-full tw-items-center tw-justify-center tw-gap-6 tw-border-b tw-border-br1 tw-bg-b2 ${/* props.padded &&  */ 'tw-px-6 tw-py-4'} tw-flex-shrink-0`}>
        <div className={'tw-flex tw-h-full tw-justify-center tw-gap-3'}>
          {props.back && (
            <div
              className="tw-aspect-square tw-h-fit tw-rounded-md tw-border tw-border-br1 tw-bg-tint tw-p-1 hover:tw-cursor-pointer hover:tw-bg-b2"
              onClick={router.history.back}>
              <Icons.ArrowLeft className="tw-h-4 tw-stroke-t1 tw-stroke-2" />
            </div>
          )}
          <div className="tw-flex tw-h-full tw-max-w-[100px] tw-items-center tw-justify-center tw-overflow-hidden tw-truncate tw-rounded-md tw-text-sm">
            onramp
          </div>
        </div>

        <div className="tw-grow">{props.header}</div>

        <div className={'tw-flex tw-h-full tw-justify-center tw-gap-3'}>
          {session.address && (
            <div
              className="tw-aspect-square tw-h-fit tw-rounded-md tw-border tw-border-br1 tw-bg-tint tw-p-1 hover:tw-cursor-pointer hover:tw-bg-b2"
              onClick={async () => {
                repo.General.update({ address: undefined });
                return nav({ to: signinRoute.to, search: { redirect: window.location.pathname } });
              }}>
              <Icons.Download01 className="tw-h-4 tw-stroke-t1 tw-stroke-2 -tw-rotate-90" />
            </div>
          )}
          <div
            className="tw-aspect-square tw-h-fit tw-rounded-md tw-border tw-border-br1 tw-bg-b2 tw-p-1"
            /* onClick={router.history.back} */
          >
            <Icons.Globe02 className="tw-h-4 tw-stroke-t1 tw-stroke-2" />
          </div>
          <div
            className="tw-aspect-square tw-h-fit tw-rounded-md tw-border tw-border-br1 tw-bg-b2 tw-p-1"
            /* onClick={router.history.back} */
          >
            <Icons.DotsVertical className="tw-h-4 tw-stroke-t1 tw-stroke-2" />
          </div>
        </div>
      </div>

      <div className={'tw-h-hit tw-flex tw-w-full tw-flex-shrink-0 tw-justify-center'}>
        {session.address && (
          <div
            className="tw-flex tw-h-full tw-w-full tw-gap-2 tw-border-b-1 tw-border-br1 tw-bg-br1 tw-p-1"
            onClick={async () => {
              repo.General.update({ address: undefined });
              return nav({ to: signinRoute.to, search: { redirect: window.location.pathname } });
            }}>
            <div className="tw-w-full tw-text-center tw-text-xs tw-text-t3">
              Address: {session.address}
              {/*               {`${session.address.slice(0, 6)}...${session.address.slice(session.address.length - 5, session.address.length)}`} */}
            </div>
          </div>
        )}
      </div>
      {props.children}
      {props.theme && <Theme />}
    </div>
  );
};

export default Form;
