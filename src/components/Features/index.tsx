"use client";
import React from "react";
import featuresData from "./featuresData";
import SingleFeature from "./SingleFeature";
import SectionHeader from "../Common/SectionHeader";
import { useTranslation } from "next-i18next";

const Feature = () => {
  const { t } = useTranslation("common");

  return (
    <section id="features" className="py-20 lg:py-25 xl:py-30">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        <SectionHeader
          headerInfo={{
            title: t("core_features_title", { defaultValue: "Fonctionnalités Principales" }),
            subtitle: t("core_features_subtitle", { defaultValue: "Découvrez ce que propose MauriVisa" }),
            description: t("core_features_description", {
              defaultValue:
                "Notre système e-visa rend la demande plus rapide, plus sûre et entièrement en ligne.",
            }),
          }}
        />

        <div className="mt-12.5 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-20 xl:gap-12.5">
          {featuresData.map((feature, key) => (
            <SingleFeature feature={feature} key={key} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
