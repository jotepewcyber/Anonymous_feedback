// export default function AppLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
  
//   <div>

//     {children};

//   </div>
//   )
// }


import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
 import '../globals.css';
import AuthProvider from '../../context/authProvider';
import { Toaster } from '@/components/ui/sonner';
import Head from 'next/head';
 import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {

    return (
    <html lang="en">


          <body>
        <AuthProvider>
          <Navbar />
              {children}
        
         <Toaster richColors />
        </AuthProvider>
          </body>
     </html>
  );
}
