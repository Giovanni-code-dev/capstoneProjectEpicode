// utils/cloudinaryUploader.js

import { v2 as cloudinary } from "cloudinary"
import path from "path"
import { URL } from "url"

/**
 * Carica un buffer su Cloudinary
 * @param {Buffer} buffer - Il file da caricare
 * @param {string} folder - La cartella su Cloudinary
 * @param {string} resourceType - Tipo di risorsa (es. 'image', 'video')
 * @returns {Promise<object>} - Risposta Cloudinary
 */
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

/**
 * Elimina una risorsa da Cloudinary tramite public_id
 * @param {string} public_id - Identificativo pubblico del file su Cloudinary
 * @returns {Promise<object>} - Risposta Cloudinary
 */
export const deleteFromCloudinary = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

/**
 * Estrae il public_id da un URL Cloudinary
 * @param {string} imageUrl - URL completo dell’immagine Cloudinary
 * @returns {string|null} - public_id utilizzabile per la delete
 */
export const extractPublicIdFromUrl = (imageUrl) => {
  try {
    const url = new URL(imageUrl)
    const parts = url.pathname.split("/")
    const filename = path.basename(parts.at(-1), path.extname(parts.at(-1)))
    const folderPath = parts.slice(3, -1).join("/")
    return `${folderPath}/${filename}`
  } catch (error) {
    console.error("Errore nell'estrazione del public_id:", error)
    return null
  }
}
