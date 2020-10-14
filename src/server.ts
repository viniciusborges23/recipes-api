import express, { Request, Response } from 'express';
import axios from 'axios';

const { PORT } = process.env;

const app = express();

app.get('/recipes', async (req: Request, res: Response) => {
  const recipes = await axios(`http://www.recipepuppy.com/api/?i=${req.query.i}`);

  res.json(recipes.data);
});

app.get('*', (_, res) => res.sendStatus(405));
app.put('*', (_, res) => res.sendStatus(405));
app.delete('*', (_, res) => res.sendStatus(405));
app.post('*', (_, res) => res.sendStatus(405));

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
