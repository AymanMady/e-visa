import React from "react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RequestForm from "@/components/RequestForm";
import { requireAuthServerSide } from "@/lib/auth-helpers";

const RequestPage = () => {
  const { data: session } = useSession();
  const { t } = useTranslation('common');

  return (
    <div className="pb-20 pt-40">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white md:text-4xl lg:text-5xl">
            {t('visa_application.title')}
          </h1>
          <p className="mt-4 text-lg text-waterloo dark:text-manatee">
            {t('welcome')} {session?.user?.name}, {t('visa_application.subtitle')}
          </p>
        </div>
        <RequestForm />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authResult = await requireAuthServerSide(context);
  
  if ('props' in authResult) {
    return {
      props: {
        ...authResult.props,
        ...(await serverSideTranslations(context.locale ?? 'fr', ['common'])),
      },
    };
  }
  
  return authResult;
};

export default RequestPage;
