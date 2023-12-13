import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { getRepoLanguages } from "./api/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticPath = path.join(__dirname, "static");

const app = express();
app.set('view engine', 'ejs');

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/api", async (req, res) => {
  let username = req.query.username;
  let repo = req.query.repo;

  let langs = await getRepoLanguages(username, repo);
  let totalUsage = Object.values(langs).reduce((a, b) => a + b, 0);
  let percentUsage = Object.values(langs).map(usage => (usage / totalUsage) * 100);
  Object.keys(langs).forEach((key, index) => {
    langs[key] = percentUsage[index].toFixed(2);
  })

  res.render(path.join(staticPath, "index.ejs"), { langs });
});

app.use("/", router);
app.listen(3000);
