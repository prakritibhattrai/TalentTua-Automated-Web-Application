import React, { useRef, useState } from "react";
import { staticData } from "../../data/traitMatrix";
import { Link } from "react-router-dom";

export const MessageList = ({ messages, onSelect }) => (
  <ul className="mt-16 space-y-5">
    {messages &&
      messages.map((message, index) => (
        <MessageItem key={index} message={message} onSelect={onSelect} />
      ))}
  </ul>
);

const MessageItem = ({ message, onSelect }) => {
  const isBot = message.sender === "bot";

  return (
    <li
      className={`max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot ? (
        <BotMessage message={message} onSelect={onSelect} />
      ) : (
        <UserMessage message={message} />
      )}
    </li>
  );
};

const BotMessage = ({ message, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle checkbox selection and deselection
  const handleCheckboxChange = (option, checked) => {
    setSelectedOptions((prevSelected) => {
      const newSelectedOptions = checked
        ? [...prevSelected, option]
        : prevSelected.filter((item) => item !== option);
      return newSelectedOptions;
    });
  };

  // Handle save/confirm button click
  const handleSaveSelection = () => {
    onSelect(selectedOptions); // Send selected options to onSelect function
    setSelectedOptions([]); // Clear selected options after submission
  };

  return (
    <>
      <svg
        className="shrink-0 size-[38px] rounded-full"
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="38" height="38" rx="6" fill="#2563EB"></rect>
        <path
          d="M10 28V18.64C10 13.8683 14.0294 10 19 10C23.9706 10 28 13.8683 28 18.64C28 23.4117 23.9706 27.28 19 27.28H18.25"
          stroke="white"
          strokeWidth="1.5"
        ></path>
        <path
          d="M13 28V18.7552C13 15.5104 15.6863 12.88 19 12.88C22.3137 12.88 25 15.5104 25 18.7552C25 22 22.3137 24.6304 19 24.6304H18.25"
          stroke="white"
          strokeWidth="1.5"
        ></path>
        <ellipse cx="19" cy="18.6554" rx="3.75" ry="3.6" fill="white"></ellipse>
      </svg>
      <div className="space-y-2">
        <p className="text-sm text-gray-800 dark:text-white">
          {message.content || ""}
        </p>
        {message.inputType === "dropdown" && message.options && (
          <div className="flex flex-col items-start">
            <div>
              {message.options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelect(option)}
                  className="mb-2.5 me-1.5 py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-lg border border-blue-600 bg-white text-blue-600 align-middle hover:bg-blue-50 focus:outline-none focus:bg-blue-50 text-sm dark:bg-neutral-900 dark:text-blue-500 dark:border-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400 dark:focus:text-blue-400 dark:focus:border-blue-400"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
        {message.inputType === "checkbox" && message.options && (
          <>
            <ul className="grid w-full gap-4 md:grid-cols-3 lg:grid-cols-4 text-center">
              {message.options.map((option, index) => (
                <li key={index} className="flex justify-center">
                  <input
                    type="checkbox"
                    id={`checkbox-option-${option}`}
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={(e) =>
                      handleCheckboxChange(option, e.target.checked)
                    }
                    className="hidden peer"
                  />
                  <label
                    htmlFor={`checkbox-option-${option}`}
                    className="w-full px-4 py-2 inline-flex justify-center items-center gap-2 rounded-md border border-blue-500 bg-white text-blue-500 hover:bg-blue-50 focus:outline-none focus:ring focus:ring-blue-300 text-sm cursor-pointer dark:hover:text-gray-300 dark:border-gray-600 peer-checked:border-blue-600 peer-checked:bg-blue-100 hover:text-blue-600 dark:peer-checked:bg-gray-700 dark:peer-checked:text-gray-300 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
                  >
                    <p>{option}</p>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-start">
              <button
                onClick={handleSaveSelection}
                className="py-2 px-6 bg-blue-600 text-white rounded-md font-medium shadow hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 text-sm"
              >
                Save
              </button>
            </div>
          </>
        )}

        {message.name === "traitMatrix" && message.options && (
          <ScaleSelection onSelect={onSelect} />
        )}
        {message.name === "reviewAndUpdate" && <EditableSummary />}
        {message.name === "icp" && <ICP />}
      </div>
    </>
  );
};

const ICP = () => {
  return (
    <>
      <div className="">
        <Link to="/icp" state={{ jobTitle: "Software Engineer" }}>
          ICP
        </Link>
      </div>
    </>
  );
};

const UserMessage = ({ message }) => (
  <div className="py-2 sm:py-4 w-full justify-items-end">
    <div className="max-w-2xl flex gap-x-2 sm:gap-x-4">
      <div className="grow space-y-3">
        <div className="space-y-1.5">
          <p className="mb-1.5 mt-2 text-sm text-gray-800 dark:text-white max-w-md">
            {typeof message.content === "object"
              ? JSON.stringify(message.content)
              : message.content || ""}
          </p>
        </div>
      </div>
      <span className="shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
        <span className="text-sm font-medium text-white leading-none">
          {message.senderInitials || "AZ"}
        </span>
      </span>
    </div>
  </div>
);

const ScaleSelection = ({ onSelect }) => {
  const categories = staticData.trait_matrix;
  const [ratings, setRatings] = useState(
    categories.reduce(
      (acc, category) => ({ ...acc, [category.name]: null }),
      {}
    )
  );
  const categoryRefs = useRef(categories.map(() => React.createRef()));

  const handleScaleSelection = (category, scale) => {
    setRatings((prevRatings) => {
      const newRatings = { ...prevRatings, [category]: scale };
      const nextCategoryIndex = categories.findIndex((cat, index) => {
        return (
          newRatings[cat.name] === null && index > categories.indexOf(category)
        );
      });
      if (nextCategoryIndex !== -1 && categoryRefs.current[nextCategoryIndex]) {
        categoryRefs.current[nextCategoryIndex].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return newRatings;
    });
  };

  const handleSave = () => {
    onSelect(ratings);
  };

  return (
    <div className="flex flex-col items-center border border-gray-200 rounded-lg p-4 bg-white shadow-md">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <div
              key={category.name}
              ref={categoryRefs.current[index]}
              className="mb-4"
            >
              <p className="text-gray-900 mb-2 font-normal text-sm">
                {category.name}
              </p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((scale) => (
                  <button
                    key={`${category.name}-${scale}`}
                    onClick={() => handleScaleSelection(category.name, scale)}
                    className={`px-3 py-1 rounded-full border transition-all duration-200 ease-in-out
                      ${
                        ratings[category.name] === scale
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-blue-500 hover:text-white"
                      }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-start">
          <button
            onClick={handleSave}
            className="py-2 px-6 bg-blue-600 text-white rounded-md font-medium shadow hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const EditableSummary = () => {
  const [userData, setUserData] = useState({
    jobTitle: "Software Engineer",
    jobFamily: "IT",
    industry: "Waste management and remediation services",
    seniorityLevel: [
      "Entry level - very limited proficiency, willing to learn",
      "Mid-level - experience with independent contributions",
    ],
    roleDescription:
      "Responsible for developing software applications and maintaining systems. Able to work with different technologies and collaborate with cross-functional teams to deliver high-quality solutions.",
  });

  const [isEditing, setIsEditing] = useState({
    jobTitle: false,
    jobFamily: false,
    industry: false,
    seniorityLevel: false,
    roleDescription: false,
  });

  const [editedData, setEditedData] = useState({ ...userData });

  const [openAccordion, setOpenAccordion] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSeniorityChange = (event) => {
    const { value, checked } = event.target;
    setEditedData((prevData) => {
      const updatedSeniorityLevel = checked
        ? [...prevData.seniorityLevel, value]
        : prevData.seniorityLevel.filter((level) => level !== value);
      return { ...prevData, seniorityLevel: updatedSeniorityLevel };
    });
  };

  const toggleEditing = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAccordionToggle = (field) => {
    setOpenAccordion(openAccordion === field ? null : field); // Toggle open/close for sections
  };

  const handleSaveChanges = () => {
    setUserData(editedData);
    alert("Changes saved!");
    setIsEditing({
      jobTitle: false,
      jobFamily: false,
      industry: false,
      seniorityLevel: false,
      roleDescription: false,
    });
    setOpenAccordion(null); // Close all accordions after save
  };

  return (
    <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm max-w-3xl mx-auto">
      <h2 className="text-medium  text-blue-600 flex items-center mb-6">
        <i className="fas fa-user-circle mr-3"></i> Review and Update
      </h2>

      {/* Accordion Section */}
      <div className="space-y-4 w-96">
        {/* Job Title Accordion */}
        <div>
          <button
            onClick={() => handleAccordionToggle("jobTitle")}
            className="w-full text-left border p-3 rounded-md text-sm bg-blue-50 text-gray-600 flex items-center justify-between"
          >
            Job Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 text-gray-800 transition-transform ${
                openAccordion === "jobTitle" ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openAccordion === "jobTitle" && (
            <div className="border p-4 rounded-md mt-2">
              <input
                type="text"
                name="jobTitle"
                value={editedData.jobTitle}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
              />
              <input
                type="text"
                name="jobFamily"
                value={editedData.jobFamily}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
              />
              <div className="bg-blue-50 p-4 rounded-md mt-2">
                {["Entry level", "Mid-level", "Senior"].map((level) => (
                  <div key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      value={level}
                      checked={editedData.seniorityLevel.includes(level)}
                      onChange={handleSeniorityChange}
                      className="form-checkbox text-blue-600"
                    />
                    <span className="text-sm text-gray-800 ml-2">{level}</span>
                  </div>
                ))}
                <button
                  onClick={() => toggleEditing("seniorityLevel")}
                  className="mt-2 text-blue-600"
                >
                  Save
                </button>
              </div>
              <button
                onClick={() => toggleEditing("jobTitle")}
                className="mt-2 border-blue-600 text-blue-600"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Job Family Accordion */}
        <div>
          <button
            onClick={() => handleAccordionToggle("jobFamily")}
            className="w-full text-left border p-3 rounded-md text-sm  text-blue-600 flex items-center justify-between"
          >
            Skill Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 text-gray-800 transition-transform ${
                openAccordion === "jobFamily" ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openAccordion === "jobFamily" && (
            <div className="bg-blue-50 p-4 rounded-md mt-2">
              <input
                type="text"
                name="jobFamily"
                value={editedData.jobFamily}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
              />
              <button
                onClick={() => toggleEditing("jobFamily")}
                className="mt-2 text-blue-600"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Role Description Accordion */}
        <div>
          <button
            onClick={() => handleAccordionToggle("roleDescription")}
            className="w-full text-left border p-3 rounded-md text-sm  text-blue-600 flex items-center justify-between"
          >
            Role Descriptions
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 text-gray-800 transition-transform ${
                openAccordion === "roleDescription" ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openAccordion === "roleDescription" && (
            <div className="bg-blue-50 p-4 rounded-md mt-2">
              <textarea
                name="roleDescription"
                value={editedData.roleDescription}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                rows="3"
              />
              <button
                onClick={() => toggleEditing("roleDescription")}
                className="mt-2 text-blue-600"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save All Changes */}
      <div className="text-start mt-6">
        <button
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
