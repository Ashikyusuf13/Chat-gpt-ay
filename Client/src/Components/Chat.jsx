import React, { use, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../Context/Appcontext";
import { assets } from "../assets/assets";
import Messages from "./Messages";
import toast from "react-hot-toast";

const Chat = () => {
  const containerRef = useRef(null);
  const { selectedchat, theme, user, axios, setUser } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  // standardize to `prompt`
  const [prompt, setPrompt] = useState("");
  // normalize mode values to lowercase to match server routes: 'text' | 'image'
  const [mode, setMode] = useState("text");
  const [ispublished, setIspublished] = useState(false);

  const onsubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const promptcopy = prompt;
      // clear input immediately
      setPrompt("");
      // optimistic add
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: promptcopy,
          timestamp: Date.now(),
          isimage: false,
        },
      ]);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: selectedchat._id, prompt: promptcopy, ispublished },
        { withCredentials: true, timeout: 120000 }, // 120 second timeout for rate limiting
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);

        // decrease user credits (guard in case setUser isn't provided)
        if (typeof setUser === "function") {
          if (mode === "image") {
            setUser((prev) => ({ ...prev, credits: (prev?.credits || 0) - 2 }));
          } else {
            setUser((prev) => ({ ...prev, credits: (prev?.credits || 0) - 1 }));
          }
        }
      } else {
        toast.error(data.message || "Failed to process request");
        setPrompt(promptcopy);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to process request. If you're getting rate limit errors, please wait and try again.";
      toast.error(errorMessage);
      setPrompt(promptcopy);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessages(selectedchat?.messages ?? []); // ensure array
  }, [selectedchat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex-col justify-between p-1 flex md:m-10 xl:m-30 max-md:mt-15 2xl:pr-40">
      {/* messages */}
      <div
        ref={containerRef}
        className="flex-1 mb-5 overflow-y-auto custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="logo"
              className="w-100"
            />
            <p className="mt-5 text-3xl sm:text-5xl font-bold text-center text-slate-900 dark:text-white">
              Welcome to my ay-gpt
            </p>
          </div>
        )}

        {Array.isArray(messages) &&
          messages.map((message, index) => (
            <Messages key={message.id ?? index} message={message} />
          ))}
        {/* 
          3 dots animation loading */}
        {loading && (
          <div className="loader flex items-center gap-2 mt-4 ml-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 dark:bg-purple-400 animate-bounce "></div>
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 dark:bg-purple-400 animate-bounce "></div>
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 dark:bg-purple-400 animate-bounce "></div>
          </div>
        )}
      </div>

      {/*  publish community */}
      {mode === "image" && (
        <div className="flex items-center mx-auto justify-center p-2 gap-3 mb-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={ispublished}
              onChange={(e) => setIspublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500 transition-all"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4"></div>
          </label>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Publish to Community Gallery
          </span>
        </div>
      )}

      {/* input */}
      <form
        onSubmit={onsubmit}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
          border-2 border-purple-300 dark:border-purple-700 
          rounded-2xl w-full max-w-3xl p-2 
          flex items-center justify-between gap-2
          shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20
          focus-within:border-purple-500 dark:focus-within:border-purple-500
          transition-all duration-300"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="appearance-none px-4 py-2 rounded-xl 
            bg-purple-100 dark:bg-purple-900/50 
            text-sm font-medium text-purple-700 dark:text-purple-300 
            border border-purple-200 dark:border-purple-700
            outline-none cursor-pointer
            hover:bg-purple-200 dark:hover:bg-purple-800/50
            transition-colors"
        >
          <option value="text">💬 Text</option>
          <option value="image">🎨 Image</option>
        </select>

        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here..."
          required
          className="flex-1 w-full px-4 py-2 text-sm 
            bg-transparent
            text-gray-800 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            outline-none"
        />

        <button
          disabled={loading}
          className="p-2.5 rounded-xl 
            bg-gradient-to-r from-purple-600 to-pink-500 
            hover:from-purple-700 hover:to-pink-600
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-md hover:shadow-lg
            transition-all duration-300"
        >
          {loading ? (
            <svg
              className="w-5 h-5 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default Chat;
