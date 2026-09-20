import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import GreenDotsCursor from "@/components/GreenDotsCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "SQL Query Visualizer & Practice Playground",
  description:
    "Interactive SQL execution visualizer with sample data flow & categorized practice playground.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased relative">
        <GreenDotsCursor />
        <div className="relative z-10">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
