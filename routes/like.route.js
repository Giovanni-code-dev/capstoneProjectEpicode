import express from "express"
import {
  addLike,
  removeLike,
  getLikeCount,
  isLikedByMe,
  getMyLikes
} from "../controllers/likeController.js"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"

const router = express.Router()

router.get("/:targetType/:targetId/count", getLikeCount)

router.use(JWTAuthMiddleware) // tutte le rotte richiedono login

router.post("/", addLike)
router.delete("/:targetType/:targetId", removeLike)

router.get("/mine/:targetType/:targetId", isLikedByMe)
router.get("/mine", getMyLikes)

export default router

