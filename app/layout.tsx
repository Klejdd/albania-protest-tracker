import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Albania Protest Tracker",
  description: "A transparent platform collecting citizen voices about the protests in Albania",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq">
      <body className="bg-gray-950 text-white min-h-screen">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
