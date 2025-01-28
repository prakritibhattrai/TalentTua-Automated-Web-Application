import { useState } from "react";
import SaveButton from "./Button";
import PropTypes from "prop-types";

const EditableSummary = ({ onSubmit, userData }) => {
  const [editedData, setEditedData] = useState({ ...userData });
  // Save changes
  const handleSaveChanges = () => {
    onSubmit(editedData);
  };

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="border border-gray-200 p-4 rounded-lg">
      <ul className="text-sm text-gray-800 pl-5">
        {Object.entries(editedData).map(
          ([key, value]) =>
            key !== "traitMatrix" &&
            key !== "welcome" && (
              <li key={key} className="mb-2 text-gray-700 text-sm leading-snug">
                <span className="text-sm text-black">{formatKey(key)}:</span>{" "}
                {key === "jobTitle" && value ? (
                  <span>{value.jobTitle || value.occupation.title}</span>
                ) : Array.isArray(value) ? (
                  value.length > 0 ? (
                    <>{value.join(", ")}</>
                  ) : (
                    <span>No data available</span>
                  )
                ) : typeof value === "object" && value !== null ? (
                  <span>{JSON.stringify(value, null, 2)}</span>
                ) : value === null || value === undefined ? (
                  <span>No data available</span>
                ) : (
                  <span>{value}</span>
                )}
              </li>
            )
        )}
      </ul>
      <div className="mt-4 flex justify-end">
        <SaveButton onClick={handleSaveChanges} label="Generate ICP" />
      </div>
    </div>
  );
};

EditableSummary.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
};

export default EditableSummary;
