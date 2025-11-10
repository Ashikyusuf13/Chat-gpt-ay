import React, { useEffect, useState } from "react";
import { dummyPublishedImages } from "../assets/assets";
import Loading from "./Loading";

const Community = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    setContent(dummyPublishedImages);
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <h1 className=" font-medium text-3xl dark:text-white mt-12">Community</h1>

      {content.length > 0 ? (
        <div className="flex flex-wrap justify-center mb-5 gap-4 mx-auto overflow-y-auto  max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
          {content.map((item, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden bg-white/5 shadow-lg hover:shadow-2xl transition"
            >
              <a href={item.imageUrl} target="_blank" className="">
                <div className="relative group min-w-[200px] min-h-[200px] sm:h-48 md:h-50 lg:h-54 bg-gray-50 dark:bg-gray-800 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt="image"
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-1 text-center bg-black/40 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-transform ease-in-out duration-300">
                    <p className="text-sm text-white truncate">
                      {item.userName}
                    </p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-600 dark:text-gray-400">
          No community images yet.
        </div>
      )}
    </div>
  );
};

export default Community;
