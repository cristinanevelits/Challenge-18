import { Router } from "express";
const router = Router();
import * as thoughtController from "../controllers/thoughtController.js";
import * as reactionController from "../controllers/reactionController.js";

// /api/thoughts
router
  .route("/")
  .get(thoughtController.getAllThoughts)
  .post(thoughtController.createThought);

// /api/thoughts/:thoughtId
router
  .route("/:thoughtId")
  .get(thoughtController.getThoughtById)
  .put(thoughtController.updateThought)
  .delete(thoughtController.deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions").post(reactionController.createReaction);

router
  .route("/:thoughtId/reactions/:reactionId")
  .delete(reactionController.deleteReaction);

export default router;
