import { useEffect, useRef, useState } from "react";
import Title from "../components/chat/Title";
import { MessageList } from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import { staticData } from "../data/traitMatrix";
import { motion } from "framer-motion";
import { sanitizeInput, validateData } from "../helpers/sanitizeInput";
const API_BASE_URL = import.meta.env.VITE_API_URL;

function ChatPage() {
  const messageEndRef = useRef(null);
  const [icpData, setICPData] = useState({});
  const [results, setResults] = useState({});
  const [botTyping, setBotTyping] = useState(false);
  const [input, setInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});
  const botTypingRef = useRef(null); // Ref for bot typing section

  const questions = [
    {
      name: "welcome",
      question:
        "At TalentTua we are experts when it comes to finding incredibly talented candidates that match your unique Ideal Candidate Profile (ICP). What is an ICP you may ask?",
      answer:
        "It is simple we take day one hard skills needed for the role, level of experience, and most importantly the soft skills that relate to the role and have you customize what your open role requires.",
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
      answer: questions[0].answer,
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
            let response = await fetch(`${API_BASE_URL}/jobs`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jobTitle: userInput }),
            });

            const data = await response.json();
            console.log(data);

            if (data) {
              if (data?.keyProficiencies?.technicalSkills) {
                setResults((prev) => ({
                  ...prev,
                  toolsProficiencies: data.keyProficiencies?.technicalSkills,
                }));
              }

              if (
                data?.niceToHave?.work_styles ||
                data?.niceToHave?.work_values ||
                data?.niceToHave?.interests ||
                data?.niceToHave?.abilities ||
                data?.niceToHave?.skills
              ) {
                setResults((prev) => ({
                  ...prev,
                  work_styles: [
                    ...(data?.niceToHave?.work_styles || []),
                    ...(data?.niceToHave?.interests || []),
                    ...(data?.niceToHave?.abilities || []),
                    ...(data?.niceToHave?.skills || []),
                    ...(data?.niceToHave?.work_values || []),
                  ],
                }));
              }
              // Stop bot typing here before sending the next message
              setBotTyping(false);
            }
          }

          if (currentQuestion.name === "welcome") {
            if (userInput === "No") {
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
      setBotTyping(true);
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
        setBotTyping(false); // Stop typing if validation fails
        return; // Stop submission and allow user to fix errors
      }

      // Proceed with submitting the data if valid
      setUserData(updatedData);

      setBotTyping(true); // Bot starts processing the ICP request

      // Simulate typing for a short duration to improve UX
      setTimeout(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/jobs/saveJob`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            throw new Error("Failed to save job data");
          }

          const responseData = await response.json();
          console.log(responseData);
          if (!responseData) {
            // If ICP generation fails, show an error
            throw new Error("ICP generation failed. Please try again.");
          }

          // If ICP is successfully generated, update the state
          setICPData((prev) => ({ ...prev, ...responseData }));
          setBotTyping(false); // Bot is done processing

          // Move to the next step or complete the process
          const nextStep = currentStep + 1;
          if (nextStep < questions.length) {
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
          } else {
            setMessages((prev) => [
              ...prev,
              {
                heading: "",
                content: "Process complete! Thank you for your inputs.",
                sender: "bot",
              },
            ]);
          }
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            {
              content: error.message, // Show the specific error message
              sender: "bot",
            },
          ]);

          // Re-display the current question for correction
          setMessages((prev) => [
            ...prev,
            {
              heading: "",
              content: questions[currentStep].question,
              inputType: questions[currentStep].inputType,
              options: questions[currentStep].options || "",
              name: questions[currentStep].name || "",
              sender: "bot",
            },
          ]);
        } finally {
          setBotTyping(false); // Ensure bot stops typing in all cases
        }
      }, 1000); // Simulated delay for UX
    } catch (error) {
      setBotTyping(false); // Stop typing on error
      setMessages((prev) => [
        ...prev,
        {
          content: error.message, // Show the specific error message
          sender: "bot",
        },
      ]);

      // Re-display the current question for correction
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
      }, 300);
    }
  };

  // Set the ref dynamically based on botTyping status
  useEffect(() => {
    if (botTyping) {
      botTypingRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [botTyping]); // Trigger effect when botTyping changes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages[messages.length - 1]?.sender === "bot") {
      setBotTyping(false); // Stop bot typing when the bot message is displayed
    }
  }, [messages]);

  return (
    <div className="relative bg-none min-h-screen max-h-100 lg:ps-64">
      <div className="pt-10 lg:pt-14">
        <Title />
        <MessageList
          messages={messages}
          onSelect={handleUserAction}
          onSubmit={handleFormSubmit}
          userData={userData}
          icpData={icpData}
          botTyping={botTyping}
          message={messageEndRef}
        />

        <div className="max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 justify-start">
          {botTyping && (
            <motion.div
              className="bot-typing flex items-center mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.8, // Smoother transition duration
                ease: "easeInOut", // Easier animation curve
              }}
              ref={botTypingRef} // Attach ref to bot typing div
            >
              <div className="typing-dots flex gap-1">
                <motion.span
                  className="dot h-2 w-2 bg-gradient-to-tl from-blue-600 to-violet-600 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 0.3,
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                />
                <motion.span
                  className="dot h-2 w-2 bg-gradient-to-tl from-blue-600 to-violet-600 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 0.3,
                    duration: 0.6,
                    ease: "easeInOut",
                    delay: 0.15, // Stagger the animation
                  }}
                />
                <motion.span
                  className="dot h-2 w-2 bg-gradient-to-tl from-blue-600 to-violet-600 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 0.3,
                    duration: 0.6,
                    ease: "easeInOut",
                    delay: 0.3, // Stagger the animation
                  }}
                />
              </div>
              <motion.p
                className="ml-2 bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} // Fade out when exiting
                transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
              >
                Analyzing your data...
              </motion.p>
            </motion.div>
          )}

          {!botTyping && currentStep > 0 && (
            <motion.div
              className="navigation-buttons flex justify-start items-center mt-1 relative"
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {currentStep > 0 && (
                <motion.button
                  className="go-back-button text-gray-700 shadow-sm font-medium dark:bg-neutral-900 dark:text-blue-600 border dark:border-blue-600 border-gray-400 text-sm px-3 py-1 rounded-tl-lg rounded-bl-lg bg-gray-50 dark:hover:bg-neutral-900 hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoBack}
                >
                  {"< "}prev
                </motion.button>
              )}
              {currentStep < questions.length - 1 && (
                <motion.button
                  className="next-button text-gray-700  shadow-sm font-medium dark:bg-neutral-900 dark:text-blue-600 border dark:border-blue-600 border-gray-400 text-sm px-3 py-1 rounded-tr-lg rounded-br-lg bg-gray-50 dark:hover:bg-neutral-900 hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUserAction(input)}
                >
                  next{" >"}
                </motion.button>
              )}
            </motion.div>
          )}
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
