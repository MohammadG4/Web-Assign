class RecipeManager {
    constructor() {
        this.recipes = JSON.parse(localStorage.getItem('saved_data')) || [];
    }

    getAllRecipes() {
        return this.recipes;
    }

    getRecipeById(id) {
        return this.recipes.find(recipe => recipe.id === id);
    }

    addRecipe(recipe) {
        recipe.id = Date.now().toString(); 
        this.recipes.push(recipe);
        this.saveToStorage();
        return recipe;
    }

    updateRecipe(id, updatedRecipe) {
        const index = this.recipes.findIndex(recipe => recipe.id === id);
        if (index !== -1) {
            this.recipes[index] = { ...this.recipes[index], ...updatedRecipe };
            this.saveToStorage();
            return true;
        }
        return false;
    }

    deleteRecipe(id) {
        const index = this.recipes.findIndex(recipe => recipe.id === id);
        if (index !== -1) {
            this.recipes.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    searchRecipes(query) {
        query = query.toLowerCase().trim();
        return this.recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(query) ||
            recipe.decrib.toLowerCase().includes(query)
        );
    }

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

    saveToStorage() {
        localStorage.setItem('saved_data', JSON.stringify(this.recipes));
    }

    getFavoriteRecipes(userId) {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
        return this.recipes.filter(recipe => favorites.includes(recipe.id));
    }

    toggleFavorite(userId, recipeId) {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
        const index = favorites.indexOf(recipeId);
        
        if (index === -1) {
            favorites.push(recipeId);
        } else {
            favorites.splice(index, 1);
        }
        
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
        return index === -1; 
    }
}

window.RecipeManager = RecipeManager; 