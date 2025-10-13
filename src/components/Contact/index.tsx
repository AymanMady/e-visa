"use client";
import { FeatureTab } from "@/types/featureTab";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

const Contact = () => {
  /**
   * Source: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
   * Reason: To fix rehydration error
   */
  const [hasMounted, setHasMounted] = React.useState(false);
  const [currentTab, setCurrentTab] = useState("tabOne");

  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  const featuresTabData: FeatureTab[] = [
    {
      id: "tabOne",
      title: "Solid Has Neat & Clean User Interface.",
      desc1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies lacus non fermentum ultrices. Fusce consectetur le.`,
      desc2: `    Nam id eleifend dui, id iaculis purus. Etiam lobortis neque nec finibus sagittis. Nulla ligula nunc egestas ut.`,
      image: "/images/features/features-light-01.png",
      imageDark: "/images/features/features-dark-01.svg",
    },
    {
      id: "tabTwo",
      title: "Ready to Use Pages You Need for a SaaS Business.",
      desc1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies lacus non fermentum ultrices. Fusce consectetur le.`,
      desc2: `    Nam id eleifend dui, id iaculis purus. Etiam lobortis neque nec finibus sagittis. Nulla ligula nunc egestas ut.`,
      image: "/images/features/features-light-01.png",
      imageDark: "/images/features/features-dark-01.svg",
    },
    {
      id: "tabThree",
      title: "Functional Blog, DB, Auth and Many More",
      desc1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies lacus non fermentum ultrices. Fusce consectetur le.`,
      desc2: `Nam id eleifend dui, id iaculis purus. Etiam lobortis neque nec finibus sagittis. Nulla ligula nunc egestas ut.`,
      image: "/images/features/features-light-01.png",
      imageDark: "/images/features/features-dark-01.svg",
    },
  ];

  return (
    <>
      <section className="relative pb-20 pt-18.5 lg:pb-22.5">
        <div className="relative mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="absolute -top-16 -z-1 mx-auto h-[350px] w-[90%]">
            <Image
              fill
              className="dark:hidden"
              src="/images/shape/shape-dotted-light.svg"
              alt="Dotted Shape"
            />
            <Image
              fill
              className="hidden dark:block"
              src="/images/shape/shape-dotted-dark.svg"
              alt="Dotted Shape"
            />
          </div>

          {/* <!-- Tab Menues Start --> */}
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: -20,
              },

              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top mb-15 flex flex-wrap justify-center rounded-[10px] border border-stroke bg-white shadow-solid-5 dark:border-strokedark dark:bg-blacksection dark:shadow-solid-6 md:flex-nowrap md:items-center lg:gap-7.5 xl:mb-21.5 xl:gap-12.5"
          >
            <div
              onClick={() => setCurrentTab("tabOne")}
              className={`relative flex w-full cursor-pointer items-center gap-4 border-b border-stroke px-6 py-2 last:border-0 dark:border-strokedark md:w-auto md:border-0 xl:px-13.5 xl:py-5 ${
                currentTab === "tabOne"
                  ? "active before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:rounded-tl-[4px] before:rounded-tr-[4px] before:bg-primary"
                  : ""
              }`}
            >
              <div className="flex h-12.5 w-12.5 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                <p className="text-metatitle3 font-medium text-black dark:text-white">
                  01
                </p>
              </div>
              <div className="md:w-3/5 lg:w-auto">
                <button className="text-sm font-medium text-black dark:text-white xl:text-regular">
                  General Information
                </button>
              </div>
            </div>
            <div
              onClick={() => setCurrentTab("tabTwo")}
              className={`relative flex w-full cursor-pointer items-center gap-4 border-b border-stroke px-6 py-2 last:border-0 dark:border-strokedark md:w-auto md:border-0 xl:px-13.5 xl:py-5 ${
                currentTab === "tabTwo"
                  ? "active before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:rounded-tl-[4px] before:rounded-tr-[4px] before:bg-primary"
                  : ""
              }`}
            >
              <div className="flex h-12.5 w-12.5 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                <p className="text-metatitle3 font-medium text-black dark:text-white">
                  02
                </p>
              </div>
              <div className="md:w-3/5 lg:w-auto">
                <button className="text-sm font-medium text-black dark:text-white xl:text-regular">
                  Passport Information
                </button>
              </div>
            </div>
            <div
              onClick={() => setCurrentTab("tabThree")}
              className={`relative flex w-full cursor-pointer items-center gap-4 border-b border-stroke px-6 py-2 last:border-0 dark:border-strokedark md:w-auto md:border-0 xl:px-13.5 xl:py-5 ${
                currentTab === "tabThree"
                  ? "active before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:rounded-tl-[4px] before:rounded-tr-[4px] before:bg-primary"
                  : ""
              }`}
            >
              <div className="flex h-12.5 w-12.5 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                <p className="text-metatitle3 font-medium text-black dark:text-white">
                  03
                </p>
              </div>
              <div className="md:w-3/5 lg:w-auto">
                <button className="text-sm font-medium text-black dark:text-white xl:text-regular">
                  Payment Details
                </button>
              </div>
            </div>
          </motion.div>
          {/* <!-- Tab Menues End --> */}

          {/* ========== Contenu du formulaire ========== */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="animate_top mx-auto max-w-c-1154"
          >
            {currentTab === "tabOne" && (
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top mx-auto max-w-c-1154"
              >
                <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
                  <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-linear-to-t from-transparent to-[#dee7ff47] dark:bg-linear-to-t dark:to-[#252A42]"></div>
                  <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
                    <Image
                      src="./images/shape/shape-dotted-light.svg"
                      alt="Dotted"
                      className="dark:hidden"
                      fill
                    />
                    <Image
                      src="./images/shape/shape-dotted-dark.svg"
                      alt="Dotted"
                      className="hidden dark:block"
                      fill
                    />
                  </div>

                  <div className="flex flex-col-reverse w-full flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
                    <motion.div
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: -20,
                        },

                        visible: {
                          opacity: 1,
                          y: 0,
                        },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 1, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-full xl:p-15"
                    >
                      <h2 className="mb-15 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2"></h2>

                      <form action="" method="POST">
                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                            Email address *
                          </label>
                          <input
                            type="email"
                            className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                          />
                          <input
                            type="text"
                            placeholder="Phone number"
                            className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                          />
                        </div>

                        <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <select
                            className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                            defaultValue={"tourism"}
                          >
                            <option value="tourism">Tourism</option>
                            <option value="business">Business</option>
                            <option value="famille">Famille</option>
                            <option value="medical">Medical</option>
                            <option value="culter-sports">Culter/Sports</option>
                            <option value="other">Other</option>
                          </select>
                          <input
                            type="date"
                            placeholder="Arrival Date"
                            className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                          />
                        </div>

                        <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <select
                            className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                            defaultValue={"double"}
                          >
                            <option value="double">Double</option>
                            <option value="multi">Multiple</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Address in Mauritania"
                            className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                          />
                        </div>

                        <div className="mb-11.5 flex">
                          <textarea
                            placeholder="Description of the reason for travel"
                            rows={4}
                            className="w-full border-b border-stroke bg-transparent focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                          ></textarea>
                        </div>

                        <div className="flex flex-wrap gap-4 xl:justify-between ">
                          <button
                            aria-label="send message"
                            className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                          >
                            Send Message
                            <svg
                              className="fill-white"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            {currentTab === "tabTwo" && (
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top mx-auto max-w-c-1154"
              >
                <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
                  <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-linear-to-t from-transparent to-[#dee7ff47] dark:bg-linear-to-t dark:to-[#252A42]"></div>
                  <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
                    <Image
                      src="./images/shape/shape-dotted-light.svg"
                      alt="Dotted"
                      className="dark:hidden"
                      fill
                    />
                    <Image
                      src="./images/shape/shape-dotted-dark.svg"
                      alt="Dotted"
                      className="hidden dark:block"
                      fill
                    />
                  </div>

                  <div className="flex flex-col-reverse w-full flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
                    <motion.div
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: -20,
                        },

                        visible: {
                          opacity: 1,
                          y: 0,
                        },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 1, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-full xl:p-15"
                    >
                      <form
                        action="https://formbold.com/s/unique_form_id"
                        method="POST"
                      >
                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Travel Document Number *
                            </label>
                            <input
                              type="text"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            />
                          </div>

                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Travel Document Type
                            </label>
                            <select className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white">
                              <option value="standard">
                                Standard Passport
                              </option>
                              <option value="service">Service Passport</option>
                              <option value="diplomatic">
                                Diplomatic Passport
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Date of Issue
                            </label>
                            <input
                              type="date"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            />
                          </div>

                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Expiration Date
                            </label>
                            <input
                              type="date"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            />
                          </div>
                        </div>

                        <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Place of Issue
                            </label>
                            <input
                              type="text"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 xl:justify-between">
                          <button
                            aria-label="send message"
                            className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                          >
                            Submit
                            <svg
                              className="fill-white"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            {currentTab === "tabThree" && (
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top mx-auto max-w-c-1154"
              >
                <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
                  <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-linear-to-t from-transparent to-[#dee7ff47] dark:bg-linear-to-t dark:to-[#252A42]"></div>
                  <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
                    <Image
                      src="./images/shape/shape-dotted-light.svg"
                      alt="Dotted"
                      className="dark:hidden"
                      fill
                    />
                    <Image
                      src="./images/shape/shape-dotted-dark.svg"
                      alt="Dotted"
                      className="hidden dark:block"
                      fill
                    />
                  </div>

                  <div className="flex flex-col-reverse w-full flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
                    <motion.div
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: -20,
                        },

                        visible: {
                          opacity: 1,
                          y: 0,
                        },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 1, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-full xl:p-15"
                    >
                      <form
                        action=""
                        method="POST"
                      >
                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Title
                            </label>
                            <select className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white">
                              <option value="mr">Mr</option>
                              <option value="mrs">Mrs</option>
                              <option value="ms">Miss</option>
                            </select>
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            />
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            />
                          </div>
                        </div>

                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            />
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Place of Birth
                            </label>
                            <input
                              type="text"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            />
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Nationality
                            </label>
                            <input
                              type="text"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            />
                          </div>
                        </div>

                        <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Sex
                            </label>
                            <select className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white">
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>

                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Profession
                            </label>
                            <input
                              type="text"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 xl:justify-between">
                          <button
                            aria-label="submit form"
                            className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                          >
                            Submit
                            <svg
                              className="fill-white"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;
