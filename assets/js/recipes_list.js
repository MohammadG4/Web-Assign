function putdata(recipe) {
  const newdiv = document.createElement("div");
  const container = document.getElementById("big-container");

  newdiv.className = "recipe-card";

  newdiv.innerHTML = `
<h2>${recipe.name}</h2>
<p><strong>Course:</strong> ${recipe.crsname}</p>
<p><strong>Ingredients:</strong> ${recipe.ingred}</p>
<p class="description">${recipe.decrib}</p>
<div class="card-actions">
<a href="RecipePage.html?recipe=${encodeURIComponent(
  recipe.name
)}" class="details-btn">View Details</a>
<a href="editPage.html?recipe=${encodeURIComponent(
  recipe.name
)}" class="edit-btn">Edit</a>
</div>
`;

  container.appendChild(newdiv);
}

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("big-container");
  container.innerHTML = ""; 

  const alldata = JSON.parse(localStorage.getItem("saved_data")) || [];
  alldata.forEach(putdata);
});