// Updated search.js

// Initialize with direct access to recipes instead of using RecipeManager
const filteredItems = [];
const searchResults = document.getElementById('recipes-grid');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const ingredientsInput = document.getElementById('ingredient-input');

// Get all recipes from localStorage
const getAllRecipes = () => {
  return JSON.parse(localStorage.getItem("saved_data")) || [];
};

// Append filtered recipes to the UI
const appendFilteredItems = () => {
  searchResults.innerHTML = '';
  
  if (filteredItems.length === 0) {
    searchResults.innerHTML = '<p class="no-results">No recipes found matching your criteria</p>';
    return;
  }
  
  filteredItems.forEach((recipe) => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    
    recipeCard.innerHTML = `
      <h2>${recipe.name}</h2>
      <p><strong>Course:</strong> ${recipe.crsname}</p>
      <p><strong>Ingredients:</strong> ${recipe.ingred}</p>
      <p class="description">${recipe.decrib}</p>
      <div class="card-actions">
        <a href="RecipePage.html?recipe=${encodeURIComponent(recipe.name)}" class="details-btn">View Details</a>
        <a href="editPage.html?recipe=${encodeURIComponent(recipe.name)}" class="edit-btn">Edit</a>
        <button class="favorite-btn" data-name="${recipe.name}">
          ${recipe.isFav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
        </button>
      </div>
    `;
    
    searchResults.appendChild(recipeCard);
  });
  
  // Add event listeners for favorite buttons
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', toggleFavorite);
  });
};

// Search functionality
const search = () => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedIngredients = ingredientsInput.value.split(',').map(ing => ing.trim().toLowerCase()).filter(ing => ing);
  
  let results = getAllRecipes();
  
  // Apply search term filter
  if (searchTerm) {
    results = results.filter(recipe => 
      recipe.name.toLowerCase().includes(searchTerm) || 
      recipe.decrib.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply ingredients filter
  if (selectedIngredients.length > 0) {
    results = results.filter(recipe => {
      const recipeIngredients = recipe.ingred.toLowerCase().split(',').map(ing => ing.trim());
      
      // Check if all selected ingredients are in the recipe
      return selectedIngredients.every(ingredient => 
        recipeIngredients.some(recipeIng => recipeIng.includes(ingredient))
      );
    });
  }
  
  // Update the filteredItems array
  filteredItems.length = 0;
  results.forEach(item => filteredItems.push(item));
  
  appendFilteredItems();
};

// Toggle favorite status
const toggleFavorite = (event) => {
  const recipeName = event.target.dataset.name;
  const allRecipes = getAllRecipes();
  
  // Find and update the recipe
  const updatedRecipes = allRecipes.map(recipe => {
    if (recipe.name === recipeName) {
      recipe.isFav = !recipe.isFav;
    }
    return recipe;
  });
  
  // Save to localStorage
  localStorage.setItem("saved_data", JSON.stringify(updatedRecipes));
  
  // Update the UI
  search();
};

// Event Listeners
searchButton.addEventListener('click', search);

searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    search();
  }
});

ingredientsInput.addEventListener('change', search);

// Initial load
document.addEventListener('DOMContentLoaded', search);