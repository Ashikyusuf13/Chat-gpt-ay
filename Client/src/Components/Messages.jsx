import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import prism from "prismjs";

const Messages = ({ message }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, [message.content]);

  // Check if message is an image (handle both isImage and isimage)
  const isImage = message.isImage || message.isimage;

  return (
    <div className="my-4">
      {message.role === "user" ? (
        // User Message
        <div className="flex items-start justify-end gap-3">
          <div className="flex flex-col max-w-xl md:max-w-2xl">
            <div className="rounded-2xl rounded-tr-sm px-4 py-3 
              bg-gradient-to-br from-purple-600 to-indigo-600 
              text-white shadow-md shadow-purple-500/20">
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
              <img
                src={assets.user_icon}
                className="w-5 h-5 invert"
                alt="user"
              />
            </div>
          </div>
        </div>
      ) : (
        // AI Message
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          </div>
          <div className="flex flex-col max-w-xl md:max-w-2xl lg:max-w-3xl">
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 
              bg-gray-100 dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700
              shadow-sm">

              {isImage ? (
                // Image Response
                <div className="relative">
                  {imageLoading && !imageError && (
                    <div className="flex items-center justify-center w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {imageError ? (
                    <div className="flex flex-col items-center justify-center w-full h-48 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <svg className="w-10 h-10 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-sm text-red-500 dark:text-red-400">Failed to load image</p>
                    </div>
                  ) : (
                    <a href={message.content} target="_blank" rel="noopener noreferrer" className="block group">
                      <img
                        src={message.content}
                        alt="AI Generated"
                        className={`max-w-full rounded-lg shadow-md cursor-pointer 
                          transition-all duration-300 
                          group-hover:shadow-xl group-hover:scale-[1.02]
                          ${imageLoading ? 'hidden' : 'block'}`}
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                          setImageLoading(false);
                          setImageError(true);
                        }}
                      />
                      {!imageLoading && !imageError && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-full shadow-lg">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              View Full Size
                            </span>
                          </div>
                        </div>
                      )}
                    </a>
                  )}
                </div>
              ) : (
                // Text Response
                <div className="text-sm text-gray-800 dark:text-gray-200 reset-tw prose prose-sm dark:prose-invert max-w-none">
                  <Markdown>{message.content}</Markdown>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
