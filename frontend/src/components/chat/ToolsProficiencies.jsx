import { useState } from "react";
import PropTypes from "prop-types";

const ToolProficiencies = ({
  optionsToDisplay,
  searchQuery,
  selectedOptions,
  handleCheckboxChange,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [expanded, setExpanded] = useState(false); // Expand or collapse dropdown
  const [showMore, setShowMore] = useState({}); // Track "Load More" for each category

  // Handle search input change
  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
    if (e.target.value.length > 0) setExpanded(true);
  };

  // Handle enter key press for adding custom options
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && localSearchQuery.trim() !== "") {
      if (!selectedOptions.includes(localSearchQuery)) {
        handleCheckboxChange(localSearchQuery, true); // Add to selected options
      }
      setLocalSearchQuery(""); // Clear search input after adding
    }
  };

  // Remove selected technology
  const handleRemoveSelected = (option) => {
    handleCheckboxChange(option, false); // Remove from selected options
  };

  const toggleExpand = () => setExpanded(!expanded);

  const toggleShowMore = (categoryName) => {
    setShowMore((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const filterTechnologies = (techs) =>
    techs.filter((tech) =>
      tech.toLowerCase().includes(localSearchQuery.toLowerCase())
    );

  const {
    technologies = [],
    tools = [],
    allTechnologies = {},
  } = optionsToDisplay || {};
  const {
    hot_technologies = [],
    in_demand_technologies = [],
    both_hot_and_in_demand = [],
  } = allTechnologies;

  // Remove duplicates
  const filteredHotTechs = hot_technologies.filter(
    (tech) => !both_hot_and_in_demand.includes(tech)
  );
  const filteredInDemandTechs = in_demand_technologies.filter(
    (tech) => !both_hot_and_in_demand.includes(tech)
  );

  const allCategories = [
    { name: "🔥📈 Both Hot & In-Demand", data: both_hot_and_in_demand },
    { name: "🔥 Hot Technologies", data: filteredHotTechs },
    { name: "📈 In-Demand Technologies", data: filteredInDemandTechs },
    ...technologies.map((category) => ({
      name: category.title.name,
      data: category.example.map((ex) => ex.name),
      id: category.title.id,
    })),
    ...tools.map((category) => ({
      name: category.title.name,
      data: category.example.map((ex) => ex.name),
      id: category.title.id,
    })),
  ];

  // Filter categories based on search
  const filteredCategories = allCategories
    .map((cat) => ({
      ...cat,
      data: filterTechnologies(cat.data),
    }))
    .filter((cat) => cat.data.length > 0);

  return (
    <div className="relative space-y-4">
      {/* Search Bar */}
      <input
        type="text"
        value={localSearchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder="Search technologies or type to add..."
        className="border border-gray-400 shadow-sm dark:border-neutral-700 placeholder:text-[13px] placeholder:text-neutral-400 text-[13px] dark:text-neutral-200 dark:bg-neutral-900 text-sm text-gray-700 rounded-lg p-1.5 w-full focus:ring-1 focus:ring-blue-600 focus:outline-none"
      />
      {/* Show Selected Options on Top */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedOptions.map((option) => (
          <div
            key={option}
            className=" bg-gray-100 px-2 rounded-md text-xs text-gray-800 flex items-center"
          >
            <span>{option}</span>
            <button
              onClick={() => handleRemoveSelected(option)}
              className="text-xs text-blue-500"
            >
              &times; {/* "X" to remove */}
            </button>
          </div>
        ))}
      </div>
      {/* Dropdown Button */}
      <button
        onClick={toggleExpand}
        className="w-full text-left text-xs text-blue-500 underline"
      >
        {expanded ? "Hide Technologies" : "Show Technologies"}
      </button>

      {/* Display Filtered Items */}
      {
        <div
          style={{ width: "600px" }}
          className=" grid grid-cols-2 bg-white dark:bg-gray-900 w-96  rounded-lg  max-h-56 overflow-y-auto"
        >
          {filteredCategories.length === 0 ? (
            <p className="text-sm text-gray-700 w-full">
              No results found.<br></br> Press enter to add{" "}
              <span className="font-semibold border bg-gray-100 rounded-lg p-1">
                {localSearchQuery || ""}
              </span>{" "}
              as a new option.{" "}
            </p>
          ) : (
            filteredCategories.map(({ name, data, id }) => {
              const showMoreItems = showMore[name]; // Use the category name as key
              const displayItems = showMoreItems ? data : data.slice(0, 5);

              return (
                <div key={id || name} className="mb-3 mt-1">
                  <p className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    {name}
                  </p>
                  {displayItems.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer mb-2"
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
                  ))}
                  {data.length > 5 && (
                    <button
                      onClick={() => toggleShowMore(name)} // Pass name to toggle
                      className="text-blue-500 text-xs mt-1"
                    >
                      {showMoreItems ? "Show Less" : "Load More"}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      }
    </div>
  );
};

ToolProficiencies.propTypes = {
  optionsToDisplay: PropTypes.object.isRequired,
  searchQuery: PropTypes.string.isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default ToolProficiencies;
