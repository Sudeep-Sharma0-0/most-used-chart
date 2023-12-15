import { getRepoLanguages, getRepos } from "./api/index.js";

export async function getLangs(username) {
  let repos = await getRepos(username);

  let allLangs = await Promise.all(repos.map(async repo => await getRepoLanguages(username, repo)));
  allLangs = allLangs.filter(item => Object.keys(item).length > 0)

  let totalUsage = 0;
  let langs = {};

  for (let repo of allLangs) {
    let uniqueLangs = [];
    let repoLangs = Object.keys(repo);

    totalUsage += Object.values(repo).reduce((use, next) => use + next);
    uniqueLangs = [...uniqueLangs, ...repoLangs.filter(lang => !uniqueLangs.includes(lang))];

    for (let lang of repoLangs) {
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

  let otherLangs = keyValueArray.splice(6);
  let otherUsage = ["Others", otherLangs.reduce((use, next) => parseFloat(use) + parseFloat(next[1]), 0).toFixed(2)];

  keyValueArray.push(otherUsage);
  langs = Object.fromEntries(keyValueArray);

  return langs;
}
