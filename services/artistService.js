import UserModel from "../models/User.js"
import createHttpError from "http-errors"
import ShowModel from "../models/Show.js"

// Recupera profilo pubblico artista
export const getPublicArtistProfile = async (req, res, next) => {
  try {
    const artist = await UserModel.findById(req.params.id)
      .select("name bio avatar telefono website instagram facebook youtube portfolio tiktok location role")

    if (!artist || artist.role !== "artist") {
      throw createHttpError(404, "Artista non trovato")
    }

    res.json({
      _id: artist._id,
      name: artist.name,
      bio: artist.bio,
      avatar: artist.avatar,
      telefono: artist.telefono,
      website: artist.website,
      instagram: artist.instagram,
      facebook: artist.facebook,
      youtube: artist.youtube,
      portfolio: artist.portfolio,
      tiktok: artist.tiktok,
      location: artist.location,
      category: artist.category
    })
  } catch (error) {
    next(error)
  }
}


export const searchArtistsByFilters = async (req, res, next) => {
    try {
      const { city, category } = req.query
  
      const query = { role: "artist" }
  
      if (city) {
        query["location.city"] = { $regex: new RegExp(city, "i") }
      }
  
      if (category) {
        query["categories"] = { $regex: new RegExp(category, "i") }
      }
  
      const artists = await UserModel.find(query).select("name avatar bio location categories")
  
      res.json(artists)
    } catch (error) {
      next(error)
    }
  }
  
  