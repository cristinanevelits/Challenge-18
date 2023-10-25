import Thought from "../models/Thought.js";
import Reaction from "../models/Reaction.js";
import { Types } from "mongoose";

export const createReaction = async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const newReaction = req.body;

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    const reaction = new Reaction(newReaction);
    await reaction.save();

    thought.reactions.push(reaction._id);

    await thought.save();

    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteReaction = async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;
    console.log(req.params);

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    const objectIdReactionId = new Types.ObjectId(reactionId);

    // Remove the reaction from the array
    thought.reactions = thought.reactions.filter(
      (reaction) => reaction !== objectIdReactionId
    );

    await thought.save();

    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
