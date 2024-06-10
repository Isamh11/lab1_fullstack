// Wait for the DOM to fully load before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
    document.getElementById('addRecipeForm').addEventListener('submit', addRecipe);
});

// Fetch all recipes from the API and display them
function fetchRecipes() {
    fetch('http://localhost:5000/api/recipes')
        .then(response => response.json())
        .then(data => displayRecipes(data))
        .catch(error => console.error('Error fetching recipes:', error));
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipesTable');
    container.innerHTML = ''; 
    const table = document.createElement('table');
    table.classList.add('recipe-table'); 
    table.innerHTML = `
        <tr class="recipe-table-header">
            <th>Title</th>
            <th>Ingredients</th>
            <th>Instructions</th>
            <th>Cooking Time</th>
            <th>Actions</th>
        </tr>`;

    recipes.forEach(recipe => {
        const row = table.insertRow();
        row.classList.add('recipe-row'); 
        row.setAttribute('data-id', recipe._id);
        row.innerHTML = `
            <td>${recipe.title}</td>
            <td>${recipe.ingredients.join(', ')}</td> <!-- Assuming ingredients is an array -->
            <td>${recipe.instructions}</td>
            <td>${recipe.cookingTime} minutes</td>
            <td>
                <button class="edit-btn" onclick='editRecipe("${recipe._id}")'>Edit</button>
                <button class="delete-btn" onclick='deleteRecipe("${recipe._id}")'>Delete</button>
            </td>`;
    });
    
    container.appendChild(table);
}

function addRecipe(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    let recipe = Object.fromEntries(formData.entries());

    recipe.ingredients = recipe.ingredients.split(',').map(ingredient => ingredient.trim()).filter(Boolean);

    recipe.cookingTime = Number(recipe.cookingTime); 

    fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
    })
    .then(response => {
        if (response.ok) {
            fetchRecipes(); 
        } else {
            response.json().then(data => {
                alert('Failed to add recipe: ' + (data.message || ''));
            });
        }
    })
    .catch(error => console.error('Error adding recipe:', error));
}

function editRecipe(id) {

    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    const title = row.cells[0].innerText;
    const ingredients = row.cells[1].innerText;
    const instructions = row.cells[2].innerText;
    const cookingTime = row.cells[3].innerText;

    document.getElementById('editId').value = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editIngredients').value = ingredients;
    document.getElementById('editInstructions').value = instructions;
    document.getElementById('editCookingTime').value = cookingTime;

    showEditModal();
}

document.getElementById('editRecipeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    submitEditForm();
});

function submitEditForm() {
    const id = document.getElementById('editId').value;
    const title = document.getElementById('editTitle').value;
    let ingredients = document.getElementById('editIngredients').value;
    const instructions = document.getElementById('editInstructions').value;
    const cookingTime = document.getElementById('editCookingTime').value;

    ingredients = ingredients.split(/,|\s+/).filter(Boolean); 

    const updatedRecipe = { title, ingredients, instructions, cookingTime };

    fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Recipe update failed.');
        }
        return response.json();
    })
    .then(updatedRecipe => {
        closeEditModal();
        fetchRecipes(); 
    })
    .catch(error => {
        console.error('Error updating recipe:', error);
        alert(error.message);
    });
}

function showEditModal() {
    document.getElementById('editRecipeModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editRecipeModal').style.display = 'none';
}

// Handle deleting a recipe 
function deleteRecipe(id) {
    console.log('id:', id);
    if (!confirm('Are you sure you want to delete this recipe?')) {
        return;
    }

    // remove the recipe 
    const rowToDelete = document.querySelector(`tr[data-id="${id}"]`);
    if (rowToDelete) {
        rowToDelete.parentNode.removeChild(rowToDelete);
    }


    fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            fetchRecipes();
            alert('Recipe not found or delete failed.');
        }
        
    })
    .catch(error => {
        console.error('Error deleting recipe:', error);
        fetchRecipes();
    });
}
