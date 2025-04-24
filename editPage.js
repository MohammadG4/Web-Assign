// editPage.js - Script for the edit recipe page

document.addEventListener('DOMContentLoaded', function() {
  // Get the recipe name from URL parameter
  const getUrlParameter = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  const recipeName = getUrlParameter('recipe');
  let currentRecipe = null;
  let allRecipes = [];
  
  // Function to load the recipe data into the form
  const loadRecipeData = () => {
    allRecipes = JSON.parse(localStorage.getItem("saved_data")) || [];
    currentRecipe = allRecipes.find(r => r.name === recipeName);
    
    if (!currentRecipe) {
      alert("Recipe not found!");
      window.location.href = "recipes_list.html";
      return;
    }
    
    // Populate the form fields with current recipe data
    document.getElementById("name").value = currentRecipe.name;
    
    // Select the correct course option
    const courseSelect = document.getElementById("course");
    const courseValue = currentRecipe.crsname.toLowerCase().replace(" ", "_");
    for (let i = 0; i < courseSelect.options.length; i++) {
      if (courseSelect.options[i].value === courseValue) {
        courseSelect.selectedIndex = i;
        break;
      }
    }
    
    // Populate ingredients list
    const ingredientsList = document.getElementById("ingredients-list");
    ingredientsList.innerHTML = ""; // Clear existing list
    
    const ingredients = currentRecipe.ingred.split(", ");
    ingredients.forEach(ingredient => {
      // Check if ingredient has quantity format like "ingredient - quantity"
      const parts = ingredient.split(" - ");
      const ingredientName = parts[0];
      const quantity = parts.length > 1 ? parts[1] : "1";
      
      addIngredientToList(ingredientName, quantity);
    });
    
    // Set description
    document.getElementById("description").value = currentRecipe.decrib;
  };
  
  // Function to add ingredient to the visual list
  window.addIngredientToList = (ingredient, quantity) => {
    const list = document.getElementById("ingredients-list");
    const li = document.createElement("li");
    li.textContent = `${ingredient} - ${quantity}`;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.background = "red";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.onclick = function () {
      list.removeChild(li);
    };
    
    li.appendChild(deleteBtn);
    list.appendChild(li);
  };
  
  // Modified addIngredient function to use the common function
  window.addIngredient = () => {
    const ingredient = document.getElementById("ingredient").value;
    const quantity = document.getElementById("quantity").value;
    
    if (ingredient && quantity) {
      addIngredientToList(ingredient, quantity);
      
      // Clear input fields
      document.getElementById("ingredient").value = "";
      document.getElementById("quantity").value = "";
    }
  };
  
  // Function to collect ingredients from the list
  const collectIngredients = () => {
    const items = document.getElementById("ingredients-list").getElementsByTagName("li");
    const ingredients = [];
    
    for (let i = 0; i < items.length; i++) {
      // Extract text without the "X" button text
      const text = items[i].textContent.replace("X", "").trim();
      ingredients.push(text);
    }
    
    return ingredients.join(", ");
  };
  
  // Handle form submission
  document.getElementById("recipe-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById("name").value;
    const courseSelect = document.getElementById("course");
    const courseValue = courseSelect.options[courseSelect.selectedIndex].value;
    const courseName = courseSelect.options[courseSelect.selectedIndex].text;
    const ingredients = collectIngredients();
    const description = document.getElementById("description").value;
    
    // Update recipe object
    const updatedRecipe = {
      name: name,
      crsname: courseName,
      ingred: ingredients,
      decrib: description,
      isFav: currentRecipe.isFav // Keep the favorite status
    };
    
    // Remove old recipe and add updated one
    const updatedRecipes = allRecipes.map(r => {
      if (r.name === recipeName) {
        return updatedRecipe;
      }
      return r;
    });
    
    // Save to localStorage
    localStorage.setItem("saved_data", JSON.stringify(updatedRecipes));
    
    // Redirect back to recipe page
    window.location.href = `RecipePage.html?recipe=${encodeURIComponent(name)}`;
  });
  
  // Handle delete button
  document.getElementById("delete-recipe").addEventListener("click", function() {
    if (confirm(`Are you sure you want to delete "${currentRecipe.name}"?`)) {
      // Remove recipe from array
      const updatedRecipes = allRecipes.filter(r => r.name !== recipeName);
      
      // Save to localStorage
      localStorage.setItem("saved_data", JSON.stringify(updatedRecipes));
      
      // Redirect to recipes list
      window.location.href = "recipes_list.html";
    }
  });
  
  // Load recipe data when page loads
  loadRecipeData();
});