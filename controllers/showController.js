import ShowModel from "../models/Show.js"
import createHttpError from "http-errors"

export const createShow = async (req, res, next) => {
  try {
    const newShow = new ShowModel({
      ...req.body,
      artist: req.user._id, // preso dal JWT
    })

    const saved = await newShow.save()
    res.status(201).json(saved)
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