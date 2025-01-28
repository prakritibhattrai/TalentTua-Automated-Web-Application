import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ICP = ({ icpData }) => {
  console.log("ICP", icpData);
  return (
    <>
      <div className=" mt-4">
        <Link
          to="/icp"
          state={icpData}
          className="text-sm text-blue-600 transition-colors"
        >
          View ICP Details
        </Link>
      </div>
    </>
  );
};

ICP.propTypes = {
  icpData: PropTypes.object.isRequired,
};

export default ICP;
