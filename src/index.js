import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { getLangs } from "./getLangs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticPath = path.join(__dirname, "static");
const viewPath = path.join(__dirname, "views");

const app = express();
app.set('view engine', 'ejs');
app.set('views', viewPath);
app.use(express.static(staticPath));

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/api", async (req, res) => {
  let username = req.query.username;

  let langs = await getLangs(username);
  res.render(path.join(viewPath, "index.ejs"), { langs });
});

app.use("/", router);
app.listen(3000);
