import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import ToasterContext from "./context/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider enableSystem={false} attribute="class" defaultTheme="light">
      <div className={`dark:bg-black ${inter.className}`}>
        <Lines />
        <Header />
        <ToasterContext />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
}
