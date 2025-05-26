import UserModel from "../models/User.js"
import { getCoordinatesFromAddress } from "../utils/geocoding.js"
import createHttpError from "http-errors"

// Aggiorna posizione
export const updateUserLocation = async (req, res, next) => {
  try {
    const { city, address } = req.body

    if (!city || !address) {
      throw createHttpError(400, "City e address sono obbligatori")
    }

    const coordinates = await getCoordinatesFromAddress(city, address)

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        location: {
          city,
          address,
          coordinates,
        },
      },
      { new: true }
    )

    if (!updatedUser) throw createHttpError(404, "Utente non trovato")

    res.json({
      message: "Posizione aggiornata con successo!",
      location: updatedUser.location,
    })
  } catch (error) {
    next(error)
  }
}

// Recupera posizione
export const getUserLocation = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).select("location")
    if (!user || !user.location) {
      throw createHttpError(404, "Posizione non trovata.")
    }

    res.json({ location: user.location })
  } catch (error) {
    next(error)
  }
}
