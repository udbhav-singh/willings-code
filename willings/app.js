const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let recipes = [];
let idCounter = 1;

// POST /recipes - Create a new recipe
app.post("/recipes", (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;

  if (!title || !making_time || !serves || !ingredients || !cost) {
    return res.status(200).json({
      message: "Recipe creation failed!",
      required: "title, making_time, serves, ingredients, cost",
    });
  }

  const newRecipe = {
    id: idCounter++,
    title,
    making_time,
    serves,
    ingredients,
    cost,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  recipes.push(newRecipe);
  res.status(200).json({
    message: "Recipe successfully created!",
    recipe: [newRecipe],
  });
});

// GET /recipes - Return the list of all recipes
app.get("/recipes", (req, res) => {
  const recipeList = recipes.map(({ id, title, making_time, serves, ingredients, cost }) => ({
    id,
    title,
    making_time,
    serves,
    ingredients,
    cost,
  }));

  res.status(200).json({ recipes: recipeList });
});

// GET /recipes/:id - Return the selected recipe
app.get("/recipes/:id", (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));

  if (!recipe) {
    return res.status(200).json({ message: "No recipe found" });
  }

  res.status(200).json({
    message: "Recipe details by id",
    recipe: [recipe],
  });
});

// PATCH /recipes/:id - Update the selected recipe
app.patch("/recipes/:id", (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));

  if (!recipe) {
    return res.status(200).json({ message: "No recipe found" });
  }

  if (title) recipe.title = title;
  if (making_time) recipe.making_time = making_time;
  if (serves) recipe.serves = serves;
  if (ingredients) recipe.ingredients = ingredients;
  if (cost) recipe.cost = cost;
  recipe.updated_at = new Date().toISOString();

  res.status(200).json({
    message: "Recipe successfully updated!",
    recipe: [recipe],
  });
});

// DELETE /recipes/:id - Delete the selected recipe
app.delete("/recipes/:id", (req, res) => {
  const recipeIndex = recipes.findIndex((r) => r.id === parseInt(req.params.id));

  if (recipeIndex === -1) {
    return res.status(200).json({ message: "No recipe found" });
  }

  recipes.splice(recipeIndex, 1);
  res.status(200).json({ message: "Recipe successfully removed!" });
});

// Handle other endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
