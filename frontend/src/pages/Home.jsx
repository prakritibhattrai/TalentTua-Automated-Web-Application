import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion from framer-motion
import logo from "../assets/logo.png";
import ThemeContext from "../contexts/ThemeContext";
import { useContext } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [placeholderText, setPlaceholderText] = useState(
    "🤖 Say something to start..."
  );

  const navigate = useNavigate();

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim()) {
      navigate("/chat", { state: { input: inputValue } });
    }
  };

  const handleChange = (event) => {
    navigate("/chat", { darkMode: { darkMode } });
    setInputValue(event.target.value);
  };
  const { darkMode, toggleDarkMode } = useContext(ThemeContext); // Access context

  // Effect to toggle dark mode on the document's root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Toggle function

  useEffect(() => {
    const changingTexts = [
      "🎯 Find your perfect skill match!",
      "⚙️ Hire with skill, not resumes!",
      "📍 Personalized job suggestions!",
      "🚀 Bridge your skill gaps fast!",
      "🧠 Build your ideal candidate profile!",
      "🌱 Grow your network effortlessly!",
      "🔑 Unlock skills-based hiring!",
      "🌍 Explore endless career paths!",
    ];

    let index = 0;
    const changePlaceholder = () => {
      setPlaceholderText(changingTexts[index]);
      index = (index + 1) % changingTexts.length;
    };
    const placeholderInterval = setInterval(changePlaceholder, 2000);
    return () => clearInterval(placeholderInterval);
  }, []);

  return (
    <main
      id="content"
      className="dark:bg-neutral-900 max-h-screen dark:to-neutral-800"
    >
      <div className="h-screen flex flex-col pb-6">
        <div className="h-full flex flex-col justify-center">
          <div className="-mt-20 max-w-4xl w-full text-center mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center mb-6 gap-2 text-[#1C1D22]">
              <div className="flex items-center justify-center gap-2 text-[#1C1D22]">
                <div className="text-6xl text-blue-600">
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M39.475 21.6262..."
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <img src={logo} className="h-12 w-12" />
              </div>
            </div>

            {/* Motion Component for animated text */}
            <motion.h1
              className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Welcome to TalentTua AI
            </motion.h1>

            {/* Motion Component for description text */}
            <motion.p
              className="mt-3 text-gray-600 dark:text-neutral-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Over 100+ ICPs have been generated already!
            </motion.p>
          </div>

          {/* Motion Component for Input Box */}
          <motion.div
            className="mt-10 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <motion.input
                type="text"
                className="p-4 block border w-full text-gray-800 border-gray-300 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 
                 focus:ring-1 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700
                  dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder={placeholderText}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                animate={{ placeholderText }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute top-1/2 end-2 -translate-y-1/2">
                <button
                  type="button"
                  className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-white dark:focus:text-white"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M12 12v9"></path>
                    <path d="m16 16-4-4-4 4"></path>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Motion Component for Button */}
          <Link to="/chat" className="w-full mx-auto text-center">
            <motion.button
              type="button"
              className="mt-6 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Let&apos;s Get Started!
            </motion.button>
          </Link>
        </div>

        {/* Motion Component for Footer */}
        <motion.footer
          className="mt-auto flex max-w-4xl text-center mx-auto px-4 gap-6 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <button
            className="text-xs flex gap-2 text-gray-600 dark:text-neutral-500 items-start"
            onClick={(e) => {
              e.preventDefault();
              toggleDarkMode();
            }}
          >
            {darkMode && darkMode ? " Theme Light" : "Theme  Dark"}
            {darkMode && darkMode ? (
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
          <p className="text-xs text-gray-600 dark:text-neutral-500">
            Copyright @ TalentTua Candidate Screening. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </main>
  );
};

export default Home;
