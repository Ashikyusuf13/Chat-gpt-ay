import mongoose from "mongoose";

const chatschema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", requried: true },
    userName: { type: String, requried: true },
    name: { type: String, requried: true },
    messages: [
      {
        isImage: { type: Boolean, requried: true },
        ispublished: { type: Boolean, default: false },
        role: { type: String, requried: true },
        content: { type: String, requried: true },
        timestamp: { type: Number, requried: true },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chats", chatschema);

export default Chat;
