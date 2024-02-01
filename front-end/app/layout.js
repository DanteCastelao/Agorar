import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Agorar",
  description: "Agorar: tu guía instantánea para seguir el estado de las temáticas del mega DNU y la Ley Ómnibus",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/Icon.png" type="image/png"/>
      </head>
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-13RT3WTLD9" />
    </html>
  );
}
