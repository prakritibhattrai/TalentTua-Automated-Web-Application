import React from "react";

function Message({ text, sender }) {
  return (
    <div
      className={`message ${sender === "user" ? "text-right" : "text-left"}`}
    >
      <p
        className={`p-2 ${
          sender === "user"
            ? "bg-blue-500 text-white rounded-lg"
            : "bg-gray-200 rounded-lg"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

export default Message;
