import { useEffect, useRef, useState } from "react";
import { staticData } from "../data/traitMatrix";
import TraitMatrix from "../components/traitMatrix";
import MultiSelectorInput from "../components/MultiSelector";
import EditableSummary from "../components/editableSummary";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [messages, setMessages] = useState([
    {
      heading: "Welcome to TalentTua AI. Your AI-powered copilot for hiring...",
      content: "Let’s get started! What is the job title you are hiring for?",
      sender: "bot",
      nextStep: "jobTitle",
    },
  ]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState("jobTitle");
  const [userData, setUserData] = useState({
    jobTitle: "",
    jobFamily: "",
    industry: "",
    seniorityLevel: "",
    stakeholderEngagement: "",
    traitsMatrix: staticData.trait_matrix,
    topDesirableTraits: [],
    undesirableTraits: [],
    toolProficiencies: [],
    jobDescription: "",
    questions: "",
    editOptions: "",
  });

  //Skills (Desirable Skills , Undesirable Skills, Tool Proficiencies)
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSkillsChange = (newSkills) => {
    setSelectedSkills(newSkills);
    console.log("Selected skills:", newSkills);
  };

  const handleSaveSkills = (skills, type) => {
    console.log(
      userData.topDesirableTraits,
      userData.undesirableTraits,
      userData.toolProficiencies
    );
    // Save the top five skills to userData based on the type
    if (type === "topDesirableTraits") {
      setUserData({
        ...userData,
        topDesirableTraits: skills.slice(0, 5), // Ensure only 5 skills for top desirable traits
      });
    } else if (type === "undesirableTraits") {
      setUserData({
        ...userData,
        undesirableTraits: skills.slice(0, 5), // Ensure only 5 skills for undesirable traits
      });
    } else if (type === "toolProficiencies") {
      setUserData({
        ...userData,
        toolProficiencies: skills, // Ensure only 5 skills for tool proficiencies
      });
    }

    // Optionally call some function to handle bot response or notifications
    handleBotResponse(`${type} Saved`);
  };

  //End of Skills   (Desirable Skills , Undesirable Skills, Tool Proficiencies)

  // Function to handle trait rating change
  const handleTraitRatingChange = (traitId, rating) => {
    // Update trait rating in userData state
    setUserData((prevData) => ({
      ...prevData,
      traitsMatrix: prevData.traitsMatrix.map((trait) =>
        trait.id === traitId
          ? { ...trait, rating: parseInt(rating, 10) }
          : trait
      ),
    }));
    console.log(userData.traitsMatrix.length, staticData.trait_matrix.length);
    if (
      userData.traitsMatrix.length === staticData.trait_matrix.length &&
      userData.traitsMatrix.every((trait) => trait.rating != null)
    ) {
      handleBotResponse("Trait Matrix Saved");
    }
  };

  // User input and option clicks
  const handleUserAction = (userMessageOrOption) => {
    if (!userMessageOrOption.trim()) return;

    const isOption = typeof userMessageOrOption === "string";

    // Add user message or selected option to chat
    setMessages((prev) => [
      ...prev,
      { content: userMessageOrOption, sender: "user" },
    ]);

    setIsBotTyping(true);
    // Update user data based on the step and user action
    updateUserData(currentStep, userMessageOrOption);
    setInput("");

    // Process bot response after delay
    setTimeout(() => {
      const botResponse = getBotResponse(
        isOption ? userMessageOrOption : userMessageOrOption.trim()
      );
      setMessages((prev) => [...prev, botResponse]);
      setIsBotTyping(false);
    }, 2000);
  };

  // Function to handle the bot's response after a user action
  const handleBotResponse = (value) => {
    setMessages((prev) => [...prev, { content: value, sender: "user" }]);

    setTimeout(() => {
      const botResponse = getBotResponse();
      console.log(botResponse);
      setMessages((prev) => [...prev, botResponse]);
      setIsBotTyping(false);
    }, 500);
  };
  // Function to update user data based on current step
  const updateUserData = (step, value) => {
    setUserData((prev) => ({
      ...prev,
      [step]: value,
    }));
  };
  // Handle edit or confirm action
  const handleEditOrConfirm = (action) => {
    if (action === "Edit") {
      // Allow user to go back and edit the relevant part of the form
      // You could prompt to select what section to edit, rather than just resetting to the first step
      setIsEdit(true);
      handleBotResponse("Edit");
    } else if (action === "Confirm") {
      // Finalize the process and submit the data
      saveRecruitersInput(userData);
      setCurrentStep("done");
      handleBotResponse("Thank you! Your data has been saved.");
    }
  };
  const handleLinkClick = () => {
    // Navigate to the next page (job-details) and pass userData as state
    navigate("/icp", { state: { userData } });
  };
  const stepFlow = {
    start: "jobTitle",
    jobTitle: "jobFamily",
    jobFamily: "industry",
    industry: "seniorityLevel",
    seniorityLevel: "stakeholderEngagement",
    stakeholderEngagement: "traitsMatrix",
    traitsMatrix: "topDesirableTraits",
    topDesirableTraits: "undesirableTraits",
    undesirableTraits: "toolProficiencies",
    toolProficiencies: "jobDescription",
    jobDescription: "questions",
    questions: "done",
    done: "done",
  };
  const generateICPLink = () => {
    const url = new URL("http://localhost:5173/icp");
    url.search = new URLSearchParams(userData).toString();
    return url.href;
  };
  // Function to generate the summary from the collected data
  const generateSummary = () => {
    const summary = {
      jobTitle: userData.jobTitle,
      jobFamily: userData.jobFamily,
      industry: userData.industry,
      seniorityLevel: userData.seniorityLevel,
      stakeholderEngagement: userData.stakeholderEngagement,
      topDesirableTraits: userData.topDesirableTraits.join(", "),
      undesirableTraits: userData.undesirableTraits.join(", "),
      toolProficiencies: userData.toolProficiencies.join(", "),
    };

    return (
      <>
        <span className="font-medium">Title:</span> {summary.jobTitle}
        <span className="font-medium">Job Family:</span> {summary.jobFamily}
        <span className="font-medium">Industry: </span>
        {summary.industry}
        <span className="font-medium">Seniority Level:</span>{" "}
        {summary.seniorityLevel}
        <span className="font-medium">Stakeholder Engagement:</span>{" "}
        {summary.stakeholderEngagement}
        <span className="font-medium">Top Desirable Traits:</span>{" "}
        {summary.topDesirableTraits}
        <span className="font-medium">Undesirable Traits:</span>{" "}
        {summary.undesirableTraits}
        <span className="font-medium">Tool Proficiencies:</span>{" "}
        {summary.toolProficiencies}
      </>
    );
  };

  const getBotResponse = () => {
    let nextStep;
    console.log("Current Step:", isEdit);
    if (isEdit) {
      setCurrentStep("editOptions");
      // If isEdit is true, set next step to editOptions
      nextStep = "done";
    } else {
      // Otherwise, follow the standard step flow
      nextStep = stepFlow[currentStep];
    }
    console.log("Current Step:", currentStep);
    console.log("Next Step:", nextStep);
    setCurrentStep(nextStep || "done");

    const responses = {
      jobTitle: {
        heading: "What is the job family?",
        sender: "bot",
        options: staticData.jobFamilyOptions,
      },
      jobFamily: {
        heading: "What industry is the job in?",
        sender: "bot",
        options: staticData.industryOptions,
      },
      industry: {
        heading: "What is the seniority level for this role?",
        sender: "bot",
        options: staticData.seniorityLevelOptions,
      },
      seniorityLevel: {
        heading: "How important is stakeholder engagement for this role?",
        sender: "bot",
        options: staticData.stakeholderEngagementOptions,
      },
      stakeholderEngagement: {
        heading:
          "Please rate the following traits based on importance and frequency",
        sender: "bot",
        traits: staticData.trait_matrix,
      },
      traitsMatrix: {
        heading: "What are the top five most desirable traits for this role?",
        sender: "bot",
        customInput: true,
        examples: ["Team Player", "Problem Solver", "Good Communicator"],
      },
      topDesirableTraits: {
        heading: "What are the five undesirable traits for this role?",
        sender: "bot",
        customInput: true,
        examples: [
          "Lack of Communication",
          "Poor Time Management",
          "Lack of Teamwork",
        ],
      },
      undesirableTraits: {
        heading:
          "What tools and technologies should the candidate be proficient in?",
        sender: "bot",
        customInput: true,
        examples: ["React.js", "Node.js", "MongoDB"],
      },
      toolProficiencies: {
        heading: "Please provide a job description for this role",
        sender: "bot",
      },
      jobDescription: {
        heading: "What are the screening questions for this role?",
        sender: "bot",
        options: ["Do you have experience with React.js for at least 2 years?"],
      },
      questions: {
        heading:
          "Thank you! Here's a summary of the information you've provided:",
        sender: "bot",
        summary: generateSummary(),
        editOrConfirm: ["Edit", "Confirm"],
      },
      done: {
        heading: "Thank you you ICP is generated please click the link!",
        link: generateICPLink(),
        sender: "bot",
      },
    };

    return {
      ...responses[currentStep],
      nextStep: nextStep,
    };
  };

  const saveRecruitersInput = async () => {
    try {
      // Optionally call some function to handle bot response or notifications
      handleBotResponse("Job Data Updated Successfully");
      console.log("User Data:", userData);

      // Send the request to the backend API
      const response = await fetch("http://localhost:3000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData), // Send userData as the body of the request
      });

      console.log(response); // Log the full response object for debugging

      // Check if the response was successful (status code 200-299)
      if (response.ok) {
        const result = await response.json(); // Parse the response as JSON
        console.log("Backend response:", result);

        // Additional logic based on the backend response can be added here
        // For example, display success message or redirect user
      } else {
        console.error("Failed to send data to backend:", response.statusText);
        // You can also add logic to handle specific errors, e.g., showing a custom error message
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
      // Optionally show user a generic error message or handle error based on the situation
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="relative bg-none w-full lg:ps-64">
      <div className="py-10 lg:py-14">
        {/* Title */}
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
            Welcome to TalentTua AI
          </h1>
          <p className="mt-3 text-gray-600 dark:text-neutral-400">
            Your AI-powered copilot for hiring.
          </p>
        </div>

        {/* Messages */}
        <ul className="mt-16 space-y-5">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" ? (
                /* Bot Message */
                <>
                  <svg
                    className="shrink-0 size-[38px] rounded-full"
                    width={38}
                    height={38}
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width={38} height={38} rx={6} fill="#2563EB" />
                    <path
                      d="M10 28V18.64C10 13.8683 14.0294 10 19 10C23.9706 10 28 13.8683 28 18.64C28 23.4117 23.9706 27.28 19 27.28H18.25"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M13 28V18.7552C13 15.5104 15.6863 12.88 19 12.88C22.3137 12.88 25 15.5104 25 18.7552C25 22 22.3137 24.6304 19 24.6304H18.25"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <ellipse
                      cx={19}
                      cy="18.6554"
                      rx="3.75"
                      ry="3.6"
                      fill="white"
                    />
                  </svg>
                  <div className="space-y-3">
                    <h2 className="font-medium text-gray-800 dark:text-white">
                      {message.heading || ""}
                    </h2>
                    <div className="space-y-1.5">
                      <p className="mb-1.5 text-sm text-gray-800 dark:text-white">
                        {message.content || ""}
                      </p>
                      {message.summary && (
                        <EditableSummary
                          userData={userData}
                          setUserData={setUserData}
                          onSubmit={saveRecruitersInput}
                        />
                      )}
                      {message.options && (
                        <>
                          {message.options.map((option) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleUserAction(option)}
                              className="mb-2.5 me-1.5 py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-lg border border-blue-600 bg-white text-blue-600 align-middle hover:bg-blue-50 focus:outline-none focus:bg-blue-50 text-sm dark:bg-neutral-900 dark:text-blue-500 dark:border-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400 dark:focus:text-blue-400 dark:focus:border-blue-400"
                            >
                              {option}
                            </button>
                          ))}
                        </>
                      )}
                      {message.examples && (
                        <>
                          <p className="mb-1.5 text-sm font-medium text-gray-800 dark:text-white">
                            Examples can be found below:
                          </p>
                          {message.examples.map((example, i) => (
                            <button
                              type="button"
                              key={i}
                              onClick={() => handleEditOrConfirm(example)}
                              className="p-2 ml-1 inline-flex justify-center items-center gap-x-1 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 text-xs dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                            >
                              {example}
                            </button>
                          ))}
                        </>
                      )}
                      {message.traits && (
                        <TraitMatrix
                          traits={message.traits || []}
                          onRatingChange={handleTraitRatingChange}
                        />
                      )}

                      {message.customInput && (
                        <MultiSelectorInput
                          value={selectedSkills}
                          onChange={handleSkillsChange}
                          onSave={() =>
                            handleSaveSkills(selectedSkills, currentStep)
                          }
                        />
                      )}
                      {message.link && (
                        <button
                          onClick={handleLinkClick}
                          className="hover:underline text-blue-700"
                        >
                          Go to ICP Details
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* User Message */
                <div className="py-2 sm:py-4 w-full justify-items-end">
                  <div className="max-w-2xl flex gap-x-2 sm:gap-x-4">
                    <div className="grow space-y-3">
                      <div className="space-y-1.5">
                        <p className="mb-1.5 mt-2 text-sm text-gray-800 dark:text-white">
                          {message.content || ""}
                        </p>
                        {message.summary && (
                          <p className="mt-2">{message.summary}</p>
                        )}
                        {message.options && (
                          <ul className="list-disc list-outside space-y-1.5 ps-3.5">
                            {message.options.map((option, i) => (
                              <li
                                key={i}
                                className="text-sm text-gray-800 dark:text-white"
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
                      <span className="text-sm font-medium text-white leading-none">
                        {message.senderInitials || "AZ"}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))}
          {isBotTyping && (
            <li className="max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 justify-start">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-blue-700 dark:text-white">
                  Bot is typing...
                </p>
              </div>
            </li>
          )}
          <div ref={messagesEndRef} />
        </ul>

        {/* Chat Message TextArea */}
        <div className="max-w-4xl mx-auto sticky bottom-0 z-10 p-3 sm:py-6">
          <div className="relative">
            <textarea
              className="p-4 pb-12 block w-full
                 bg-gray-100 border border-gray-200 
                 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 
                 focus:ring-1 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700
                  dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUserAction(input);
                  setInput("");
                }
              }}
            />
            {/* Toolbar */}
            <div className="absolute bottom-px inset-x-px p-2 rounded-b-lg bg-gray-100 dark:bg-neutral-800">
              <div className="flex justify-between items-center">
                {/* Button Group */}
                <div className="flex items-center"></div>
                {/* End Button Group */}
                {/* Button Group */}
                <div className="flex items-center gap-x-1">
                  {/* Send Button */}
                  <button
                    onClick={() => handleUserAction(input)}
                    className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:bg-blue-500"
                  >
                    <svg
                      className="shrink-0 size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                    </svg>
                  </button>
                  {/* End Send Button */}
                </div>
                {/* End Button Group */}
              </div>
            </div>
            {/* End Toolbar */}
          </div>
        </div>

        {/*End Chat Message TextArea  */}
      </div>
    </div>
  );
}

export default ChatPage;
