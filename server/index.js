const express = require("express");
const cors = require("cors");
const { crawlWebsite } = require("./util/crawler");

const app = express();
const port = 3000;

const apiRouter = express.Router();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

apiRouter.get("/ping", (_, res) => {
  res.sendStatus(200);
});

apiRouter.get("/crawl", async (req, res) => {
  try {
    const data = await crawlWebsite();
    res.json(data);
  } catch (e) {
    console.error(`Error crawling website: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
