import Admin from "../../models/Admin.js"
import createHttpError from "http-errors"
import { createAccessToken } from "../../tools/jwtTools.js"

// SOLO LOGIN
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })
    if (!admin) throw createHttpError(404, "Admin non trovato")

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) throw createHttpError(401, "Password errata")

    const token = await createAccessToken({
      _id: admin._id,
      role: "Admin",
      name: admin.name,
      email: admin.email,
      avatar: admin.avatar
    })

    res.json({
      message: "Login admin riuscito",
      token
    })
  } catch (error) {
    next(error)
  }
}


