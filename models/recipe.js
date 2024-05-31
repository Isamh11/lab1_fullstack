import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema for the recipes
const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    cookingTime: {
        type: Number,
        required: true,
    },
   
});

// 4. Create a model for the recipes
export const Recipe = mongoose.model('Recipe', recipeSchema);


// Method to get all recipes
export const getAllRecipes = async () => {
    try {
        const recipes = await Recipe.find();
        return recipes;
    } catch (error) {
        throw new Error('Failed to get recipes');
    }
};

// Method to create a new recipe
export const createRecipe = async (title, ingredients, instructions, cookingTime) => {
    try {
        const recipe = new Recipe({
            title,
            ingredients,
            instructions,
            cookingTime,
        });
        const savedRecipe = await recipe.save();
        return savedRecipe;
    } catch (error) {
        throw new Error('Failed to create recipe');
    }
};

// Method to get a recipe by title
export const getRecipeByTitle = async (title) => {
    try {
        const recipe = await Recipe.findOne({ title });
        return recipe;
    }
    catch (error) {
        throw new Error('Failed to get recipe');
    }
}

// Method to update a recipe by ID
export const updateRecipeById = async (id, updatedData) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(id, updatedData, { new: true });
        return recipe;
    } catch (error) {
        throw new Error('Failed to update recipe, please provide all the required fields');
    }
};

// Method to delete a recipe by ID
export const deleteRecipeById = async (id) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(id);
        return recipe;
    } catch (error) {
        throw new Error('Failed to delete recipe');
    }
};
