import App from './app';
import RecipesController from './controllers/RecipesController';

const { PORT = '3000' } = process.env;

const app = new App({
  port: PORT,
  controllers: [
    new RecipesController(),
  ],
});

app.listen();
