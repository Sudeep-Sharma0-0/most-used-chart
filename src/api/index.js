import express from "express";
import { Octokit } from "octokit";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const octokit = new Octokit({
  auth: process.env.GITHUB_TEMP_TOKEN
});

router.get("/", (req, res) => {
  let username = req.query.username;
  let repo = req.query.repo;
  try {
    getRepoLanguages(username, repo).then(langs => {
      res.send(langs);
      console.log(langs);
    });
  } catch (error) {
    console.error('Error fetching repo languages:', error);
    throw error;
  }
});

async function getRepoLanguages(owner, repo) {
  try {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/languages`, {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching repo languages:', error);
    throw error;
  }
}

export default router;
