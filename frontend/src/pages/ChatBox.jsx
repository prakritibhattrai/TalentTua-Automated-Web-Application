function ChatBox({ children }) {
  return (
    <div className="chat-container max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="chat-box bg-white p-4 rounded-lg shadow-md space-y-4">
        <div className="messages space-y-4">{children}</div>
      </div>
    </div>
  );
}

export default ChatBox;
