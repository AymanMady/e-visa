import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SessionProvider } from "next-auth/react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import ToasterContext from "./context/ToastContext";

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();

  useEffect(() => {
    if (locale === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = locale ?? 'fr';
    }
  }, [locale]);

  return (
    <SessionProvider session={pageProps.session}>
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
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);