import { useEffect, useRef, useState } from "react";

function ChatPage() {
  // Create a reference to the messages container
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      heading: "Welcome to TalentTua AI. Your AI-powered copilot for hiring...",
      content:
        "You can ask questions like : I am looking to hire :Software Developer, Data Scientist, etc.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = (userMessage) => {
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    }, 2000);
  };

  const getBotResponse = (userMessage) => {
    if (userMessage.includes("hire"))
      return "Are you looking to hire for a specific position?";
    if (userMessage.includes("job"))
      return "Are you looking for a job in the tech industry?";
    return "Can you please clarify your request?";
  };
  // Scroll to the last message whenever the messages array changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Run the effect whenever messages change
  return (
    <>
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
          {/* /* End Title */}
          <ul className="mt-16 space-y-5">
            {/* Chat Bubble */}
            {messages.map((message, index) => (
              <li
                key={index} // Use a unique identifier (e.g., `message.id` or `index`)
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
                        {message.heading || "How can we help?"}
                      </h2>
                      <div className="space-y-1.5">
                        <p className="mb-1.5 text-sm text-gray-800 dark:text-white">
                          {message.content || "You can ask questions like:"}
                        </p>
                        {message.suggestions && (
                          <ul className="list-disc list-outside space-y-1.5 ps-3.5">
                            {message.suggestions.map((suggestion, i) => (
                              <li
                                key={i}
                                className="text-sm text-gray-800 dark:text-white"
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* User Message */
                  <div className="py-2 sm:py-4 w-full justify-items-end">
                    <div className="max-w-2xl flex gap-x-2 sm:gap-x-4">
                      <div className="grow space-y-3">
                        <h2 className="font-medium text-gray-800 dark:text-white">
                          {message.heading || "How can we help?"}
                        </h2>
                        <div className="space-y-1.5">
                          <p className="mb-1.5 text-sm text-gray-800 dark:text-white">
                            {message.content || "You can ask questions like:"}
                          </p>
                          {message.suggestions && (
                            <ul className="list-disc list-outside space-y-1.5 ps-3.5">
                              {message.suggestions.map((suggestion, i) => (
                                <li
                                  key={i}
                                  className="text-sm text-gray-800 dark:text-white"
                                >
                                  {suggestion}
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
            <div ref={messagesEndRef} />
          </ul>
        </div>
        {/* Textarea */}
        <div className="max-w-4xl mx-auto sticky bottom-0 z-10 p-3 sm:py-6">
          <div className="lg:hidden flex justify-end mb-2 sm:mb-3">
            {/* Sidebar Toggle */}
            <button
              type="button"
              className="p-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="hs-application-sidebar"
              aria-label="Toggle navigation"
              data-hs-overlay="#hs-application-sidebar"
            >
              <svg
                className="shrink-0 size-3.5"
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
                <line x1={3} x2={21} y1={6} y2={6} />
                <line x1={3} x2={21} y1={12} y2={12} />
                <line x1={3} x2={21} y1={18} y2={18} />
              </svg>
              <span>Sidebar</span>
            </button>
            {/* End Sidebar Toggle */}
          </div>
          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
              setInput("");
            }}
          >
            <div className="relative">
              <textarea
                className="p-4 pb-12 block w-full bg-gray-100 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                defaultValue={""}
              />
              {/* Toolbar */}
              <div className="absolute bottom-px inset-x-px p-2 rounded-b-lg bg-gray-100 dark:bg-neutral-800">
                <div className="flex justify-between items-center">
                  {/* Button Group */}
                  <div className="flex items-center">
                    {/* Mic Button */}
                    <button
                      type="button"
                      className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-white focus:z-10 focus:outline-none focus:bg-white dark:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
                        <rect width={18} height={18} x={3} y={3} rx={2} />
                        <line x1={9} x2={15} y1={15} y2={9} />
                      </svg>
                    </button>
                    {/* End Mic Button */}
                    {/* Attach Button */}
                    <button
                      type="button"
                      className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-white focus:z-10 focus:outline-none focus:bg-white dark:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </button>
                    {/* End Attach Button */}
                  </div>
                  {/* End Button Group */}
                  {/* Button Group */}
                  <div className="flex items-center gap-x-1">
                    {/* Mic Button */}
                    <button
                      type="button"
                      className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-white focus:z-10 focus:outline-none focus:bg-white dark:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1={12} x2={12} y1={19} y2={22} />
                      </svg>
                    </button>
                    {/* End Mic Button */}
                    {/* Send Button */}
                    <button
                      type="submit"
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
          </form>

          {/* End Input */}
        </div>
        {/* End Textarea */}
      </div>
    </>
  );
}

export default ChatPage;
