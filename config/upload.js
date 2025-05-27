import multer from "multer"

// Multer con memoria temporanea (RAM), usata per upload su Cloudinary
const storage = multer.memoryStorage()

const upload = multer({ storage })

export default upload
