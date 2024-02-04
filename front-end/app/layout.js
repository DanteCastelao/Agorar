import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import Footer from "./components/footer";

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
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
          <link href="https://fonts.googleapis.com/css2?family=Vidaloka&display=swap" rel="stylesheet"/>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5111428625414371"
            crossorigin="anonymous">
          </script>
          <meta name="keywords" content="Agorar, DNU, Ley Omnibus, Diputados, Senadores, Temáticas, Estado, Argentina, Gobierno, Política, Congreso, Cámara de Diputados, Cámara de Senadores, Diputados, Senadores, Temáticas, Estado, Argentina, Gobierno, Política, Congreso, Cámara de Diputados, Cámara de Senadores"/>
        </head>
        <body className={inter.className}>
            {children}
            <Footer/>
        </body>
        <GoogleAnalytics gaId="G-13RT3WTLD9" />
      </html>
  );
}
