import { useState, useEffect } from "react";
import SaveButton from "./Button";
import PropTypes from "prop-types";
import ToolProficiencies from "./ToolsProficiencies";

const CheckboxOptions = ({ optionsToDisplay, onSelect, selected, name }) => {
  const [selectedOptions, setSelectedOptions] = useState(
    Array.isArray(selected) ? [...selected] : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [warning, setWarning] = useState("");
  const [visibleCount, setVisibleCount] = useState(20); // Lazy load first 20 items
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (Array.isArray(selected)) {
      setSelectedOptions(selected);
    }
  }, [selected]);

  const maxSelectionLimit =
    name === "toolProficiencies" || name === "stakeholderEngagement" ? 20 : 5;

  const handleCheckboxChange = (option, checked) => {
    setWarning("");
    if (checked && selectedOptions.length >= maxSelectionLimit) {
      setWarning(`You can only select up to ${maxSelectionLimit} items.`);
      return;
    }

    setSelectedOptions((prevSelected) =>
      checked
        ? [...prevSelected, option]
        : prevSelected.filter((item) => item !== option)
    );
  };

  const handleDeselect = (option) => {
    setSelectedOptions(selectedOptions.filter((item) => item !== option));
  };

  const handleSave = () => {
    if (
      selectedOptions.length > maxSelectionLimit ||
      selectedOptions.length === 0
    ) {
      setWarning(`You can only select up to ${maxSelectionLimit} items.`);
      return;
    }
    onSelect([...selectedOptions]);
  };

  const filteredOptions =
    optionsToDisplay.length > 0
      ? optionsToDisplay
          .filter((option) =>
            option.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, visibleCount) // Lazy load
      : [];

  const handleCustomInputChange = (e) => {
    setCustomInput(e.target.value);
  };

  const handleCustomInputSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      if (selectedOptions.length >= maxSelectionLimit) {
        setWarning(`You can only select up to ${maxSelectionLimit} items.`);
        return;
      }

      // Prevent duplicate selections
      if (!selectedOptions.includes(searchQuery)) {
        setSelectedOptions((prev) => [...prev, searchQuery]);
      }

      setSearchQuery(""); // Reset input after submitting
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="space-y-4 border dark:border-neutral-700 rounded-lg p-4 max-w-3xl focus:ring-1 focus:ring-blue-600 focus:outline-none">
      {/* Search Box */}
      {name !== "toolProficiencies" && (
        <>
          <p className="text-xs text-blue-600 dark:text-neutral-400">
            ℹ️ <span className="font-semibold">Note:</span> Please enter the
            option you want if it’s not in the list below.
          </p>
          <input
            type="text"
            placeholder="Search options or type to add..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleCustomInputSubmit}
            className="border border-gray-400 shadow-sm dark:border-neutral-700 placeholder:text-[13px] placeholder:text-neutral-400 text-[13px] dark:text-neutral-200 dark:bg-neutral-900 text-sm text-gray-700 rounded-lg p-1.5 w-full focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />

          <div className="flex justify-between text-xs text-blue-500 cursor-pointer">
            <span
              onClick={() =>
                setSelectedOptions(optionsToDisplay.slice(0, maxSelectionLimit))
              }
            >
              🗸 Select All
            </span>
            <span onClick={() => setSelectedOptions([])}>
              {" "}
              <span className="text-[9px]">❌</span> Clear All
            </span>
          </div>
        </>
      )}

      {/* Selected Options Display */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {name !== "toolProficiencies" &&
            selectedOptions.map((selectedOption) => (
              <div
                key={selectedOption}
                className=" bg-gray-100 px-2 rounded-md text-xs text-gray-800 flex items-center"
              >
                {selectedOption}
                <button
                  type="button"
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => handleDeselect(selectedOption)}
                >
                  &times;
                </button>
              </div>
            ))}
        </div>

        {/* Warning Message */}
        {warning && <p className="text-red-500 text-xs">{warning}</p>}
      </div>

      {/* Render ToolProficiencies if name === "toolProficiencies" */}
      {name === "toolProficiencies" ? (
        <ToolProficiencies
          optionsToDisplay={optionsToDisplay}
          searchQuery={searchQuery}
          selectedOptions={selectedOptions}
          handleCheckboxChange={handleCheckboxChange}
          toggleCategory={toggleCategory}
          expandedCategories={expandedCategories}
        />
      ) : (
        /* Regular Checkbox List */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <p className="text-sm text-gray-700 w-full">
              No results found.<br></br> Press enter to add{" "}
              <span className="font-semibold border bg-gray-100 rounded-lg p-1">
                {searchQuery}
              </span>
              as a new option.
            </p>
          ) : (
            optionsToDisplay &&
            optionsToDisplay
              .filter((option) =>
                option.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .slice(0, visibleCount)
              .map((option, index) => (
                <label
                  key={index}
                  className="flex items-start space-x-3 px-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={option}
                    onChange={(e) =>
                      handleCheckboxChange(option, e.target.checked)
                    }
                    checked={selectedOptions.includes(option)}
                    className="text-blue-500 border-gray-300 min-h-3.5 min-w-3.5 mt-1"
                  />
                  <span className="text-[13px]">{option}</span>
                </label>
              ))
          )}
        </div>
      )}

      {name !== "toolProficiencies" && (
        <div className="border-t">
          <div className="justify-between items-center mt-1">
            {/* Lazy Load More on the left */}
            {visibleCount < optionsToDisplay.length && (
              <button
                className="text-blue-500 text-center mx-auto flex items-center text-sm hover:underline disabled:opacity-50"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    // Simulating API delay
                    setVisibleCount(visibleCount + 20);
                    setLoading(false);
                  }, 1000);
                }}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load more..."}
              </button>
            )}
          </div>

          {/* Custom Input */}
          {/* <label
            htmlFor="custom-option"
            className="block text-sm mt-1  text-gray-800 dark:text-neutral-200"
            style={{ fontSize: "13px" }}
          >
            Custom Option
          </label>

          <input
            id="custom-option"
            type="text"
            value={customInput}
            onChange={handleCustomInputChange}
            onKeyDown={handleCustomInputSubmit}
            placeholder="Type and enter your option"
            className="border border-gray-400 mt-2 shadow-sm w-1/2 dark:border-neutral-700 placeholder:text-[13px] text-[13px] dark:text-neutral-200 dark:bg-neutral-900 text-sm text-gray-700 rounded-lg placeholder:text-neutral-400 p-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div> */}
        </div>
      )}

      {/* Display Custom Input */}
      {customInput && !selectedOptions.includes(customInput) && (
        <div className="mt-2 text-xs text-gray-700">
          Custom input: {customInput}
        </div>
      )}

      {/* Save Button */}
      <div className="w-full flex justify-end mt-2">
        <SaveButton onClick={handleSave} label="Save" />
      </div>
    </div>
  );
};

CheckboxOptions.propTypes = {
  optionsToDisplay: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
};

export default CheckboxOptions;
