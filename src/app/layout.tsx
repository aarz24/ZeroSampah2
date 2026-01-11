
import { ClerkProvider } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from 'react-hot-toast';
import { syncUser } from '@/db/actions';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZeroSampah",
  description: "Join our community in making waste management more efficient and rewarding!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser();
  if (user) {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
    await syncUser(
      user.id,
      user.emailAddresses[0]?.emailAddress || '',
      fullName,
      user.imageUrl
    );
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <Toaster />
          <Header />
          <Sidebar>
            {children}
          </Sidebar>
        </body>
      </html>
    </ClerkProvider>
  );
}
