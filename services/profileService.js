import createHttpError from "http-errors"
import cloudinary from "../config/cloudinary.js"
import path from "path"
import { uploadToCloudinary } from "../utils/cloudinaryUploader.js"

import Artist from "../models/Artist.js"
import Customer from "../models/Customer.js"
import Admin from "../models/Admin.js"

// Funzione helper per mappare userType al modello corretto
const getModelByUserType = (type) => {
  switch (type) {
    case "Artist":
      return Artist
    case "Customer":
      return Customer
    case "Admin":
      return Admin
    default:
      throw new Error("Tipo utente sconosciuto")
  }
}

// 🔍 Recupera il profilo utente (senza password)
export const getUserProfile = async (req, res, next) => {
  try {
    const Model = getModelByUserType(req.userType)
    const user = await Model.findById(req.user._id).select("-password")

    if (!user) throw createHttpError(404, "Utente non trovato")

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: req.userType,
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
      createdAt: user.createdAt
    })
  } catch (error) {
    next(error)
  }
}

// Aggiorna il profilo utente
export const updateUserProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name", "bio", "categories", "telefono", "website",
      "instagram", "facebook", "youtube", "portfolio", "tiktok"
    ]

    const updateData = {}
    for (const field of allowedFields) {
      if (req.body[field]) updateData[field] = req.body[field]
    }

    const Model = getModelByUserType(req.userType)
    const user = await Model.findById(req.user._id)

    if (!user) throw createHttpError(404, "Utente non trovato")

    // Se c'è un nuovo file avatar
    if (req.file) {
      // Se c'è già un avatar su Cloudinary → cancellalo
      if (user.avatar?.includes("res.cloudinary.com")) {
        const url = new URL(user.avatar)
        const parts = url.pathname.split("/")
        const public_id = parts.slice(3, -1).join("/") + "/" + path.basename(parts.at(-1), path.extname(parts.at(-1)))

        await cloudinary.uploader.destroy(public_id)
      }

      // Upload del nuovo avatar
      const folder = `users/avatar/${req.userType}`
      const result = await uploadToCloudinary(req.file.buffer, folder, "image")

      updateData.avatar = result.secure_url
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nessun campo valido da aggiornare." })
    }

    const updatedUser = await Model.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    )

    res.json({
      message: "Profilo aggiornato con successo!",
      profile: updatedUser
    })
  } catch (error) {
    next(error)
  }
}
