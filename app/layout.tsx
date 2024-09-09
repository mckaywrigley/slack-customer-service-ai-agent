import Header from "@/components/header";
import { IntercomClone } from "@/components/intercom-clone";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/utilities/providers";
import { createProfile, getProfileByUserId } from "@/db/queries/profiles-queries";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slack Customer Service Bot",
  description: "A Slack bot that provides customer support."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  if (userId) {
    const profile = await getProfileByUserId(userId);
    if (!profile) {
      await createProfile({ userId });
    }
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster />
          </Providers>
          <div className="fixed bottom-4 right-4 z-50">
            <IntercomClone />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
