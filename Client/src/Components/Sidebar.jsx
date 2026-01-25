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
    <>
      {/* overlay - keeps same responsive behavior */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-5 md:hidden"
          onClick={() => setOpenMenu(false)}
        ></div>
      )}

      <div
        className={`p-5 flex flex-col gap-3 h-screen w-70 min-md:w-72
        bg-gradient-to-br from-slate-50 via-purple-50/80 to-indigo-100/60 
        dark:from-gray-950 dark:via-purple-950/30 dark:to-gray-900
        border-r border-purple-200/50 dark:border-purple-800/30
        backdrop-blur-xl shadow-xl shadow-purple-500/5
        max-md:absolute left-0 z-10 transition-all duration-500 ease-out ${!openMenu && "max-md:-translate-x-full"
          }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setOpenMenu(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-gray-200/80 dark:bg-gray-800/80 
          hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors md:hidden group"
        >
          <img
            src={assets.close_icon}
            alt="Close"
            className="w-4 h-4 not-dark:invert group-hover:scale-110 transition-transform"
          />
        </button>

        {/* Logo Section */}
        <div className="flex items-center">
          <img
            onClick={() => {
              navigate("/");
              setOpenMenu(false);
            }}
            src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
            alt="Logo"
            className="w-36 cursor-pointer hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />
        </div>

        {/* New Chat Button - Enhanced */}
        <button
          onClick={createnewchat}
          className="w-full py-1.5 px-4 
          bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600
          hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500
          text-white font-semibold rounded-xl
          shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50
          transform hover:-translate-y-0.5 active:translate-y-0
          transition-all duration-300 ease-out cursor-pointer 
          flex items-center gap-3 justify-center group"
        >
          <span className="text-xl font-light group-hover:rotate-90 transition-transform duration-300">+</span>
          <span className="text-sm tracking-wide">New Conversation</span>
        </button>

        {/* Search Box - Enhanced */}
        <div
          className="flex items-center gap-3 
          bg-white/70 dark:bg-gray-800/50 
          border border-purple-200/50 dark:border-purple-700/30
          text-gray-800 dark:text-gray-200 
          rounded-xl px-4 py-1.5 
          shadow-sm hover:shadow-md
          focus-within:ring-2 focus-within:ring-purple-400/50 focus-within:border-purple-400
          transition-all duration-300 w-full group"
        >
          <img
            src={assets.search_icon}
            alt="searchicon"
            className="w-4 opacity-50 group-focus-within:opacity-100 not-dark:invert transition-opacity"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="bg-transparent focus:outline-none w-full placeholder-gray-400 dark:placeholder-gray-500 text-sm"
          />
        </div>

        {/* Recent Chats Header */}
        <div className="flex items-center justify-between mt-2">
          {chats.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Recent Chats
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-500 italic">
              No conversations yet
            </span>
          )}
          {chats.length > 0 && (
            <span className="text-xs text-purple-500 dark:text-purple-400 font-medium">
              {chats.length}
            </span>
          )}
        </div>

        {/* Chats List - Enhanced */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
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
                className="flex items-center justify-between p-3 rounded-xl 
                bg-white/40 dark:bg-gray-800/30
                border border-transparent hover:border-purple-300/50 dark:hover:border-purple-600/30
                hover:bg-white/80 dark:hover:bg-gray-700/50
                hover:shadow-md hover:shadow-purple-500/10
                transition-all duration-300 cursor-pointer group"
              >
                <div
                  onClick={() => {
                    setSelectedchat(chat);
                    setOpenMenu(false);
                    navigate("/");
                  }}
                  className="flex-1 min-w-0"
                >
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    {chat.messages.length > 0
                      ? chat.messages[0].content.slice(0, 28)
                      : chat.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </div>
                <button
                  onClick={(e) =>
                    toast.promise(deletechat(e, chat._id), {
                      loading: "Deleting...",
                    })
                  }
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 
                  hover:bg-red-100 dark:hover:bg-red-900/40
                  transition-all duration-200"
                >
                  <img
                    src={assets.bin_icon}
                    className="w-3.5 not-dark:invert hover:scale-110 transition-transform"
                    alt="Delete"
                  />
                </button>
              </div>
            ))}
        </div>

        {/* Bottom Section - Enhanced Cards */}
        <div className="border-t border-purple-200/30 dark:border-purple-800/20">
          {/* Community Button */}
          <button
            onClick={() => {
              navigate("/community");
              setOpenMenu(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-1.5 mb-1
            bg-gradient-to-r from-pink-500/90 via-purple-500/90 to-indigo-500/90
            hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
            text-white font-medium rounded-xl 
            shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30
            transform hover:-translate-y-0.5
            transition-all duration-300 ease-out cursor-pointer group"
          >
            <div className="p-1.5 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
              <img className="w-4" src={assets.gallery_icon} alt="" />
            </div>
            <span className="text-sm">Community Gallery</span>
            <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Credits Card */}
          <button
            onClick={() => {
              navigate("/credits");
              setOpenMenu(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-1.5 cursor-pointer 
            bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-red-500/90
            hover:from-amber-500 hover:via-orange-500 hover:to-red-500
            text-white rounded-xl 
            shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30
            transform hover:-translate-y-0.5
            transition-all duration-300 ease-out group"
          >
            <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 group-hover:rotate-12 transition-all">
              <img src={assets.diamond_icon} alt="" className="w-5 invert" />
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">{user?.credits || 0}</span>
                <span className="text-xs opacity-80">credits</span>
              </div>
              <p className="text-xs opacity-80 truncate">
                Click to purchase more
              </p>
            </div>
            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Theme Toggle - Enhanced */}
          <div className="flex items-center justify-between p-3 
            bg-gray-200/60 mt-1 mb-1 dark:bg-gray-800/50 
            border border-purple-200/30 dark:border-purple-800/20
            rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-amber-100'}`}>
                <img
                  src={assets.theme_icon}
                  alt="theme"
                  className="w-4 not-dark:invert"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
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
              {/* Enhanced track */}
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full 
                peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-600 
                transition-all duration-300 shadow-inner"></div>
              {/* Enhanced knob */}
              <div className="absolute left-0.5 top-0.5 w-5 h-5 
                bg-white rounded-full shadow-md 
                transform transition-all duration-300 ease-out
                peer-checked:translate-x-5
                flex items-center justify-center text-xs">
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
            </label>
          </div>

          {/* User Profile Card - Enhanced */}
          {user ? (
            <div
              className="w-full flex items-center justify-between gap-3 p-3
              bg-white/60 dark:bg-gray-800/50 
              border border-purple-200/30 dark:border-purple-800/20
              rounded-xl shadow-sm hover:shadow-md
              transition-all duration-300"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <img
                    src={user.profilePicture || assets.user_icon}
                    alt={user.name || "user"}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-400/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {user.name || "Guest"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email || ""}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 
                transition-colors group"
                title="Logout"
              >
                <img
                  src={assets.logout_icon}
                  alt="Logout"
                  className="w-5 h-5 not-dark:invert group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
          ) : (
            <div className="p-3 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Login to continue
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
