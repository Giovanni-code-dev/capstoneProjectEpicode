import ShowModel from "../models/Show.js"
import createHttpError from "http-errors"
import cloudinary from "../config/cloudinary.js"
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUploader.js"

export const createShow = async (req, res, next) => {
  try {
    let imageInfos = []

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, "shows")
      )

      const results = await Promise.all(uploadPromises)
      imageInfos = results.map(r => ({ url: r.secure_url, public_id: r.public_id }))
    }

    const newShow = new ShowModel({
      ...req.body,
      artist: req.user._id,
      images: imageInfos
    })

    const saved = await newShow.save()
    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
}

export const updateShow = async (req, res, next) => {
  try {
    const updated = await ShowModel.findOneAndUpdate(
      { _id: req.params.id, artist: req.user._id },
      req.body,
      { new: true }
    )
    if (!updated) throw createHttpError(404, "Show non trovato o non autorizzato")
    res.json(updated)
  } catch (error) {
    next(error)
  }
}

export const deleteShow = async (req, res, next) => {
  try {
    const deleted = await ShowModel.findOneAndDelete({
      _id: req.params.id,
      artist: req.user._id,
    })
    if (!deleted) throw createHttpError(404, "Show non trovato o non autorizzato")
    res.status(200).json({ message: "Spettacolo eliminato con successo." })
  } catch (error) {
    next(error)
  }
}

export const getShowsByArtistId = async (req, res, next) => {
  try {
    const { artistId } = req.params
    const shows = await ShowModel.find({ artist: artistId })
    res.json(shows)
  } catch (error) {
    next(error)
  }
}

export const getMyShows = async (req, res, next) => {
  try {
    const shows = await ShowModel.find({ artist: req.user._id })
    res.json(shows)
  } catch (error) {
    next(error)
  }
}

export const updateShowImages = async (req, res, next) => {
  try {
    const show = await ShowModel.findOne({ _id: req.params.id, artist: req.user._id })
    if (!show) throw createHttpError(404, "Show non trovato o non autorizzato")

    let newImages = []

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, "shows")
      )

      const results = await Promise.all(uploadPromises)
      newImages = results.map(r => ({ url: r.secure_url, public_id: r.public_id }))
    }

    show.images = [...show.images, ...newImages]
    await show.save()

    res.json({
      message: "Immagini aggiornate con successo",
      images: show.images
    })
  } catch (error) {
    next(error)
  }
}

export const deleteShowImage = async (req, res, next) => {
  try {
    const { id, index } = req.params

    const show = await ShowModel.findOne({
      _id: id,
      artist: req.user._id
    })

    if (!show) throw createHttpError(404, "Show non trovato o non autorizzato")

    const imgIndex = parseInt(index)
    if (isNaN(imgIndex) || imgIndex < 0 || imgIndex >= show.images.length) {
      throw createHttpError(400, "Indice immagine non valido")
    }

    const removedImage = show.images.splice(imgIndex, 1)[0]

    if (removedImage?.public_id) {
      await deleteFromCloudinary(removedImage.public_id)
    }

    await show.save()

    res.json({
      message: "Immagine rimossa con successo",
      removedImage,
      images: show.images
    })
  } catch (error) {
    next(error)
  }
}

export const reorderImages = async (req, res, next) => {
  try {
    const { id } = req.params
    const { newOrder } = req.body // [{ public_id, isCover }, ...]

    const show = await ShowModel.findOne({ _id: id, artist: req.user._id })
    if (!show) throw createHttpError(404, "Show non trovato o non autorizzato")

    const reorderedImages = newOrder.map(entry => {
      const match = show.images.find(img => img.public_id === entry.public_id)
      if (!match) return null
      return {
        url: match.url,
        public_id: match.public_id,
        isCover: entry.isCover || false
      }
    }).filter(Boolean)

    show.images = reorderedImages
    await show.save()

    res.json({
      message: "Ordine immagini aggiornato con successo",
      images: show.images
    })
  } catch (error) {
    next(error)
  }
}
