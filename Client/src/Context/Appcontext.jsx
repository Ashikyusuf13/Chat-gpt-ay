import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppcontextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedchat, setSelectedchat] = useState(null);
  const [loadinguser, setLoadinguser] = useState(true);

  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/getdata", {
        withCredentials: true,
      });
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      toast.error("Login / Signup to continue");
    } finally {
      setLoadinguser(false);
    }
  };

  //create new chats
  const createnewchat = async () => {
    try {
      if (!user) return toast.error("Please login to create a new chat");
      navigate("/");

      const { data } = await axios.get("/api/chat/create");
      if (data?.success) {
        // if server returned the new chat, add it to state and select it
        if (data.chat) {
          setChats((prev) => [data.chat, ...(prev || [])]);
          setSelectedchat(data.chat);
          return;
        }
        // otherwise refresh chats as fallback
        await fetchUserChats();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUserChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get", {
        withCredentials: true,
      });

      if (data.success) {
        setChats(data.chats);

        //if no chat is selected select the first chat
        if (data.chats.length === 0) {
          await createnewchat();
          return fetchUserChats();
        } else {
          setSelectedchat(data.chats[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedchat(null);
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = {
    user,
    setUser,
    chats,
    setChats,
    selectedchat,
    setSelectedchat,
    theme,
    setTheme,
    navigate,
    createnewchat,
    loadinguser,
    fetchUserChats,
    axios,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
