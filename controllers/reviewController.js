import createHttpError from "http-errors"
import ReviewModel from "../models/Review.js"
import RequestModel from "../models/Request.js"
import { uploadToCloudinary } from "../utils/cloudinaryUploader.js" // 👈 nuovo import

// CREA RECENSIONE
export const createReview = async (req, res, next) => {
  try {
    const { request, rating, comment } = req.body

    const foundRequest = await RequestModel.findOne({
      _id: request,
      user: req.user._id,
      status: "accepted",
      date: { $lte: new Date() }
    })

    if (!foundRequest) throw createHttpError(403, "Non puoi recensire questa richiesta")

    const alreadyReviewed = await ReviewModel.findOne({ request, user: req.user._id })
    if (alreadyReviewed) throw createHttpError(409, "Hai già lasciato una recensione")

    let imageUrls = []

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, "reviews")
      )

      const results = await Promise.all(uploadPromises)
      imageUrls = results.map(r => r.secure_url)
    }

    const newReview = new ReviewModel({
      user: req.user._id,
      artist: foundRequest.artist,
      request,
      rating,
      comment,
      images: imageUrls
    })

    const saved = await newReview.save()
    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
}

// TUTTE LE RECENSIONI DI UN ARTISTA
export const getReviewsForArtist = async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({ artist: req.params.artistId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    next(error)
  }
}

// MODIFICA RECENSIONE
export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body

    const updated = await ReviewModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { rating, comment },
      { new: true }
    )

    if (!updated) throw createHttpError(404, "Recensione non trovata o non autorizzato")

    res.json({
      message: "Recensione aggiornata con successo",
      review: updated
    })
  } catch (error) {
    next(error)
  }
}

// ELIMINA RECENSIONE
export const deleteReview = async (req, res, next) => {
  try {
    const deleted = await ReviewModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!deleted) throw createHttpError(404, "Recensione non trovata o non autorizzato")

    res.status(200).json({ message: "Recensione eliminata con successo" })
  } catch (error) {
    next(error)
  }
}

// 🔍 NUOVA FUNZIONE: RECENSIONI PROPRIE
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({ user: req.user._id })
      .populate("artist", "name avatar")
      .sort({ createdAt: -1 })

    res.json({
      count: reviews.length,
      reviews
    })
  } catch (error) {
    next(error)
  }
}

