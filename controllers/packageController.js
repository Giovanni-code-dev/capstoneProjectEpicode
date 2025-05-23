import PackageModel from "../models/Package.js"
import createHttpError from "http-errors"

export const createPackage = async (req, res, next) => {
  try {
    const newPackage = new PackageModel({
      ...req.body,
      artist: req.user._id,
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
