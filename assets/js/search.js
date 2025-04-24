const filteredItems = [];
const searchResults = document.getElementById('recipes-grid');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const ingredientsInput = document.getElementById('ingredient-input');

const getAllRecipes = () => {
  return JSON.parse(localStorage.getItem("saved_data")) || [];
};

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
  
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', toggleFavorite);
  });
};

const search = () => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedIngredients = ingredientsInput.value.split(',').map(ing => ing.trim().toLowerCase()).filter(ing => ing);
  
  let results = getAllRecipes();
  
  if (searchTerm) {
    results = results.filter(recipe => 
      recipe.name.toLowerCase().includes(searchTerm) || 
      recipe.decrib.toLowerCase().includes(searchTerm)
    );
  }
  
  if (selectedIngredients.length > 0) {
    results = results.filter(recipe => {
      const recipeIngredients = recipe.ingred.toLowerCase().split(',').map(ing => ing.trim());
      
      return selectedIngredients.every(ingredient => 
        recipeIngredients.some(recipeIng => recipeIng.includes(ingredient))
      );
    });
  }
  
  filteredItems.length = 0;
  results.forEach(item => filteredItems.push(item));
  
  appendFilteredItems();
};

const toggleFavorite = (event) => {
  const recipeName = event.target.dataset.name;
  const allRecipes = getAllRecipes();
  
  const updatedRecipes = allRecipes.map(recipe => {
    if (recipe.name === recipeName) {
      recipe.isFav = !recipe.isFav;
    }
    return recipe;
  });
  
  localStorage.setItem("saved_data", JSON.stringify(updatedRecipes));
  
  search();
};

searchButton.addEventListener('click', search);

searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    search();
  }
});

ingredientsInput.addEventListener('change', search);

document.addEventListener('DOMContentLoaded', search);