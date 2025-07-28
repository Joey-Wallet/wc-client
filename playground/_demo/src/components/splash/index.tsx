'use client';
import React from 'react';

import { Index as Loader } from '~/components/ui/loaders/spinner';

export const Index = () => {
  const [loadingState, setLoadingState] = React.useState('loading');

  React.useEffect(() => {
    // Only run initialization when window is defined (client-side)
    if (typeof window !== 'undefined') {
      const initialize = async () => {
        try {
          console.log('Starting initialization');
          await new Promise((resolve) => setTimeout(resolve, 100));
          console.log('Initialization complete, setting exiting state');
          setLoadingState('exiting');
        } catch (error) {
          console.error('Initialization failed:', error);
          setLoadingState('exiting');
        }
      };

      initialize();
    }
  }, []);

  React.useEffect(() => {
    // Fallback timeout for when transitionend doesn't fire
    if (loadingState === 'exiting') {
      const timeout = setTimeout(() => {
        console.log('Fallback timeout triggered, setting done state');
        setLoadingState('done');
      }, 800); // Slightly longer than the 700ms transition duration
      return () => clearTimeout(timeout);
    }
  }, [loadingState]);

  const handleAnimationEnd = () => {
    console.log('handleAnimationEnd called');
    if (loadingState === 'exiting') {
      setLoadingState('done');
    }
  };

  const isExiting = loadingState === 'exiting';

  return (
    (loadingState === 'loading' || loadingState === 'exiting') && (
      <div
        data-variant="Accent"
        className={`absolute z-[1000]
        h-full w-full flex flex-col 
        justify-center items-center 
        bg-color8 text-color12
        transition-opacity ease-out duration-700
      ${isExiting ? 'opacity-0' : 'opacity-100'}
      `}
        onTransitionEnd={(event) => {
          if (event.propertyName === 'opacity' && isExiting) {
            console.log('Transition ended, calling onAnimationEnd');
            handleAnimationEnd();
          }
        }}>
        <div className="flex grow h-full w-full items-center justify-center shrink-0">
          <div className="h-1/2 w-1/2 max-w-[72px] max-h-[72px] justify-center">
            <Loader className={'text-white'} />
          </div>
        </div>
      </div>
    )
  );
};

export default Index;
