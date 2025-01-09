import { useState, useRef } from "react";

function TraitMatrix({ traits, onRatingChange }) {
  const [selectedRatings, setSelectedRatings] = useState({});
  const traitRefs = useRef([]);

  const handleRatingClick = (traitId, rating, index) => {
    setSelectedRatings((prevRatings) => ({
      ...prevRatings,
      [traitId]: rating,
    }));
    onRatingChange(traitId, rating);

    // Scroll to the next trait
    const nextTrait = traitRefs.current[index + 1];
    if (nextTrait) {
      nextTrait.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Rate the traits for the role (1 to 4)
      </h3>

      <ul className="grid grid-cols-2 gap-4 text-start">
        {traits &&
          traits.map((trait, index) => (
            <li
              key={trait.id}
              ref={(el) => (traitRefs.current[index] = el)}
              className="flex flex-col w-full items-center p-3 bg-white border text-gray-800 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
            >
              {/* Trait Name */}
              <div className="text-sm font-medium mb-2">{trait.name}</div>

              {/* Rating Buttons */}
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingClick(trait.id, rating, index)}
                    className={`${
                      selectedRatings[trait.id] === rating
                        ? "bg-blue-600 text-white dark:border-blue-600 dark:text-blue-600 dark:bg-black"
                        : "text-blue-600 border border-blue-600 dark:border-blue-600 dark:text-blue-600 dark:bg-black hover:bg-blue-500 hover:text-white"
                    } text-sm py-2 px-4 rounded-md transition duration-300 ease-in-out`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default TraitMatrix;
