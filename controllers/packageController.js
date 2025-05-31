import PackageModel from "../models/Package.js"
import ShowModel from "../models/Show.js"
import createHttpError from "http-errors"
import { deleteFromCloudinary } from "../utils/cloudinaryUploader.js"
import { uploadMultipleImages } from "../utils/imageUploader.js"

//
// CRUD
//

// POST /packages - Crea un nuovo pacchetto
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

    const { shows = [] } = req.body

    if (!Array.isArray(shows) || shows.length === 0) {
      throw createHttpError(400, "Devi includere almeno uno spettacolo.")
    }

    const validShows = await ShowModel.find({
      _id: { $in: shows },
      artist: req.user._id
    })

    if (validShows.length !== shows.length) {
      throw createHttpError(403, "Alcuni degli spettacoli forniti non appartengono al tuo profilo.")
    }

    const newPackage = new PackageModel({
      ...req.body,
      shows,
      artist: req.user._id,
      images: imageUrls
    })

    const saved = await newPackage.save()
    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
}

// GET /packages - Pacchetti dell’artista loggato
export const getMyPackages = async (req, res, next) => {
  try {
    const packages = await PackageModel.find({ artist: req.user._id })
      .populate({ path: "shows", select: "title category" })

    const enriched = packages.map(pkg => ({
      ...pkg.toObject(),
      categories: [...new Set(pkg.shows.map(s => s.category))]
    }))

    res.json(enriched)
  } catch (error) {
    next(error)
  }
}

// GET /packages/me/:id - Dettaglio pacchetto dell’artista loggato
export const getMyPackageById = async (req, res, next) => {
  try {
    const pack = await PackageModel.findOne({ _id: req.params.id, artist: req.user._id })
      .populate("shows")
    if (!pack) throw createHttpError(404, "Pacchetto non trovato o non autorizzato")
    res.json(pack)
  } catch (error) {
    next(error)
  }
}

// PUT /packages/:id - Modifica pacchetto
export const updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params

    if ("shows" in req.body) {
      if (!Array.isArray(req.body.shows) || req.body.shows.length === 0) {
        throw createHttpError(400, "Il pacchetto deve contenere almeno uno spettacolo.")
      }

      const validShows = await ShowModel.find({
        _id: { $in: req.body.shows },
        artist: req.user._id
      })

      if (validShows.length !== req.body.shows.length) {
        throw createHttpError(403, "Alcuni degli spettacoli non ti appartengono.")
      }
    }

    const updated = await PackageModel.findOneAndUpdate(
      { _id: id, artist: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )

    if (!updated) {
      throw createHttpError(404, "Pacchetto non trovato o non autorizzato")
    }

    res.json(updated)
  } catch (error) {
    next(error)
  }
}

// DELETE /packages/:id - Elimina pacchetto
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

//
// Rotte pubbliche
//

// GET /packages/artist/:artistId - Tutti i pacchetti pubblici di un artista (filtro opzionale ?category=)
export const getPackagesByArtistId = async (req, res, next) => {
  try {
    const { category } = req.query

    const packages = await PackageModel.find({ artist: req.params.artistId })
      .populate({ path: "shows", select: "title category" })

    let filtered = packages
    if (category) {
      filtered = packages.filter(pkg =>
        pkg.shows.some(show => show.category === category)
      )
    }

    const enriched = filtered.map(pkg => ({
      ...pkg.toObject(),
      categories: [...new Set(pkg.shows.map(s => s.category))]
    }))

    res.json(enriched)
  } catch (error) {
    next(error)
  }
}

// GET /packages/:id - Dettagli di un pacchetto pubblico
export const getPackageById = async (req, res, next) => {
  try {
    const found = await PackageModel.findById(req.params.id).populate("shows")
    if (!found) throw createHttpError(404, "Pacchetto non trovato")
    res.json(found)
  } catch (error) {
    next(error)
  }
}

//
// Immagini
//

// PATCH /packages/:id/images - Aggiunge immagini al pacchetto
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

// DELETE /packages/:id/images - Elimina immagini specifiche
export const deletePackageImages = async (req, res, next) => {
  try {
    const { id } = req.params
    const { public_ids } = req.body

    if (!Array.isArray(public_ids) || public_ids.length === 0) {
      throw createHttpError(400, "Fornire almeno un public_id da eliminare")
    }

    const pack = await PackageModel.findOne({ _id: id, artist: req.user._id })
    if (!pack) throw createHttpError(404, "Pacchetto non trovato o non autorizzato")

    const imagesToRemove = pack.images.filter(img => public_ids.includes(img.public_id))
    if (imagesToRemove.length === 0) {
      throw createHttpError(404, "Nessuna immagine trovata con i public_id forniti")
    }

    await Promise.all(imagesToRemove.map(img => deleteFromCloudinary(img.public_id)))
    pack.images = pack.images.filter(img => !public_ids.includes(img.public_id))
    await pack.save()

    res.json({
      message: `${imagesToRemove.length} immagine/i rimossa/e con successo`,
      removedImages: imagesToRemove,
      images: pack.images
    })
  } catch (error) {
    next(error)
  }
}

// PATCH /packages/:id/images/order - Riordina immagini del pacchetto
export const reorderImages = async (req, res, next) => {
  try {
    const { id } = req.params
    const { newOrder } = req.body

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

// GET /packages/:id/images - Ottieni immagini di un pacchetto
export const getPackageImages = async (req, res, next) => {
  try {
    const pack = await PackageModel.findById(req.params.id).select("images")
    if (!pack) throw createHttpError(404, "Pacchetto non trovato")
    res.json(pack.images)
  } catch (error) {
    next(error)
  }
}

// GET /packages/artist/:artistId/images - Tutte le immagini dei pacchetti di un artista
export const getAllPackageImagesByArtist = async (req, res, next) => {
  try {
    const packages = await PackageModel.find({ artist: req.params.artistId }).select("images")
    const allImages = packages.flatMap(p => p.images)
    res.json(allImages)
  } catch (error) {
    next(error)
  }
}

//
// Categorie
//

// GET /packages/categories/me - Categorie dei pacchetti dell’artista loggato
export const getMyPackageCategories = async (req, res, next) => {
  try {
    const packages = await PackageModel.find({ artist: req.user._id })
      .populate({ path: "shows", select: "category" })

    const categories = new Set()
    packages.forEach(pkg => {
      pkg.shows.forEach(show => {
        if (show.category) categories.add(show.category)
      })
    })

    res.json([...categories])
  } catch (error) {
    next(error)
  }
}

// GET /packages/categories/artist/:artistId - Categorie dei pacchetti pubblici di un artista
export const getPackageCategoriesByArtistId = async (req, res, next) => {
  try {
    const packages = await PackageModel.find({ artist: req.params.artistId })
      .populate({ path: "shows", select: "category" })

    const categories = new Set()
    packages.forEach(pkg => {
      pkg.shows.forEach(show => {
        if (show.category) categories.add(show.category)
      })
    })

    res.json([...categories])
  } catch (error) {
    next(error)
  }
}
