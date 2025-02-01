import { Link, Outlet } from "react-router-dom";
import SideBar from "./sidebar";
import logo from "../assets/logo.png";

import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import ThemeContext from "../contexts/ThemeContext";

const Layout = () => {
  const location = useLocation();
  const isICP = location.pathname.includes("icp");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext); // Access context

  // Effect to toggle dark mode on the document's root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  return (
    <div className="dark:bg-neutral-900 bg-gray-10 min-h-screen">
      {/* ========== HEADER ========== */}
      {/* <Header /> */}
      {/* ========== END HEADER ========== */}
      {/* ========== MAIN CONTENT ========== */}
      {/* Breadcrumb */}
      <div className="sticky top-0 inset-x-0 z-20 bg-white  border-y px-4 sm:px-6 lg:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex items-center py-2">
          {/* Navigation Toggle */}
          <button
            type="button"
            className="size-8 flex justify-center items-center gap-x-2 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="hs-application-sidebar"
            aria-label="Toggle navigation"
            data-hs-overlay="#hs-application-sidebar"
          >
            <span className="sr-only">Toggle Navigation</span>

            <img src={logo}></img>
          </button>
          {/* End Navigation Toggle */}
          {/* Breadcrumb */}
          <ol className="ms-3 flex justify-between  items-center whitespace-nowrap w-full">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center hover:bottom-1 text-sm text-gray-800 dark:text-neutral-400"
              >
                TalentTua
                <svg
                  className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
              <li
                className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
                aria-current="page"
              >
                {isICP ? "ICP" : "Chat"}
              </li>
            </div>

            {/* Add this div with flex-grow */}
            <div className="flex-grow"></div>

            <button
              className="text-xs border border-gray-300 dark:border-neutral-700 rounded-lg p-2 text-right flex gap-2 text-gray-600 dark:text-neutral-500"
              onClick={(e) => {
                e.preventDefault();
                toggleDarkMode();
              }}
            >
              {darkMode ? (
                <svg
                  className="w-[16px] h-[16px] text-gray-800 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-[16px] h-[16px] text-gray-800 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"
                  />
                </svg>
              )}
            </button>
          </ol>

          {/* End Breadcrumb */}
        </div>
      </div>
      {/* End Breadcrumb */}
      {/* ========== MAIN CONTENT ========== */}
      {/* Sidebar */}
      <SideBar />
      {/* End Sidebar */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
