import { useState } from "react";
import SaveButton from "./Button";

export const EditableSummary = ({ onSubmit, userData }) => {
  const [editedData, setEditedData] = useState({ ...userData });
  // Save changes
  const handleSaveChanges = () => {
    onSubmit(editedData);
  };

  return (
    <div className="border border-gray-300 shadow-sm p-4 rounded-lg">
      <ul className="text-sm text-gray-800 pl-5">
        {Object.entries(editedData).map(
          ([key, value]) =>
            key !== "traitMatrix" && (
              <li key={key} className="mb-2 ">
                <span className="font-semibold text-gray-800">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>{" "}
                {key === "jobTitle" && value ? (
                  <span>
                    {value.jobTitle} - {value.occupation.title}
                  </span>
                ) : Array.isArray(value) ? (
                  value.length > 0 ? (
                    value.join(", ")
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
