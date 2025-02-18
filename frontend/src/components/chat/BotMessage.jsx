import React, { useEffect, useRef } from "react";
import CheckboxOptions from "./CheckboxOptions";
import EditableSummary from "./EditableSummary";
import ICP from "./ICP";
import ScaleSelection from "./ScaleSelection";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";
import AutoCompleteInput from "./AutoCompleteInput";
import PropTypes from "prop-types";

const BotMessage = ({
  message,
  onSelect,
  onSubmit,
  userData,
  icpData,
  messageEndRef,
}) => {
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]); // Trigger scroll whenever a new message is added

  return (
    <>
      <motion.img
        src={logo}
        className="h-7 w-7 mb-2 mx-auto sm:mx-0"
        alt="Logo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="bg-gray-50 border w-fit border-gray-200 rounded-lg p-3 dark:bg-neutral-900 dark:border-neutral-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.p
            className="text-sm text-gray-800 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {message.content || ""}
          </motion.p>
          <motion.ul
            className="text-sm text-gray-700 mt-2 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <li className="text-sm text-gray-800 dark:text-white">
              {message?.answer ? "-" + message?.answer : ""}
            </li>
          </motion.ul>
        </motion.div>

        {/* Various message handling components */}
        {message.name === "welcome" && (
          <>
            <motion.div
              className="flex flex-wrap justify-center sm:justify-start gap-1 sm:space-x-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {/* Buttons for Yes/No selection */}
              <motion.button
                onClick={() => onSelect("yes")}
                className="border border-gray-400 gap-1 hover:bg-blue-500 shadow-md rounded-lg px-6 py-2 text-sm bg-blue-600 text-white dark:bg-neutral-900 dark:text-white dark:border-neutral-700 flex items-center w-full sm:w-auto"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                Get Started
                <svg
                  className="w-[18px] h-[18px] text-white dark:text-white"
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
                    strokeWidth="2"
                    d="M19 12H5m14 0-4 4m4-4-4-4"
                  />
                </svg>
              </motion.button>

              {/* <motion.button
                onClick={() => onSelect("no")}
                className="border border-gray-400 gap-1 hover:bg-blue-500  max-w-24 shadow-md rounded-lg px-6 py-2 text-sm bg-blue-600 text-white dark:bg-neutral-900 dark:text-white dark:border-neutral-700 flex items-center w-full sm:w-auto"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              >
                <svg
                  className="w-[18px] h-[18px] text-white dark:text-white"
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
                    strokeWidth="2"
                    d="M17 13c-.889.086-1.416.543-2.156 1.057a22.322 22.322 0 0 0-3.958 5.084 1.6 1.6 0 0 1-.582.628 1.549 1.549 0 0 1-1.466.087 1.587 1.587 0 0 1-.537-.406 1.666 1.666 0 0 1-.384-1.279l1.389-4.114M17 13h3V6.5A1.5 1.5 0 0 0 18.5 5v0A1.5 1.5 0 0 0 17 6.5V13Zm-6.5 1H5.585c-.286 0-.372-.014-.626-.15a1.797 1.797 0 0 1-.637-.572 1.873 1.873 0 0 1-.215-1.673l2.098-6.4C6.462 4.48 6.632 4 7.88 4c2.302 0 4.79.943 6.67 1.475"
                  />
                </svg>
                No
              </motion.button> */}
            </motion.div>
          </>
        )}

        {/* Conditional rendering for other message types */}
        {message.inputType === "dropdown" && message.options && (
          <motion.div
            className="flex flex-wrap gap-2 xs:max-h-72 overflow-x-auto  justify-center sm:justify-start mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {message.options.map((option, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => onSelect(option)}
                className="py-1 px-2 sm:px-2 border border-gray-400 rounded-full text-[13px] font-normal shadow-sm text-gray-800 hover:bg-gray-100 dark:bg-neutral-900 dark:text-blue-500 dark:border-blue-500 dark:hover:bg-neutral-800 w-full sm:w-auto sm:min-w-[150px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {option}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Handle checkbox, autocomplete, scale selection, editable summary, and ICP */}
        {message.inputType === "checkbox" && message.options && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <CheckboxOptions
              name={message.name}
              optionsToDisplay={message.options}
              onSelect={onSelect}
              selected={message.selectedOption}
            />
          </motion.div>
        )}

        {message.name === "jobTitle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <AutoCompleteInput
              data={["data", "Software"]}
              onSelect={onSelect}
            />
          </motion.div>
        )}

        {message.name === "traitMatrix" && message.options && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <ScaleSelection onSelect={onSelect} rated={message.rating} />
          </motion.div>
        )}

        {message.name === "reviewAndUpdate" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            <EditableSummary onSubmit={onSubmit} userData={userData} />
          </motion.div>
        )}

        {message.name === "icp" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
          >
            <ICP icpData={icpData} />
          </motion.div>
        )}
      </motion.div>

      {/* This element ensures we always scroll to the bottom */}
      {message.name !== "welcome" ? <div ref={messagesEndRef} /> : ""}
    </>
  );
};

BotMessage.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string,
    answer: PropTypes.string,
    name: PropTypes.string,
    inputType: PropTypes.string,
    message: PropTypes.shape({
      options: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
    }),
    selectedOption: PropTypes.string,
    rating: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  userData: PropTypes.object,
  icpData: PropTypes.object,
};

export default BotMessage;
