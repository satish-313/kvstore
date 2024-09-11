import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/component/nav";
import Footer from "@/component/footer";


export const metadata: Metadata = {
    title: "kv store",
    description: "secure secret key value storing",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <main className="max-w-5xl mx-auto w-11/12 min-h-screen">
                    <Nav />
                    {children}
                    <Footer />
                </main>
            </body>
        </html>
    );
}
