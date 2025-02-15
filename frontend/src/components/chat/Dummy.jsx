import React, { useState, useRef, useEffect, useCallback } from "react";

const MultiSelect = ({ options, label }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
    setSearchQuery(""); // Reset search when opening
  }, []);

  // Handle selection
  const handleItemSelect = useCallback((option) => {
    setSelectedItems((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  }, []);

  // Handle removing selected item
  const handleRemoveItem = useCallback((itemToRemove) => {
    setSelectedItems((prev) => prev.filter((item) => item !== itemToRemove));
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="w-72 border border-gray-300 p-2 rounded relative"
      ref={dropdownRef}
    >
      <label
        htmlFor="multi-select"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div
        className="border border-gray-300 p-2 rounded flex flex-wrap cursor-pointer"
        onClick={toggleDropdown}
      >
        {selectedItems.map((item) => (
          <div
            key={item}
            className="bg-gray-200 px-2 py-1 rounded-md mr-2 mb-1 flex items-center"
          >
            {item}
            <button
              type="button"
              className="ml-1 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveItem(item);
              }}
            >
              &times;
            </button>
          </div>
        ))}
        {selectedItems.length === 0 && (
          <span className="text-gray-500">Select options</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border-b border-gray-300 focus:outline-none"
          />

          {/* Filtered Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <label
                key={option}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedItems.includes(option)}
                  onChange={() => handleItemSelect(option)}
                />
                {option}
              </label>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Usage Example
const App1 = () => {
  const options = [
    "Family",
    "Family in law",
    "Co-workers",
    "Friends",
    "Basketball Club",
    "Startup Investor Colleagues",
    "Swiss Embassy",
    "Zurich Meetup Group",
  ];

  return (
    <div className="p-4">
      <MultiSelect options={options} label="Category" />
    </div>
  );
};

export default App1;
