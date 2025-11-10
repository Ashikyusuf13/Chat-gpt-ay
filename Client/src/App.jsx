import React, { useContext, useState } from "react";
import Sidebar from "./Components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Credits from "./Pages/Credits";
import Community from "./Pages/Community";
import Chat from "./Components/Chat";
import { assets } from "./assets/assets";
import Loading from "./Pages/Loading";
import "./assets/prism.css";
import { AppContext } from "./Context/Appcontext";

const App = () => {
  const { user } = useContext(AppContext);

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      {!openMenu && (
        <img
          src={assets.menu_icon}
          alt="menu"
          className="w-8 h-8 md:hidden absolute top-3 left-3 cursor-pointer not-dark:invert"
          onClick={() => {
            setOpenMenu(true);
          }}
        />
      )}

      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex w-screen h-screen">
            <Sidebar openMenu={openMenu} setOpenMenu={setOpenMenu} />
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
              <Route path="/loading" element={<Loading />} />
            </Routes>
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
