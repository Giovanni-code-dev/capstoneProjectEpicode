import cloudinary from "../config/cloudinary.js"
import path from "path"
import { URL } from "url"

/**
 * Carica un file buffer su Cloudinary.
 * @param {Buffer} buffer - Il file da caricare.
 * @param {string} folder - La cartella in cui salvare (es. 'projects', 'shows').
 * @param {string} resourceType - Tipo di file ('image' o 'video').
 * @returns {Promise<object>} - Risposta da Cloudinary con url e public_id.
 */
export const uploadToCloudinary = (buffer, folder = "uploads", resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (err, result) => {
        if (err || !result?.public_id || !result?.secure_url) {
          console.error("Errore upload Cloudinary:", err || "Dati mancanti:", result)
          return reject(
            new Error("Upload fallito: dati mancanti da Cloudinary (public_id o secure_url)")
          )
        }
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}


/**
 * Elimina una risorsa da Cloudinary tramite public_id.
 * @param {string} public_id - ID pubblico dell'immagine o video da rimuovere.
 * @returns {Promise<object>} - Risultato dell'eliminazione.
 */
export const deleteFromCloudinary = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

/**
 * Estrae il public_id da un URL Cloudinary.
 * Utile per rimuovere risorse in base al link salvato.
 * @param {string} imageUrl - URL completo Cloudinary.
 * @returns {string|null} - Il public_id utilizzabile per delete.
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
