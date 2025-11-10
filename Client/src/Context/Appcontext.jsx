import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

export const AppContext = createContext();

export const AppcontextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedchat, setSelectedchat] = useState(null);

  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const fetchUser = () => {
    setUser(dummyUserData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUserChats = () => {
    setChats(dummyChats);
    setSelectedchat();
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
    chats,
    selectedchat,
    setSelectedchat,
    theme,
    setTheme,
    navigate,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
