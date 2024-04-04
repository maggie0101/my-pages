import React from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="left-0 grid h-screen  w-full text-center"
      style={{
        backgroundImage: "url('https://i.imgur.com/3hyFz6U.jpg')",
      }}
    >
      <div className="mb-8 text-4xl font-bold text-white"></div>
      <div>{children}</div>
    </div>
  );
}
