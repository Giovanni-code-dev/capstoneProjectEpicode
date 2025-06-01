import createHttpError from "http-errors"
import { deleteFromCloudinary } from "../../utils/cloudinaryUploader.js"

/**
 * Rimuove una o più immagini da un documento specifico (Show, Package, Project).
 * @param {Object} params
 * @param {Model} params.model - Il modello Mongoose da cui rimuovere le immagini.
 * @param {string} params.docId - L'ID del documento.
 * @param {string|ObjectId} params.userId - L'ID dell'artista proprietario.
 * @param {string[]} params.publicIds - Lista dei public_id da rimuovere.
 * @param {string} [params.modelName="documento"] - Nome leggibile del modello, per i messaggi.
 * @returns {Object} - Risultato con messaggio, immagini rimosse e stato aggiornato.
 */
export const deleteImagesFromModel = async ({
  model,
  docId,
  userId,
  publicIds,
  modelName = "documento"
}) => {
  // Validazione base
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    throw createHttpError(400, "Fornire almeno un public_id da eliminare")
  }

  // Debug
  console.log("DEBUG ➤ docId:", docId)
  console.log("DEBUG ➤ userId:", userId)
  console.log("DEBUG ➤ typeof docId:", typeof docId)
  console.log("DEBUG ➤ typeof userId:", typeof userId)

  // Cerca il documento dell'artista
  const doc = await model.findOne({ _id: docId, artist: userId.toString() })
  if (!doc) {
    throw createHttpError(404, `${modelName} non trovato o non autorizzato`)
  }

  // Debug immagini
  console.log("Immagini nel documento:", doc.images.map(img => img.public_id))

  // Filtra le immagini da rimuovere
  const imagesToRemove = doc.images.filter(img => publicIds.includes(img.public_id))
  if (imagesToRemove.length === 0) {
    throw createHttpError(404, "Nessuna immagine trovata con i public_id forniti")
  }

  // Elimina da Cloudinary
  await Promise.all(imagesToRemove.map(img => deleteFromCloudinary(img.public_id)))

  // Rimuovi dal documento e salva
  doc.images = doc.images.filter(img => !publicIds.includes(img.public_id))
  await doc.save()

  // Risposta finale
  return {
    message: `${imagesToRemove.length} immagine/i rimossa/e da ${modelName}`,
    removedImages: imagesToRemove,
    images: doc.images
  }
}
