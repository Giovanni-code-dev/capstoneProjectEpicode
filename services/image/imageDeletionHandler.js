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

/*
2. deleteImagesFromModel
È più completa: elimina immagini dal documento MongoDB e da Cloudinary, filtrando solo i public_id passati.
Utile quando vuoi eliminare solo alcune immagini, ad esempio:
DELETE /projects/:id/images
DELETE /packages/:id/images
*/

export const deleteImagesFromModel = async ({
  model,
  docId,
  ownerId,
  ownerField = "artist",
  publicIds,
  modelName = "documento"
}) => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    throw createHttpError(400, "Fornire almeno un public_id da eliminare")
  }

  const doc = await model.findOne({ _id: docId, [ownerField]: ownerId.toString() })
  if (!doc) {
    throw createHttpError(404, `${modelName} non trovato o non autorizzato`)
  }

  const imagesToRemove = doc.images.filter(img => publicIds.includes(img.public_id))
  if (imagesToRemove.length === 0) {
    throw createHttpError(404, "Nessuna immagine trovata con i public_id forniti")
  }

  await Promise.all(imagesToRemove.map(img => deleteFromCloudinary(img.public_id)))

  doc.images = doc.images.filter(img => !publicIds.includes(img.public_id))
  await doc.save()

  return {
    message: `${imagesToRemove.length} immagine/i rimossa/e da ${modelName}`,
    removedImages: imagesToRemove,
    images: doc.images
  }
}
