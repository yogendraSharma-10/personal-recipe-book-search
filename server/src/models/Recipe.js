const mongoose = require('mongoose');

/**
 * @file server/src/models/Recipe.js
 * @description Mongoose model for a Recipe.
 * This model stores both custom user-added recipes and recipes saved from external APIs.
 */

const RecipeSchema = new mongoose.Schema({
    /**
     * The title of the recipe.
     * Required for all recipes.
     */
    title: {
        type: String,
        required: [true, 'Recipe title is required.'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long.']
    },
    /**
     * An array of strings, where each string represents an ingredient.
     * Example: ["1 cup flour", "2 eggs", "1/2 tsp salt"]
     * Required for all recipes.
     */
    ingredients: {
        type: [String],
        required: [true, 'Ingredients are required.'],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'A recipe must have at least one ingredient.'
        }
    },
    /**
     * Detailed instructions on how to prepare the recipe.
     * Required for all recipes.
     */
    instructions: {
        type: String,
        required: [true, 'Instructions are required.'],
        trim: true,
        minlength: [10, 'Instructions must be at least 10 characters long.']
    },
    /**
     * URL to an image representing the recipe.
     * Optional, can be empty.
     */
    imageUrl: {
        type: String,
        trim: true,
        default: ''
    },
    /**
     * The unique ID from an external API if the recipe was saved from one.
     * This field is used to prevent a user from saving the same external recipe multiple times.
     * It should be null/undefined for custom recipes.
     */
    externalId: {
        type: String,
        trim: true,
        // This field is part of a compound unique index below.
        // It is not globally unique, but unique per user for external recipes.
    },
    /**
     * A boolean indicating if the recipe was custom-added by the user (true)
     * or saved from an external API (false).
     */
    isCustom: {
        type: Boolean,
        default: true, // Default to true for user-added recipes
        required: true
    },
    /**
     * The ID of the user who owns this recipe (either created it or saved it).
     * This creates a relationship with the 'User' model.
     * Required for all recipes.
     */
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipe must belong to a user.'],
        index: true // Index for efficient lookup of recipes by user
    },
    /**
     * Original URL of the recipe if it was sourced from an external website.
     * Optional.
     */
    sourceUrl: {
        type: String,
        trim: true,
        default: ''
    },
    /**
     * The cuisine type of the recipe (e.g., "Italian", "Mexican", "Asian").
     * Optional.
     */
    cuisine: {
        type: String,
        trim: true,
        default: ''
    },
    /**
     * An array of meal types this recipe falls under (e.g., "Breakfast", "Dinner", "Dessert").
     * Optional.
     */
    mealType: {
        type: [String],
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer', 'Beverage', 'Main Course', 'Side Dish'],
        default: []
    },
    /**
     * An array of dietary restrictions this recipe adheres to (e.g., "Vegetarian", "Gluten-Free").
     * Optional.
     */
    dietaryRestrictions: {
        type: [String],
        enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Keto', 'Paleo', 'Low-Carb', 'Sugar-Free'],
        default: []
    },
    /**
     * Estimated preparation time in minutes.
     * Optional.
     */
    prepTime: {
        type: Number,
        min: [0, 'Prep time cannot be negative.'],
        default: null // Use null for unspecified numeric values
    },
    /**
     * Estimated cooking time in minutes.
     * Optional.
     */
    cookTime: {
        type: Number,
        min: [0, 'Cook time cannot be negative.'],
        default: null // Use null for unspecified numeric values
    },
    /**
     * Number of servings the recipe yields.
     * Optional.
     */
    servings: {
        type: Number,
        min: [1, 'Servings must be at least 1.'],
        default: null // Use null for unspecified numeric values
    }
}, {
    /**
     * Mongoose option to automatically add `createdAt` and `updatedAt` timestamps.
     */
    timestamps: true
});

/**
 * Compound unique index for external recipes:
 * This index ensures that a specific user (`owner`) can only save a particular external recipe (`externalId`) once.
 * The `partialFilterExpression` ensures this unique constraint only applies when `externalId` actually exists
 * and is not null or an empty string, effectively ignoring custom recipes or recipes without an external ID.
 */
RecipeSchema.index(
    { owner: 1, externalId: 1 },
    { unique: true, partialFilterExpression: { externalId: { $exists: true, $ne: null, $ne: '' } } }
);

/**
 * Export the Recipe model.
 * The model name 'Recipe' will correspond to the 'recipes' collection in MongoDB.
 */
module.exports = mongoose.model('Recipe', RecipeSchema);