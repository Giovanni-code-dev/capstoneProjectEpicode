import createHttpError from "http-errors"
import ShowModel from "../models/Show.js"
import { uploadMultipleImages } from "../utils/imageUploader.js"
import { deleteImagesFromModel } from "../services/image/imageDeletionHandler.js"

//
// CRUD - Shows
//

/**
 * POST /shows
 * Crea un nuovo spettacolo per l'artista loggato, con immagini opzionali.
 */
export const createShow = async (req, res, next) => {
  try {
    let imageInfos = []

    if (req.files?.length) {
      const results = await uploadMultipleImages(req.files, "shows")
      imageInfos = results.map((r, i) => ({
        url: r.url,
        public_id: r.public_id,
        isCover: i === 0
      }))
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

/**
 * PATCH /shows/:id
 * Aggiorna uno spettacolo dell'artista loggato.
 */
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

/**
 * DELETE /shows/:id
 * Elimina uno spettacolo dell'artista loggato.
 */
export const deleteShow = async (req, res, next) => {
  try {
    const deleted = await ShowModel.findOneAndDelete({
      _id: req.params.id,
      artist: req.user._id
    })
    if (!deleted) throw createHttpError(404, "Show non trovato o non autorizzato")
    res.status(200).json({ message: "Spettacolo eliminato con successo." })
  } catch (error) {
    next(error)
  }
}

//
// Recupero show
//

export const getShowById = async (req, res, next) => {
  try {
    const show = await ShowModel.findById(req.params.id)
    if (!show) throw createHttpError(404, "Show non trovato")
    res.json(show)
  } catch (error) {
    next(error)
  }
}

export const getMyShowById = async (req, res, next) => {
  try {
    const show = await ShowModel.findOne({ _id: req.params.id, artist: req.user._id })
    if (!show) throw createHttpError(404, "Show non trovato o non autorizzato")
    res.json(show)
  } catch (error) {
    next(error)
  }
}

export const getShowsByArtistId = async (req, res, next) => {
  try {
    const shows = await ShowModel.find({ artist: req.params.artistId })
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

//
// Gestione immagini
//

export const getShowImages = async (req, res, next) => {
  try {
    const show = await ShowModel.findById(req.params.id).select("images")
    if (!show) throw createHttpError(404, "Show non trovato")
    res.json(show.images)
  } catch (error) {
    next(error)
  }
}

export const getAllShowImagesByArtist = async (req, res, next) => {
  try {
    const shows = await ShowModel.find({ artist: req.params.artistId }).select("images")
    const allImages = shows.flatMap(show => show.images)
    res.json(allImages)
  } catch (error) {
    next(error)
  }
}

export const updateShowImages = async (req, res, next) => {
  try {
    const show = await ShowModel.findOne({ _id: req.params.id, artist: req.user._id })
    if (!show) throw createHttpError(404, "Show non trovato o non autorizzato")

    let newImages = []
    if (req.files?.length) {
      const results = await uploadMultipleImages(req.files, "shows")
      newImages = results.map(r => ({
        url: r.url,
        public_id: r.public_id,
        isCover: false
      }))
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

export const deleteShowImages = async (req, res, next) => {

  try {
    const result = await deleteImagesFromModel({
      model: ShowModel,
      modelName: "Show",
      userId: req.user._id,
      docId: req.params.id, 
      publicIds: req.body.public_ids
    })
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const reorderImages = async (req, res, next) => {
  try {
    const { id } = req.params
    const { newOrder } = req.body

    const show = await ShowModel.findOne({ _id: id, artist: req.user._id })
    if (!show) throw createHttpError(404, "Show non trovato o non autorizzato")

    const reorderedImages = newOrder
      .map(entry => {
        const match = show.images.find(img => img.public_id === entry.public_id)
        if (!match) return null
        return {
          url: match.url,
          public_id: match.public_id,
          isCover: entry.isCover || false
        }
      })
      .filter(Boolean)

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
