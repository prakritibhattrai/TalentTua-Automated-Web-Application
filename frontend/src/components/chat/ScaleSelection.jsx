import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { staticData } from "../../data/traitMatrix";
import SaveButton from "./Button";
import Modal from "./Modal";

const ScaleSelection = ({ onSelect, rated = {} }) => {
  const competencies = staticData.trait_matrix;
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [error, setError] = useState(null);

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

      // Clear error message if competency becomes fully rated
      const isComplete = Object.values(newRatings[competency]).every(
        (rating) => rating !== null
      );
      if (isComplete && error?.competency === competency) {
        setError(null);
      }

      // Scroll to the next trait/competency
      const competencyIndex = competencies.findIndex(
        (comp) => comp.competency === competency
      );
      const traitIndex = competencies[competencyIndex].traits.findIndex(
        (t) => t.name === trait
      );

      // Check if we're at the last trait in the current competency
      if (traitIndex === competencies[competencyIndex].traits.length - 1) {
        // Move to the next competency if we're at the last trait
        if (competencyIndex < competencies.length - 1) {
          competencyRefs.current[competencyIndex + 1].current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      } else {
        // Scroll to the next trait within the same competency
        competencyRefs.current[competencyIndex].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return newRatings;
    });
  };

  const handleSave = () => {
    const incompleteCompetency = competencies.find((competency) =>
      Object.values(ratings[competency.competency]).some(
        (rating) =>
          rating === null ||
          typeof rating !== "number" ||
          rating < 1 ||
          rating > 4
      )
    );

    if (incompleteCompetency) {
      const index = competencies.findIndex(
        (comp) => comp.competency === incompleteCompetency.competency
      );

      if (competencyRefs.current[index]) {
        competencyRefs.current[index].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      setError({
        competency: incompleteCompetency.competency,
        message: `Please rate all traits under the competency "${incompleteCompetency.competency}" with values between 1 and 4 before saving.`,
      });

      return;
    }

    onSelect(ratings);
  };

  const handleMoreInfoClick = (competency) => {
    setSelectedCompetency(competency); // Set the selected competency to show in the modal
  };

  const handleCloseModal = () => {
    setSelectedCompetency(null); // Close the modal by setting selectedCompetency to null
  };

  return (
    <div className="flex flex-col max-h-screen items-center p-4 rounded-lg border bg-white border-gray-200 w-full mx-auto">
      <div className="w-full mb-4 text-sm text-blue-600">
        <p className="mb-1">
          Note: The info icon{" "}
          <svg
            className="inline w-4 h-4 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z"
              clipRule="evenodd"
            />
          </svg>{" "}
          provides additional information about each competency.
        </p>
      </div>

      {/* Scrollable list container */}
      <div className="w-full overflow-y-scroll flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {competencies.map((competency, index) => (
            <div
              key={competency.competency}
              ref={competencyRefs.current[index]}
              className="p-3 border rounded-md shadow-sm bg-gray-50"
            >
              <h3 className="text-gray-900 text-sm mb-2 flex justify-between items-center border-b border-gray-200 pb-1">
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

              {competency.traits.map((trait) => (
                <div key={trait.name} className="mb-4">
                  <p className="text-gray-900 text-xs mb-1">
                    <span className="text-sm text-gray-900">
                      {trait.name} :{" "}
                    </span>{" "}
                    <span className="text-gray-800 text-sm">
                      {trait.description}
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
                        className={`w-5 h-5 rounded text-xs mt-2 border transition-all duration-200 ease-in-out ${
                          ratings[competency.competency][trait.name] === scale
                            ? "bg-blue-600 text-white border-blue-500"
                            : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {error?.competency === competency.competency && (
                <p className="text-red-500 text-xs mt-2">{error.message}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal (if selected competency) */}
      {selectedCompetency && (
        <Modal
          isOpen={true}
          onClose={handleCloseModal}
          title={`Details about ${selectedCompetency.competency}`}
          data={selectedCompetency}
        />
      )}

      {/* Save Button outside the scrollable container */}
      <div className="mt-4 w-full flex justify-end">
        <SaveButton onClick={handleSave} />
      </div>
    </div>
  );
};
ScaleSelection.propTypes = {
  onSelect: PropTypes.string.isRequired,
  rated: PropTypes.func,
};

export default ScaleSelection;
