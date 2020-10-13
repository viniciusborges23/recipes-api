import express from 'express';

const { PORT } = process.env;

const app = express();

app.get('/', (_, res) => {
  res.json({ ok: true })
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));