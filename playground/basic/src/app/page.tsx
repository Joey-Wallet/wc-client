'use client';

import * as React from 'react';
import Main from './main';

import Provider from '~/context';

export default function Page() {
  return (
    <Provider>
      <Main />
    </Provider>
  );
}
