import React, { useContext, useEffect } from "react";
import { AppContext } from "../Context/Appcontext";

export default function Loading() {
  const { fetchUserChats } = useContext(AppContext);
  useEffect(() => {
    fetchUserChats();
    const t = setTimeout(() => {
      // redirect to home after 3 seconds
      window.location.href = "/";
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-500 to-violet-600 z-[9999]">
      {/* simple centered spinner, no text or box */}
      <div
        className="w-20 h-20 rounded-full border-8 border-white/30 border-t-white animate-spin"
        aria-hidden="true"
      />
    </div>
  );
}
