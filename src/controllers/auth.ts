import express from "express";
import { User } from "../models/User";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const signin = async (req: express.Request, res: express.Response) => {
  // destructuring
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(400).json({
      Error_message: "USER not found",
    });
  }

  // console.log(user?.authenticatePassword(password));

  if (!user?.authenticatePassword(password)) {
    return res.status(401).json({
      error: "Email or Password doesnt match",
    });
  }
  const secret: any = process.env.SECRET;

  // create token
  const token = jwt.sign(
    { _id: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    secret
  );
  // put token in cookie

  res.cookie("token", token);

  //send response to frontend
  const { id, first_name, last_name } = user;
  return res.json({ token, user: { id, first_name, last_name, email } });
};

export const signup = async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }
  const { first_name, last_name, email, password } = req.body;

  const user = User.create({
    first_name,
    last_name,
    email,
    encry_password: password,
  });
  try {
    await user.save();
    return res.json(user);
  } catch (error) {
    if (error) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }
    console.log("Catch an error: ", error);
  }
};

export const signout = async (req: express.Request, res: express.Response) => {
  res.clearCookie("token");
  res.json({
    message: "user signout success....",
  });
};
