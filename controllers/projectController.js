import ProjectModel from "../models/Project.js"
import createHttpError from "http-errors"

export const createProject = async (req, res, next) => {
  try {
    const newProject = new ProjectModel({
      ...req.body,
      artist: req.user._id,
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

export const getProjectsByArtistId = async (req, res, next) => {
  try {
    const projects = await ProjectModel.find({ artist: req.params.artistId })
    res.json(projects)
  } catch (error) {
    next(error)
  }
}
