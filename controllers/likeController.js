import LikeModel from "../models/Like.js"
import createHttpError from "http-errors"

//  1. Aggiungi un like
export const addLike = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.body

    if (!targetType || !targetId) {
      throw createHttpError(400, "targetType e targetId sono obbligatori")
    }

    if (!["artist", "show", "package"].includes(targetType)) {
      throw createHttpError(400, "Tipo non valido")
    }

    const existing = await LikeModel.findOne({ user: req.user._id, targetType, targetId })
    if (existing) throw createHttpError(409, "Hai già messo like")

    const newLike = new LikeModel({ user: req.user._id, targetType, targetId })
    await newLike.save()

    res.status(201).json({ message: "Like aggiunto" })
  } catch (error) {
    next(error)
  }
}

// 2. Rimuovi un like
export const removeLike = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params

    const deleted = await LikeModel.findOneAndDelete({
      user: req.user._id,
      targetType,
      targetId
    })

    if (!deleted) throw createHttpError(404, "Like non trovato")

    res.json({ message: "Like rimosso" })
  } catch (error) {
    next(error)
  }
}

// 3. Conta i like di un elemento
export const getLikeCount = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params

    const count = await LikeModel.countDocuments({ targetType, targetId })
    res.json({ count })
  } catch (error) {
    next(error)
  }
}

//  4. Verifica se l'utente ha messo like
export const isLikedByMe = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params

    const like = await LikeModel.findOne({ user: req.user._id, targetType, targetId })
    res.json({ liked: !!like })
  } catch (error) {
    next(error)
  }
}

//  5. Recupera tutti i like messi dall'utente
export const getMyLikes = async (req, res, next) => {
  try {
    const filter = { user: req.user._id }

    if (req.query.type) {
      if (!["artist", "show", "package"].includes(req.query.type)) {
        throw createHttpError(400, "Tipo non valido")
      }
      filter.targetType = req.query.type
    }

    const populateMap = {
      artist: { path: "targetId", model: "Artist", select: "name avatar" },
      show: { path: "targetId", model: "Show", select: "title images" },
      package: { path: "targetId", model: "Package", select: "title images" }
    }

    const likes = await LikeModel.find(filter).populate(
      req.query.type ? populateMap[req.query.type] : ""
    )

    res.json(likes)
  } catch (error) {
    next(error)
  }
}
