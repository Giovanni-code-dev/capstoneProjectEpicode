import createHttpError from "http-errors"
import ReviewModel from "../models/Review.js"
import RequestModel from "../models/Request.js"
import { uploadMultipleImages } from "../utils/imageUploader.js"
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUploader.js"
import { deleteImagesFromModel } from "../services/image/imageDeletionHandler.js"
import { deleteImagesFromCloudinaryList } from "../utils/imageUploader.js"


//  Crea una recensione
export const createReview = async (req, res, next) => {
  try {
    const { request, rating, comment } = req.body

    if (!request || !rating || !comment) {
      throw createHttpError(400, "Tutti i campi (request, rating, commento) sono obbligatori")
    }

    const foundRequest = await RequestModel.findOne({
      _id: request,
      customer: req.user._id,
      status: "accepted",
      date: { $lte: new Date() }
    })

    if (!foundRequest) {
      throw createHttpError(403, "Non puoi recensire questa richiesta")
    }

    const alreadyReviewed = await ReviewModel.findOne({ request, customer: req.user._id })
    if (alreadyReviewed) {
      throw createHttpError(409, "Hai già lasciato una recensione per questa richiesta")
    }

    let imageInfos = []
    if (req.files?.length > 0) {
      if (req.files.length > 3) throw createHttpError(400, "Puoi caricare massimo 3 immagini")

      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, "reviews")
      )
      const results = await Promise.all(uploadPromises)
      imageInfos = results.map(r => ({
        url: r.secure_url,
        public_id: r.public_id
      }))
    }

    const newReview = new ReviewModel({
      customer: req.user._id,
      artist: foundRequest.artist,
      request,
      rating,
      comment,
      images: imageInfos
    })

    const saved = await newReview.save()
    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
}

// Aggiunge immagini a una recensione esistente
export const addReviewImages = async (req, res, next) => {
  try {
    const review = await ReviewModel.findOne({
      _id: req.params.id,
      customer: req.user._id
    })

    if (!review) throw createHttpError(404, "Recensione non trovata o non autorizzato")

    const newCount = req.files?.length || 0
    const existingCount = review.images.length

    if (newCount === 0) {
      throw createHttpError(400, "Devi caricare almeno un'immagine")
    }

    if (existingCount + newCount > 3) {
      throw createHttpError(400, "Puoi caricare al massimo 3 immagini per recensione")
    }

    const newImages = await uploadMultipleImages(req.files, "reviews")

    review.images.push(...newImages)
    await review.save()

    res.json({
      message: "Immagini aggiunte con successo",
      images: review.images
    })
  } catch (error) {
    next(error)
  }
}

// Recensioni pubbliche per un artista
export const getReviewsForArtist = async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({ artist: req.params.artistId })
      .populate("customer", "name avatar")
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    next(error)
  }
}

//  Modifica una recensione
export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    if (!rating && !comment) throw createHttpError(400, "Nessun dato da aggiornare")

    const updated = await ReviewModel.findOneAndUpdate(
      { _id: req.params.id, customer: req.user._id },
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

// Elimina una recensione
export const deleteReview = async (req, res, next) => {
  try {
    const deleted = await ReviewModel.findOneAndDelete({
      _id: req.params.id,
      customer: req.user._id,
    })

    if (!deleted) throw createHttpError(404, "Recensione non trovata o non autorizzato")

    // Usa la funzione riutilizzabile
    await deleteImagesFromCloudinaryList(deleted.images)

    res.status(200).json({ message: "Recensione eliminata con successo" })
  } catch (error) {
    next(error)
  }
}



// Elimina una o più immagini da una recensione
/**
 * DELETE /reviews/:id/images
 * Rimuove una o più immagini da una recensione dell'utente loggato
 */
export const deleteReviewImages = async (req, res, next) => {
  try {
    const result = await deleteImagesFromModel({
      model: ReviewModel,
      docId: req.params.id,
      ownerId: req.user._id,
      ownerField: "customer", // diverso da artist
      publicIds: req.body.public_ids,
      modelName: "recensione"
    })

    res.json(result)
  } catch (error) {
    next(error)
  }
}

// Le recensioni scritte dal customer loggato
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({ customer: req.user._id })
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
