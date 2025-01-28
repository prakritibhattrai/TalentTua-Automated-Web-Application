import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SaveButton = ({ onClick, label = "Save", className = "", icon }) => {
  return (
    <div className="flex items-center justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`bg-gray-600 text-white text-sm px-3 py-2 rounded-lg flex items-center ${className}`}
        aria-label="Save Data"
        role="button"
      >
        {icon ? (
          <img src={icon} alt="icon" className="w-3 h-3 me-2" />
        ) : (
          <svg
            className="w-[16px] h-[16px] text-white mr-1 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 3v4a1 1 0 0 1-1 1H5m4 6 2 2 4-4m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
            />
          </svg>
        )}
        <span className="text-sm">{label}</span>
      </motion.button>
    </div>
  );
};
SaveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string,
};
export default SaveButton;
