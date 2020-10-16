import axios from 'axios';
import RecipesController from '../RecipesController';
import { getGIF } from '../../services/giphyApi';
import { ERROR_TYPES } from '../../errors/ValidateError';

jest.mock('axios');
jest.mock('../../services/giphyApi');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('src.controllers.RecipesController', (): void => {
  describe('validateIngredients', (): void => {
    it('Throws if is empty', async (): Promise<void> => {
      expect(() => RecipesController.validateIngredients())
        .toThrow(ERROR_TYPES.INGREDIENTS_MISSING);
    });

    it('Throws if is has more than 3 ingredients', async (): Promise<void> => {
      expect(() => RecipesController.validateIngredients('one,two,three,four'))
        .toThrow(ERROR_TYPES.MAX_INGREDIENTS_ALLOWED);
    });

    it('Returns true if ingredients are ok', async (): Promise<void> => {
      expect(() => RecipesController.validateIngredients('one,two,three')).toBeTruthy();
    });
  });

  describe('mapper', (): void => {
    it('Returns the mapped recipe', async (): Promise<void> => {
      (getGIF as any).mockResolvedValue('gifurl');
      const puppyRecipe = { title: 'recipe', ingredients: 'coconut, banana, apple', href: 'link' };
      const recipes = await RecipesController.mapper(puppyRecipe);

      expect(recipes).toEqual({
        title: 'recipe',
        ingredients: ['apple', 'banana', 'coconut'],
        link: 'link',
        gif: 'gifurl',
      });
    });
  });

  describe('fetchRecipes', (): void => {
    it('Returns empty array if no recipes found', async (): Promise<void> => {
      mockedAxios.get.mockResolvedValue({ data: { results: [] } });
      const recipes = await RecipesController.fetchRecipes('ingredients');
      expect(recipes).toEqual([]);
    });

    it('Returns the recipes', async (): Promise<void> => {
      const results = [{ title: 'recipe', ingredients: 'egg', href: 'url' }];
      mockedAxios.get.mockResolvedValue({ data: { results } });
      (getGIF as any).mockResolvedValue('gifurl');
      const recipes = await RecipesController.fetchRecipes('ingredients');

      expect(recipes).toEqual([{
        title: 'recipe',
        ingredients: ['egg'],
        link: 'url',
        gif: 'gifurl',
      }]);
    });
  });
});
