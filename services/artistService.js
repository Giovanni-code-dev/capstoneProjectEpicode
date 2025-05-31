// services/artistService.js

import Artist from "../models/Artist.js"
import ReviewModel from "../models/Review.js"
import createHttpError from "http-errors"

// Recupera profilo pubblico di un artista, includendo la media dei voti e il numero di recensioni
export const getPublicArtistProfile = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id).select(
      "name bio avatar telefono website instagram facebook youtube portfolio tiktok location categories"
    )

    if (!artist) {
      throw createHttpError(404, "Artista non trovato")
    }

    const reviews = await ReviewModel.find({ artist: artist._id })
    const averageRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null

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
      categories: artist.categories,
      averageRating,
      reviewCount: reviews.length
    })
  } catch (error) {
    next(error)
  }
}

// Ricerca artisti filtrando per città e categoria, con opzioni di ordinamento e limit
export const searchArtistsByFilters = async (req, res, next) => {
  try {
    const { city, category, sort, limit } = req.query
    const query = {}

    if (city) {
      query["location.city"] = { $regex: new RegExp(city, "i") }
    }

    if (category) {
      query["categories"] = { $regex: new RegExp(category, "i") }
    }

    const artists = await Artist.find(query).select("name avatar bio location categories createdAt")

    const resultsWithRatings = await Promise.all(
      artists.map(async (artist) => {
        const reviews = await ReviewModel.find({ artist: artist._id })
        const averageRating = reviews.length
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
          : null

        return {
          ...artist.toObject(),
          averageRating: averageRating ? averageRating.toFixed(1) : null,
          reviewCount: reviews.length
        }
      })
    )

    // Ordinamento dinamico
    if (sort === "rating") {
      resultsWithRatings.sort((a, b) => (parseFloat(b.averageRating) || 0) - (parseFloat(a.averageRating) || 0))
    } else if (sort === "reviewCount") {
      resultsWithRatings.sort((a, b) => b.reviewCount - a.reviewCount)
    } else if (sort === "latest") {
      resultsWithRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sort === "random") {
      resultsWithRatings.sort(() => Math.random() - 0.5)
    }

    const finalResults = limit ? resultsWithRatings.slice(0, parseInt(limit)) : resultsWithRatings
    res.json(finalResults)
  } catch (error) {
    next(error)
  }
}

// Recupera gli artisti "in evidenza", con almeno 5 recensioni e media >= 4.5
export const getHighlightedArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find().select("name avatar bio location categories createdAt")

    const highlighted = await Promise.all(
      artists.map(async (artist) => {
        const reviews = await ReviewModel.find({ artist: artist._id })
        const averageRating = reviews.length
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
          : null

        return {
          ...artist.toObject(),
          averageRating: averageRating ? averageRating.toFixed(1) : null,
          reviewCount: reviews.length
        }
      })
    )

    const filtered = highlighted.filter(
      (artist) => artist.reviewCount >= 5 && parseFloat(artist.averageRating) >= 4.5
    )

    filtered.sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating))

    res.json(filtered)
  } catch (error) {
    next(error)
  }
}
