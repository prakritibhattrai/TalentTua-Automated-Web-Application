import React from "react";

function UserInput({ value, onChange, onSend, placeholder }) {
  return (
    <div className="user-input flex items-center mt-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="border rounded-lg p-2 w-full"
        placeholder={placeholder}
      />
      <button
        onClick={onSend}
        className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
      >
        Send
      </button>
    </div>
  );
}

export default UserInput;
