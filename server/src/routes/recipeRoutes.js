const express = require('express');
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API for managing personal and external recipes
 */

/**
 * @swagger
 * /api/recipes/search:
 *   get:
 *     summary: Search for recipes from an external API
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search term for recipes (e.g., "chicken pasta")
 *       - in: query
 *         name: cuisine
 *         schema:
 *           type: string
 *         description: Filter by cuisine type (e.g., "Italian", "Mexican")
 *       - in: query
 *         name: diet
 *         schema:
 *           type: string
 *         description: Filter by diet (e.g., "vegetarian", "vegan")
 *     responses:
 *       200:
 *         description: A list of recipes from the external API.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExternalRecipe'
 *       500:
 *         description: Server error
 */
router.get('/search', recipeController.searchExternalRecipes);

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all custom recipes and saved external recipes for the authenticated user
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's custom and saved recipes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new custom recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeInput'
 *     responses:
 *       201:
 *         description: The created custom recipe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.route('/')
    .get(authMiddleware.protect, recipeController.getRecipes)
    .post(authMiddleware.protect, recipeController.createRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a single custom or saved external recipe by ID
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The recipe ID (MongoDB ObjectId for custom, or external ID for saved)
 *     responses:
 *       200:
 *         description: The requested recipe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: Recipe not found or not owned by user
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update an existing custom recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the custom recipe to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeInput'
 *     responses:
 *       200:
 *         description: The updated custom recipe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: Recipe not found or not owned by user
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a custom recipe or unsave an external recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe to delete/unsave
 *     responses:
 *       204:
 *         description: Recipe successfully deleted/unsaved.
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: Recipe not found or not owned by user
 *       500:
 *         description: Server error
 */
router.route('/:id')
    .get(authMiddleware.protect, recipeController.getRecipeById)
    .put(authMiddleware.protect, recipeController.updateRecipe)
    .delete(authMiddleware.protect, recipeController.deleteRecipe);

/**
 * @swagger
 * /api/recipes/save-external:
 *   post:
 *     summary: Save an external recipe to the user's favorites
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExternalRecipeSaveInput'
 *     responses:
 *       201:
 *         description: The external recipe was successfully saved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input or recipe already saved
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.post('/save-external', authMiddleware.protect, recipeController.saveExternalRecipe);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the recipe.
 *         user:
 *           type: string
 *           description: The ID of the user who owns this recipe.
 *         title:
 *           type: string
 *           description: The title of the recipe.
 *         description:
 *           type: string
 *           description: A brief description of the recipe.
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients.
 *         instructions:
 *           type: string
 *           description: Step-by-step instructions.
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to an image of the recipe.
 *         externalId:
 *           type: string
 *           description: ID from the external API if it's a saved external recipe.
 *           nullable: true
 *         sourceUrl:
 *           type: string
 *           format: uri
 *           description: Original source URL for external recipes.
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the recipe was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the recipe was last updated.
 *       required:
 *         - user
 *         - title
 *         - ingredients
 *         - instructions
 *     RecipeInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the recipe.
 *         description:
 *           type: string
 *           description: A brief description of the recipe.
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients.
 *         instructions:
 *           type: string
 *           description: Step-by-step instructions.
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to an image of the recipe.
 *       required:
 *         - title
 *         - ingredients
 *         - instructions
 *     ExternalRecipe:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the recipe from the external API.
 *         title:
 *           type: string
 *           description: The title of the external recipe.
 *         image:
 *           type: string
 *           format: uri
 *           description: URL to an image of the external recipe.
 *         sourceUrl:
 *           type: string
 *           format: uri
 *           description: Original source URL for the external recipe.
 *         readyInMinutes:
 *           type: number
 *           description: Estimated preparation time in minutes.
 *         servings:
 *           type: number
 *           description: Number of servings.
 *         extendedIngredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               original:
 *                 type: string
 *           description: Detailed list of ingredients.
 *         instructions:
 *           type: string
 *           description: Step-by-step instructions.
 *     ExternalRecipeSaveInput:
 *       type: object
 *       properties:
 *         externalId:
 *           type: string
 *           description: The ID of the recipe from the external API.
 *         title:
 *           type: string
 *           description: The title of the external recipe.
 *         description:
 *           type: string
 *           description: A brief description of the recipe (optional, can be generated).
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients.
 *         instructions:
 *           type: string
 *           description: Step-by-step instructions.
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to an image of the recipe.
 *         sourceUrl:
 *           type: string
 *           format: uri
 *           description: Original source URL for the external recipe.
 *       required:
 *         - externalId
 *         - title
 *         - ingredients
 *         - instructions
 *         - imageUrl
 *         - sourceUrl
 */

module.exports = router;