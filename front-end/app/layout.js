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
          <meta name="keywords" content="Agorar, DNU, Ley Omnibus, Ley de los Alquileres, ley de los alquileres, la ley de alquileres, argentina ley de alquileres, ley de alquileres 2023, alquileres argentina ley, leyde alquileres, derogación de la ley de alquileres, derogación ley de alquileres, dnu alquileres, ley alquileres, dnu obras sociales, ley de tierras rurales argentina, ley de tierras argentina, decreto alquileres, la ley argentina, ley abastecimiento, alquileres decreto, la ley de abastecimiento, ley de abastecimiento que es, nueva ley obra social, decreto de obras sociales, dnu decreto de necesidad y urgencia, dnu en argentina, decreto obras sociales, ley de góndolas argentina, dnu argentina, decreto dnu, medidas alquileres, ley de tierras argentina en que consiste, ley de abastecimiento argentina, ley dnu, argentina dnu, ley nacional de tierras, necesidad y urgencia, ley de tierras, ley de dnu, decretos de necesidad y urgencia en argentina, decreto necesidad y urgencia, decreto de necesidad de urgencia, decreto de necesidad y urgencia argentina, artículo de la ley, derogación de la ley, la ley del estado, estado leyes, sobre las leyes, empresas para"/>
        </head>
        <body className={inter.className}>
            {children}
            <Footer/>
        </body>
        <GoogleAnalytics gaId="G-13RT3WTLD9" />
      </html>
  );
}
