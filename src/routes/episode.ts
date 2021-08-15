import express from "express";
import { Episode } from "../models/Episode";

const router = express.Router();

router.post("/api/episode", async (req, res) => {
  const { title, season_id, location, file } = req.body;

  const naruto_episodes = Episode.create({
    title,
    season_id,
    location,
    file,
  });

  try {
    await naruto_episodes.save();
    return res.json(naruto_episodes);
  } catch (error) {
    if (error) {
      return res.status(400).json({
        err: "Not able to save naruto season one in DB",
      });
    }
    console.log("Catch an error: ", error);
  }
});

export { router as insertEpisodes };
