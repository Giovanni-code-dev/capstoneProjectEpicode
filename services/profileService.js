import UserModel from "../models/User.js"
import createHttpError from "http-errors"
import cloudinary from "../config/cloudinary.js"
import path from "path"
import { uploadToCloudinary } from "../utils/cloudinaryUploader.js" // 👈 nuovo import

// Recupera profilo utente (senza password)
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password")
    if (!user) throw createHttpError(404, "Utente non trovato")

    res.json({
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      telefono: user.telefono,
      website: user.website,
      instagram: user.instagram,
      facebook: user.facebook,
      youtube: user.youtube,
      portfolio: user.portfolio,
      tiktok: user.tiktok,
      location: user.location,
      categories: user.categories,
      createdAt: user.createdAt,
    })
  } catch (error) {
    next(error)
  }
}

// Aggiorna campi base del profilo
export const updateUserProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "bio",
      "categories",
      "telefono",
      "website",
      "instagram",
      "facebook",
      "youtube",
      "portfolio",
      "tiktok"
    ]

    const updateData = {}

    for (const field of allowedFields) {
      if (req.body[field]) {
        updateData[field] = req.body[field]
      }
    }

    if (req.file) {
      const user = await UserModel.findById(req.user._id)

      // 🔥 Se ha già un avatar, distruggilo da Cloudinary
      if (user.avatar && user.avatar.includes("res.cloudinary.com")) {
        const url = new URL(user.avatar)
        const parts = url.pathname.split("/")
        const public_id = parts.slice(3, parts.length - 1).join("/") + "/" + path.basename(parts.at(-1), path.extname(parts.at(-1)))

        await cloudinary.uploader.destroy(public_id)
      }

      // 📤 Upload nuovo avatar con utility
      const folder = `users/avatar/${req.user.role}`
      const result = await uploadToCloudinary(req.file.buffer, folder, "image")

      updateData.avatar = result.secure_url
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nessun campo valido da aggiornare." })
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    )

    if (!updatedUser) throw createHttpError(404, "Utente non trovato")

    res.json({
      message: "Profilo aggiornato con successo!",
      profile: updatedUser
    })
  } catch (error) {
    next(error)
  }
}
