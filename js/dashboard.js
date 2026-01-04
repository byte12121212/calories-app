/**
 * Dashboard functionality for calorie tracking
 */

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize dashboard
    initializeDashboard();
});

/**
 * Initialize dashboard
 */
function initializeDashboard() {
    // Display user email
    const userEmail = getCurrentUser();
    document.getElementById('userEmail').textContent = userEmail;
    
    // Setup logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Setup food form
    document.getElementById('foodForm').addEventListener('submit', handleAddFood);
    
    // Setup edit form
    document.getElementById('editForm').addEventListener('submit', handleEditFood);
    
    // Setup modal close buttons
    document.getElementById('closeModal').addEventListener('click', closeEditModal);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    
    // Close modal when clicking outside
    document.getElementById('editModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });
    
    // Load and display food entries
    loadFoodEntries();
}

/**
 * Handle add food form submission
 * @param {Event} e - Form submit event
 */
function handleAddFood(e) {
    e.preventDefault();
    
    const foodName = document.getElementById('foodName').value.trim();
    const calories = parseInt(document.getElementById('calories').value);
    
    // Validate inputs
    if (!foodName) {
        showFieldError('foodNameError', 'Food name is required.');
        return;
    }
    
    if (!calories || calories < 0) {
        showFieldError('caloriesError', 'Please enter a valid calorie amount.');
        return;
    }
    
    // Clear errors
    clearFoodFormErrors();
    
    // Get current user
    const userEmail = getCurrentUser();
    const userData = getUserData(userEmail);
    
    // Create new food entry
    const newFood = {
        id: Date.now().toString(), // Simple ID generation
        name: foodName,
        calories: calories,
        date: getCurrentDate(),
        timestamp: new Date().toISOString()
    };
    
    // Add to user data
    userData.foods.push(newFood);
    saveUserData(userEmail, userData);
    
    // Reset form
    document.getElementById('foodForm').reset();
    
    // Reload food entries
    loadFoodEntries();
}

/**
 * Handle edit food form submission
 * @param {Event} e - Form submit event
 */
function handleEditFood(e) {
    e.preventDefault();
    
    const foodId = document.getElementById('editId').value;
    const foodName = document.getElementById('editFoodName').value.trim();
    const calories = parseInt(document.getElementById('editCalories').value);
    
    // Validate inputs
    if (!foodName || !calories || calories < 0) {
        return;
    }
    
    // Get current user
    const userEmail = getCurrentUser();
    const userData = getUserData(userEmail);
    
    // Find and update food entry
    const foodIndex = userData.foods.findIndex(food => food.id === foodId);
    if (foodIndex !== -1) {
        userData.foods[foodIndex].name = foodName;
        userData.foods[foodIndex].calories = calories;
        saveUserData(userEmail, userData);
    }
    
    // Close modal and reload
    closeEditModal();
    loadFoodEntries();
}

/**
 * Handle delete food entry
 * @param {string} foodId - Food entry ID
 */
function handleDeleteFood(foodId) {
    if (!confirm('Are you sure you want to delete this food entry?')) {
        return;
    }
    
    // Get current user
    const userEmail = getCurrentUser();
    const userData = getUserData(userEmail);
    
    // Remove food entry
    userData.foods = userData.foods.filter(food => food.id !== foodId);
    saveUserData(userEmail, userData);
    
    // Reload food entries
    loadFoodEntries();
}

/**
 * Handle edit food entry - open modal
 * @param {string} foodId - Food entry ID
 */
function handleEditFoodEntry(foodId) {
    // Get current user
    const userEmail = getCurrentUser();
    const userData = getUserData(userEmail);
    
    // Find food entry
    const food = userData.foods.find(f => f.id === foodId);
    if (!food) {
        return;
    }
    
    // Populate edit form
    document.getElementById('editId').value = food.id;
    document.getElementById('editFoodName').value = food.name;
    document.getElementById('editCalories').value = food.calories;
    
    // Show modal
    document.getElementById('editModal').classList.remove('hidden');
}

/**
 * Close edit modal
 */
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('editForm').reset();
}

/**
 * Load and display food entries for today
 */
function loadFoodEntries() {
    const userEmail = getCurrentUser();
    const userData = getUserData(userEmail);
    const currentDate = getCurrentDate();
    
    // Filter foods for today
    const todayFoods = userData.foods.filter(food => food.date === currentDate);
    
    // Calculate total calories
    const totalCalories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
    
    // Update stats
    document.getElementById('totalCalories').textContent = totalCalories;
    document.getElementById('foodCount').textContent = todayFoods.length;
    
    // Display food list
    displayFoodList(todayFoods);
}

/**
 * Display food list
 * @param {Array} foods - Array of food entries
 */
function displayFoodList(foods) {
    const foodListElement = document.getElementById('foodList');
    
    if (foods.length === 0) {
        foodListElement.innerHTML = '<p class="empty-state">No foods logged today. Add your first entry!</p>';
        return;
    }
    
    // Sort by timestamp (newest first)
    foods.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Generate HTML
    const html = foods.map(food => `
        <div class="food-item">
            <div class="food-info">
                <div class="food-name">${escapeHtml(food.name)}</div>
                <div class="food-calories">${food.calories} calories</div>
            </div>
            <div class="food-actions">
                <button class="btn btn-edit" onclick="handleEditFoodEntry('${food.id}')">Edit</button>
                <button class="btn btn-danger" onclick="handleDeleteFood('${food.id}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    foodListElement.innerHTML = html;
}

/**
 * Clear food form errors
 */
function clearFoodFormErrors() {
    document.getElementById('foodNameError').textContent = '';
    document.getElementById('caloriesError').textContent = '';
}

/**
 * Show field error message
 * @param {string} errorId - Error element ID
 * @param {string} message - Error message
 */
function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

