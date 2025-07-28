'use client';

import { useEffect, useState } from 'react';

const getMobileDetect = (userAgent: string) => {
  const isAndroid = () => Boolean(userAgent.match(/Android/i));
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = () => Boolean(userAgent.match(/SSR/i) || userAgent === 'SSR');
  const isXApp = () => Boolean(userAgent.match(/xumm/i));
  const isMobile = () => Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = () => !isMobile() && !isSSR();

  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
    isXApp,
  };
};

const useMobileDetect = () => {
  const [mobileDetect, setMobileDetect] = useState(() => getMobileDetect('SSR'));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
    setMobileDetect(getMobileDetect(userAgent));
    setIsClient(true);
  }, []);

  return { ...mobileDetect, isClient };
};

export default useMobileDetect;
