import axios from 'axios';
import pMap from 'p-map';
import { Router, Request, Response } from 'express';
import sanitize from '../libs/sanitize';
import { getGIF } from '../services/giphyApi';
import Recipe, { PuppyRecipe } from '../types/Recipe';
import ValidateError, { ERROR_TYPES } from '../errors/ValidateError';

class RecipesController {
  public path = '/recipes';

  public router = Router();

  constructor() {
    this.routes();
  }

  public routes() {
    this.router.get(this.path, RecipesController.getAll);
  }

  static validateIngredients(ingredients?: string) {
    if (!ingredients) {
      throw new ValidateError(ERROR_TYPES.INGREDIENTS_MISSING);
    }

    if (ingredients.split(',').length > 3) {
      throw new ValidateError(ERROR_TYPES.MAX_INGREDIENTS_ALLOWED);
    }

    return true;
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

  static async fetchRecipes(ingredients: string) {
    const { data: { results } } = await axios.get(`http://www.recipepuppy.com/api?i=${ingredients}`);

    if (!results) {
      return [];
    }

    return pMap(results, RecipesController.mapper);
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const ingredientsQuery = req.query.i as string;
      const keywords = ingredientsQuery.split(',');

      RecipesController.validateIngredients(ingredientsQuery);

      const recipes = await RecipesController.fetchRecipes(ingredientsQuery);

      res.json({
        keywords,
        recipes,
      });
    } catch (e) {
      if (!e.status) {
        res.sendStatus(500);
        return;
      }

      res.status(e.status).json({
        status: e.status,
        message: e.message,
      });
    }
  }
}

export default RecipesController;
