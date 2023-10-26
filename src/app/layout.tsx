import './globals.css';
import type { Metadata , } from 'next';
import { Inter } from 'next/font/google';

import GlobalLayout from './layouts/global_layout';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })



export const metadata: Metadata = {
  title: 'OOUMPH',
  description: 'OOUMPH',
}




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      {/* <Head>
      <title>My page title</title>
      </Head> */}
      <body className={inter.className}>
        <GlobalLayout> 
        {children}
        </GlobalLayout>

        </body>
    </html>
  )
}
