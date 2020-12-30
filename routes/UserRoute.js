import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { generateToken } from "../Auth.js";

const UserRouter = express.Router();

UserRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({
      username: req.body.username,
      email: req.body.email,
    });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({
      message: "Email or password is incorrect",
    });
  })
);

UserRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const newUser = await user.save();
    res.send({
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      token: generateToken(newUser),
    });
  })
);

export default UserRouter;
