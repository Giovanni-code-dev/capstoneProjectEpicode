import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinaryUploader.js"

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

/*
1. deleteImagesFromCloudinaryList
È semplice e diretta: prende un array di immagini ([{url, public_id}]) e le elimina solo da Cloudinary.
 Utile quando stai eliminando tutto un documento, ad esempio:
deleteShow()
deletePackage()
deleteProject()
deleteReview()
*/
/**
 * Elimina tutte le immagini di un array (che contengono public_id) da Cloudinary
 * @param {Array} images - Array di immagini, ognuna con public_id
 * @returns {Promise<void>}
 */
export const deleteImagesFromCloudinaryList = async (images = []) => {
  const deletions = images
    .filter(img => img?.public_id)
    .map(img => deleteFromCloudinary(img.public_id))

  await Promise.all(deletions)
}
