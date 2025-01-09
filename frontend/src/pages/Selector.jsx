import React from "react";

const Selector = ({ label, options, onSelect, selectedValue }) => {
  return (
    <div className="selector-container">
      <label className="text-lg font-semibold">{label}</label>
      <select
        value={selectedValue}
        onChange={(e) => onSelect(e.target.value)}
        className="mt-2 p-2 border rounded-md w-full"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
