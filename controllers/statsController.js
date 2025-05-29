import mongoose from "mongoose"
import LikeModel from "../models/Like.js"
import ShowModel from "../models/Show.js"
import PackageModel from "../models/Package.js"
import ReviewModel from "../models/Review.js"
import RequestModel from "../models/Request.js"
import createHttpError from "http-errors"

export const getArtistStats = async (req, res, next) => {
  try {
    const { artistId } = req.params

    // ✅ Verifica che l'ID sia valido
    if (!mongoose.isValidObjectId(artistId)) {
      throw createHttpError(400, "ID artista non valido")
    }

    // 🔹 Likes diretti sull'artista
    const artistLikesPromise = LikeModel.countDocuments({ targetType: "artist", targetId: artistId })

    // 🔹 Shows e packages creati dall'artista
    const showsPromise = ShowModel.find({ artist: artistId }, "_id")
    const packagesPromise = PackageModel.find({ artist: artistId }, "_id")

    // 🔹 Recensioni ricevute
    const reviewsPromise = ReviewModel.find({ artist: artistId }, "rating")

    // 🔹 Richieste ricevute
    const totalRequestsPromise = RequestModel.countDocuments({ artist: artistId })
    const acceptedRequestsPromise = RequestModel.countDocuments({ artist: artistId, status: "accepted" })

    // 🚀 Lancia tutte le query in parallelo
    const [
      artistLikes,
      shows,
      packages,
      reviews,
      totalRequests,
      acceptedRequests
    ] = await Promise.all([
      artistLikesPromise,
      showsPromise,
      packagesPromise,
      reviewsPromise,
      totalRequestsPromise,
      acceptedRequestsPromise
    ])

    // 🔸 Likes su show e pacchetti
    const showIds = shows.map(s => s._id)
    const packageIds = packages.map(p => p._id)

    const [showLikes, packageLikes] = await Promise.all([
      LikeModel.countDocuments({ targetType: "show", targetId: { $in: showIds } }),
      LikeModel.countDocuments({ targetType: "package", targetId: { $in: packageIds } })
    ])

    // 🔸 Calcolo media voti recensioni
    const reviewCount = reviews.length
    const averageRating = reviewCount > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(2)
      : null

    // 🔚 Risposta finale
    res.json({
      likeCount: {
        artist: artistLikes,
        shows: showLikes,
        packages: packageLikes,
        total: artistLikes + showLikes + packageLikes
      },
      reviewStats: {
        total: reviewCount,
        averageRating
      },
      requests: {
        total: totalRequests,
        accepted: acceptedRequests
      }
    })

  } catch (error) {
    next(error)
  }
}
