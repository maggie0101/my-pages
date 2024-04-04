import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import "./globals.css";

export const metadata: Metadata = {
  title: "人生重啟遊戲",
  description: "一款改變人生的習慣養成卡牌戰鬥遊戲",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="h-screen  w-full"
        style={{
          backgroundImage: "url('https://i.imgur.com/cFivuBv.jpg')",
        }}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
