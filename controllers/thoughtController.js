import Thought from "../models/Thought.js";
import User from "../models/User.js";

export const getAllThoughts = (req, res) => {
  Thought.find({})
    .select("-__v")
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

export const getThoughtById = ({ params }, res) => {
  console.log(params)
  Thought.findOne({ _id: params.thoughtId })
    .select("-__v")
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: "No thought found with this id" });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

export const createThought = ({ body }, res) => {
  Thought.create(body)
    .then(({ _id }) => {
      return User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: _id } },
        { new: true }
      );
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id" });
      }
      res.json(dbUserData);
    })
    .catch((err) => res.status(400).json(err));
};

export const updateThought = ({ params, body }, res) => {
  Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
    new: true,
    runValidators: true,
  })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: "No thought found with this id" });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => res.status(400).json(err));
};

export const deleteThought = ({ params }, res) => {
  Thought.findOneAndDelete({ _id: params.thoughtId })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: "No thought found with this id" });
      }
      return User.findOneAndUpdate(
        { thoughts: params.thoughtId },
        { $pull: { thoughts: params.thoughtId } }
      );
    })
    .then(() => {
      return res.json({ message: "Thought and associated reactions deleted" });
    })
    .catch((err) => res.status(400).json(err));
};


export const addReaction = ({ params, body }, res) => {
  Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $push: { reactions: body } },
    { new: true, runValidators: true }
  )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: "No thought found with this id" });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => res.status(400).json(err));
};

export const removeReaction = ({ params }, res) => {
  Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $pull: { reactions: { reactionId: params.reactionId } } },
    { new: true }
  )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: "No thought found with this id" });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => res.status(400).json(err));
};
