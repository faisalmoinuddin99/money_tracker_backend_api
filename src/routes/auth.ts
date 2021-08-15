require("dotenv").config();
import express from "express";
import { check, validationResult } from "express-validator";
import { signin, signup, signout } from "../controllers/auth";
const router = express.Router();

export const signinRoute = router.post(
  "/api/auth/signin",
  [
    check("email").isEmail().withMessage("email is required"),
    check("password")
      .isLength({ min: 1 })
      .withMessage("password field is required"),
  ],
  signin
);

export const signupRoute = router.post(
  "/api/auth/signup",
  [
    check("email").isEmail().withMessage("email is required"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("password should be atleast 3 char"),
  ],
  signup
);

export const signoutRoute = router.post("/api/auth/signout", signout);
