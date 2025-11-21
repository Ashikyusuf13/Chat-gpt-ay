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
      if (!user) return toast.error("Please login to send a message");
      if (!selectedchat?._id)
        return toast.error("Select or create a chat first");

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
        { withCredentials: true }
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
        toast.error(data.message);
        setPrompt(promptcopy);
      }
    } catch (error) {
      toast.error(error.message);
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
    <div className="flex-1 flex-col justify-between m-5 flex md:m-10 xl:m-30 max-md:mt-15 2xl:pr-40">
      {/* messages */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-auto">
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
          <div className="loader flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce "></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce "></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce "></div>
          </div>
        )}
      </div>

      {/*  publish community */}

      {mode === "image" && (
        <div className="flex items-center mx-auto justify-center  p-1 gap-2">
          <input
            className="cursor-pointer"
            type="checkbox"
            checked={ispublished}
            onChange={(e) => setIspublished(e.target.checked)}
          />
          <label>
            <p className="text-sm">Publish Generated image to Community</p>
          </label>
        </div>
      )}
      {/* input */}
      <form
        onSubmit={onsubmit}
        className="border border-purple-800 rounded-full w-full max-w-3xl p-3 flex items-center justify-between gap-3"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="appearance-none pr-4 pl-3 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 outline-none "
        >
          <option
            className="bg-transparent hover:dark:bg-purple-400"
            value="text"
          >
            Text
          </option>
          <option value="image">Image</option>
        </select>
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here..."
          required
          className="flex-1 w-full text-sm outline-none"
        />
        <button disabled={loading}>
          <img src={loading ? assets.stop_icon : assets.send_icon} alt="" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
