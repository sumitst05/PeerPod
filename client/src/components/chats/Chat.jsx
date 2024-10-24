import Picker from "emoji-picker-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../contexts/ThemeContext";

export const Chat = ({ roomId }) => {
  const mode = import.meta.env.VITE_MODE;
  const { user } = useAuth();
  const { theme } = useTheme();
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const replyRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const url =
      mode === "DEV"
        ? "http://localhost:3000"
        : "https://peerpod-hk5e.onrender.com";
    socketRef.current = io(url, {
      withCredentials: true,
    });
    socketRef.current.emit("joinRoom", roomId.toUpperCase());
    socketRef.current.emit("fetchMessages", roomId.toUpperCase());

    socketRef.current.on("newMessage", (message) => {
      console.log("Received new message:", message);
      setAllMessages((prevMessages) => [...prevMessages, message]);
    });

    socketRef.current.on("messages", (messages) => {
      console.log("Fetched messages:", messages);
      setAllMessages(messages);
    });

    return () => {
      socketRef.current.off("newMessage");
      socketRef.current.off("messages");
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // Scroll to the bottom whenever allMessages changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "instant" });

    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setShowEmojiPicker(false);
        setReplyTo(null);
      }
    });
    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setShowEmojiPicker(false);
        }
      });
    };
  }, [allMessages]);

  const handleReply = (sender) => {
    setReplyTo(sender);
    replyRef.current?.focus();
  };

	const closeReply = () =>{
		setReplyTo(null);
	}

  const handleMessageSend = () => {
    if (newMessage.trim()) {
      const message = {
        content: newMessage,
        contentType: "TEXT",
        channelType: roomId.toUpperCase(),
        sender: user._id,
        replyTo: replyTo?._id,
        createdAt: new Date(),
      };
      console.log("Sending message:", message);
      socketRef.current.emit("sendMessage", message);
      setNewMessage("");
      setShowEmojiPicker(false);
      setReplyTo(null);
    }
  };

  const handleMessage = useCallback((e) => {
    setNewMessage(e.target.value);
  }, []);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleOutsideClick = useCallback((e) => {
    if (
      e.target.closest(".emoji-picker-container") === null &&
      e.target.closest(".emoji-button") === null
    ) {
      setShowEmojiPicker(false);
    }
  }, []);

  return (
    <div
      className={` ${theme && "dark"} flex flex-col overflow-hidden h-screen dark:bg-neutral-900 dark:text-white  text-gray-800`}
    >
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-[95%]">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-xl bg-gray-100 h-full p-4 dark:bg-neutral-900">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid  -ml-2">
                  {allMessages.map((m, i) => (
                    <MessageLeft
                      key={i}
                      message={m}
                      allMessages={allMessages}
                      onReply={handleReply}
                    />
                  ))}
                </div>
                <div ref={chatEndRef} /> {/* Empty div to scroll into view */}
              </div>
						</div>
						{replyTo?.sender.username && (
							<div className="flex justify-between">
								<p className="text-violet-500 font-bold ml-2">
									Replying to: @{replyTo?.sender.username}
								</p>
								<button
									type="button"
								  onClick={closeReply}
									className="text-gray-900 dark:text-white hover:bg-red-500 hover:text-gray-300 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
								>
									<svg className="w-3 h-3" viewBox="0 0 14 14">
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
										/>
									</svg>
									<span className="sr-only">Close modal</span>
								</button>
							</div>
						)}
            <div className="flex flex-row items-center h-16 drop-shadow-lg rounded-xl bg-white dark:bg-neutral-900 w-full px-2">
              <div className="flex-grow">
                <div className="relative w-full">
                  <input
                    ref={replyRef}
                    value={newMessage}
                    onChange={handleMessage}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleMessageSend();
                      }
                    }}
                    placeholder="type something..."
                    type="text"
                    className="flex w-full border border-gray-400/50 rounded-xl dark:bg-neutral-900 focus:outline-none focus:border-indigo-500 pl-4 md:pr-10 pr-6 h-10"
                  />
                  <button
                    onClick={toggleEmojiPicker}
                    className="emoji-button absolute flex items-center justify-center h-full w-12 right-0 top-0 dark:text-neutral-900 hover:text-gray-600 dark:hover:text-gray-600"
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
                    <div className="emoji-picker-container border absolute z-50 bottom-[4rem] right-0 w-fit">
                      <Picker
                        height={350}
                        width={400}
                        onEmojiClick={(e) =>
                          setNewMessage((prev) => prev + e.emoji)
                        }
												style={{ fontSize: '1.2rem'}}
                        disableSearchBar
                        disableSkinTonePicker
                        lazyLoadEmojis
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <button
                  onClick={handleMessageSend}
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white md:py-1 md:pr-2 sm:ml-4 flex-shrink-0"
                >
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
                  <span className="hidden md:block">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageLeft = ({ message, allMessages, onReply }) => {
  const convertUrlsToLinks = (text) => {
    const urlRegex =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const originalMessage = allMessages.find((m) => m._id === message.replyTo);

  const handleOriginalMessageClick = (messageId) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      className={`col-start-1 col-end-8 p-3 rounded-lg relative ${theme && "dark"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-row items-center">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-gray-50 flex-shrink-0">
          <img
            src={message.sender.profilePicture}
            alt={message.sender.username}
            className="h-8 w-8 rounded-full"
          />
        </div>
        <div
          className="flex flex-col items-start justify-start"
          id={`message-${message._id}`}
        >
          <span className="text-sm text-violet-500 ml-2 dark:text-indigo-300">
            {message.sender.username}
          </span>
          <div
            className="relative ml-2 text-sm bg-white py-3 px-3 shadow rounded-xl dark:bg-neutral-800"
            onClick={() => handleOriginalMessageClick(originalMessage._id)}
          >
            {originalMessage && message.replyTo && (
              <div className="flex flex-col bg-zinc-100 dark:bg-zinc-700 p-1 rounded mb-2 cursor-pointer">
                <p className="text-violet-500">
                  {originalMessage.sender.username}
                </p>
                <p className="text-ellipsis overflow-hidden whitespace-nowrap max-w-xs">
                  {originalMessage.content}
                </p>
              </div>
            )}
            <div className="flex gap-3 items-baseline justify-between">
              <div>{convertUrlsToLinks(message.content)}</div>
              <span className="text-[0.7rem] text-gray-900/60 dark:text-gray-400">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
        {isHovered && <ThreeDots onReply={() => onReply(message)} />}
      </div>
    </div>
  );
};

const ThreeDots = ({ onReply }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <button
        onClick={toggleDropdown}
        className="relative flex-shrink-0 inline-flex self-center items-center mt-4 text-sm font-medium text-center text-gray-900 rounded-lg hover:bg-gray-100 focus:outline-none dark:text-white"
        type="button"
      >
        <svg
          className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-white dark:hover:bg-neutral-900"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 4 15"
        >
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button>
      {isOpen && (
        <div className="ml-4 absolute mx-auto z-10 bg-white divide-y dark:bg-neutral-800 divide-gray-100 rounded-lg shadow w-40">
          <div className="text-sm text-gray-700">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900 dark:text-white dark:hover:bg-neutral-700"
              onClick={onReply}
            >
              Reply
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900 dark:text-white dark:hover:bg-neutral-700">
              Edit
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900 dark:text-white dark:hover:bg-neutral-700">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
