import PackageModel from "../models/Package.js"
import createHttpError from "http-errors"
import cloudinary from "../config/cloudinary.js"
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUploader.js"

// 📦 Crea un nuovo pacchetto con immagini multiple
export const createPackage = async (req, res, next) => {
  try {
    let imageUrls = []

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, "packages")
      )

      const results = await Promise.all(uploadPromises)
      imageUrls = results.map(r => r.secure_url)
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

export const getMyPackages = async (req, res, next) => {
  try {
    const packages = await PackageModel.find({ artist: req.user._id }).populate("shows")
    res.json(packages)
  } catch (error) {
    next(error)
  }
}

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

export const deletePackage = async (req, res, next) => {
  try {
    const deleted = await PackageModel.findOneAndDelete({
      _id: req.params.id,
      artist: req.user._id,
    })
    if (!deleted) throw createHttpError(404, "Pacchetto non trovato o non autorizzato")
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export const getPackagesByArtistId = async (req, res, next) => {
  try {
    const { artistId } = req.params
    const packages = await PackageModel.find({ artist: artistId }).populate("shows")
    res.json(packages)
  } catch (error) {
    next(error)
  }
}

export const getPackageById = async (req, res, next) => {
  try {
    const { id } = req.params
    const found = await PackageModel.findById(id).populate("shows")
    if (!found) throw createHttpError(404, "Pacchetto non trovato")
    res.json(found)
  } catch (error) {
    next(error)
  }
}

export const updatePackageImages = async (req, res, next) => {
  try {
    const pack = await PackageModel.findOne({ _id: req.params.id, artist: req.user._id })
    if (!pack) throw createHttpError(404, "Pacchetto non trovato o non autorizzato")

    let imageUrls = []

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, "packages")
      )

      const results = await Promise.all(uploadPromises)
      imageUrls = results.map(r => r.secure_url)
    }

    // Aggiorna le immagini con spread
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

export const deletePackageImage = async (req, res, next) => {
  try {
    const { id, index } = req.params

    const pack = await PackageModel.findOne({
      _id: id,
      artist: req.user._id
    })

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
