import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Chat from "../Models/Chat.js";

//generate tokens

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

//Register user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exitstinguser = await User.findOne({ email });

  if (exitstinguser) {
    return res.json({ success: false, message: "User already exists" });
  }

  const hassedpassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hassedpassword,
  });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_KEY === "production",
    sameSite: process.env.NODE_KEY === "production" ? "none" : "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    success: true,
    message: "User registered successfully",
    token,
  });
};

//login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = generateToken(user._id);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_KEY === "production",
          sameSite: process.env.NODE_KEY === "production" ? "none" : "strict",
          maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, message: "logged", token });
      } else {
        return res.json({ success: false, message: "Invalid password" });
      }
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Logout User
export const LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_KEY === "production",
      sameSite: process.env.NODE_KEY === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get user
export const getUser = async (req, res) => {
  try {
    const user = req.user;

    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//published-images
export const userpublishedimages = async (req, res) => {
  try {
    // unwind messages and find those marked as image + published
    const publishedimages = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": true,
          "messages.ispublished": true,
        },
      },
      {
        $project: {
          // return the message _id so the client has a stable key
          _id: "$messages._id",
          imageUrl: "$messages.content",
          userName: "$userName",
          chatId: "$_id",
        },
      },
    ]);

    res.json({ success: true, images: publishedimages.reverse() });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
