import { useLocation } from "react-router-dom";

function ICPPage() {
  const location = useLocation();
  const { jobTitle, toolProficiencies, topDesirableTraits, undesirableTraits } =
    location.state || {}; // Get userData passed as state

  return (
    <div className="relative w-full lg:ps-64">
      <div className="py-10 lg:py-14">
        {/* Title */}
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
            Ideal Candidate Profile
          </h1>
          <p className="mt-3 text-gray-600 dark:text-neutral-400">
            Outlines the skills, experience, and personality traits of an Ideal
            Candidate for a job.
          </p>
        </div>
        {/* End Title */}

        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
            <div className="flex items-center">
              <svg
                className="w-[20px] h-[20px] text-blue-600 mr-3 dark:text-white"
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
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 7H5a2 2 0 0 0-2 2v4m5-6h8M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m0 0h3a2 2 0 0 1 2 2v4m0 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6m18 0s-4 2-9 2-9-2-9-2m9-2h.01"
                />
              </svg>

              <h2 className="font-medium text-gray-800 dark:text-white">
                {jobTitle || "Software Engineer"}
              </h2>
            </div>
            <div className="space-y-1.5">
              <p className="mb-1.5 text-sm text-gray-800 dark:text-white">
                You can ask questions like:
              </p>
              <ul className="list-disc list-outside space-y-1.5 ps-3.5">
                <li className="text-sm text-gray-800 dark:text-white">
                  What Preline UI?
                </li>

                <li className="text-sm text-gray-800 dark:text-white">
                  How many Starter Pages &amp; Examples are there?
                </li>

                <li className="text-sm text-gray-800 dark:text-white">
                  Is there a PRO version?
                </li>
              </ul>
            </div>
          </div>
          {/* Tools and Technologies Card */}
          <div className="p-6 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg
                className="w-[20px] h-[20px] text-blue-600 mr-3 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7.58209 8.96025 9.8136 11.1917l-1.61782 1.6178c-1.08305-.1811-2.23623.1454-3.07364.9828-1.1208 1.1208-1.32697 2.8069-.62368 4.1363.14842.2806.42122.474.73509.5213.06726.0101.1347.0133.20136.0098-.00351.0666-.00036.1341.00977.2013.04724.3139.24069.5867.52125.7351 1.32944.7033 3.01552.4971 4.13627-.6237.8375-.8374 1.1639-1.9906.9829-3.0736l4.8107-4.8108c1.0831.1811 2.2363-.1454 3.0737-.9828 1.1208-1.1208 1.3269-2.80688.6237-4.13632-.1485-.28056-.4213-.474-.7351-.52125-.0673-.01012-.1347-.01327-.2014-.00977.0035-.06666.0004-.13409-.0098-.20136-.0472-.31386-.2406-.58666-.5212-.73508-1.3294-.70329-3.0155-.49713-4.1363.62367-.8374.83741-1.1639 1.9906-.9828 3.07365l-1.7788 1.77875-2.23152-2.23148-1.41419 1.41424Zm1.31056-3.1394c-.04235-.32684-.24303-.61183-.53647-.76186l-1.98183-1.0133c-.38619-.19746-.85564-.12345-1.16234.18326l-.86321.8632c-.3067.3067-.38072.77616-.18326 1.16235l1.0133 1.98182c.15004.29345.43503.49412.76187.53647l1.1127.14418c.3076.03985.61628-.06528.8356-.28461l.86321-.8632c.21932-.21932.32446-.52801.2846-.83561l-.14417-1.1127ZM19.4448 16.4052l-3.1186-3.1187c-.7811-.781-2.0474-.781-2.8285 0l-.1719.172c-.7811.781-.7811 2.0474 0 2.8284l3.1186 3.1187c.7811.781 2.0474.781 2.8285 0l.1719-.172c.7811-.781.7811-2.0474 0-2.8284Z"
                />
              </svg>

              <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                Tools and Technologies
              </h3>
            </div>
            <ul className="mt-3 space-y-1">
              {toolProficiencies && toolProficiencies.length > 0 ? (
                toolProficiencies.map((tool, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-800 dark:text-neutral-200"
                  >
                    {tool}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-800 dark:text-neutral-200">
                  No tools and technologies available
                </li>
              )}
            </ul>
          </div>

          {/* Top Desirable Traits Card */}
          <div className="p-6 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h2l.4 2M7 10h2l.4 2M11 10h2l.4 2M15 10h2l.4 2M19 10h2l.4 2M5 6h14M5 14h14M5 18h14"
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                Top Five Skills
              </h3>
            </div>
            <ul className="mt-3 space-y-1">
              {topDesirableTraits && topDesirableTraits.length > 0 ? (
                topDesirableTraits.map((trait, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-800 dark:text-neutral-200"
                  >
                    {trait}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-800 dark:text-neutral-200">
                  No skills available
                </li>
              )}
            </ul>
          </div>

          {/* Top Undesirable Traits Card */}
          <div className="p-6 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h2l.4 2M7 10h2l.4 2M11 10h2l.4 2M15 10h2l.4 2M19 10h2l.4 2M5 6h14M5 14h14M5 18h14"
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                Top Undesirable Skills
              </h3>
            </div>
            <ul className="mt-3 space-y-1">
              {undesirableTraits && undesirableTraits.length > 0 ? (
                undesirableTraits.map((trait, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-800 dark:text-neutral-200"
                  >
                    {trait}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-800 dark:text-neutral-200">
                  No undesirable skills available
                </li>
              )}
            </ul>
          </div>

          {/* PDF Download Card */}
          <div className="p-6 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm lg:col-span-2">
            <div className="flex items-center">
              <svg
                className="w-[20px] h-[20px] text-blue-600 mr-3 dark:text-white"
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
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M10 3v4a1 1 0 0 1-1 1H5m8 7.5 2.5 2.5M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Zm-5 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                />
              </svg>

              <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                ICP PDF file to download and visualize
              </h3>
            </div>
            <ul>
              <li className="mt-3">
                <a
                  className="text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500 dark:hover:text-blue-400"
                  href="../../docs/index.html"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Installation Guide
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500 dark:hover:text-blue-400"
                  href="../../docs/frameworks.html"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Framework Guides
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ICPPage;
