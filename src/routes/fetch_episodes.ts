import express from "express";
import { Episode } from "../models/Episode";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/api/episode", async (req, res) => {
  const episode = await Episode.find();
  const metadata = {
    total_count: episode.length,
  };

  console.log("file name:" + episode[2].file);
  console.log("location name:" + episode[2].location);

  return res.json({ _metadata: metadata, records: episode });
});

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

router.get("/video", async (req, res) => {
  const range: any = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  const episode = await Episode.find();

  let ep_name = episode[3].file;
  const videoPath = path.format({
    dir: episode[3].location,
    base: `${ep_name}.mkv`,
  });
  console.log(videoPath);
  const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});

export { router as fetchEpisodeRouter };
