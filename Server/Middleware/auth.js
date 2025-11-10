import jwt from "jsonwebtoken"
import User from "../Models/User.js"

export const protectuser = async (req, res, next) => {
  try {
    // Preferred: use cookie-parser and read req.cookies.token
    // Fallback: parse raw header "k=v; k2=v2"
    let token

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    } else if (typeof req.headers.cookie === "string") {
      const m = req.headers.cookie.match(/(?:^|;\s*)token=([^;]+)/)
      token = m ? decodeURIComponent(m[1]) : undefined
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    
    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.json({ success: false, message: "Not authorized, user not found" })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message })
  }
}  