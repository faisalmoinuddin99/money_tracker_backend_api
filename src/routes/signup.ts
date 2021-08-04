import express from "express";
import { User } from "../entities/User";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    msg: "hello",
  });
});

router.post(
  "/api/signup",
  [
    check("email").isEmail().withMessage("email is required"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("password should be atleast 3 char"),
  ],
  async (req: express.Request, res: express.Response) => {
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
  }
);

export { router as createSignUpRouter };
