import { v2 as cloudinary } from "cloudinary"

export const uploadToCloudinary = (buffer, folder = "uploads", resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => {
        if (err) reject(err)
        else resolve(result)
      }
    )
    stream.end(buffer)
  })
}

export const deleteFromCloudinary = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}
