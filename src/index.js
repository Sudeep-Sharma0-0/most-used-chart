import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { getLangs } from "./getLangs.js";
import { getColor } from "./getColor.js";

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
  res.redirect("/api");
});

router.get("/api", async (req, res) => {
  let username = req.query.username;

  let langs = await getLangs(username);

  let styles = "background: conic-gradient(";
  let startPercentage = 0;
  let endPercentage = 0;
  let langKeys = Object.keys(langs);
  langKeys.forEach((lang, index) => {
    endPercentage += parseFloat(langs[lang]);
    styles += `\n  ${getColor(lang, path.join(staticPath, "languages.yml"))} ${startPercentage}% ${endPercentage}%`;
    startPercentage = endPercentage;
    if (index !== langKeys.length - 1) {
      styles += ",";
    }
  });
  styles += "\n);";

  res.render(path.join(viewPath, "index.ejs"), { langs, styles });
});

app.use("/", router);
app.listen(3000);
