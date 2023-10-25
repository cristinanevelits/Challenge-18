import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const { connect, connection } = mongoose;
const PORT = process.env.PORT || 3001;
const app = express();

// Connect to MongoDB
connect(process.env.MONGODB_URI);

connection.on("connected", () => {
  console.log("Connected to the database");
});

connection.on("error", (err) => {
  console.error(`Database connection error: ${err}`);
});

connection.on("disconnected", () => {
  console.log("Disconnected from the database");
});

process.on("SIGINT", () => {
  connection.close(() => {
    console.log("Database connection closed through app termination");
    process.exit(0);
  });
});

app.use(express.json());

import usersRoutes from "./routes/users.js";
import thoughtsRoutes from "./routes/thoughts.js";
import friendsRoutes from "./routes/friends.js";

app.use("/api/users", usersRoutes);
app.use("/api/thoughts", thoughtsRoutes);
app.use("/api/friends", friendsRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
