import Artist from "../../models/Artist.js"
import createHttpError from "http-errors"
import { createAccessToken } from "../../tools/jwtTools.js"

// Registrazione artista
export const registerArtist = async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    const existing = await Artist.findOne({ email })
    if (existing) {
      console.log(" Registrazione bloccata: email già presente per artista:", email)
      throw createHttpError(409, "Utente già registrato come artista")
    }

    const newArtist = new Artist({ email, password, name })
    await newArtist.save()

    const token = await createAccessToken({
      _id: newArtist._id,
      role: "artist",
      name: newArtist.name,
      email: newArtist.email,
      avatar: newArtist.avatar,
      model: "Artist"
    })

    // Invia la risposta con il token e i dati dell'artista

    res.status(201).json({
      message: "Registrazione avvenuta con successo",
      token,
      artist: {
        _id: newArtist._id,
        name: newArtist.name,
        email: newArtist.email
      }
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
    if (!artist) throw createHttpError(404, "Artista non trovato")

    //  Blocca login se l'account è stato creato con Google
    if (artist.provider !== "local") {
      throw createHttpError(400, "Questo account è stato creato con Google. Accedi tramite Google.")
    }

    const isMatch = await artist.comparePassword(password)
    if (!isMatch) throw createHttpError(401, "Password errata")

    const token = await createAccessToken({
      _id: artist._id,
      role: "Artist",
      name: artist.name,
      email: artist.email,
      avatar: artist.avatar,
    })

    res.json({
      message: "Login artista riuscito",
      token,
      name: artist.name,
      email: artist.email,
      avatar: artist.avatar,
      role: "artist",
      _id: artist._id,
      model: "Artist"
    })
    
  } catch (error) {
    next(error)
  }
}


