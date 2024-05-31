import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
//import { recipes } from './recipeStore.js';
import {getAllRecipes, getRecipeByTitle, 
    createRecipe, updateRecipeById, deleteRecipeById} from './models/recipe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new Express application
const app = express();
app.use(express.static('src'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

// 2. Connect to the database
mongoose.connect(process.env.MONGODB_URL, {})
.then(() => { console.log('Connected to the database') })
.catch((error) => { console.log('Failed to connect to the database', error) });

const PORT = process.env.PORT || 5000;


//show all recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await getAllRecipes();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//show a single recipe by title
app.get('/api/recipes/:title', async (req, res) => {
    try {
        const recipe = await getRecipeByTitle(req.params.title);
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//add a new recipe
app.post('/api/recipes', async (req, res) => {
    try {
        const { title, ingredients, instructions, cookingTime } = req.body;
        const recipe = await createRecipe(title, ingredients, instructions, cookingTime);
        res.status(201).json(recipe);
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            res.status(409).json({ message: 'Recipe already exists' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

//update a recipe
app.put('/api/recipes/:id', async (req, res) => {
    try {
        const updatedRecipe = await updateRecipeById(req.params.id, req.body);
        if (updatedRecipe) {
            res.json(updatedRecipe);
        } else {
            res.status(404).json({ message: 'Recipe doesn\'t exist' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//delete a recipe
app.delete('/api/recipes/:id', async (req, res) => {
    try {
        const recipe = await deleteRecipeById(req.params.id);
        if (recipe) {
            res.json({ message: 'Recipe deleted' });
        } else {
            res.status(404).json({ message: 'Recipe doesn\'t exist' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    });