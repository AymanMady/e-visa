"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSession, signOut } from "next-auth/react";

import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import LanguageSwitcher from "../../lib/utils/LanguageSwitcher";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();

  const pathUrl = usePathname();

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-99999 w-full py-7 ${
        stickyMenu
          ? "bg-white py-4! shadow-sm transition duration-100 dark:bg-black"
          : ""
      }`}
    >
      <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between xl:w-1/4">
          <Link href="/">
            <Image
              src="/images/logo/logo-dark.png"
              alt="logo"
              width={119.03}
              height={30}
              className="hidden w-full dark:block"
            />
            <Image
              src="/images/logo/logo-light.png"
              alt="logo"
              width={119.03}
              height={30}
              className="w-full dark:hidden"
            />
          </Link>

          <button
            aria-label="hamburger Toggler"
            className="block xl:hidden"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="absolute right-0 block h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-0 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "w-full! delay-300" : "w-0"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "delay-400 w-full!" : "w-0"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "w-full! delay-500" : "w-0"
                  }`}
                ></span>
              </span>
              <span className="du-block absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "h-0! delay-0" : "h-full"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "h-0! delay-200" : "h-0.5"
                  }`}
                ></span>
              </span>
            </span>
          </button>
        </div>

        <div
          className={`invisible h-0 w-full items-center justify-between xl:visible xl:flex xl:h-auto xl:w-full ${
            navigationOpen &&
            "navbar visible! mt-4 h-auto max-h-[400px] rounded-md bg-white p-7.5 shadow-solid-5 dark:bg-blacksection xl:h-auto xl:p-0 xl:shadow-none xl:dark:bg-transparent"
          }`}
        >
          <nav>
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10">
              {/* Pour les admins, afficher uniquement Accueil et Dashboard Admin */}
              {session?.user?.role === "admin" ? (
                <>
                  <li>
                    <Link
                      href="/"
                      className={
                        pathUrl === "/"
                          ? "text-primary hover:text-primary"
                          : "hover:text-primary"
                      }
                    >
                      {t("home")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin"
                      className={
                        pathUrl === "/admin"
                          ? "text-primary hover:text-primary"
                          : "hover:text-primary"
                      }
                    >
                      {t("admin_dashboard")}
                    </Link>
                  </li>
                </>
              ) : (
                /* Pour les utilisateurs normaux, afficher le menu standard */
                menuData.map((menuItem, key) => (
                  <li key={key} className={menuItem.submenu && "group relative"}>
                    {menuItem.submenu ? (
                      <>
                        <button
                          onClick={() => setDropdownToggler(!dropdownToggler)}
                          className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary"
                        >
                          {t(menuItem.title)} 
                          <span>
                            <svg
                              className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                            </svg>
                          </span>
                        </button>

                        <ul
                          className={`dropdown ${dropdownToggler ? "flex" : ""}`}
                        >
                          {menuItem.submenu.map((item, key) => (
                            <li key={key} className="hover:text-primary">
                              <Link href={item.path || "#"}>{t(item.title)}</Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link
                        href={`${menuItem.path}`}
                        className={
                          pathUrl === menuItem.path
                            ? "text-primary hover:text-primary"
                            : "hover:text-primary"
                        }
                      >
                        {t(menuItem.title)}
                      </Link>
                    )}
                  </li>
                ))
              )}
            </ul>
          </nav>

          <div className="mt-7 flex items-center gap-4 xl:mt-0">
            <ThemeToggler />
            <LanguageSwitcher />

            {status === "loading" ? (
              <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <span className="hidden sm:inline">{session.user?.name || "Utilisateur"}</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg dark:bg-blacksection">
                    <div className="px-4 py-3 border-b border-stroke dark:border-strokedark">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-waterloo dark:text-manatee">
                        {session.user?.email}
                      </p>
                      {session.user?.role === "admin" && (
                        <span className="mt-1 inline-block rounded bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="py-2">
                      {session.user?.role === "admin" ? (
                        /* Menu pour les admins */
                        <>
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm font-medium text-primary hover:bg-gray-100 dark:hover:bg-strokedark"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            {t("admin_dashboard")}
                          </Link>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              signOut({ callbackUrl: "/" });
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-strokedark"
                          >
                            {t("logout")}
                          </button>
                        </>
                      ) : (
                        /* Menu pour les utilisateurs normaux */
                        <>
                          <Link
                            href="/my-applications"
                            className="block px-4 py-2 text-sm text-black hover:bg-gray-100 dark:text-white dark:hover:bg-strokedark"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            📋 {t("my_visa_applications")}
                          </Link>
                          <Link
                            href="/request"
                            className="block px-4 py-2 text-sm text-black hover:bg-gray-100 dark:text-white dark:hover:bg-strokedark"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            ➕ {t("new_application")}
                          </Link>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              signOut({ callbackUrl: "/" });
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-strokedark"
                          >
                            {t("logout")}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
                >
                  {t('sign_in')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
                >
                  {t('sign_up')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;