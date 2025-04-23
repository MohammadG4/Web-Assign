// Initialize RecipeManager
const recipeManager = new RecipeManager();
let filteredItems = [];

const searchResults = document.getElementById('recipes-grid');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const ingredientsInput = document.getElementById('ingredient-input');

// Append filtered recipes to the UI
const appendFilteredItems = () => {
    searchResults.innerHTML = '';
    
    if (filteredItems.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No recipes found matching your criteria</p>';
        return;
    }

    filteredItems.forEach((item) => {
        let ingredientsDisplay = '';
        try {
            const ingredients = JSON.parse(item.ingred);
            ingredientsDisplay = ingredients.map((ing) => ing.name).join(', ');
        } catch (err) {
            ingredientsDisplay = item.ingred;
        }

        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <div class="recipe-card">
                <h2>${item.name}</h2>
                <p><strong>Course:</strong> ${item.crsname}</p>
                <p><strong>Ingredients:</strong> ${ingredientsDisplay}</p>
                <p class="description">${item.decrib}</p>
                <div class="card-actions">
                    <a href="RecipePage.html?id=${item.id}" class="details-btn">View Details</a>
                    <button onclick="toggleFavorite('${item.id}')" class="favorite-btn">
                        ${isFavorite(item.id) ? '❤️' : '🤍'}
                    </button>
                    ${isCurrentUserAdmin() ? `<a href="editPage.html?id=${item.id}" class="edit-btn">Edit</a>` : ''}
                </div>
            </div>
        `;

        searchResults.appendChild(recipeCard);
    });
}

// Search functionality
const search = () => {
    const searchTerm = searchInput.value;
    const selectedIngredients = ingredientsInput.value.split(',').map(ing => ing.trim()).filter(ing => ing);
    
    let results = recipeManager.getAllRecipes();
    
    // Apply search term filter
    if (searchTerm) {
        results = recipeManager.searchRecipes(searchTerm);
    }
    
    // Apply ingredients filter
    if (selectedIngredients.length > 0) {
        results = recipeManager.filterByIngredients(selectedIngredients);
    }
    
    filteredItems = results;
    appendFilteredItems();
}

// Helper functions
const isFavorite = (recipeId) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return false;
    
    const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.username}`)) || [];
    return favorites.includes(recipeId);
}

const isCurrentUserAdmin = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser && currentUser.isAdmin;
}

const toggleFavorite = (recipeId) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to add favorites');
        window.location.href = 'login.html';
        return;
    }
    
    recipeManager.toggleFavorite(currentUser.username, recipeId);
    search(); // Refresh the display
}

// Event Listeners
searchButton.addEventListener('click', search);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        search();
    }
});

ingredientsInput.addEventListener('change', search);

// Initial load
search();
