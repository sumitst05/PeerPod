import { useState } from "react";
import Picker from "emoji-picker-react";

export const Chat = ({ roomId }) => {
  const messages = ["Hello"];
  const [allMessages, setAllMessages] = useState(messages);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleMessageSend = () => {
    if (newMessage.trim()) {
      setAllMessages((p) => [...p, newMessage]);
      setNewMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleMessage = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="flex flex-col overflow-hidden h-screen  text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-[95%]">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid  -ml-2">
                  {allMessages.map((m, i) => (
                    <MessageLeft key={i} message={m} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center h-16 drop-shadow-lg rounded-xl bg-white w-full px-2">
              <div className="flex-grow">
                <div className="relative w-full">
                  <input
                    value={newMessage}
                    onChange={handleMessage}
                    onKeyDown={handleMessage}
                    type="text"
                    className="flex w-full border border-gray-400/50 rounded-xl focus:outline-none focus:border-indigo-500 pl-4 md:pr-10 pr-6 h-10"
                  />
                  <button
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="yellow"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute z-50 bottom-[4rem] right-5 md:left-[26rem] w-full">
                      <Picker
                        height={400}
                        width={300}
                        onEmojiClick={(e) =>
                          setNewMessage((prev) => prev + e.emoji)
                        }
                        disableSearchBar
                        disableSkinTonePicker
                        lazyLoadEmojis
                        className="md:w-full w-1/2 max-w-md mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <button
                  onClick={handleMessageSend}
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white md:px-2 md:py-1 flex-shrink-0"
                >
                  <span className="hidden md:block">Send</span>
                  <span className="p-3 md:p-2">
                    <svg
                      className="w-4 h-4 transform rotate-45"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageLeft = ({ message }) => {
  return (
    <div className="col-start-1 col-end-8 p-3 rounded-lg relative">
      <div className="flex flex-row">
        <div className="flex items-center mt-2 justify-center h-8 w-8 rounded-full bg-indigo-500 text-gray-50 flex-shrink-0">
          {message[0]}
        </div>
        <div className="relative ml-2 text-sm bg-white py-3 px-3 shadow rounded-xl">
          <div className="flex gap-3 items-baseline">
            <div>{message}</div>
            <span className="text-[0.7rem] text-gray-900/60">1:30 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
