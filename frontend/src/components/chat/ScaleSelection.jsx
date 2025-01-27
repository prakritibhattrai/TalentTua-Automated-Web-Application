import React, { useState, useRef } from "react";
import { staticData } from "../../data/traitMatrix";
import SaveButton from "./Button";
import Modal from "./Modal";

export const ScaleSelection = ({ onSelect, rated = {} }) => {
  const competencies = staticData.trait_matrix;
  const [selectedCompetency, setSelectedCompetency] = useState(null);

  // Initialize state with `rated` values or default to `null`.
  const [ratings, setRatings] = useState(
    competencies.reduce(
      (acc, competency) => ({
        ...acc,
        [competency.competency]: competency.traits.reduce(
          (traitsAcc, trait) => ({
            ...traitsAcc,
            [trait.name]: rated[competency.competency]?.[trait.name] || null,
          }),
          {}
        ),
      }),
      {}
    )
  );

  const competencyRefs = useRef(competencies.map(() => React.createRef()));

  const handleScaleSelection = (competency, trait, scale) => {
    setRatings((prevRatings) => {
      const newRatings = {
        ...prevRatings,
        [competency]: {
          ...prevRatings[competency],
          [trait]: scale,
        },
      };

      // Find the next unselected trait and scroll into view.
      const nextCompetencyIndex = competencies.findIndex(
        (comp, index) =>
          Object.values(newRatings[comp.competency]).includes(null) &&
          index >
            competencies.findIndex((comp) => comp.competency === competency)
      );

      if (
        nextCompetencyIndex !== -1 &&
        competencyRefs.current[nextCompetencyIndex]
      ) {
        competencyRefs.current[nextCompetencyIndex].current.scrollIntoView({
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

  const handleMoreInfoClick = (competency) => {
    console.log(competency);
    setSelectedCompetency(competency); // Set the selected competency to show in the modal
  };

  const handleCloseModal = () => {
    setSelectedCompetency(null); // Close the modal by setting selectedCompetency to null
  };

  return (
    <div className="flex flex-col max-h-screen overflow-y-scroll items-center p-4 rounded-lg border bg-white border-gray-200 w-full mx-auto">
      <div className="w-full mb-4 text-xs text-gray-600">
        <p className="mb-1">
          <strong>Information :</strong> Select a competency and rate each trait
          on a scale of 1 to 4 based on your preferences. Click the{" "}
          <span className="text-blue-600 underline">info icon</span> for more
          details about each competency.
        </p>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-2 gap-1">
          {competencies.map((competency, index) => (
            <div
              key={competency.competency}
              ref={competencyRefs.current[index]}
              className="p-3 border rounded-md shadow-sm bg-gray-50"
            >
              {/* Display competency name */}
              <h3 className="text-gray-800 text-sm font-medium mb-2 flex justify-between items-center border-b border-gray-300 pb-1">
                {competency.competency}
                <button
                  onClick={() => handleMoreInfoClick(competency)}
                  className="text-blue-600 text-xs underline flex items-center"
                >
                  <svg
                    className="w-[16px] h-[16px] text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </h3>

              {/* Display traits */}
              {competency.traits.map((trait) => (
                <div key={trait.name} className="mb-2">
                  <p className="text-gray-800 text-xs mb-1">
                    {trait.name}:{" "}
                    <span className="text-gray-600">
                      {trait.shortDescription}
                    </span>
                  </p>

                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((scale) => (
                      <button
                        key={scale}
                        onClick={() =>
                          handleScaleSelection(
                            competency.competency,
                            trait.name,
                            scale
                          )
                        }
                        className={`w-5 h-5 rounded text-xs border transition-all duration-200 ease-in-out ${
                          ratings[competency.competency][trait.name] === scale
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Modal for showing detailed information */}
        {selectedCompetency && (
          <Modal
            isOpen={true}
            onClose={handleCloseModal}
            title={`Details about ${selectedCompetency.competency}`}
            data={selectedCompetency}
          />
        )}

        <div className="mt-4 flex justify-end">
          <SaveButton onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};
