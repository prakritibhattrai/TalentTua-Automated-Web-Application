import PropTypes from "prop-types";
import { motion } from "framer-motion";
import BotMessage from "./BotMessage";
import user from "../../assets/user.png";

export const MessageList = ({
  messages,
  onSelect,
  onSubmit,
  userData,
  icpData,
  messageEndRef,
}) => (
  <ul className="mt-16 space-y-5">
    {messages &&
      messages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          onSelect={onSelect}
          onSubmit={onSubmit}
          userData={userData}
          icpData={icpData}
          messageEndRef={messageEndRef}
        />
      ))}
  </ul>
);

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  icpData: PropTypes.object.isRequired,
};

const MessageItem = ({
  message,
  onSelect,
  onSubmit,
  userData,
  icpData,
  messageEndRef,
}) => {
  const isBot = message.sender === "bot";

  return (
    <motion.li
      className={`max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 ${
        isBot ? "justify-start" : "justify-end"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5 }}
    >
      {isBot ? (
        <>
          <BotMessage
            message={message}
            onSelect={onSelect}
            onSubmit={onSubmit}
            userData={userData}
            icpData={icpData}
          />
        </>
      ) : (
        <>
          <UserMessage message={message} />
        </>
      )}
    </motion.li>
  );
};

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  icpData: PropTypes.object.isRequired,
};

const UserMessage = ({ message }) => {
  const renderContent = () => {
    if (message.name === "jobTitle") {
      const { occupation, jobTitle, selectedJobTitle } = message.content;
      return (
        <div className="bg-blue-600 w-fit inline-block dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-white dark:text-white break-words">
            Occupation: {occupation?.title}
          </p>
          <p className="text-sm text-white dark:text-white break-words">
            Job Title :{" "}
            {selectedJobTitle?.title || jobTitle || occupation?.title}
          </p>
        </div>
      );
    }
    if (message.name === "traitMatrix") {
      return (
        <div className="bg-blue-600 text-white inline-block dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          Trait Matrix saved successfully
        </div>
      );
    }
    return typeof message.content === "object" ? (
      Array.isArray(message.content) ? (
        <div className="bg-blue-600 w-fit text-white inline-block dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          {message.content.join(", ")}
        </div>
      ) : (
        <div className="bg-blue-600 w-fit text-white inline-block dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          {JSON.stringify(message.content)}
        </div>
      )
    ) : (
      <div className="bg-blue-600 w-fit text-white inline-block dark:bg-gray-800 p-3 rounded-lg shadow-sm">
        {message.content}
      </div>
    );
  };

  return (
    <motion.div
      className="py-2 sm:py-4 w-fit justify-items-end"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-2xl flex gap-x-2 sm:gap-x-4">
        <div className="grow space-y-3">
          <div className="space-y-1.5">
            <div className="mb-1.5 mt-2 text-sm text-gray-800 dark:text-white break-words max-w-md">
              {renderContent()}
            </div>
          </div>
        </div>
        <span className="">
          <img src={user} className="h-7 w-7" alt="User" />
        </span>
      </div>
    </motion.div>
  );
};

UserMessage.propTypes = {
  message: PropTypes.object.isRequired,
};
