import { useEffect, useRef, useState } from "react";
import Title from "../components/chat/Title";
import { MessageList } from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import { staticData } from "../data/traitMatrix";
import { motion } from "framer-motion";
import { sanitizeInput, validateData } from "../helpers/sanitizeInput";

function ChatPage() {
  const messageEndRef = useRef(null);
  const [icpData, setICPData] = useState({});
  const [results, setResults] = useState({});
  const [botTyping, setBotTyping] = useState(false);
  const [input, setInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});
  const botTypingRef = useRef(null); // Ref for bot typing section

  // Set the ref dynamically based on botTyping status
  useEffect(() => {
    if (botTyping) {
      botTypingRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [botTyping]); // Trigger effect when botTyping changes

  const questions = [
    {
      name: "welcome",
      question:
        "Would you like to generate the Ideal Candidate Profile for the role?",
      option: ["Yes", "No"],
      inputType: "text",
      validate: "required",
    },
    {
      name: "jobTitle",
      question: "What is the job role or title you are looking to hire for?",
      inputType: "text",
      validate: "required",
    },
    {
      name: "jobFamily",
      question: "Please select a job family for this role:",
      inputType: "dropdown",
      options: staticData.jobFamilyOptions,
    },
    {
      name: "industry",
      question: "Please select an industry for the role:",
      inputType: "dropdown",
      options: staticData.industryOptions,
    },
    {
      name: "seniorityLevel",
      question: "Please select the seniority level for the role:",
      inputType: "dropdown",
      options: staticData.seniorityLevelOptions,
    },
    {
      name: "stakeholderEngagement",
      question: "Please select multiple stakeholder engagement for the role:",
      inputType: "checkbox",
      options: staticData.stakeholderEngagementOptions,
      selectedOption: [],
    },
    {
      name: "traitMatrix",
      question:
        "Please select a TraitMatrix scale according to the importance:",
      inputType: "traitMatrix",
      options: staticData.trait_matrix,
      rating: {},
    },
    {
      name: "desirableSoftSkills",
      question:
        "Please select or enter the five must-have soft skills for the role:",
      inputType: "checkbox",
      options: results.work_styles || [
        "Communication",
        "Leadership",
        "Teamwork",
        "Problem Solving",
        "Creativity",
        "Adaptability",
        "Time Management",
        "Critical Thinking",
        "Conflict Resolution",
        "Emotional Intelligence",
      ],
    },
    {
      name: "undesirableTraits",
      question: "Please select or enter five undesirable skills for the role:",
      inputType: "checkbox",
      options: staticData.undesirableSkills,
    },
    {
      name: "toolProficiencies",
      question:
        "Please select tools and proficiencies required for day 1 on the job:",
      inputType: "checkbox",
      options: results.toolsProficiencies || [
        "Excel",
        "PowerPoint",
        "MS Word",
        "Google Suite",
        "Project Management Software",
        "CRM software",
        "SQL",
        "Data visualization tools",
        "Programming languages (Python, Java, etc.)",
      ],
    },
    {
      name: "roleDescription",
      question:
        "Describe what is unique about this role for your organization in comparison to other organizations(Why does this role exist in your organization?)",
      inputType: "textarea",
    },
    {
      name: "reviewAndUpdate",
      question: "Please review and update the saved data",
      inputType: "textarea",
    },
    {
      name: "icp",
      question: "Please click the link to view your pdf",
      inputType: "textarea",
    },
  ];

  const [messages, setMessages] = useState([
    {
      heading: "Welcome to TalentTua AI. Your AI-powered copilot for hiring...",
      content: questions[0].question,
      inputType: questions[0].inputType,
      name: questions[0].name,
      sender: "bot",
    },
  ]);

  const addErrorMessage = (message, currentQuestion) => {
    setMessages((prev) => [
      ...prev,
      {
        content: message,
        sender: "bot",
      },
      {
        heading: "",
        content: currentQuestion?.question || "No question found.",
        inputType: currentQuestion?.inputType || "text",
        options: currentQuestion?.options || "",
        name: currentQuestion?.name || "",
        sender: "bot",
      },
    ]);
    setInput("");
  };

  const handleUserAction = async (userInput) => {
    try {
      setBotTyping(true);

      // Check if input is provided
      if (
        !userInput ||
        userInput.length === 0 ||
        Object.keys(userInput).length === 0
      ) {
        setMessages((prev) => [
          ...prev,
          {
            content: "Please provide an answer to continue.",
            sender: "bot",
          },
          {
            heading: "",
            content: questions[currentStep]?.question || "No question found.",
            inputType: questions[currentStep]?.inputType || "text",
            options: questions[currentStep]?.options || "",
            name: questions[currentStep]?.name || "",
            sender: "bot",
          },
        ]);
        setInput("");
        setBotTyping(false); // Stop typing when no valid input
        return;
      }

      const updatedUserData = { ...userData };
      const nextStep = currentStep + 1;
      const currentQuestion = questions[currentStep];

      // Sanitize and validate user input
      if (typeof userInput === "string") {
        userInput = sanitizeInput(userInput);
        if (userInput.length > 255) {
          addErrorMessage(
            "Input exceeds the maximum length of 255 characters.",
            currentQuestion
          );
          setBotTyping(false); // Stop typing if input length error occurs
          return;
        }
      }

      // Validation based on inputType
      switch (currentQuestion?.inputType) {
        case "text":
        case "textarea":
          if (
            (typeof userInput !== "string" && typeof userInput !== "object") || // If it's neither a string nor an object
            (typeof userInput === "string" && userInput.trim() === "") || // If it's a string and empty
            (typeof userInput === "object" && !Object.keys(userInput).length) // If it's an empty object
          ) {
            addErrorMessage("Input is invalid or empty.", currentQuestion);
            setBotTyping(false); // Stop typing if input is invalid
            return;
          }

          if (currentQuestion.name === "jobTitle") {
            let response = await fetch("http://localhost:3000/jobs", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jobTitle: userInput }),
            });

            const data = await response.json();

            if (data?.keyProficiencies?.technicalSkills?.tools_and_technology) {
              setResults((prev) => ({
                ...prev,
                toolsProficiencies:
                  data.keyProficiencies.technicalSkills.tools_and_technology,
              }));
            }

            if (
              data?.niceToHave?.work_styles ||
              data?.niceToHave?.interests ||
              data?.niceToHave?.abilities
            ) {
              setResults((prev) => ({
                ...prev,
                work_styles: [
                  ...(data?.niceToHave?.work_styles?.map(
                    (style) => style.name
                  ) || []),
                  ...(data?.niceToHave?.interests.map((style) => style.name) ||
                    []),
                  ...(data?.niceToHave?.abilities.map((style) => style.name) ||
                    []),
                ],
              }));
            }

            // Stop bot typing here before sending the next message
            setBotTyping(false);
          }

          if (currentQuestion.name === "welcome") {
            if (userInput == "no") {
              setMessages((prev) => [
                ...prev,
                {
                  heading: "",
                  content: `Thank you for your time! Know more about TalentTua at `,
                  link: "www.talentua.com",
                  sender: "bot",
                },
              ]);
              setBotTyping(false); // Stop typing here as well
              return;
            }
          }
          break;

        case "dropdown":
          if (
            !currentQuestion.options.includes(userInput) ||
            typeof userInput !== "string"
          ) {
            addErrorMessage(
              "Invalid selection from dropdown options.",
              currentQuestion
            );
            setBotTyping(false); // Stop typing on dropdown error
            return;
          }
          break;

        case "checkbox":
          if (!Array.isArray(userInput)) {
            addErrorMessage(
              "Invalid checkbox input. Input should be an array.",
              currentQuestion
            );
            setBotTyping(false); // Stop typing on checkbox error
            return;
          }
          break;

        case "traitMatrix":
          console.log("TraitMatrix data:", userInput);

          // Check that input is an object and not an array
          if (typeof userInput !== "object" || Array.isArray(userInput)) {
            addErrorMessage(
              "Invalid traitMatrix data format.",
              currentQuestion
            );
            setBotTyping(false); // Stop typing on traitMatrix error
            return;
          }
          break;

        default:
          addErrorMessage("Unsupported input type.", currentQuestion);
          setBotTyping(false); // Stop typing on unsupported type
          return;
      }

      // Save sanitized input
      updatedUserData[currentQuestion.name] = userInput;
      setUserData(updatedUserData);

      // Display user input
      setMessages((prev) => [
        ...prev,
        { content: userInput, sender: "user", name: currentQuestion.name },
      ]);
      setInput("");

      // Handle next question or end
      if (nextStep < questions.length) {
        setMessages((prev) => [
          ...prev,
          {
            heading: "",
            content: questions[nextStep]?.question || "No question available.",
            inputType: questions[nextStep]?.inputType || "text",
            options: questions[nextStep]?.options || "",
            name: questions[nextStep]?.name || "",
            sender: "bot",
          },
        ]);
        setCurrentStep(nextStep);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            heading: "",
            content:
              "Thank you for providing the details. We'll take it from here!",
            sender: "bot",
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setMessages((prev) => [
        ...prev,
        {
          content: error.message || "An error occurred. Please try again.",
          sender: "bot",
        },
      ]);
      setBotTyping(false); // Stop typing in case of error
    }
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const prevQuestion = questions[prevStep];
      const prevAnswer = userData[prevQuestion.name] || [];

      setCurrentStep(prevStep);
      setMessages((prev) => [
        ...prev,
        {
          heading: "",
          content: prevQuestion.question,
          inputType: prevQuestion.inputType,
          options: prevQuestion.options || "",
          selectedOption: prevAnswer || [],
          rating: prevAnswer || {},
          name: prevQuestion.name || "",
          sender: "bot",
        },
      ]);
      setInput("");
    }
  };

  const handleFormSubmit = async (updatedData) => {
    try {
      // Validate updatedData before submitting
      const validationErrors = validateData(updatedData);
      if (validationErrors.length > 0) {
        // Display validation errors and stay on the same step to allow user correction
        setMessages((prev) => [
          ...prev,
          {
            content: `Please fix the following errors:\n${validationErrors.join(
              "\n"
            )}`,
            sender: "bot",
          },
        ]);
        return; // Stop submission and allow the user to fix the errors
      }

      // Proceed with submitting the data if valid
      setUserData(updatedData);
      setBotTyping(true);

      setMessages((prev) => [
        ...prev,
        {
          heading: "",
          content: "Thank you, we are calculating the ICP for you!",
          sender: "bot",
        },
      ]);
      setBotTyping(true);
      const response = await fetch("http://localhost:3000/jobs/saveJob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      console.log(response, userData);
      if (!response.ok) {
        throw new Error("Failed to save job data");
      }

      const responseData = await response.json();

      if (!responseData) {
        // If ICP generation fails, show an error and stay on the current step
        throw new Error("ICP generation failed. Please try again.");
      }

      // If ICP is successfully generated, update the state
      setICPData((prev) => ({ ...prev, ...responseData }));
      setBotTyping(false);
      // Move to the next step or complete the process
      const nextStep = currentStep + 1;
      if (nextStep < questions.length) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              heading: "",
              content: questions[nextStep].question,
              inputType: questions[nextStep].inputType,
              options: questions[nextStep].options || "",
              name: questions[nextStep].name || "",
              sender: "bot",
            },
          ]);
          setCurrentStep(nextStep);
          setBotTyping(false);
        }, 1000);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            heading: "",
            content: "Process complete! Thank you for your inputs.",
            sender: "bot",
          },
        ]);
        setBotTyping(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      // If there's an error (e.g., ICP generation failed), show the error and allow user correction
      setMessages((prev) => [
        ...prev,
        {
          content: error.message, // Show the specific error message (e.g., ICP generation failed)
          sender: "bot",
        },
      ]);

      // Show the previous question again for correction
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            heading: "",
            content: questions[currentStep].question, // Show the question again
            inputType: questions[currentStep].inputType,
            options: questions[currentStep].options || "",
            name: questions[currentStep].name || "",
            sender: "bot",
          },
        ]);
        setBotTyping(false);
      }, 1000);
    }
  };
  // Simulating bot typing and setting botTyping to false after 2 seconds
  useEffect(() => {
    if (botTyping) {
      setTimeout(() => {
        setBotTyping(false); // Stop bot typing after 2 seconds
      }, 2000);
    }
  }, [botTyping]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative bg-none w-full lg:ps-64">
      <div className="pt-10 lg:pt-14">
        <Title />
        <MessageList
          messages={messages}
          onSelect={handleUserAction}
          onSubmit={handleFormSubmit}
          userData={userData}
          icpData={icpData}
          botTyping={botTyping}
        />
        <div className="max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 justify-start">
          {botTyping && (
            <motion.div
              className="bot-typing flex items-center mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              ref={botTypingRef} // Attach ref to bot typing div
            >
              <div className="typing-dots flex gap-1">
                <span className="dot h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="dot h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="dot h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
              <p className="ml-2 text-gray-500 text-xs">Typing...</p>
            </motion.div>
          )}

          {!botTyping && currentStep > 0 && (
            <motion.div
              className="navigation-buttons flex justify-start items-center mt-4"
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {currentStep > 0 && (
                <motion.button
                  className="go-back-button text-gray-800 shadow-sm dark:bg-neutral-900 dark:text-blue-600 border dark:border-blue-600 border-gray-400 text-sm px-4 py-2 rounded-tl-lg rounded-bl-lg bg-gray-50 dark:hover:bg-neutral-900 hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoBack}
                >
                  {"<"} prev
                </motion.button>
              )}
              {currentStep < questions.length - 1 && (
                <motion.button
                  className="next-button text-gray-800  shadow-sm dark:bg-neutral-900 dark:text-blue-600 border dark:border-blue-600 border-gray-400 text-sm px-4 py-2 rounded-tr-lg rounded-br-lg bg-gray-50 dark:hover:bg-neutral-900 hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUserAction(input)}
                >
                  next {">"}
                </motion.button>
              )}
            </motion.div>
          )}
          <div ref={messageEndRef}></div>
        </div>

        <ChatInput
          input={input}
          current={questions[currentStep]}
          setInput={setInput}
          onSubmit={handleUserAction}
        />
      </div>
    </div>
  );
}

export default ChatPage;
