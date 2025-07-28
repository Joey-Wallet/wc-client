import type { Metadata } from 'next';

import './styles.css';

export const metadata: Metadata = {
  title: 'WalletConnect Toolkit for XRPL + Joey Wallet',
  description:
    'A toolkit for testing WalletConnect integration with the XRP Ledger and Joey Wallet, enabling seamless wallet interactions and transaction testing.',
  icons: {
    icon: '/assets/favicon/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="Light" className="Globals">
      <body data-variant="Default" className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
