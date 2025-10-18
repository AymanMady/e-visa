import { Metadata, InferGetStaticPropsType } from "next";
import Hero from "@/components/Hero";
import Feature from "@/components/Features";
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';


export default function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation('common');

  return (
    <main>
      <Hero />
      <Feature />
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fr', ['common', 'footer'])),
    },
  };
};