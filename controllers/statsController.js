export const getArtistStats = async (req, res, next) => {
    try {
      const artistId = req.params.artistId
  
      // 1. Conta likes sull'artista
      const artistLikes = await LikeModel.countDocuments({
        targetType: "artist",
        targetId: artistId
      })
  
      // 2. Trova tutti gli show dell'artista
      const shows = await ShowModel.find({ artist: artistId }, "_id")
      const showIds = shows.map(s => s._id)
  
      const showLikes = await LikeModel.countDocuments({
        targetType: "show",
        targetId: { $in: showIds }
      })
  
      // 3. Trova tutti i pacchetti dell'artista
      const packages = await PackageModel.find({ artist: artistId }, "_id")
      const packageIds = packages.map(p => p._id)
  
      const packageLikes = await LikeModel.countDocuments({
        targetType: "package",
        targetId: { $in: packageIds }
      })
  
      const totalLikes = artistLikes + showLikes + packageLikes
  
      res.json({
        likeCount: {
          artist: artistLikes,
          shows: showLikes,
          packages: packageLikes,
          total: totalLikes
        }
      })
  
    } catch (error) {
      next(error)
    }
  }
  