import { CheckboxOptions } from "./CheckboxOptions";
import { EditableSummary } from "./EditableSummary";
import { ICP } from "./ICP";
import { ScaleSelection } from "./ScaleSelection";
import { motion } from "framer-motion";

import logo from "../../assets/logo.png";
import AutoCompleteInput from "./AutoCompleteInput";

export const BotMessage = ({
  message,
  onSelect,
  onSubmit,
  userData,
  icpData,
}) => {
  return (
    <>
      <img src={logo} className="h-7 w-7 mb-4"></img>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 dark:bg-neutral-900 dark:border-neutral-700">
          <p className="text-sm text-gray-800 dark:text-white">
            {message.content || ""}
          </p>
        </div>
        {message.name === "welcome" && (
          <div className="flex space-x-2">
            <motion.button
              onClick={() => onSelect("yes")}
              className="border border-gray-400 hover:bg-blue-400 shadow-md rounded-lg px-4 py-2 text-sm bg-blue-500 text-white dark:bg-neutral-900 dark:text-white dark:border-neutral-700 flex items-center"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-[18px] mr-0.5  h-[18px] text-white dark:text-white"
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
                  d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475"
                />
              </svg>
              Yes
            </motion.button>
            <motion.button
              onClick={() => onSelect("no")}
              className="border border-gray-400 hover:bg-blue-400 shadow-md rounded-lg px-4 py-1 text-sm bg-blue-500 text-white dark:bg-neutral-900 dark:text-white dark:border-neutral-700 flex items-center"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
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
            </motion.button>
          </div>
        )}
        {message.inputType === "dropdown" && message.options && (
          <div className="flex flex-wrap gap-2">
            {message.options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelect(option)}
                className="py-1 px-3 border border-gray-400 rounded-full text-sm shadow-sm text-gray-800 hover:bg-gray-100 dark:bg-neutral-900 dark:text-blue-500 dark:border-blue-500 dark:hover:bg-neutral-800"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {message.inputType === "checkbox" && message.options && (
          <CheckboxOptions
            name={message.name}
            optionsToDisplay={message.options}
            onSelect={onSelect}
            selected={message.selectedOption}
          />
        )}
        {message.name === "jobTitle" && (
          <AutoCompleteInput data={["data", "Software"]} onSelect={onSelect} />
        )}
        {message.name === "traitMatrix" && message.options && (
          <ScaleSelection onSelect={onSelect} rated={message.rating} />
        )}
        {message.name === "reviewAndUpdate" && (
          <EditableSummary onSubmit={onSubmit} userData={userData} />
        )}
        {message.name === "icp" && <ICP icpData={icpData} />}
      </div>
    </>
  );
};
