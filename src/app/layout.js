import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

import Providers from "./providers";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata = {
  title: "Le Quiz",
  description: "Learning by Complete Immersion",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${montserrat.variable} ${openSans.variable}`}>
        <Providers>
          <Header />

          <div className='app-shell'>
            <main className='app-main'>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
