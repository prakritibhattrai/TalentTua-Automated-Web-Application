import { Outlet } from "react-router-dom";
import SideBar from "./sidebar";
import logo from "../assets/logo.png";

const Layout = () => {
  return (
    <div className="dark:bg-neutral-900 bg-gray-10">
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
            className="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
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
          <ol className="ms-3 flex items-center whitespace-nowrap">
            <li className="flex items-center text-sm text-gray-800 dark:text-neutral-400">
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
            </li>
            <li
              className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
              aria-current="page"
            >
              Chat
            </li>
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
