import PackageModel from "../models/Package.js"
import createHttpError from "http-errors"
import { deleteFromCloudinary } from "../utils/cloudinaryUploader.js"
import { uploadMultipleImages } from "../utils/imageUploader.js"

// 📦 Crea un nuovo pacchetto con immagini multiple
export const createPackage = async (req, res, next) => {
  try {
    let imageUrls = []

    if (req.files?.length) {
      const results = await uploadMultipleImages(req.files, "packages")
      imageUrls = results.map(r => ({
        url: r.url,
        public_id: r.public_id,
        isCover: false
      }))
    }

    const newPackage = new PackageModel({
      ...req.body,
      artist: req.user._id,
      images: imageUrls
    })

    const saved = await newPackage.save()
    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
}

// 📦 Restituisce tutti i pacchetti dell’artista loggato
export const getMyPackages = async (req, res, next) => {
  try {
    const packages = await PackageModel.find({ artist: req.user._id }).populate("shows")
    res.json(packages)
  } catch (error) {
    next(error)
  }
}

// 🔐 Recupera un singolo pacchetto dell’artista loggato
export const getMyPackageById = async (req, res, next) => {
  try {
    const pack = await PackageModel.findOne({ _id: req.params.id, artist: req.user._id }).populate("shows")
    if (!pack) throw createHttpError(404, "Pacchetto non trovato o non autorizzato")
    res.json(pack)
  } catch (error) {
    next(error)
  }
}


// 📦 Modifica un pacchetto esistente (se appartiene all’artista)
export const updatePackage = async (req, res, next) => {
  try {
    const updated = await PackageModel.findOneAndUpdate(
      { _id: req.params.id, artist: req.user._id },
      req.body,
      { new: true }
    )
    if (!updated) throw createHttpError(404, "Pacchetto non trovato o non autorizzato")
    res.json(updated)
  } catch (error) {
    next(error)
  }
}

// 📦 Elimina un pacchetto (se appartiene all’artista)
export const deletePackage = async (req, res, next) => {
  try {
    const deleted = await PackageModel.findOneAndDelete({
      _id: req.params.id,
      artist: req.user._id
    })
    if (!deleted) throw createHttpError(404, "Pacchetto non trovato o non autorizzato")
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

// 📦 Restituisce tutti i pacchetti pubblici di un artista specifico
export const getPackagesByArtistId = async (req, res, next) => {
  try {
    const packages = await PackageModel.find({ artist: req.params.artistId }).populate("shows")
    res.json(packages)
  } catch (error) {
    next(error)
  }
}

// 📦 Restituisce i dettagli di un pacchetto tramite ID
export const getPackageById = async (req, res, next) => {
  try {
    const found = await PackageModel.findById(req.params.id).populate("shows")
    if (!found) throw createHttpError(404, "Pacchetto non trovato")
    res.json(found)
  } catch (error) {
    next(error)
  }
}

// 📸 Aggiunge nuove immagini a un pacchetto esistente
export const updatePackageImages = async (req, res, next) => {
  try {
    const pack = await PackageModel.findOne({ _id: req.params.id, artist: req.user._id })
    if (!pack) throw createHttpError(404, "Pacchetto non trovato o non autorizzato")

    let imageUrls = []

    if (req.files?.length) {
      const results = await uploadMultipleImages(req.files, "packages")
      imageUrls = results.map(r => ({
        url: r.url,
        public_id: r.public_id,
        isCover: false
      }))
    }

    pack.images = [...pack.images, ...imageUrls]
    await pack.save()

    res.json({
      message: "Immagini pacchetto aggiornate",
      images: pack.images
    })
  } catch (error) {
    next(error)
  }
}

// 🗑️ Rimuove una singola immagine da un pacchetto per indice
export const deletePackageImage = async (req, res, next) => {
  try {
    const { id, index } = req.params
    const pack = await PackageModel.findOne({ _id: id, artist: req.user._id })
    if (!pack) throw createHttpError(404, "Pacchetto non trovato o non autorizzato")

    const imgIndex = parseInt(index)
    if (isNaN(imgIndex) || imgIndex < 0 || imgIndex >= pack.images.length) {
      throw createHttpError(400, "Indice immagine non valido")
    }

    const removedImage = pack.images.splice(imgIndex, 1)[0]
    if (removedImage?.public_id) {
      await deleteFromCloudinary(removedImage.public_id)
    }

    await pack.save()

    res.json({
      message: "Immagine rimossa con successo",
      removedImage,
      images: pack.images
    })
  } catch (error) {
    next(error)
  }
}

// 🔁 Riordina le immagini del pacchetto e imposta la copertina
export const reorderImages = async (req, res, next) => {
  try {
    const { id } = req.params
    const { newOrder } = req.body // [{ public_id, isCover }, ...]

    const pack = await PackageModel.findOne({ _id: id, artist: req.user._id })
    if (!pack) throw createHttpError(404, "Pacchetto non trovato o non autorizzato")

    const reorderedImages = newOrder.map(entry => {
      const match = pack.images.find(img => img.public_id === entry.public_id)
      if (!match) return null
      return {
        url: match.url,
        public_id: match.public_id,
        isCover: entry.isCover || false
      }
    }).filter(Boolean)

    pack.images = reorderedImages
    await pack.save()

    res.json({
      message: "Immagini pacchetto riordinate con successo",
      images: pack.images
    })
  } catch (error) {
    next(error)
  }
}

// 📸 Restituisce solo le immagini di un singolo pacchetto
export const getPackageImages = async (req, res, next) => {
  try {
    const pack = await PackageModel.findById(req.params.id).select("images")
    if (!pack) throw createHttpError(404, "Pacchetto non trovato")
    res.json(pack.images)
  } catch (error) {
    next(error)
  }
}

// 📸 Restituisce tutte le immagini di tutti i pacchetti di un artista
export const getAllPackageImagesByArtist = async (req, res, next) => {
  try {
    const packages = await PackageModel.find({ artist: req.params.artistId }).select("images")
    const allImages = packages.flatMap(p => p.images)
    res.json(allImages)
  } catch (error) {
    next(error)
  }
}
