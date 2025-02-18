import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <>
      {/* Content */}
      <div className="w-full lg:ps-64">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card */}
            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Total users
                  </p>
                  <div className="hs-tooltip">
                    <div className="hs-tooltip-toggle">
                      <svg
                        className="shrink-0 size-4 text-gray-500 dark:text-neutral-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx={12} cy={12} r={10} />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                      <span
                        className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700"
                        role="tooltip"
                      >
                        The number of daily users
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    72,540
                  </h3>
                  <span className="flex items-center gap-x-1 text-green-600">
                    <svg
                      className="inline-block size-4 self-center"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                      <polyline points="16 7 22 7 22 13" />
                    </svg>
                    <span className="inline-block text-sm"> 1.7% </span>
                  </span>
                </div>
              </div>
            </div>
            {/* End Card */}
            {/* Card */}
            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Sessions
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    29.4%
                  </h3>
                </div>
              </div>
            </div>
            {/* End Card */}
            {/* Card */}
            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Avg. Click Rate
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    56.8%
                  </h3>
                  <span className="flex items-center gap-x-1 text-red-600">
                    <svg
                      className="inline-block size-4 self-center"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                      <polyline points="16 17 22 17 22 11" />
                    </svg>
                    <span className="inline-block text-sm"> 1.7% </span>
                  </span>
                </div>
              </div>
            </div>
            {/* End Card */}
            {/* Card */}
            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Pageviews
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    92,913
                  </h3>
                </div>
              </div>
            </div>
            {/* End Card */}
          </div>
          {/* End Grid */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Card */}
            <div className="p-4 md:p-5 min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                    ICP
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    $126,238.49
                  </p>
                </div>
                <div>
                  <span className="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-500">
                    <svg
                      className="inline-block size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14" />
                      <path d="m19 12-7 7-7-7" />
                    </svg>
                    25%
                  </span>
                </div>
              </div>
              {/* End Header */}
              <div id="hs-multiple-bar-charts" />
            </div>
            {/* End Card */}
            {/* Card */}
            <div className="p-4 md:p-5 min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                    Visitors
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    80.3k
                  </p>
                </div>
                <div>
                  <span className="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500">
                    <svg
                      className="inline-block size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14" />
                      <path d="m19 12-7 7-7-7" />
                    </svg>
                    2%
                  </span>
                </div>
              </div>
              {/* End Header */}
              <div id="hs-single-area-chart" />
            </div>
            {/* End Card */}
          </div>
          {/* Card */}
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                  {/* Header */}
                  <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                        ALL ICPs
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        List of generated ICP.
                      </p>
                    </div>
                    <div>
                      <div className="inline-flex gap-x-2">
                        <a
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                          href="#"
                        >
                          View all
                        </a>
                        <Link
                          to="/chat"
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                          href="#"
                        >
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                          Create ICP
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* End Header */}
                  {/* Table */}
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead className="bg-gray-50 dark:bg-neutral-800">
                      <tr>
                        <th scope="col" className="ps-6 py-3 text-start">
                          <label
                            htmlFor="hs-at-with-checkboxes-main"
                            className="flex"
                          >
                            <input
                              type="checkbox"
                              className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                              id="hs-at-with-checkboxes-main"
                            />
                          </label>
                        </th>
                        <th
                          scope="col"
                          className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                        >
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Employer
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Job Title
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Status
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Portfolio
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Created At
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Action
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-end" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label
                              htmlFor="hs-at-with-checkboxes-1"
                              className="flex"
                            >
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-1"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <img
                                className="inline-block size-[38px] rounded-full"
                                src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                                alt="Avatar"
                              />
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Christina Mason
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  christina@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Director
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              Human resources
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                              New
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                1/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{ width: "25%" }}
                                  aria-valuenow={25}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              28 Dec, 12:12
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <Link
                              to="/icp"
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/* End Table */}
                  {/* Footer */}
                  <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        <span className="font-semibold text-gray-800 dark:text-neutral-200">
                          12
                        </span>
                        results
                      </p>
                    </div>
                    <div>
                      <div className="inline-flex gap-x-2">
                        <button
                          type="button"
                          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                        >
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                          Prev
                        </button>
                        <button
                          type="button"
                          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                        >
                          Next
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* End Footer */}
                </div>
              </div>
            </div>
          </div>
          {/* End Card */}
        </div>
      </div>
      {/* End Content */}
    </>
  );
}

export default Dashboard;
