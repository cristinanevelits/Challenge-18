import { Router } from "express";
const router = Router();
import * as friendController from "../controllers/friendController.js";

// /api/users/:userId/friends/:friendId
router
  .route("/:userId/friends/:friendId")
  .post(friendController.addFriend)
  .delete(friendController.removeFriend);

export default router;
