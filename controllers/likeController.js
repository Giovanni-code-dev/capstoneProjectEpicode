import LikeModel from "../models/Like.js"
import createHttpError from "http-errors"
import UserModel from "../models/User.js"
import ShowModel from "../models/Show.js"
import PackageModel from "../models/Package.js"

// 🔹 1. Aggiungi un like
export const addLike = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.body

    // Validazione base
    if (!["artist", "show", "package"].includes(targetType)) {
      throw createHttpError(400, "Tipo non valido")
    }

    // Evita duplicati
    const alreadyLiked = await LikeModel.findOne({
      user: req.user._id,
      targetType,
      targetId
    })

    if (alreadyLiked) throw createHttpError(409, "Hai già messo like")

    const like = new LikeModel({
      user: req.user._id,
      targetType,
      targetId
    })

    await like.save()
    res.status(201).json({ message: "Like aggiunto" })
  } catch (error) {
    next(error)
  }
}

// 🔹 2. Rimuovi un like
export const removeLike = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params

    await LikeModel.findOneAndDelete({
      user: req.user._id,
      targetType,
      targetId
    })

    res.status(200).json({ message: "Like rimosso" })
  } catch (error) {
    next(error)
  }
}

// 🔹 3. Conta i like ricevuti da un oggetto
export const getLikeCount = async (req, res, next) => {
  try {
    const count = await LikeModel.countDocuments({
      targetType: req.params.targetType,
      targetId: req.params.targetId
    })

    res.json({ count })
  } catch (error) {
    next(error)
  }
}

// 🔹 4. Verifica se l'utente loggato ha messo like
export const isLikedByMe = async (req, res, next) => {
  try {
    const like = await LikeModel.findOne({
      user: req.user._id,
      targetType: req.params.targetType,
      targetId: req.params.targetId
    })

    res.json({ liked: !!like })
  } catch (error) {
    next(error)
  }
}

// 🔹 5. Recupera tutti i like messi dall'utente loggato (filtrabile per tipo)
export const getMyLikes = async (req, res, next) => {
  try {
    const filter = { user: req.user._id }

    if (req.query.type) {
      if (!["artist", "show", "package"].includes(req.query.type)) {
        throw createHttpError(400, "Tipo non valido")
      }
      filter.targetType = req.query.type
    }

    const populateOptions = {
      artist: { path: "targetId", model: "User", select: "name avatar role" },
      show: { path: "targetId", model: "Show", select: "title images" },
      package: { path: "targetId", model: "Package", select: "title images" },
    }

    const likes = await LikeModel.find(filter).populate(
      req.query.type ? populateOptions[req.query.type] : ""
    )

    res.json(likes)
  } catch (error) {
    next(error)
  }
}
