import React, { useContext, useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./Pages/Login";
import Credits from "./Pages/Credits";
import Community from "./Pages/Community";
import Chat from "./Components/Chat";
import { assets } from "./assets/assets";
import Loading from "./Pages/Loading";
import "./assets/prism.css";
import { AppContext } from "./Context/Appcontext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, loadinguser } = useContext(AppContext);

  const [openMenu, setOpenMenu] = useState(false);
  const { pathname } = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  if (pathname === "/loading" || loadinguser) {
    return <Loading />;
  }

  return (
    <>
      <Toaster />
      {!openMenu && (
        <img
          src={assets.menu_icon}
          alt="menu"
          className="w-8 h-8 md:hidden fixed top-3 left-4 cursor-pointer not-dark:invert"
          onClick={() => {
            setOpenMenu(true);
          }}
        />
      )}

      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white h-screen w-screen overflow-hidden">
          <div className="flex w-full h-full">
            <Sidebar openMenu={openMenu} setOpenMenu={setOpenMenu} />
            <div className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<Chat />} />
                <Route path="/login" element={<Login />} />
                <Route path="/credits" element={<Credits />} />
                <Route path="/community" element={<Community />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] h-screen flex justify-center items-center w-full">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;
