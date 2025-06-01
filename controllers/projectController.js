// controllers/projectController.js

import ProjectModel from "../models/Project.js"
import createHttpError from "http-errors"
import { uploadMultipleImages } from "../utils/imageUploader.js"
import { deleteImagesFromModel } from "../services/image/imageDeletionHandler.js"
import { deleteImagesFromCloudinaryList } from "../utils/imageUploader.js"

//
// CRUD - Progetti
//

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

export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await ProjectModel.find({ artist: req.user._id })
    res.json(projects)
  } catch (error) {
    next(error)
  }
}

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

// DELETE /projects/:id - Elimina progetto
export const deleteProject = async (req, res, next) => {
  try {
    const deleted = await ProjectModel.findOneAndDelete({
      _id: req.params.id,
      artist: req.user._id
    })

    if (!deleted) throw createHttpError(404, "Progetto non trovato o non autorizzato")

    // Elimina eventuali immagini collegate
    await deleteImagesFromCloudinaryList(deleted.images)

    res.status(200).json({ message: "Progetto eliminato con successo" })
  } catch (error) {
    next(error)
  }
}



//
// Rotte pubbliche
//

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

// DELETE /projects/:id/images
export const deleteProjectImage = async (req, res, next) => {
  try {
    const publicIds = req.body.public_ids || req.body.publicIds
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      throw createHttpError(400, "public_ids è richiesto e deve essere un array non vuoto")
    }

    const result = await deleteImagesFromModel({
      model: ProjectModel,
      modelName: "Project",
      ownerId: req.user._id,
      docId: req.params.id,
      publicIds
    })

    res.json(result)
  } catch (error) {
    next(error)
  }
}



export const reorderProjectImages = async (req, res, next) => {
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
