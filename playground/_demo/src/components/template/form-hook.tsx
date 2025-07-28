'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Updated from next/compat/router
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useFormNavigation } from '~/lib/zustand/form';
import { cn } from '~/lib/utils';

export interface FormRenderProps {
  form: UseFormReturn<any>;
  step: number;
  steps: number;
  handleBack: () => void;
  handleNext: () => void;
  isLastStep: boolean;
}

export interface Props {
  formName: string;
  formType?: 'default' | 'plain';
  className?: string;
  children: (props: FormRenderProps) => ReactNode;
  header?: ReactNode;
  max?: boolean;
  steps?: number;
  show?: {
    header?: boolean;
    backArrow?: boolean;
    nextArrow?: boolean;
    steps?: boolean;
  };
}

export const Form = ({
  className,
  children,
  header,
  max = true,
  steps = 1,
  formName,
  formType = 'default',
  show: showProp,
}: Props) => {
  const router = useRouter();
  const { step, setStep } = useFormNavigation(formName);

  // Initialize React Hook Form
  const form = useForm({ mode: 'onChange' });

  // Define default show values based on formType
  const defaultShow =
    formType === 'plain'
      ? { header: false, backArrow: false, nextArrow: false, steps: false }
      : { header: true, backArrow: true, nextArrow: true, steps: true };

  // Merge default show values with passed show prop
  const show = { ...defaultShow, ...showProp };

  // Navigation handlers
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router?.back();
    }
  };

  const handleNext = () => {
    if (step < steps) {
      form.trigger().then((isValid) => {
        if (isValid) {
          setStep(step + 1);
        }
      });
    } else {
      form.handleSubmit((data) => {
        console.log('Form submitted:', data);
        // Optionally navigate to a completion page
        // router?.push('/complete');
      })();
    }
  };

  const formRenderProps: FormRenderProps = {
    form,
    step,
    steps,
    handleBack,
    handleNext,
    isLastStep: step === steps,
  };

  return (
    <div
      className={cn(
        `flex max-h-[600px] max-w-[500px] select-none flex-col items-center overflow-hidden
        ${formType === 'plain' ? '' : 'border-2 border-color4 bg-color1 rounded-lg'}
        ${max ? 'h-3/4 w-3/4' : 'h-fit w-fit'} 
        max-sm:h-full max-sm:max-h-none max-sm:max-w-none max-sm:w-full max-sm:rounded-none`
      )}>
      {show.header && (
        <div className="relative flex h-fit min-h-14 w-full items-center justify-center gap-6 border-b border-color4 bg-color1 p-4">
          {show.backArrow && (
            <button
              className="absolute left-4 aspect-square h-fit rounded-full p-1 hover:bg-color3 hover:cursor-pointer"
              onClick={handleBack}
              aria-label="Go back">
              <ArrowLeft className="h-5 text-color11" />
            </button>
          )}
          {header}
          {show.nextArrow && steps > 1 && step < steps && (
            <button
              className="absolute right-4 aspect-square h-fit rounded-full p-1 hover:bg-color3 hover:cursor-pointer"
              onClick={handleNext}
              aria-label="Go next">
              <ArrowRight className="h-5 text-color11" />
            </button>
          )}
        </div>
      )}
      <div
        className={`flex flex-col grow w-full ${formType === 'plain' ? 'p-6' : 'px-6 pb-6 pt-3'}`}>
        {children(formRenderProps)}
      </div>
      {show.steps && steps > 1 && (
        <div className="flex w-full p-6">
          <div className="mt-4 flex justify-between items-center w-full max-sm:flex-col max-sm:gap-3">
            <span className="text-sm text-color11">
              Step {step} of {steps}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
