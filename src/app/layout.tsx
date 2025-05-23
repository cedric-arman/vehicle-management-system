import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-nunito',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vehicle Registration System',
  description: 'Vehicle Registration System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
