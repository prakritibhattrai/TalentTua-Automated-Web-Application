import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null; // Don't render modal if it's not open
  console.log("COM", data);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-80">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="text-sm text-gray-700">
          {data &&
            data.traits.map((trait) => (
              <div key={trait.name} className="mb-3">
                <p className="text-gray-800 text-sm mb-1">{trait.name}</p>
                <p className="text-gray-600 text-xs mb-2">
                  {trait.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({
    traits: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default Modal;
