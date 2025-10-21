import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import { requireAdminServerSide } from "@/lib/auth-helpers";

const AdminPage = () => {
  return <AdminDashboard />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const adminResult = await requireAdminServerSide(context);
  
  if ('props' in adminResult) {
    return {
      props: {
        ...adminResult.props,
        ...(await serverSideTranslations(context.locale ?? 'fr', ['common'])),
      },
    };
  }
  
  return adminResult;
};

export default AdminPage;

