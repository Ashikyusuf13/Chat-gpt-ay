import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import prism from "prismjs";

const Messages = ({ message }) => {
  useEffect(() => {
    prism.highlightAll();
  }, [message.content]);

  return (
    <div>
      {message.role === "user" ? (
        <div className="flex items-start justify-end  my-4 gap-2 ">
          <div className="flex flex-col rounded-lg max-w-2xl p-2 px-4 gap-2 border border-slate-900 bg-gray-300 dark:border-white ">
            <p className="text-sm dark:text-primary">{message.content}</p>
            <span className="text-xs dark:text-primary ">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <img
            src={assets.user_icon}
            className="w-9 rounded-full object-cover"
            alt="logo"
          />
        </div>
      ) : (
        <div className="inline-flex max-w-2xl p-2 gap-2 flex-col py-4 border  border-slate-900 bg-gray-300 dark:border-white rounded-lg ">
          {message.isImage ? (
            <div>
              <img
                src={message.content}
                alt="image"
                className="w-xl rounded-md object-cover"
              />
              <span className="text-xs dark:text-primary ">
                {moment(message.timestamp).fromNow()}
              </span>
            </div>
          ) : (
            <div className="text-sm reset-tw dark:text-primary">
              {" "}
              <Markdown>{message.content}</Markdown>{" "}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;
