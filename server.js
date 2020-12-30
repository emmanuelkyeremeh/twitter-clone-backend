import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRouter from "./routes/UserRoute.js";
import postRouter from "./routes/PostRouter.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", UserRouter);
app.use("/api/posts", postRouter);
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connection Successful!");
});

app.get("/", async (req, res) => {
  res.send("Server Backend");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
