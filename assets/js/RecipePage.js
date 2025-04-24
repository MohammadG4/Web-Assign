document.addEventListener('DOMContentLoaded', function() {
  const getUrlParameter = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  const recipeName = getUrlParameter('recipe');
  
  const loadRecipeDetails = () => {
    const savedRecipes = JSON.parse(localStorage.getItem("saved_data")) || [];
    
    const recipe = savedRecipes.find(r => r.name === recipeName);
    
    if (!recipe) {
      document.querySelector('.container').innerHTML = `
        <h2>Recipe not found</h2>
        <p>The recipe you are looking for could not be found.</p>
        <button onclick="window.location.href='recipes_list.html'">Back to Home</button>
      `;
      return;
    }
    
    displayRecipeDetails(recipe);
    
    setupButtons(recipe, savedRecipes);
  };
  
  const displayRecipeDetails = (recipe) => {
    document.title = `Feastly - ${recipe.name}`;
    
    const nameElement = document.querySelector('.container h2');
    nameElement.textContent = `Recipe name: ${recipe.name}`;
    
    const courseElement = document.querySelector('.container p[style*="color: #3f3f3f"]');
    courseElement.textContent = recipe.crsname;
    
    const descriptionElement = document.querySelector('.container p[style*="font-size: smaller"]');
    descriptionElement.textContent = recipe.decrib;
    
    const ingredientsList = document.querySelector('.ingredients ul');
    ingredientsList.innerHTML = '';
    
    const ingredients = recipe.ingred.split(', ');
    ingredients.forEach(ingredient => {
      const li = document.createElement('li');
      li.textContent = ingredient;
      ingredientsList.appendChild(li);
    });
    
    const instructionsList = document.querySelector('.instructions ol');
    instructionsList.innerHTML = '';
    
    const instructions = recipe.decrib.split('.').filter(step => step.trim() !== '');
    
    instructions.forEach(instruction => {
      const li = document.createElement('li');
      li.textContent = instruction.trim();
      instructionsList.appendChild(li);
    });
    
    const favoriteBtn = document.querySelector('.favorite-btn');
    favoriteBtn.textContent = recipe.isFav ? "Remove from Favorites" : "Add to Favorites";
  };
  
  const setupButtons = (recipe, allRecipes) => {
    const editBtn = document.querySelector('.edit-btn');
    editBtn.onclick = () => {
      window.location.href = `editPage.html?recipe=${encodeURIComponent(recipe.name)}`;
    };
    
    const deleteBtn = document.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete ${recipe.name}?`)) {
        const updatedRecipes = allRecipes.filter(r => r.name !== recipe.name);
        
        localStorage.setItem("saved_data", JSON.stringify(updatedRecipes));
        
        window.location.href = 'recipes_list.html';
      }
    });
    
    const favoriteBtn = document.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => {
      const updatedRecipes = allRecipes.map(r => {
        if (r.name === recipe.name) {
          r.isFav = !r.isFav;
        }
        return r;
      });
      
      localStorage.setItem("saved_data", JSON.stringify(updatedRecipes));
      
      const updatedRecipe = updatedRecipes.find(r => r.name === recipe.name);
      favoriteBtn.textContent = updatedRecipe.isFav ? "Remove from Favorites" : "Add to Favorites";
    });
  };
  
  loadRecipeDetails();
});