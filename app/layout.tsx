import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XYZ AI - Future Is Here",
  description: "Web AI Gacor by XYZ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
