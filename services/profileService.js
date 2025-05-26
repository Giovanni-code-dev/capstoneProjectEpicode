import UserModel from "../models/User.js"
import createHttpError from "http-errors"

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

// 🔄 Aggiorna campi base del profilo
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
            "avatar",
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
