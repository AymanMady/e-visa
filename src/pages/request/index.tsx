import React, { useEffect } from "react";
import { Metadata } from "next";
import { useRouter } from "next/router";
import RequestForm from "@/components/RequestForm";

export const metadata: Metadata = {
  title: "Request Page - Solid SaaS Boilerplate",
  description: "This is Support page for Solid Pro"
};

const RequestPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/signin");
    }
  }, []);

  return (
    <div className="pb-20 pt-40">
      <RequestForm />
    </div>
  );
};

export default RequestPage;
