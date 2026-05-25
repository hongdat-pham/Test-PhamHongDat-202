import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeReel – Short Video Feed",
  description: "Vertical scroll short video feed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
