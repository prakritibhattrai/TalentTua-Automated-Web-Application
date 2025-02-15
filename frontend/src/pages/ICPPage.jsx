import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// Main page component
const ICPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [recruiter, setRecruiter] = useState(null);
  const [onet, setOnet] = useState(null);

  useEffect(() => {
    if (location.state?.recruiter && location.state?.onet) {
      setRecruiter(location.state?.recruiter);
      setOnet(location.state?.onet);
    } else {
      navigate(-1); // Go back if no data is provided
    }
  }, [location.state, navigate]);

  if (!recruiter || !onet) {
    return (
      <div className="text-center text-red-600 text-sm">
        Invalid data provided
      </div>
    );
  }

  const {
    niceToHave = {},
    educationExpertise = {},
    keyProficiencies = {},
  } = onet;
  const { knowledge = [], job_zone = {}, education = {} } = educationExpertise;
  const { technicalSkills = {} } = keyProficiencies;

  const toolsAndTechnologies = technicalSkills.tools_and_technology || [];
  const requiredTools = recruiter?.toolProficiencies || [];

  const toolProficiencies = toolsAndTechnologies.filter(
    (tool) => !requiredTools.includes(tool)
  );
  const desirable = recruiter?.desirableSoftSkills || [];
  const undesirable = recruiter?.undesirableTraits || [];
  const suggestedNiceToHave = niceToHave;
  console.log(suggestedNiceToHave);
  return (
    <motion.div
      className="relative max-w-6xl m-auto lg:ps-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="p-4 sm:p-6 lg:py-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 mb-4 text-sm"
        >
          Go Back to Chat
        </button>
        <Header recruiter={recruiter} />
        {/* Place the subscribe form right after the header */}
        <div className="my-10 sm:my-14 flex justify-between border rounded-lg p-6 bg-gradient-to-r from-blue-50 via-indigo-200 to-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div>
            <p className="text-base font-semibold text-gray-800 dark:text-neutral-200 ">
              Log in and start your experience today. Discover and hire top
              talent with ease!
            </p>
          </div>

          <div className="flex items-center">
            <p className="text-sm font-semibold underline text-blue-600 dark:text-blue-400 cursor-pointer hover:underline transition-colors duration-200">
              Log in to proceed
            </p>
          </div>
        </div>

        <ExecutiveSummary recruiter={recruiter} />

        <SoftSkills
          suggestedNiceToHave={suggestedNiceToHave}
          desirable={desirable}
          undesirable={undesirable}
        />
        <EducationSection
          job_zone={job_zone}
          education={education}
          knowledge={knowledge}
        />
        <ToolsAndTechnologies
          technicalSkills={technicalSkills}
          requiredTools={requiredTools}
        />
        <EndParagraph recruiter={recruiter} />
      </div>
    </motion.div>
  );
};
function SoftSkills({ suggestedNiceToHave, desirable, undesirable }) {
  // Flatten the niceToHave data from different sections into one array
  const allNiceToHave = [
    ...(suggestedNiceToHave?.work_styles || []),
    ...(suggestedNiceToHave?.work_values || []),
    ...(suggestedNiceToHave?.skills || []),
  ];

  // Remove items that are already in desirable
  const remainingNiceToHave = allNiceToHave.filter(
    (trait) => !desirable.includes(trait)
  );

  // Function to get random items (ensuring no duplicates)
  const getRandomTraits = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Get the first `count` elements
  };

  // Get 6 random traits that are not in desirable
  const randomSuggestedTraits = getRandomTraits(remainingNiceToHave, 6);

  return (
    <div className="border border-gray-200 p-4 rounded-lg text-sm">
      <h2 className="font-semibold text-gray-800 mb-3">Soft Skills</h2>

      {/* Must-Have Traits */}
      {desirable && desirable.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-800">🔹 Must-Have:</h3>
          <p className="text-gray-700">{desirable.join(", ")}</p>
        </div>
      )}
      {/* Must Not Have Traits */}
      {undesirable && undesirable.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-800">
            🔹 Must Not Have:
          </h3>
          <p className="text-gray-700">{undesirable.join(", ")}</p>
        </div>
      )}
      {/* Suggested Traits (Random 6) */}
      {randomSuggestedTraits.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            🔹 Suggested Must Have:
          </h3>
          <p className="text-gray-700">{randomSuggestedTraits.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

// Executive Summary
function ExecutiveSummary({ recruiter }) {
  return (
    <div className="border border-gray-200 text-sm  p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-2">Executive Summary</h3>
      <p className="text-gray-700">
        This profile outlines the ideal candidate for a {recruiter.jobTitle}{" "}
        position, belonging to {recruiter.jobFamily} and {recruiter.industry}.
      </p>
    </div>
  );
}

// End Paragraph
function EndParagraph({ recruiter }) {
  return (
    <div className="border border-gray-200  p-4 rounded-lg ">
      <p className="text-gray-800 text-sm">
        This profile serves as a guide to educate you on the total skills,
        knowledge, abilities, and attitudes required for the role of{" "}
        {recruiter.jobTitle}. This is not meant to be all inclusive of the many
        nuanced requirements and responsibilities associated with this role.
        Rather, it is intended to serve as a reference for completing a
        skills-based hiring process along with using a framework that
        mathematically determines the likelihood of required attributes listed
        here. Contact us at{" "}
        <Link className="text-blue-600 hover:underline">
          hello@talenttua.com
        </Link>{" "}
        for more information
      </p>
    </div>
  );
}

const ToolsAndTechnologies = ({ technicalSkills, requiredTools }) => {
  if (!technicalSkills) return null;

  const {
    technologies = [],
    tools = [],
    allTechnologies = {},
  } = technicalSkills;

  // Convert requiredTools into a Set for quick lookup
  const requiredToolsSet = new Set(
    requiredTools.map((tool) => tool.toLowerCase())
  );

  // Filter out duplicates from hot technologies & tools
  const hotTechnologies = allTechnologies.both_hot_and_in_demand
    ?.filter((tech) => !requiredToolsSet.has(tech.toLowerCase()))
    .join(", ");

  const technologyCategories = technologies
    .map((tech) => tech.title.name)
    .join(", ");

  const filteredTools = tools
    .map((tool) => tool.title.name)
    .filter((tool) => !requiredToolsSet.has(tool.toLowerCase()))
    .join(", ");

  const requiredToolsFiltered = requiredTools.join(", ");

  return (
    <div className="border border-gray-200 p-4 rounded-lg text-sm">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">
        Tools & Technologies
      </h2>

      {requiredToolsFiltered && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-800">🔹 Must Have:</h3>
          <p className="text-gray-800">{requiredToolsFiltered}</p>
        </div>
      )}

      {hotTechnologies && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Suggested:</h3>
          <h3 className="text-sm font-semibold text-gray-800 mt-2">
            🔹 In Demand & Hot:
          </h3>
          <p className="text-gray-800">{hotTechnologies}</p>
        </div>
      )}

      {technologyCategories && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            🔹 Technology Categories:
          </h3>
          <p className="text-gray-800">{technologyCategories}</p>
        </div>
      )}

      {filteredTools && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800">🔹 Tools:</h3>
          <p className="text-gray-800">{filteredTools}</p>
        </div>
      )}
    </div>
  );
};

// Education section to display education requirements and expertise
function EducationSection({ job_zone, education, knowledge }) {
  return (
    <div className="border border-gray-200  p-4 text-sm rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-3">
        Education & Expertise
      </h3>

      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-800">
          🔹Education Level:
        </h4>
        <p className="text-gray-800">
          {job_zone?.education || "Not Specified"}
        </p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-800">
          Suggested Knowledge:
        </h4>
        <p className="text-gray-700">{knowledge.join(", ")}</p>
      </div>
    </div>
  );
}

// Header component for the ICP page
function Header({ recruiter }) {
  const idealCandidateProfile = recruiter?.jobTitle
    ? recruiter.jobTitle.charAt(0).toUpperCase() +
      recruiter.jobTitle.slice(1).toLowerCase()
    : "";
  return (
    <motion.div
      className="text-center text-sm mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-xl font-bold text-gray-800 sm:text-2xl dark:text-white">
        <div>Ideal Candidate Profile: {idealCandidateProfile}</div>
      </h1>
      <p className="text-sm text-gray-700 dark:text-neutral-400 mt-3">
        Outlines the skills, experience, and personality traits of an Ideal
        Candidate for this role.
      </p>
    </motion.div>
  );
}

ICPPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      recruiter: PropTypes.object.isRequired,
      onet: PropTypes.object.isRequired,
    }),
  }).isRequired,
};

EndParagraph.propTypes = {
  recruiter: PropTypes.shape({
    jobTitle: PropTypes.string.isRequired,
  }).isRequired,
};

ToolsAndTechnologies.propTypes = {
  technicalSkills: PropTypes.shape({
    tools_and_technology: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default ICPPage;
