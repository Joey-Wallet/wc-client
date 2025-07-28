'use client';

import React, { useEffect } from 'react';

import ProjectIdForm from './projectId';
import MetadataForm from './metadata';

import { Separator } from '~/components/ui/separator';

const form_name = 'configuration';

export const Index = () => {
  return (
    <div className="h-fit w-full flex flex-col gap-3 justify-start shrink-0 overflow-y-auto">
      <ProjectIdForm />
      <Separator />
      <MetadataForm />
    </div>
  );
};

export default Index;
