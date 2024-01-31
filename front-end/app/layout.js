import { Inter, Vidaloka } from "next/font/google";
import "./globals.css";
import Head from "next/head";

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
      <Head>
        {/* Google Analytics Tracking Code */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WRD1CS854D"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-13RT3WTLD9');
            `,
          }}
        ></script>
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
