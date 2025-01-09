import React, { useState } from "react";

function MultiSelectorInput({ value, onChange, onSave }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue(""); // Reset input field
    }
  };

  const handleRemove = (item) => {
    onChange(value.filter((i) => i !== item));
  };

  const handleSave = () => {
    onSave(value);
    onChange([]);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 font-medium rounded-full shadow-sm"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="p-1.5 flex flex-col sm:flex-row items-center gap-2 border border-gray-200 rounded-lg dark:border-neutral-700">
        <div className="relative w-full sm:flex-1">
          <label htmlFor="multi-selector-input" className="sr-only">
            Add Item
          </label>

          <input
            type="text"
            id="multi-selector-input"
            className="py-2 px-3 block w-full sm:min-w-[200px] border-transparent rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
            placeholder="Add skills and press Enter"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
        </div>

        <button
          className="w-full sm:w-auto whitespace-nowrap py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-gray-900 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200"
          onClick={handleSave}
        >
          Submit
          <svg
            className="shrink-0 size-3.5"
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}

export default MultiSelectorInput;
