import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AppOverlay } from "@/components/AppOverlay";
import { Drawer } from "@/components/Drawer";
import { SignInModal } from "@/components/SignInModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muse — Garden of Poetry",
  description: "A sanctuary for women who write — inspired by the Japanese concept of ma, the sacred pause between words where all meaning lives.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body suppressHydrationWarning>
          <Drawer />
          <AppOverlay />
          <SignInModal />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
