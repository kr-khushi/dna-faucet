import MiniKitProvider from "@/provider/MiniKitProvider";
import "./globals.css";
import { Comic_Neue } from "next/font/google";
const comic_neue = Comic_Neue({
  subsets: ["latin"],
  variable: "--font-comic-neue",
  weight: ["700", "400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${comic_neue.className}`}>
        <MiniKitProvider>{children}</MiniKitProvider>
      </body>
    </html>
  );
}
