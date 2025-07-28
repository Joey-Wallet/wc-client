'use client';

import React, { ReactNode } from 'react';

import { useRouter } from 'next/compat/router';

import { ArrowLeft, ArrowRight } from 'lucide-react'; // Lucide icons

import { useStore } from '~/lib/zustand';
import { useFormNavigation } from '~/lib/zustand/form';
import { cn } from '~/lib/utils';

import { Button } from '~/components/ui/button';

interface Props {
  formName: string;
  className?: string;
  children?: ReactNode;
  header?: ReactNode;
  back?: boolean;
  blank?: boolean;
  showButtons?: boolean;
  showSteps?: boolean;
  min?: boolean;
  steps?: number; // Total number of steps in the form
}

const Form = ({
  className,
  children,
  header,
  back = false,
  blank = false,
  min = false,
  showButtons = true,
  showSteps = true,
  steps = 1,
  formName,
}: Props) => {
  const router = useRouter();

  const { theme: currentTheme, toggleTheme, activeNetwork, setActiveNetwork } = useStore();

  // State for managing form steps
  const { step, setStep } = useFormNavigation(formName);

  // Navigation handlers
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (back) {
      router?.back();
    }
  };

  const handleNext = () => {
    if (step < steps) {
      setStep(step + 1);
    } else {
      // Handle form submission or final step navigation
      console.log('Form completed:', { activeNetwork, theme: currentTheme });
      // Optionally navigate to a completion page
      // navigate('/complete');
    }
  };

  return (
    <div
      className={cn(
        `
        flex max-h-[600px] max-w-[500px] select-none flex-col items-center overflow-hidden
        border-2 border-color4
        bg-color1
        rounded-lg
        ${min ? 'h-3/4 w-3/4' : 'h-fit w-fit'} 
            max-sm:h-full max-sm:max-h-none max-sm:max-w-none max-sm:w-full max-sm:rounded-none max-sm:border-none`,
        className
      )}>
      {!blank && (
        <div className="relative flex h-fit min-h-14 w-full items-center justify-center gap-6 border-b border-color4 bg-color1 p-4">
          {(back || step > 1) && (
            <button
              className="absolute left-4 aspect-square h-fit rounded-full p-1 hover:bg-color3 hover:cursor-pointer"
              onClick={handleBack}
              aria-label="Go back">
              <ArrowLeft className="h-5 text-color11" />
            </button>
          )}
          {header}
          {steps > 1 && step < steps && (
            <button
              className="absolute right-4 aspect-square h-fit rounded-full hover:bg-color3 hover:cursor-pointer"
              onClick={handleNext}
              aria-label="Go next">
              <ArrowRight className="h-5 text-color11" />
            </button>
          )}
        </div>
      )}
      <div className={`flex flex-col grow w-full ${blank ? 'p-6' : 'px-6 pb-6 pt-3'}`}>
        {children}
      </div>
      {!blank && (showSteps || showButtons) && (
        <div className="flex flex-col w-full p-6">
          {steps > 1 && (
            <div className="mt-4 flex justify-between items-center max-sm:flex-col max-sm:gap-3 ">
              {showSteps && (
                <span className="text-sm text-color11 max-sm:hidden">
                  Step {step} of {steps}
                </span>
              )}
              <div className="flex gap-2 max-sm:w-full">
                {step > 1 && showButtons && (
                  <Button
                    variant={'outline'}
                    theme={'Default'}
                    className="px-4 py-2 rounded"
                    onClick={handleBack}>
                    Back
                  </Button>
                )}
                {showButtons && (
                  <Button theme={'Accent'} className="px-4 py-2 rounded" onClick={handleNext}>
                    {step === steps ? 'Submit' : 'Next'}
                  </Button>
                )}
              </div>
              {showSteps && (
                <span className="text-sm text-color11 min-sm:hidden">
                  Step {step} of {steps}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Form;
