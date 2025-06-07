import createHttpError from "http-errors"
import ShowModel from "../models/Show.js"
import { uploadMultipleImages } from "../utils/imageUploader.js"
import { deleteImagesFromModel } from "../services/image/imageDeletionHandler.js"
import { deleteImagesFromCloudinaryList } from "../utils/imageUploader.js"
import { deleteFromCloudinary } from "../utils/cloudinaryUploader.js"
import { uploadToCloudinary } from "../utils/cloudinaryUploader.js"




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

    // ✅ Se viene inviata una singola immagine, la carichiamo su Cloudinary
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "shows")
      imageInfos.push({
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        isCover: true
      })
    }

    // ✅ Creazione del nuovo show con artista e immagine (se presente)
    const newShow = new ShowModel({
      ...req.body,
      artist: req.user._id,
      images: imageInfos
    })

    const saved = await newShow.save()
    res.status(201).json(saved)
  } catch (error) {
    console.error("Errore nella creazione dello show:", error)
    next(error)
  }
}


/**
 * PATCH /shows/:id
 * Aggiorna uno spettacolo dell'artista loggato.
 */
export const updateShow = async (req, res, next) => {
  try {
    const show = await ShowModel.findOne({ _id: req.params.id, artist: req.user._id })
    if (!show) throw createHttpError(404, "Show non trovato o non autorizzato")

    // Aggiorna campi base
    if (req.body.title !== undefined) show.title = req.body.title
    if (req.body.description !== undefined) show.description = req.body.description
    if (req.body.category !== undefined) show.category = req.body.category
    if (req.body.durationMinutes !== undefined) show.durationMinutes = req.body.durationMinutes
    

    // ✅ Gestione nuova immagine di copertina (se presente)
    if (req.file) {
      console.log("✅ Immagine ricevuta:", req.file)

      // Carica su Cloudinary usando il buffer
      const uploaded = await uploadToCloudinary(req.file.buffer, "shows")

      console.log("✅ Risultato Cloudinary:", uploaded)


      const imageUrl = uploaded.secure_url
      const public_id = uploaded.public_id

      // Se già presente, sostituisci la copertina
      if (show.images.length > 0) {
        const oldImage = show.images[0]
        
        if (oldImage.public_id) {
          try {
            await deleteFromCloudinary(oldImage.public_id)
          } catch (err) {
            console.warn("⚠️ Errore durante la cancellazione su Cloudinary:", err)
          }
        } else {
          console.warn("⚠️ Nessun public_id presente nell’immagine esistente.")
        }
      
        show.images[0] = { url: imageUrl, public_id }
      }
      else {
        show.images.push({ url: imageUrl, public_id })
      }
    }

    await show.save()
    res.json(show)
  } catch (error) {
    console.error("ERRORE UPDATE SHOW:", error)
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
      artist: req.user._id,
    })

    if (!deleted) throw createHttpError(404, "Show non trovato o non autorizzato")

    await deleteImagesFromCloudinaryList(deleted.images)

    res.status(200).json({ message: "Show eliminato con successo" })
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
      ownerId: req.user._id,
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
