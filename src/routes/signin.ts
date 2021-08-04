import express from "express";
import { User } from "../entities/User";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/api/signin",
  [
    check("email").isEmail().withMessage("email is required"),
    check("password")
      .isLength({ min: 1 })
      .withMessage("password field is required"),
  ],
  async (req: express.Request, res: express.Response) => {
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
        message: "USER not found",
      });
    }

    console.log(user?.authenticatePassword(password));

    if (!user?.authenticatePassword(password)) {
      console.log(user);

      res.status(401).json({
        message: "Email or Password doesnt match",
      });
    }
    res.json(user);
  }
);

export { router as createSignInRouter };
