import { Router, Request, Response } from 'express';
import recipePuppyApi from '../services/recipePuppyApi';
import giphyApi from '../services/giphyApi';

const { GIPHY_API_KEY } = process.env;

class RecipesController {
  public path = '/recipes';

  public router = Router();

  constructor() {
    this.routes();
  }

  public routes() {
    this.router.get(this.path, this.getAll);
  }

  getAll = async (req: Request, res: Response) => {
    console.log(req.query.i);
    // validate params
    try {
      const { data: recipesData } = await recipePuppyApi.get(`?i=${req.query.i}`);

      if (!recipesData.results) {
        res.json([]);
        return;
      }

      const giphy = await giphyApi.get(`search?api_key=${GIPHY_API_KEY}&q=${recipesData.results[0].title}&limit=1&lang=en`);

      console.log('recipes', recipesData);
      console.log('giphy', giphy.data.data[0]?.url);

      res.json(recipesData.results);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default RecipesController;
