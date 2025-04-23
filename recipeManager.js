// Recipe Management System
class RecipeManager {
    constructor() {
        this.recipes = JSON.parse(localStorage.getItem('saved_data')) || [];
    }

    // Get all recipes
    getAllRecipes() {
        return this.recipes;
    }

    // Get recipe by ID
    getRecipeById(id) {
        return this.recipes.find(recipe => recipe.id === id);
    }

    // Add new recipe
    addRecipe(recipe) {
        recipe.id = Date.now().toString(); // Simple unique ID generation
        this.recipes.push(recipe);
        this.saveToStorage();
        return recipe;
    }

    // Update existing recipe
    updateRecipe(id, updatedRecipe) {
        const index = this.recipes.findIndex(recipe => recipe.id === id);
        if (index !== -1) {
            this.recipes[index] = { ...this.recipes[index], ...updatedRecipe };
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Delete recipe
    deleteRecipe(id) {
        const index = this.recipes.findIndex(recipe => recipe.id === id);
        if (index !== -1) {
            this.recipes.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Search recipes
    searchRecipes(query) {
        query = query.toLowerCase().trim();
        return this.recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(query) ||
            recipe.decrib.toLowerCase().includes(query)
        );
    }

    // Filter recipes by ingredients
    filterByIngredients(ingredients) {
        return this.recipes.filter(recipe => {
            let recipeIngredients = [];
            try {
                recipeIngredients = JSON.parse(recipe.ingred).map(ing => ing.name.toLowerCase());
            } catch (err) {
                recipeIngredients = recipe.ingred.toLowerCase().split(',').map(i => i.trim());
            }
            return ingredients.every(ingredient => 
                recipeIngredients.includes(ingredient.toLowerCase())
            );
        });
    }

    // Save to localStorage
    saveToStorage() {
        localStorage.setItem('saved_data', JSON.stringify(this.recipes));
    }

    // Get user's favorite recipes
    getFavoriteRecipes(userId) {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
        return this.recipes.filter(recipe => favorites.includes(recipe.id));
    }

    // Toggle favorite status
    toggleFavorite(userId, recipeId) {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
        const index = favorites.indexOf(recipeId);
        
        if (index === -1) {
            favorites.push(recipeId);
        } else {
            favorites.splice(index, 1);
        }
        
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
        return index === -1; // Returns true if added to favorites, false if removed
    }
}

// Export the RecipeManager class
window.RecipeManager = RecipeManager; 