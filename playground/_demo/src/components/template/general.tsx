import React, { ReactNode } from 'react';

import Theme from '../theme';
import useClient from '@/components/hook/useClient';
import useRerender from '@/components/hook/useRerender';

import Image from 'next/image';
import Image1 from '@monorepo/assets/src/images/png/background-5.png';

import { useZustandState } from '@/lib/zustand';

import Icons from '@monorepo/icons/next';
import * as typings from '@monorepo/typings';
import config from '@/common/config';

const Themes = typings.schema.latest.Types.Themes.Themes;

interface Props {
  children: JSX.Element | JSX.Element[] | ReactNode;
}

const General = ({ children }: Props) => {
  const isClient = useClient();

  const zustand = useZustandState;
  const currentTheme = zustand.getState().theme;
  const rerender = useRerender();

  const handleThemeChange = () => {
    let theme =
      currentTheme === Themes.availableThemes.theme1
        ? Themes.availableThemes.theme2
        : Themes.availableThemes.theme1;
    zustand.setState({ theme });
    rerender.call();
  };

  return (
    isClient && (
      <Theme>
        <div className="tw-flex tw-h-full tw-w-full tw-flex-col">
          {config.sandbox && (
            <div className="tw-flex tw-h-fit tw-min-h-10 tw-w-full tw-items-center tw-justify-center tw-gap-1 tw-bg-t1 tw-px-2 tw-py-2 tw-text-center tw-font-montserrat tw-text-xs tw-font-semibold tw-text-t2 max-xs:tw-flex-col">
              <Icons.AlertCircle className="tw-h-4 tw-flex-shrink-0 tw-stroke-t2 tw-stroke-2" />
              <div className="tw-text-nowrap">{`Sandbox version`}</div>
              <div className="tw-h-3 tw-border-r-1 tw-border-t2 max-xs:tw-h-0 max-xs:tw-w-full max-xs:tw-border-b-1 max-xs:tw-border-r-0"></div>
              <div className="tw-font-normal">
                {`For experimental use only. Proceed with caution.`}
              </div>
            </div>
          )}
          <div className="tw-flex tw-w-full tw-grow tw-flex-col tw-items-center tw-bg-gradient3 tw-p-4 tw-font-montserrat tw-text-t1 max-lg:tw-p-0">
            <div className="tw-flex tw-h-full tw-w-full tw-flex-col">
              <div className="tw-relative tw-flex tw-shrink-0 tw-grow tw-flex-col tw-items-center tw-justify-center">
                {children}
                <div
                  onClick={handleThemeChange}
                  className="tw-absolute tw-bottom-6 tw-flex-shrink-0 hover:tw-cursor-pointer max-xs:tw-hidden">
                  {currentTheme === Themes.availableThemes.theme1 ? (
                    <Icons.Sun className="tw-h-4 tw-w-4 tw-stroke-t1 tw-stroke-2" />
                  ) : (
                    <Icons.MoonStar className="tw-h-4 tw-w-4 tw-stroke-t1 tw-stroke-2" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Theme>
    )
  );
};

export default General;
