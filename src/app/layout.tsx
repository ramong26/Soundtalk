import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import QueryProvider from './providers/QueryProvider';
import { Archivo_Black, Oswald } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

import HeaderMain from '@/shared/components/HeaderMain/HeaderMain';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['200', '400', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SoundTalk',
  description: '음악 차트 & 플레이리스트',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === 'production';
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ko">
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script src="https://unpkg.com/react-scan/dist/auto.global.js" strategy="beforeInteractive" />
        )}
      </head>
      <body className={`${oswald.variable} ${archivoBlack.variable}`}>
        <QueryProvider>
          <HeaderMain />
          {children}
        </QueryProvider>

        {GA_ID && isProduction && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        {isProduction && <Analytics />}
      </body>
    </html>
  );
}
