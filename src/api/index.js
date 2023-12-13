import { Octokit } from "octokit";
import dotenv from "dotenv";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TEMP_TOKEN
});


export async function getRepoLanguages(owner, repo) {
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
