const express = require("express");
const cors = require("cors");

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

apiRouter.get("/data", (req, res) => {
  res.json({
    message: "Data from backend",
    items: ["item1", "item2", "item3"],
  });
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
