// RecipePage.js - Script for the individual recipe details page

document.addEventListener('DOMContentLoaded', function() {
  // Function to get URL parameters
  const getUrlParameter = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  // Get recipe name from URL parameter
  const recipeName = getUrlParameter('recipe');
  
  // Load recipe data from localStorage
  const loadRecipeDetails = () => {
    const savedRecipes = JSON.parse(localStorage.getItem("saved_data")) || [];
    
    // Find the selected recipe by name
    const recipe = savedRecipes.find(r => r.name === recipeName);
    
    // If recipe not found, show error and return
    if (!recipe) {
      document.querySelector('.container').innerHTML = `
        <h2>Recipe not found</h2>
        <p>The recipe you are looking for could not be found.</p>
        <button onclick="window.location.href='recipes_list.html'">Back to Home</button>
      `;
      return;
    }
    
    // Update page with recipe details
    displayRecipeDetails(recipe);
    
    // Setup buttons with correct functionality
    setupButtons(recipe, savedRecipes);
  };
  
  // Display recipe details on the page
  const displayRecipeDetails = (recipe) => {
    document.title = `Feastly - ${recipe.name}`;
    
    // Update recipe name
    const nameElement = document.querySelector('.container h2');
    nameElement.textContent = `Recipe name: ${recipe.name}`;
    
    // Update course name
    const courseElement = document.querySelector('.container p[style*="color: #3f3f3f"]');
    courseElement.textContent = recipe.crsname;
    
    // Update description
    const descriptionElement = document.querySelector('.container p[style*="font-size: smaller"]');
    descriptionElement.textContent = recipe.decrib;
    
    // Parse ingredients and create list items
    const ingredientsList = document.querySelector('.ingredients ul');
    ingredientsList.innerHTML = '';
    
    const ingredients = recipe.ingred.split(', ');
    ingredients.forEach(ingredient => {
      const li = document.createElement('li');
      li.textContent = ingredient;
      ingredientsList.appendChild(li);
    });
    
    // Use the description (decrib) to create instruction steps
    // Split by periods to create separate steps
    const instructionsList = document.querySelector('.instructions ol');
    instructionsList.innerHTML = '';
    
    // Split the description by periods and filter out empty strings
    const instructions = recipe.decrib.split('.').filter(step => step.trim() !== '');
    
    instructions.forEach(instruction => {
      const li = document.createElement('li');
      li.textContent = instruction.trim();
      instructionsList.appendChild(li);
    });
    
    // Update favorite button text based on current state
    const favoriteBtn = document.querySelector('.favorite-btn');
    favoriteBtn.textContent = recipe.isFav ? "Remove from Favorites" : "Add to Favorites";
  };
  
  // Setup action buttons
  const setupButtons = (recipe, allRecipes) => {
    // Edit button - update href with recipe name
    const editBtn = document.querySelector('.edit-btn');
    editBtn.onclick = () => {
      window.location.href = `editPage.html?recipe=${encodeURIComponent(recipe.name)}`;
    };
    
    // Delete button
    const deleteBtn = document.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete ${recipe.name}?`)) {
        // Filter out the recipe to delete
        const updatedRecipes = allRecipes.filter(r => r.name !== recipe.name);
        
        // Save updated recipes back to localStorage
        localStorage.setItem("saved_data", JSON.stringify(updatedRecipes));
        
        // Navigate back to recipes list
        window.location.href = 'recipes_list.html';
      }
    });
    
    // Favorite button
    const favoriteBtn = document.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => {
      // Toggle favorite status
      const updatedRecipes = allRecipes.map(r => {
        if (r.name === recipe.name) {
          r.isFav = !r.isFav;
        }
        return r;
      });
      
      // Save updated recipes back to localStorage
      localStorage.setItem("saved_data", JSON.stringify(updatedRecipes));
      
      // Update button text
      const updatedRecipe = updatedRecipes.find(r => r.name === recipe.name);
      favoriteBtn.textContent = updatedRecipe.isFav ? "Remove from Favorites" : "Add to Favorites";
    });
  };
  
  // Initialize the page
  loadRecipeDetails();
});