import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
    title: "Meetfan",
    description: "Next.js app starter with Tailwind CSS"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
  
            <html lang="th">
                <body className="font-sans antialiased">
                    <AuthProvider>{children}</AuthProvider>
                </body>
            </html>
    
    );
}
