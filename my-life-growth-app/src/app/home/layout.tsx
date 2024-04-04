import React from "react";

import Navbar from "./_components/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex-rows fixed top-0 flex h-screen w-full overflow-hidden">
          <nav className="flex w-[25%] flex-col overflow-y-scroll border-r bg-slate-100 pb-10">
            <Navbar />
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
