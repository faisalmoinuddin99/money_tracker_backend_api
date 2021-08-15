import express from "express";
import { Season } from "../models/Season";
const router = express.Router();

router.post("/api/sessions", async (req, res) => {
  const { season, total_episodes } = req.body;

  const naruto_seasons = Season.create({
    season,
    total_episodes,
  });

  try {
    await naruto_seasons.save();
    return res.json(naruto_seasons);
  } catch (error) {
    if (error) {
      return res.status(400).json({
        err: "Not able to save naruto season one in DB",
      });
    }
    console.log("Catch an error: ", error);
  }
});

export { router as insertSeasons };
