import express from "express";
import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Post from "../models/PostModel.js";

const postRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../images/");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

postRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const posts = await Post.find({});
    res.send(posts);
  })
);

postRouter.post(
  "/v2",
  upload.single("photo"),
  expressAsyncHandler(async (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const caption = req.body.caption;
    const photo = req.body.filename;

    const post = new Post({
      name,
      username,
      caption,
      photo,
    });

    const newPost = await post.save();

    res.send("Post Added!");
  })
);

export default postRouter;
