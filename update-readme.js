const fs = require('fs');
const axios = require('axios');

const username = 'Adrinho3677';

async function getRepos() {
  const res = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`);
  return res.data.map(repo => ({
    name: repo.name,
    url: repo.html_url,
    desc: repo.description || 'Sem descrição',
    updated: repo.updated_at.split('T')[0]
  }));
}

function updateReadme(repos) {
  const readme = fs.readFileSync('README.md', 'utf8');

  const start = '<!--PROJETOS:START-->';
  const end = '<!--PROJETOS:END-->';

  const regex = new RegExp(`${start}[\\s\\S]*${end}`, 'm');

  const list = repos.map(
    r => `- 🚀 [**${r.name}**](${r.url}) — ${r.desc} (Atualizado em ${r.updated})`
  ).join('\n');

  const newSection = `${start}\n${list}\n${end}`;

  const updated = readme.replace(regex, newSection);

  fs.writeFileSync('README.md', updated);
}

(async () => {
  const repos = await getRepos();
  updateReadme(repos);
})();
