// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Allow requests from any origin (for W3Schools editor testing)
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "mowenuk";
const REPO_NAME = "prodmgt";
const BRANCH = "main";

// READ FILE
app.get('/api/read', async (req, res) => {
  const path = req.query.path;
  const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  const data = await response.json();
  res.json({ content: Buffer.from(data.content, 'base64').toString('utf-8'), sha: data.sha });
});

// WRITE FILE
app.post('/api/write', async (req, res) => {
  const { path, content, sha, message } = req.body;
  const encodedContent = Buffer.from(content).toString('base64');

  const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: message || `Update ${path}`,
      content: encodedContent,
      sha
    })
  });

  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
