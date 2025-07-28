'use client';

import React, { useEffect } from 'react';

import FormTemplate from '~/components/template/form-hook';

import { Index as Session } from './session';

import { useFormNavigation } from '~/lib/zustand/form';
import { useStore } from '~/lib/zustand';

const form_name = 'session';

export const Index = () => {
  const { step, setStep, next } = useFormNavigation(form_name);
  const { activeNetwork, setActiveNetwork } = useStore();

  const form_props = {
    formName: 'onboarding',
    type: 'plain',
    steps: 3,
    className: 'w-full h-full',
    blank: step === 1,
    showButtons: false,
    showSteps: false,
    header: undefined,
    show: {
      header: step !== 1,
      backArrow: true,
      nextArrow: false,
      steps: false,
    },
  };

  //   switch (step) {
  //     case 1:
  //       form_props.header = NetworkHeader;
  //       break;
  //     case 2:
  //       form_props.header = ConnectHeader;
  //       break;
  //     case 3:
  //       form_props.header = UriHeader;
  //       break;
  //   }
  return (
    <FormTemplate {...form_props}>
      {(props) => (
        <>
          {step === 1 && <Session {...props} />}
          {/*           {step === 2 && <Connect {...props} />}
          {step === 3 && <Uri {...props} />} */}
        </>
      )}
    </FormTemplate>
  );
};

export default Index;
