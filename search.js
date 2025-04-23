// Load and parse data from localStorage
const list = localStorage.getItem('saved_data');
const data = JSON.parse(list) || [];

let filteredItems = [...data];
let filters = {};

const searchResults = document.getElementById('recipes-grid');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const ingredientsInput = document.getElementById('ingredient-input');

// Append filtered recipes to the UI
const appendFilteredItems = () => {
    applyFilters();

    searchResults.innerHTML = '';
    if (filteredItems.length === 0) {
        searchResults.innerHTML = '<p>No results found</p>';
        return;
    }

    filteredItems.forEach((item) => {
        let ingredientsDisplay = '';
        try {
            const ingredients = JSON.parse(item.ingred);
            ingredientsDisplay = ingredients.map((ing) => ing.name).join(', ');
        } catch (err) {
            // fallback إذا ingred مش JSON
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
                    <a href="RecipePage.html" class="details-btn">View Details</a>
                    <a href="editPage.html" class="edit-btn">Edit</a>
                </div>
            </div>
        `;

        searchResults.appendChild(recipeCard);
    });
}


// Manage filters object
const addFilter = (key, filterFunction) => {
    filters[key] = filterFunction;
};

const removeFilter = (key) => {
    delete filters[key];
};

// Apply filters to data
const applyFilters = () => {
    filteredItems = data.filter((item) => {
        return Object.values(filters).every((filter) => filter(item));
    });
};

// Search filter
const search = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        removeFilter('search');
    } else {
        addFilter('search', (item) =>
            item.name.toLowerCase().includes(searchTerm)
        );
    }

    appendFilteredItems();
};

// Ingredient filter
ingredientsInput.addEventListener('change', (event) => {
    const selectedIngredients = ingredientsInput.value.split(',').map((ingredient) => ingredient.trim().toLowerCase());
    console.log(selectedIngredients);

    if (selectedIngredients.length === 1 && selectedIngredients[0] === '') {
        delete filters.ingredients;
    } else {
        addFilter('ingredients', (item) => {
            let ingredients = [];

            try {
                ingredients = JSON.parse(item.ingred).map((ingredient) => ingredient.name.toLowerCase());
            } catch (err) {
                ingredients = item.ingred.toLowerCase().split(',').map(i => i.trim());
            }

            return selectedIngredients.every((ingredient) => ingredients.includes(ingredient));
        });
    }

    appendFilteredItems();
});


// Event Listeners
searchButton.addEventListener('click', search);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        search();
    }
});

// Initial load
appendFilteredItems();
