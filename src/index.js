import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { getRepoLanguages, getRepos } from "./api/index.js";

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
  let repos = await getRepos(username);

  let allLangs = await Promise.all(repos.map(async repo => await getRepoLanguages(username, repo)));
  allLangs = allLangs.filter(item => Object.keys(item).length > 0)
  console.log(allLangs);

  let totalUsage = 0;
  let langs = {};
  for (let repo of allLangs) {
    let uniqueLangs = [];
    let repoLangs = Object.keys(repo);

    totalUsage += Object.values(repo).reduce((use, next) => use + next);
    uniqueLangs = [...uniqueLangs, ...repoLangs.filter(lang => !uniqueLangs.includes(lang))];

    for (let lang of repoLangs) {
      console.log(lang, repo[lang]);
      if (!Object.keys(langs).includes(lang)) langs[lang] = 0;
      langs[lang] += repo[lang];
    }
  }
  let percentUsage = Object.values(langs).map(item => ((item / totalUsage) * 100).toFixed(2));
  percentUsage.forEach((item, index) => {
    langs[Object.keys(langs)[index]] = item;
  });
  let keyValueArray = Object.entries(langs);
  keyValueArray.sort((a, b) => b[1] - a[1]);
  langs = Object.fromEntries(keyValueArray);

  res.render(path.join(staticPath, "index.ejs"), { langs });
});

app.use("/", router);
app.listen(3000);
