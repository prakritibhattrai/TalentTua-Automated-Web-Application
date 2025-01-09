import React from "react";

const StakeholderSelector = ({
  options,
  selectedOptions,
  onCheckboxChange,
  onConfirm,
}) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-medium">
        Select Stakeholder Engagement Levels
      </h3>
      {options.map((option) => (
        <div key={option} className="flex items-center mt-2">
          <input
            type="checkbox"
            id={option}
            value={option}
            checked={selectedOptions.includes(option)}
            onChange={() => onCheckboxChange(option)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor={option} className="ml-2 text-gray-700">
            {option}
          </label>
        </div>
      ))}
      <button
        onClick={onConfirm}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Confirm
      </button>
    </div>
  );
};

export default StakeholderSelector;
