import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import '~/styles/globals.scss'; // Adjust path if needed

// Configure Geist fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

interface StandaloneLayoutProps {
  children: ReactNode;
}

const Layout: React.FC<StandaloneLayoutProps> = ({ children }) => {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</div>
  );
};

export default Layout;
