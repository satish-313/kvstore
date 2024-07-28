import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Key value store",
  description: "Secure storing for key value store",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-gray-900">
        <main className="relative mx-auto w-11/12 max-w-5xl">
          <nav className="sticky top-0 bg-slate-950 px-4 py-2 text-3xl font-semibold text-gray-200">
            <h3>Kv store</h3>
          </nav>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </main>
      </body>
    </html>
  );
}
