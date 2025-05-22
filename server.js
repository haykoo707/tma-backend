const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const app = express();

const PORT = 3000;
const FILE = 'data.txt';

app.use(bodyParser.json());

const loadData = async () => {
  try {
    const content = await fs.readFile(FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch {
    return [];
  }
};

const saveData = async (data) => {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
};

app.post('/saveData', async (req, res) => {
  const { userId, username, userScore, claimedTasks, referrals, mysteryBoxes } = req.body;

  let data = await loadData();
  const index = data.findIndex(u => u.userId === userId);

  const userData = {
    userId,
    username,
    userScore,
    claimedTasks,
    referrals,
    mysteryBoxes
  };

  if (index >= 0) {
    data[index] = userData;
  } else {
    data.push(userData);
  }

  await saveData(data);
  res.send({ success: true });
});

app.get('/getData', async (req, res) => {
  const { userId } = req.query;
  const data = await loadData();
  const user = data.find(u => u.userId === userId);

  if (!user) return res.status(404).send({ error: 'User not found' });

  res.send(user);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});