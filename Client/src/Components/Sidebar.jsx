import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/Appcontext";
import moment from "moment";
import toast from "react-hot-toast";

const Sidebar = ({ openMenu, setOpenMenu }) => {
  const [search, setSearch] = useState("");

  const {
    user,
    chats,
    theme,
    setTheme,
    navigate,
    setSelectedchat,
    createnewchat,
    axios,
    setChats,
    fetchUserChats,
  } = useContext(AppContext);

  const logout = () => {
    axios.post("/api/auth/logout", {}, { withCredentials: true }).then(() => {
      window.location.reload();
      toast.success("Logged out successfully");
    });
  };

  const deletechat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirm) return;
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { withCredentials: true }
      );
      if (data.success) {
        setChats((prev) => prev.filter((c) => c._id !== chatId));
        toast.success(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div
      className={`p-5 flex flex-col gap-2 border-r border-gray-300 dark:border-gray-700 h-screen w-full md:w-72
      bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black
      backdrop-blur-3xl max-md:absolute left-0 z-1 transition-all duration-500 ${
        !openMenu && "max-md:-translate-x-full"
      } `}
    >
      {/* logo */}

      <img
        onClick={() => {
          navigate("/");
          setOpenMenu(false);
        }}
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="Logo"
        className="w-40 cursor-pointer drop-shadow-lg"
      />

      {/* add btn */}
      <button
        onClick={createnewchat}
        className="w-full py-1 bg-gradient-to-r from-indigo-500 to-purple-600 
        text-white rounded-lg shadow-md 
        hover:from-purple-600 hover:to-pink-500 
        transition-all duration-300 ease-in-out cursor-pointer 
        flex items-center gap-2 justify-center"
      >
        <span className="text-lg">+</span>
        <span>New Chat</span>
      </button>

      {/* search */}
      <div
        className="flex items-center gap-3 bg-white/80 dark:bg-gray-700/60 
        text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 shadow-sm 
        focus-within:ring-2 focus-within:ring-pink-400 transition w-full"
      >
        <img
          src={assets.search_icon}
          alt="searchicon"
          className="w-5 not-dark:invert"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Conversations"
          className="bg-transparent focus:outline-none w-full placeholder-gray-600 dark:placeholder-gray-200 text-xs"
        />
      </div>

      {/* chats */}
      {chats.length > 0 ? (
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide ">
          Recent Chats
        </div>
      ) : (
        <div className="text-sm italic text-gray-600 mt-2">No Recent Chats</div>
      )}

      <div className="text-sm space-y-3 overflow-y-auto flex-1 min-h-0 pb-4">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              className="border-b flex items-center justify-between border-gray-200 dark:border-gray-700 p-2 rounded-md 
                hover:bg-gray-400 dark:hover:bg-gray-600/60 transition cursor-pointer group"
            >
              <div
                onClick={() => {
                  setSelectedchat(chat);
                  setOpenMenu(false);
                  navigate("/");
                }}
                className="flex-1"
              >
                <p className="truncate w-full ">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs truncate w-full">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img
                onClick={(e) =>
                  toast.promise(deletechat(e, chat._id), {
                    loading: "Deleting....",
                  })
                }
                src={assets.bin_icon}
                className="w-4 hidden group-hover:block not-dark:invert"
                alt=""
              />
            </div>
          ))}
      </div>

      {/* community */}
      <button
        onClick={() => {
          navigate("/community");
          setOpenMenu(false);
        }}
        className="w-full flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 
            text-white font-medium rounded-lg shadow-md 
            hover:from-purple-600 hover:to-pink-500 
            transition-all duration-300 ease-in-out cursor-pointer text-sm"
      >
        <img className="w-4 " src={assets.gallery_icon} alt="" />
        <span>Community Image</span>
      </button>

      {/* credits */}
      <button
        onClick={() => {
          navigate("/credits");
          setOpenMenu(false);
        }}
        className="w-full flex items-center gap-3 p-2 cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 
            text-white font-medium rounded-lg shadow-md 
            hover:from-purple-600 hover:to-pink-500 
            transition-all duration-300 ease-in-out justify-start"
      >
        <img src={assets.diamond_icon} alt="" className="w-4 invert" />
        <div className="text-left">
          <p className="text-xs">Credits:{user?.credits}</p>
          <p className="text-xs truncate  w-full">
            Purchase credits to use this ay-gpt
          </p>
        </div>
      </button>

      {/*    add theme btn */}
      <div className="w-full flex items-center gap-3 p-2 bg-white/90 dark:bg-gray-800/80 rounded-lg shadow-sm justify-between">
        <div className="flex items-center gap-3">
          <img
            src={assets.theme_icon}
            alt="theme"
            className="w-4 not-dark:invert"
          />
          <p className="font-medium text-gray-800 dark:text-gray-200">Theme</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            onChange={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            aria-label="Toggle theme"
          />

          {/* track */}
          <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r from-indigo-500 to-purple-600 transition-colors"></div>

          {/* knob */}
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4"></div>
        </label>
      </div>

      {/* user profile */}

      {user ? (
        <div
          className="w-full flex items-center justify-between gap-3 bg-white/90 dark:bg-gray-800/80 
            text-gray-900 dark:text-gray-100 font-medium rounded-lg shadow-md 
            transition-all duration-300 ease-in-out  p-2 "
        >
          <div className="flex items-center gap-3">
            <img
              src={user.profilePicture || assets.user_icon}
              alt={user.name || "userlogo"}
              className="w-10 h-10 rounded-full object-cover "
            />
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">
                {user.name || "Guest"}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {user.email || ""}
              </span>
            </div>
          </div>
          <img
            onClick={logout}
            src={assets.logout_icon}
            alt="Logout"
            className="w-5 h-5 not-dark:invert cursor-pointer"
          />
        </div>
      ) : (
        <div className="text-sm text-gray-700 italic">Loggin to continue</div>
      )}

      <img
        onClick={() => setOpenMenu(false)}
        src={assets.close_icon}
        alt=""
        className="w-5 h-5 cursor-pointer absolute top-3 right-3 not-dark:invert md:hidden"
      />
    </div>
  );
};

export default Sidebar;
