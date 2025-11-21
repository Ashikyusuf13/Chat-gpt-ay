import openAI from "../Config/Openai.js";
import Chat from "../Models/Chat.js";
import User from "../Models/User.js";
import axios from "axios";
import imagekit from "../Config/Imagekit.js";

//Text based Ai chat controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "you don't have the enough token to use this feature",
      });
    }

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
      ispublished: false,
    });

    const { choices } = await openAI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
      ispublished: false,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    res.json({ success: true, reply });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Image generation controller
export const imagemessagecontroller = async (req, res) => {
  try {
    const userId = req.user._id;
    //check the token for image <2
    if (req.user.credits < 2) {
      res.json({
        success: false,
        message: "you don't have the enough token to use this feature",
      });
    }

    const { prompt, ispublished, chatId } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
      ispublished: false,
    });

    //Encode the prompt

    const encodedprompt = encodeURIComponent(prompt);

    //construct imagekit ai url
    const generatedImageUrl = `${
      process.env.IMAGEKIT_URL_ENDPOINT
    }/ik-genimg-prompt-${encodedprompt}/aygpt/${Date.now()}.png?tr=w-800,h-800`;

    //trigger generation
    const aiImageRespond = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    //convert to base 64 image
    const base64Image = `date:image/png;base64,${Buffer.from(
      aiImageRespond.data,
      "binary"
    ).toString("base64")}`;

    //upload to the imagekit media lib
    const uploadRespond = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "Aygpt",
    });

    //reply func
    const reply = {
      role: "assistant",
      content: uploadRespond.url,
      timestamp: Date.now(),
      isImage: true,
      ispublished: ispublished === true || ispublished === "true",
    };

    // save message and update credits BEFORE sending response
    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    // send response after successful DB save
    res.json({ success: true, reply });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
