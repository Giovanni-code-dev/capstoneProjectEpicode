// utils/imageUploader.js
import { uploadToCloudinary } from "./cloudinaryUploader.js"

/**
 * Carica più immagini su Cloudinary e restituisce url + public_id
 * @param {Array} files - Array di file (es. da req.files)
 * @param {String} folder - Nome della cartella Cloudinary
 * @returns {Promise<Array<{url: string, public_id: string}>>}
 */
export const uploadMultipleImages = async (files, folder) => {
  if (!files || files.length === 0) return []

  const uploadPromises = files.map(file =>
    uploadToCloudinary(file.buffer, folder)
  )

  const results = await Promise.all(uploadPromises)

  return results.map(r => ({
    url: r.secure_url,
    public_id: r.public_id
  }))
}
