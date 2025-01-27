import { Link, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

function ICPPage() {
  const location = useLocation();
  const { recruiter, onet } = location.state || {};
  const niceToHave = onet?.niceToHave || {};
  if (!recruiter || !onet) {
    return (
      <div className="text-center text-red-600">Invalid data provided</div>
    );
  }
  const knowledge = onet?.educationExpertise?.knowledge || [];

  //console.log(knowledge, recruiter, onet);
  const education = onet?.educationExpertise?.education?.[0] || {
    name: "Not Specified",
    description: "No additional details available.",
  };

  const toolsAndTechnologies =
    onet?.keyProficiencies?.technicalSkills?.tools_and_technology || [];
  const topDesirableTraits = onet?.desirableSoftSkills || [];
  const undesirableTraits = recruiter?.undesirableTraits || [];
  const desirableTraits = recruiter?.desirableSoftSkills || [];
  console.log(undesirableTraits);
  const requiredTools = recruiter?.toolProficiencies || [];
  const toolProficiencies = toolsAndTechnologies.filter(
    (tool) => !requiredTools.includes(tool)
  );
  const mustHaveTraits = [
    ...new Set([
      niceToHave?.abilities?.[0]?.name || "Default Ability",
      niceToHave?.work_styles?.[0]?.name || "Default Work Style",
      niceToHave?.work_activities?.[0]?.name || "Default Work Activity",
      niceToHave?.skills?.[0]?.name || "Default Skill",
      niceToHave?.interests?.[0]?.name || "Default Interest",
    ]),
  ];

  return (
    <motion.div
      id="pdf"
      className="relative w-full lg:ps-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="p-24 lg:py-14">
        <Header recruiter={recruiter} />
        <div className="max-w-4xl py-10 border shadow-sm rounded-lg px-12 shadow-black-700 sm:px-6 lg:px-8 mx-auto mt-8 gap-6">
          <ShareButtons />
          <ExecutiveSummary recruiter={recruiter} />
          <TraitsSection
            title="Essential Traits & Behaviors"
            traits={desirableTraits}
          />
          <TraitsSection
            title="Nice-to-Have Traits & Behaviors"
            traits={mustHaveTraits}
          />
          <TraitsSection
            title="Unwanted Traits & Behaviors"
            traits={undesirableTraits}
          />
          <EducationSection
            education={education}
            toolProficiencies={toolProficiencies}
            knowledge={knowledge}
            requiredTools={requiredTools}
          />
          <EndParagraph recruiter={recruiter} />
        </div>
      </div>
    </motion.div>
  );
}
function EndParagraph({ recruiter }) {
  return (
    <p className="text-sm text-gray-800 dark:text-neutral-200">
      This profile serves as a guide to educate you on the total skills,
      knowledge, abilities, and attitudes required for the role of{" "}
      {recruiter.jobTitle}. This is not meant to be all inclusive of the many
      nuanced requirements and responsibilities associated with this role.
      Rather, it is intended to serve as a reference for completing a
      skills-based hiring process along with using a framework that
      mathematically determines the likelihood of required attributes listed
      here. Contact us at{" "}
      <Link className="text-blue-600 text-sm">hello@talenttua.com</Link> for
      more information.
    </p>
  );
}
function exportToPDF() {
  const element = document.getElementById("pdf");
  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("profile.pdf");
  });
}
function Header({ recruiter }) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
        Ideal Candidate Profile: {recruiter.jobTitle}
      </h1>
      <p className="mt-3 text-gray-600 dark:text-neutral-400">
        Outlines the skills, experience, and personality traits of an Ideal
        Candidate for a job.
      </p>
    </motion.div>
  );
}

function ShareButtons() {
  return (
    <div className="flex justify-end">
      <button
        className="bg-blue-600 text-white mr-1 text-sm px-3 py-2 rounded-lg flex items-center"
        aria-label="Share Profile"
      >
        <svg
          className="w-[16px] h-[16px] mr-1 text-white dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.7"
            d="M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
          />
        </svg>
        Share
      </button>
      <Link
        onClick={() => exportToPDF}
        target="_blank"
        className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg flex items-center"
        aria-label="View Profile PDF"
      >
        <svg
          className="w-3 h-3 me-2 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
          <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
        </svg>
        View PDF
      </Link>
    </div>
  );
}

function ExecutiveSummary({ recruiter }) {
  return (
    <>
      <h3 className="text-sm font-semibold text-gray-800 dark:text-blue-300 flex items-center">
        Executive Summary
      </h3>

      <p className=" text-sm text-gray-800 dark:text-neutral-200 mt-1">
        This profile outlines the ideal candidate for a {recruiter.jobTitle}{" "}
        position, belonging to {recruiter.jobFamily} and {recruiter.industry}.
        This role has the potential to grow and adapt to the company’s future
        needs and requirements.
      </p>
    </>
  );
}

function TraitsSection({ title, traits }) {
  return (
    <motion.div
      className="traits-section"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h3 className="text-sm font-medium mt-4 text-gray-800 dark:text-gray-200 flex items-center">
        {title}
      </h3>
      <div className="grid grid-cols-3 gap-4 p-4">
        {traits.length > 0 ? (
          traits.map((trait, index) => (
            <motion.div
              className="flex items-center space-x-2 text-sm text-gray-800 dark:text-gray-400"
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <svg
                className="w-[14px] h-[14px] min-h-3 max-h-3 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
                />
              </svg>

              <span>{trait}</span>
            </motion.div>
          ))
        ) : (
          <p className="mt-3 text-sm text-gray-800 dark:text-gray-400">
            No traits listed.
          </p>
        )}
      </div>
    </motion.div>
  );
}

function EducationSection({
  education,
  toolProficiencies,
  knowledge,
  requiredTools,
}) {
  return (
    <>
      <h3 className="text-sm font-medium mt-4 text-gray-800 dark:text-gray-200 flex items-center">
        Education & Expertise :
      </h3>
      <div className="p-4">
        <p className=" text-sm font-medium text-gray-800 dark:text-gray-400">
          {education.name}
        </p>
        <p className="text-sm mt-1 text-gray-900 dark:text-gray-400">
          {education.description || ""}
        </p>
      </div>
      <h3 className="text-sm font-medium mt-4 text-gray-800 dark:text-gray-200 flex items-center">
        Tools Proficiencies required in day 1 :
      </h3>
      <div className="p-4">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
          Technology Proficiencies
        </p>
        <div className="grid grid-cols-3 gap-4 p-4">
          {requiredTools.length > 0 ? (
            requiredTools.slice(0, 10).map((name, index) => (
              <div
                className="text-sm flex items-center  text-gray-800 dark:text-gray-400"
                key={index}
              >
                {/* Icon with fixed size */}
                <svg
                  className="w-[16px] h-[16px]  min-h-3 max-h-3 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
                  />
                </svg>
                <span className="ml-2 w-full">{name || "N/A"}</span>
              </div>
            ))
          ) : (
            <p className="mt-3 text-sm text-gray-800 dark:text-gray-400">
              Domain expertise not listed.
            </p>
          )}
        </div>
      </div>

      <h3 className="text-sm font-medium mt-4  text-gray-800 dark:text-gray-400">
        Key Proficiences :
      </h3>

      <ul className="p-4">
        <li>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-400">
            Technical Expertise
          </p>
          <div className="grid grid-cols-3 gap-4 p-4">
            {toolProficiencies.length > 0 ? (
              toolProficiencies.slice(0, 10).map((name, index) => (
                <div
                  className="text-sm flex items-center  text-gray-800 dark:text-gray-400"
                  key={index}
                >
                  {/* Icon with fixed size */}
                  <svg
                    className="w-[16px] h-[16px] min-h-3 max-h-3 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
                    />
                  </svg>
                  <span className="ml-2 w-full">{name || "N/A"}</span>
                </div>
              ))
            ) : (
              <p className="mt-3 text-sm text-gray-800 dark:text-gray-400">
                Domain expertise not listed.
              </p>
            )}
          </div>
        </li>

        <li>
          <p className="text-sm font-medium  text-gray-800 dark:text-gray-400">
            Knowledge And Domain
          </p>
          <div className="grid grid-cols-3 gap-4 p-4">
            {knowledge.length > 0 ? (
              knowledge.slice(0, 10).map((name, index) => (
                <div
                  className=" text-sm flex items-center text-gray-900 dark:text-gray-400"
                  key={index}
                >
                  {/* Icon */}
                  <svg
                    className="w-[14px] h-[14px] min-h-3 max-h-3 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
                    />
                  </svg>
                  <span className="ml-2">{name.name}</span>
                </div>
              ))
            ) : (
              <p className="mt-3 text-sm text-gray-900 dark:text-gray-400">
                Knowledge not listed.
              </p>
            )}
          </div>
        </li>
      </ul>
    </>
  );
}

export default ICPPage;
