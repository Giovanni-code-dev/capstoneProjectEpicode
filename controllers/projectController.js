import ProjectModel from "../models/Project.js"
import createHttpError from "http-errors"
import { uploadMultipleImages } from "../utils/imageUploader.js"
import { deleteFromCloudinary } from "../utils/cloudinaryUploader.js"

//
// CRUD - Progetti
//

/**
 * POST /projects
 * Crea un nuovo progetto per l’artista loggato (con eventuali immagini).
 */
export const createProject = async (req, res, next) => {
  try {
    let images = []

    if (req.files?.length) {
      images = await uploadMultipleImages(req.files, "projects")
    }

    const newProject = new ProjectModel({
      ...req.body,
      artist: req.user._id,
      images
    })

    const saved = await newProject.save()
    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /projects
 * Restituisce tutti i progetti dell’artista loggato.
 */
export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await ProjectModel.find({ artist: req.user._id })
    res.json(projects)
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /projects/:id
 * Modifica un progetto dell’artista loggato.
 */
export const updateProject = async (req, res, next) => {
  try {
    const updated = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id, artist: req.user._id },
      req.body,
      { new: true }
    )
    if (!updated) throw createHttpError(404, "Progetto non trovato o non autorizzato")
    res.json(updated)
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /projects/:id
 * Elimina un progetto dell’artista loggato.
 */
export const deleteProject = async (req, res, next) => {
  try {
    const deleted = await ProjectModel.findOneAndDelete({
      _id: req.params.id,
      artist: req.user._id,
    })
    if (!deleted) throw createHttpError(404, "Progetto non trovato o non autorizzato")
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

//
// Rotte pubbliche
//

/**
 * GET /projects/artist/:artistId
 * Restituisce tutti i progetti pubblici di un artista specifico.
 */
export const getProjectsByArtistId = async (req, res, next) => {
  try {
    const projects = await ProjectModel.find({ artist: req.params.artistId })
    res.json(projects)
  } catch (error) {
    next(error)
  }
}

//
// Immagini progetto
//

/**
 * PATCH /projects/:id/images
 * Aggiunge nuove immagini a un progetto esistente.
 */
export const updateProjectImages = async (req, res, next) => {
  try {
    const project = await ProjectModel.findOne({ _id: req.params.id, artist: req.user._id })
    if (!project) throw createHttpError(404, "Progetto non trovato o non autorizzato")

    const newImages = await uploadMultipleImages(req.files, "projects")
    project.images = [...project.images, ...newImages]

    await project.save()
    res.json({ message: "Immagini aggiornate con successo", images: project.images })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /projects/:id/images/:index
 * Rimuove una singola immagine da un progetto tramite indice.
 */
export const deleteProjectImage = async (req, res, next) => {
  try {
    const { id, index } = req.params
    const project = await ProjectModel.findOne({ _id: id, artist: req.user._id })
    if (!project) throw createHttpError(404, "Progetto non trovato o non autorizzato")

    const imgIndex = parseInt(index)
    if (isNaN(imgIndex) || imgIndex < 0 || imgIndex >= project.images.length) {
      throw createHttpError(400, "Indice immagine non valido")
    }

    const removedImage = project.images.splice(imgIndex, 1)[0]
    if (removedImage?.public_id) {
      await deleteFromCloudinary(removedImage.public_id)
    }

    await project.save()
    res.json({
      message: "Immagine rimossa con successo",
      removedImage,
      images: project.images
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /projects/:id/images/order
 * Riordina le immagini di un progetto in base a un nuovo array fornito dal frontend.
 */
export const reorderImages = async (req, res, next) => {
  try {
    const { id } = req.params
    const { newOrder } = req.body

    const project = await ProjectModel.findOne({ _id: id, artist: req.user._id })
    if (!project) throw createHttpError(404, "Progetto non trovato o non autorizzato")

    const reorderedImages = newOrder.map(entry => {
      const match = project.images.find(img => img.public_id === entry.public_id)
      if (!match) return null
      return {
        url: match.url,
        public_id: match.public_id,
        isCover: entry.isCover || false
      }
    }).filter(Boolean)

    project.images = reorderedImages
    await project.save()

    res.json({
      message: "Immagini riordinate con successo",
      images: project.images
    })
  } catch (error) {
    next(error)
  }
}
