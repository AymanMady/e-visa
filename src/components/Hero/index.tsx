"use client";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const Hero = () => {
  const { t } = useTranslation("common");

  return (
    <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
          <div className="md:w-1/2">
            <h4 className="mb-4.5 text-lg font-medium text-black dark:text-white">
              🇲🇷 MauriVisa – {t("description")}
            </h4>
            <h1 className="mb-5 pr-16 text-3xl font-bold text-black dark:text-white xl:text-hero">
              {t("welcome")}{" "}
              <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark">
                MauriVisa
              </span>
            </h1>
            <p className="text-black/70 dark:text-white/70">
              {t("hero_text", {
                defaultValue:
                  "Plateforme officielle de demande de visa électronique pour la République Islamique de Mauritanie. Simple, rapide et sécurisée.",
              })}
            </p>

            <div className="mt-10">
              <div className="flex flex-wrap gap-5">
                <button
                  aria-label="start visa application"
                  className="flex rounded-full bg-primary px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-primary/80"
                >
                  {t("start_application", { defaultValue: "Démarrer la demande" })}
                </button>
              </div>

              <p className="mt-5 text-black dark:text-white opacity-70">
                {t("hero_note", {
                  defaultValue: "Service officiel du Ministère de l’Intérieur et de la Décentralisation.",
                })}
              </p>
            </div>
          </div>

          <div className="animate_right hidden md:w-1/2 lg:block">
            <div className="relative 2xl:-mr-7.5">
              <Image
                src="/images/shape/shape-01.png"
                alt="shape"
                width={46}
                height={246}
                className="absolute -left-11.5 top-0"
              />
              {/* <Image
                src="/images/shape/shape-02.svg"
                alt="shape"
                width={36.9}
                height={36.7}
                className="absolute bottom-0 right-0 z-10"
              /> */}
              <Image
                src="/images/shape/shape-03.svg"
                alt="shape"
                width={36.9}
                height={36.7}
                className="absolute bottom-0 right-0 z-10"
              />
              {/* <Image
                src="/images/shape/shape-03.svg"
                alt="shape"
                width={21.64}
                height={21.66}
                className="absolute -right-6.5 bottom-0 z-1"
              /> */}
              <div className="relative aspect-700/444 w-full">
                <Image
                  className="shadow-solid-l dark:hidden"
                  src="/images/hero/hero-light.png"
                  alt="Hero MauriVisa"
                  fill
                />
                <Image
                  className="hidden shadow-solid-l dark:block"
                  src="/images/hero/hero-dark.png"
                  alt="Hero MauriVisa"
                  fill
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
