import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ICP = ({ icpData }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/icp", { state: icpData });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleNavigate}
        className="text-sm xs:text-sm text-blue-600 transition-colors"
      >
        View ICP Details
      </button>
    </div>
  );
};

ICP.propTypes = {
  icpData: PropTypes.object.isRequired,
};

export default ICP;
