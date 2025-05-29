import Artist from "../../models/Artist.js"
import createHttpError from "http-errors"
import { createAccessToken } from "../../tools/jwtTools.js"

// Registrazione artista
export const registerArtist = async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    const existing = await Artist.findOne({ email })
    if (existing) throw createHttpError(409, "Email già registrata")

    const newArtist = new Artist({ email, password, name })
    await newArtist.save()

    const token = await createAccessToken({
      _id: newArtist._id,
      model: "Artist"
    })

    res.status(201).json({
      message: "Registrazione avvenuta con successo",
      token
    })
  } catch (error) {
    next(error)
  }
}

// Login artista
export const loginArtist = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const artist = await Artist.findOne({ email })
    if (!artist) throw createHttpError(401, "Credenziali non valide")

    const isMatch = await artist.isPasswordCorrect(password)
    if (!isMatch) throw createHttpError(401, "Credenziali non valide")

    const token = await createAccessToken({
      _id: artist._id,
      model: "Artist"
    })

    res.json({
      message: "Login artista riuscito",
      token
    })
  } catch (error) {
    next(error)
  }
}
