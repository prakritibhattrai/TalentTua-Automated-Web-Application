import axios from "axios";
import { useState, useEffect, useRef } from "react";
import SaveButton from "./Button";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AutoCompleteInput = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedOccupation, setSelectedOccupation] = useState(null); // Object containing title and ID
  const [jobTitles, setJobTitles] = useState([]); // Job titles for selected occupation
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const cache = useRef({});

  // Fetch suggestions for occupations on searchTerm change and on component load
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      if (cache.current[searchTerm]) {
        setSuggestions(cache.current[searchTerm]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/occupations`);
        if (response.data && response.data.jobTitles.length < 0) {
          setError(
            "Cannot find the job titles. Please enter your preferred job title below manually."
          );
        }
        // Sort and filter the response
        const sortedSuggestions = response.data.jobTitles.sort((a, b) => {
          const startsWithA = a.title
            .toLowerCase()
            .startsWith(searchTerm.toLowerCase());
          const startsWithB = b.title
            .toLowerCase()
            .startsWith(searchTerm.toLowerCase());

          // Prioritize titles that start with searchTerm
          if (startsWithA && !startsWithB) return -1;
          if (!startsWithA && startsWithB) return 1;

          // If both start with the search term or neither, sort alphabetically
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });

        cache.current[searchTerm] = sortedSuggestions;
        setSuggestions(sortedSuggestions);
      } catch (err) {
        setError(
          "No occupations found. Please enter your preferred job title below manually."
        );
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = debounce(fetchSuggestions, 500);

    debounceFetch();
  }, [searchTerm]);

  // Fetch job titles based on selected occupation
  useEffect(() => {
    const fetchJobTitles = async () => {
      if (!selectedOccupation) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/occupations/jobTitles/${selectedOccupation.id}`
        );
        if (response.data && response.data.jobTitles.length > 0) {
          setJobTitles(response.data.jobTitles);
        } else {
          setJobTitles([]);
          setError(
            "No job titles found. Please enter your preferred job title below."
          );
        }

        setJobTitles(response.data.jobTitles);
      } catch (err) {
        setError(
          "No job titles found. Please enter your preferred job title below."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobTitles();
  }, [selectedOccupation]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    setHighlightedIndex(-1);
    setSelectedOccupation(null);
    setJobTitles([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    setSelectedOccupation(suggestion); // Store occupation object
    setSuggestions([]);
  };

  const handleJobTitleChange = (event) => {
    setSelectedJobTitle(event.target.value);
  };

  const handleSave = () => {
    // Validation
    if (
      (!selectedOccupation && !selectedJobTitle) ||
      selectedJobTitle.length >= 255 ||
      selectedOccupation?.title?.length >= 255
    ) {
      setError(
        "Please select an occupation or enter a valid job title (less than 255 characters)."
      );
      return;
    }

    onSelect({
      occupation: selectedOccupation,
      jobTitle: jobTitle,
      selectedJobTitle: selectedJobTitle,
    });
  };

  return (
    <div className="space-y-6 flex flex-col border dark:border-neutral-700 shadow-sm rounded-lg p-4 w-full text-gray-900 bg-white dark:bg-neutral-900 sm:min-w-96">
      <div className="space-y-4 w-full">
        {/* Occupation Search Section */}
        <div className="w-full">
          {error && <p className="text-red-500 mt-2 text-xs sm:xs">{error}</p>}
          <label
            htmlFor="occupation-input"
            className="block mb-2 text-[12px] text-gray-800 dark:text-neutral-200 sm:text-base"
          >
            Not seeing the occupation you are looking?
            <br></br> Fill in the preferred job title field below with the title
            you are looking to hire for
          </label>
          <div className="relative">
            <input
              id="occupation-input"
              type="text"
              className="border border-gray-400 shadow-sm dark:border-neutral-700 placeholder:text-[13px] text-[13px] dark:text-neutral-200 dark:bg-neutral-900 text-sm text-gray-700 rounded-lg p-1 pl-8 w-full focus:ring-1 focus:ring-blue-600 focus:outline-none"
              placeholder="Type, search and select occupation ..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  setHighlightedIndex((prev) =>
                    Math.min(prev + 1, suggestions.length - 1)
                  );
                } else if (event.key === "ArrowUp") {
                  setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                } else if (event.key === "Enter" && highlightedIndex >= 0) {
                  const selectedSuggestion = suggestions[highlightedIndex];
                  handleSuggestionClick(selectedSuggestion);
                } else if (event.key === "Escape") {
                  setSuggestions([]);
                }
              }}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="w-2.5 h-2.5 text-gray-500 dark:text-neutral-400 sm:w-3 sm:h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            {loading && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                <div className="spinner border-2 border-blue-600 border-t-transparent rounded-full w-5 h-5 animate-spin"></div>
              </div>
            )}
          </div>

          {!loading && suggestions.length === 0 && searchTerm.trim() && (
            <p className="text-red-500 mt-2 text-xs sm:text-xs">
              No results found.
            </p>
          )}
          {!selectedOccupation && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`border border-gray-400 shadow-sm dark:border-neutral-700 text-[13px] dark:text-neutral-200 dark:bg-neutral-900 
                text-sm text-gray-700 rounded-lg p-1 w-full focus:ring-1 focus:ring-blue-600 focus:outline-none 
                ${
                  suggestions.length > 0
                    ? "max-h-36 overflow-scroll"
                    : "overflow-hidden max-h-0"
                }`}
            >
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-4 py-2 cursor-pointer  hover:bg-gray-100 dark:hover:bg-neutral-800 dark:hover:border-blue-500 ${
                    index === highlightedIndex
                      ? "bg-blue-100 dark:bg-neutral-900 dark:text-blue-500 text-blue-500"
                      : ""
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                >
                  {suggestion.title}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>
      {/* Job Title Section */}
      {selectedOccupation && (
        <div className="space-y-2 rounded-lg w-full text-gray-800 dark:border-neutral-700 dark:bg-neutral-900 transition-opacity duration-300 ease-in-out">
          <label
            htmlFor="job-title"
            className="block text-sm text-gray-800 dark:text-neutral-200 sm:text-base"
          >
            Select Job Title for {selectedOccupation?.title || ""}
          </label>
          <select
            id="job-title"
            className="border border-gray-400 shadow-sm dark:border-neutral-700 placeholder:text-[13px] text-[13px] dark:text-neutral-200 dark:bg-neutral-900 text-sm text-gray-700 rounded-lg p-1.5 w-full focus:ring-1 focus:ring-blue-600 focus:outline-none"
            value={selectedJobTitle}
            onChange={handleJobTitleChange}
          >
            <option value="">Select a job title</option>
            {jobTitles &&
              jobTitles.map((jobTitle) => (
                <option key={jobTitle?.id} value={jobTitle?.title}>
                  {jobTitle.title}
                </option>
              ))}
          </select>
        </div>
      )}
      <span className="text-sm text-center p-0 m-0 dark:text-white">Or</span>

      <div className=" w-full flex-grow">
        <label
          htmlFor="custom-job-title"
          className="block mb-1 text-sm text-gray-700 dark:text-neutral-200 sm:text-base"
        >
          Your preferred job title:
        </label>
        <div className="relative">
          <input
            id="custom-job-title"
            type="text"
            className="border border-gray-400 text-[13px] shadow-sm dark:border-neutral-700 placeholder:text[13px] dark:text-neutral-200 dark:bg-neutral-900 text-gray-700 rounded-lg p-1 pl-3 w-full focus:ring-1 focus:ring-blue-600 focus:outline-none"
            placeholder="Preferred job title ..."
            value={jobTitle}
            onChange={(event) => {
              handleJobTitleChange(event);
              setJobTitle(event.target.value);
            }}
          />
          {loading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="spinner border-2 border-blue-600 border-t-transparent rounded-full w-5 h-5 animate-spin"></div>
            </div>
          )}
        </div>
      </div>
      <div className=" w-full flex justify-end">
        <SaveButton onClick={handleSave} />
      </div>
    </div>
  );
};

// Debounce utility
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
AutoCompleteInput.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default AutoCompleteInput;
