import User from "../models/User.js";
import Thought from "../models/Thought.js";

export function getAllUsers(req, res) {
  User.find({})
    .select("-__v")
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}

export function getUserById({ params }, res) {
  console.log(params); 
  User.findOne({ _id: params.userId })
    .select("-__v")
    .populate("friends")
    .populate("thoughts")
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id" });
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}

export function createUser({ body }, res) {
  console.log("Request body:", body);
  User.create(body)
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.status(400).json(err));
}

export function updateUser({ params, body }, res) {
  User.findOneAndUpdate({ _id: params.userId }, body, {
    new: true,
    runValidators: true,
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id" });
      }
      res.json(dbUserData);
    })
    .catch((err) => res.status(400).json(err));
}

export function deleteUser({ params }, res) {
  User.findOneAndDelete({ _id: params.userId })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id" });
      }
      return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
    })
    .then(() => {
      res.json({ message: "User and associated thoughts deleted" });
    })
    .catch((err) => res.status(400).json(err));
}

export function addFriend({ params, body }, res) {
  User.findOneAndUpdate(
    { _id: params.userId },
    { $addToSet: { friends: params.friendId } },
    { new: true }
  )
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id" });
      }
      res.json(dbUserData);
    })
    .catch((err) => res.status(400).json(err));
}

export function removeFriend({ params }, res) {
  User.findOneAndUpdate(
    { _id: params.userId },
    { $pull: { friends: params.friendId } },
    { new: true }
  )
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id" });
      }
      res.json(dbUserData);
    })
    .catch((err) => res.status(400).json(err));
}
