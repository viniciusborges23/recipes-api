# Recipes API

An api that show recipes for the given ingredients.

## Demo

You can check the live demo at [Heroku](https://vob-recipesapi.herokuapp.com)
- [Recipes with bananas](https://vob-recipesapi.herokuapp.com/recipes?i=banana)

## Run Local

### Requirements
- `nodejs`
- `yarn`
- `docker` and `docker-compose`

### Steps

1. Clone this repo
```
git clone https://github.com/viniciusborges23/recipes-api.git
cd recipes-api
```

2. Install dependencies
```
yarn install
```

3. Copy `.env.sample` to `.env` and set the necessary keys.

4. Run docker with `docker-compose up`