import pMap from 'p-map';
import { Router, Request, Response } from 'express';
import recipePuppyApi from '../services/recipePuppyApi';
import giphyApi from '../services/giphyApi';

const { GIPHY_API_KEY } = process.env;

function sanitize(title: string) {
  return title.trim().replace(/\n|\r|\t/g, '');
}

async function getGIF(title: string) {
  let gif = '';

  try {
    const { data: { data } } = await giphyApi.get(`search?api_key=${GIPHY_API_KEY}&q=${title}&limit=1&lang=en`);

    gif = data[0]?.url || '';
  } catch (e) {
    // noop
  }

  return gif;
}

interface PuppyRecipes {
  title: string;
  ingredients: string;
  href: string;
}

class RecipesController {
  public path = '/recipes';

  public router = Router();

  constructor() {
    this.routes();
  }

  public routes() {
    this.router.get(this.path, RecipesController.getAll);
  }

  static validateIngredients(ingredients: string) {
    if (!ingredients) {
      throw new Error('Ingredients missing.');
    }

    if (ingredients.split(',').length > 3) {
      throw new Error('Max ingredients allowed.');
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const ingredientsQuery = req.query.i as string;

      RecipesController.validateIngredients(ingredientsQuery);

      const { data: { results } } = await recipePuppyApi.get(`?i=${ingredientsQuery}`);

      if (!results) {
        res.json({
          keywords: ingredientsQuery.split(','),
          recipes: [],
        });
        return;
      }

      const mapper = async ({ title, ingredients, href: link }: PuppyRecipes) => {
        const gif = await getGIF(title);

        return {
          title: sanitize(title),
          ingredients: ingredients.split(', ').sort(),
          link,
          gif,
        };
      };

      const recipes = await pMap(results, mapper);

      res.json({
        keywords: ingredientsQuery.split(','),
        recipes,
      });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default RecipesController;
