import express from "express";
import apiRoutes from "./api/index.js";


const app = express();

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
})

app.listen(3000);
