import { useState, useEffect } from "react";
import SaveButton from "./Button";
import PropTypes from "prop-types";

const CheckboxOptions = ({ optionsToDisplay, onSelect, selected, name }) => {
  const [selectedOptions, setSelectedOptions] = useState(
    Array.isArray(selected) ? [...selected] : []
  );
  const [customInput, setCustomInput] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (Array.isArray(selected)) {
      setSelectedOptions(selected);
    }
  }, [selected]);

  const maxSelectionLimit = name === "toolProficiencies" ? 15 : 5;

  const handleCheckboxChange = (option, checked) => {
    setWarning(""); // Clear any previous warning

    if (checked && selectedOptions.length >= maxSelectionLimit) {
      setWarning(`You can only select up to ${maxSelectionLimit} items.`);
      return;
    }

    setSelectedOptions((prevSelected) => {
      if (checked) {
        return [...prevSelected, option];
      } else {
        return prevSelected.filter((item) => item !== option);
      }
    });
  };

  const handleCustomInputChange = (e) => {
    setCustomInput(e.target.value);
  };

  const handleSave = () => {
    const optionsToSubmit = [...selectedOptions];
    if (customInput) {
      optionsToSubmit.push(customInput);
    }
    onSelect(optionsToSubmit);
  };

  return (
    <div className="space-y-4 border rounded-lg p-5">
      {/* Options */}
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {optionsToDisplay.map((option, index) => (
          <label
            key={index}
            className={`flex items-start space-x-2 px-2 py-1 text-xs transition-all duration-200 cursor-pointer ${
              selectedOptions.includes(option) ? "" : "bg-white border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              value={option}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              checked={selectedOptions.includes(option)} // Ensure it reflects selected state
              className="text-blue-500 border-gray-300 checkbox min-h-3.5 min-w-3.5 mt-1"
              style={{ width: "12px", height: "12px" }} // Set fixed size here
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}

        {/* Custom Option */}
        {customInput && (
          <label
            className={`flex  space-x-2 px-2 py-1 transition-all text-xs duration-200 cursor-pointer ${
              selectedOptions.includes(customInput)
                ? "bg-blue-100"
                : "bg-white border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              value={customInput}
              onChange={(e) =>
                handleCheckboxChange(customInput, e.target.checked)
              }
              checked={selectedOptions.includes(customInput)} // Ensure it reflects selected state
              className="text-blue-500 h-4 w-4 border-gray-300 focus:ring focus:ring-blue-200"
              // Set fixed size here
            />
            <span className="text-sm text-gray-700">{customInput}</span>
          </label>
        )}

        {/* Checkbox for any selected options that are not in optionsToDisplay */}
        {selectedOptions
          .filter((option) => !optionsToDisplay.includes(option))
          .map((option, index) => (
            <label
              key={index}
              className="grid grid-cols-3 p-4 items-center text-xs space-x-2 gap-2 px-2 py-1 transition-all duration-200 cursor-pointer "
            >
              <input
                type="checkbox"
                value={option}
                onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                checked={true} // Always checked for options not in optionsToDisplay
                className="text-blue-500 border-gray-300 checkbox min-h-3.5 min-w-3.5 mt-1"
                style={{ width: "12px", height: "12px" }} // Set fixed size here
              />
              <span className="text-sm text-gray-800">{option}</span>
            </label>
          ))}
      </div>

      {/* Warning Message */}
      {warning && (
        <p className="text-red-500 text-sm font-semibold">{warning}</p>
      )}

      <div className="w-full flex justify-end">
        <div className="flex items-end h-22">
          <input
            id="customInput"
            type="text"
            value={customInput}
            onChange={handleCustomInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customInput.trim()) {
                if (selectedOptions.length >= maxSelectionLimit) {
                  setWarning(
                    `You can only select up to ${maxSelectionLimit} items.`
                  );
                  return;
                }
                if (!optionsToDisplay.includes(customInput)) {
                  handleCheckboxChange(customInput, true); // Automatically check the custom option
                  optionsToDisplay.push(customInput);
                }
                setCustomInput("");
              }
            }}
            placeholder="Type and Enter"
            className="p-1.5 border border-gray-400 shadow-sm bg-gray-50 rounded-lg w-60 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300"
          />

          <div className="mt-2 ml-3">
            <SaveButton onClick={handleSave} label="Save" />
          </div>
        </div>
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
