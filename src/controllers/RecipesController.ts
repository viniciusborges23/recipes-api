import pMap from 'p-map';
import { Router, Request, Response } from 'express';
import sanitize from '../libs/sanitize';
import recipePuppyApi from '../services/recipePuppyApi';
import { getGIF } from '../services/giphyApi';
import Recipe, { PuppyRecipe } from '../types/Recipe';

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

  static async mapper(puppyRecipe: PuppyRecipe): Promise<Recipe> {
    const { title, ingredients, href: link } = puppyRecipe;

    const gif = await getGIF(title);

    return {
      title: sanitize(title),
      ingredients: ingredients.split(', ').sort(),
      link,
      gif,
    };
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const ingredientsQuery = req.query.i as string;
      const keywords = ingredientsQuery.split(',');

      RecipesController.validateIngredients(ingredientsQuery);

      const { data: { results } } = await recipePuppyApi.get(`?i=${ingredientsQuery}`);

      if (!results) {
        res.json({
          keywords,
          recipes: [],
        });
        return;
      }

      const recipes = await pMap(results, RecipesController.mapper);

      res.json({
        keywords,
        recipes,
      });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default RecipesController;
