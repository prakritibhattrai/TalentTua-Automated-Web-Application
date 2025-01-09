import { useEffect, useRef, useState } from "react";
import Title from "../components/chat/Title";
import { MessageList } from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import { staticData } from "../data/traitMatrix";

function ChatPage() {
  const questions = [
    {
      name: "jobTitle",
      question: "What is the job role or title you are looking to hiring for?",
      inputType: "text",
    },
    {
      name: "jobFamily",
      question: "Please select a job family for this role:",
      inputType: "dropdown",
      options: [
        "Accounting and Finance",
        "Administrative Support",
        "Craft and related trades",
        "Database and Network Analysts",
        "Health and Medicine",
        "Human Resources",
        "Legal, Social, and Cultural",
        "Manufacturing",
        "Marketing and Advertising",
        "Natural Resources and Extraction",
        "Sales and Retail",
        "Science and Engineering",
        "Service and Product Support",
        "Software Applications and Developers",
        "Other",
      ],
    },
    {
      name: "industry",
      question: "Please select a industry for the role:",
      inputType: "dropdown",
      options: [
        "Agriculture, forestry, fishing and hunting",
        "Mining, quarrying, and oil and gas extraction",
        "Utilities",
        "Construction",
        "Wholesale trade",
        "Retail Trade",
        "Transportation and warehousing",
        "Information and cultural industries",
        "Manufacturing",
        "Finance and insurance",
        "Real estate and rental and leasing",
        "Professional, scientific, and technical services",
        "Management of companies and enterprises",
        "Administrative and support services",
        "Educational services",
        "Waste management and remediation services",
        "Health care and social assistance",
        "Arts, entertainment and recreation",
        "Accommodation and food services",
        "Other services (except public administration)",
        "Public administration",
      ],
    },
    {
      name: "seniorityLevel",
      question: "Please select the seniority level for the role:",
      inputType: "dropdown",
      options: [
        "Entry level - very limited proficiency, willing to learn",
        "Junior - limited proficiency, building competencies and skill sets",
        "Intermediate - proficient, honing competencies and advancing skill sets",
        "Senior - advanced proficiency, highly competent, could teach lower levels",
        "Manager - intermediate to senior level, manages people, delivery, or product/service",
        "Executive - proficient to advanced proficiency domain expertise, successful people manager or leader",
      ],
    },
    {
      name: "stakeholderEngagement",
      question: "Please select multiple stakeholder engagement for the role:",
      inputType: "checkbox",
      options: [
        "Internal team or department",
        "Other internal teams or departments",
        "Client-facing responsibilities",
        "Suppliers, vendors, or other business supports",
        "Legislative, legal, NGOs or other government-regulated organizations",
        "Board of directors, external shareholders, or executive team",
      ],
    },
    {
      name: "traitMatrix",
      question:
        "Please select a TraitMatrix scale from according to the importance:",
      inputType: "",
      options: staticData.trait_matrix,
    },
    {
      name: "desirableSoftSkills",
      question:
        "Please select or enter the five must have soft skills for the role:",
      inputType: "checkbox",
      options: [
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
      options: [
        "Lack of initiative",
        "Poor communication",
        "Inflexibility",
        "Disorganization",
        "Lack of attention to detail",
        "Negative attitude",
        "Poor time management",
      ],
    },
    {
      name: "toolProficiencies",
      question:
        "Please select tool and proficiencies required for day 1 on the job:",
      inputType: "checkbox",
      options: [
        "Excel",
        "PowerPoint",
        "CRM software",
        "SQL",
        "Data visualization tools",
        "Programming languages (Python, Java, etc.)",
      ],
    },
    {
      name: "roleDescription",
      question:
        "Describe what is unique about this role for your organization in comparison to other organizations(Why does this role exists in your organization?)",
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
  const messageEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      heading: "Welcome to TalentTua AI. Your AI-powered copilot for hiring...",
      content: questions[0].question, // First question
      inputType: questions[0].inputType,
      sender: "bot",
    },
  ]);
  const [botTyping, setBotTyping] = useState(false);
  const [input, setInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});
  const handleUserAction = (userInput) => {
    const updatedUserData = {
      ...userData,
      [`${questions[currentStep].name}`]: userInput,
    };
    setUserData(updatedUserData);

    const userMessage = {
      content: userInput,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    const nextStep = currentStep + 1;
    if (nextStep < questions.length) {
      setBotTyping(true); // Show typing indicator
      setTimeout(() => {
        const nextBotMessage = {
          heading: "",
          content: questions[nextStep].question,
          inputType: questions[nextStep].inputType,
          options: questions[nextStep].options || "",
          name: questions[nextStep].name || "",
          sender: "bot",
        };

        setMessages((prevMessages) => [...prevMessages, nextBotMessage]);
        setCurrentStep(nextStep);
        setBotTyping(false); // Hide typing indicator
      }, 1000); // Simulate delay for bot typing
    } else {
      const thankYouMessage = {
        heading: "",
        content:
          "Thank you for providing the details. We’ll take it from here!",
        sender: "bot",
      };

      setBotTyping(true); // Show typing indicator
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, thankYouMessage]);
        setBotTyping(false); // Hide typing indicator
      }, 1000);
    }
  };
  const handleEdit = () => {
    // Let the user go back to the question they want to edit (you could give them options for each question)
    setIsReviewing(false);
    setCurrentStep(0);
    setMessages([
      {
        heading: "Welcome back! Let's continue the questionnaire.",
        content: questions[0].question,
        sender: "bot",
      },
    ]);
  };
  const handleConfirmation = () => {
    // You can handle the final submission here, such as sending the data to the server
    const submitMessage = {
      heading: "",
      content:
        "Thank you for confirming! Your data has been submitted successfully.",
      sender: "bot",
    };

    setMessages((prevMessages) => [...prevMessages, submitMessage]);
  };
  const handleFormSubmit = () => {
    console.log(userData);
  };
  // Scroll to the last message when messages update
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="relative bg-none w-full lg:ps-64">
      <div className="pt-10 lg:pt-14">
        <Title />

        <MessageList messages={messages} onSelect={handleUserAction} />
        {botTyping && (
          <div className="flex max-w-4xl justify-start">
            <div className="py-2 px-16 text-blue-600">
              <span className="animate-pulse [animation-delay:0ms] inline-block mr-1">
                Bot
              </span>
              <span className="animate-pulse [animation-delay:500ms] inline-block mr-1">
                is
              </span>
              <span className="animate-pulse [animation-delay:900ms] inline-block mr-1">
                typing...
              </span>
            </div>
          </div>
        )}

        <div ref={messageEndRef}></div>

        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleUserAction}
        />
      </div>
    </div>
  );
}

export default ChatPage;
