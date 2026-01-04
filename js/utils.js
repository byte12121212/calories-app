/**
 * Utility functions for the application
 */

/**
 * Hash a password using Web Crypto API
 * Uses SHA-256 for password hashing
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - The hashed password as a hex string
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} - Current date string
 */
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is logged in
 */
function isAuthenticated() {
    return localStorage.getItem('currentUser') !== null;
}

/**
 * Get current user email
 * @returns {string|null} - Current user email or null
 */
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

/**
 * Set current user
 * @param {string} email - User email
 */
function setCurrentUser(email) {
    localStorage.setItem('currentUser', email);
}

/**
 * Clear current user session
 */
function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

/**
 * Get users from localStorage
 * @returns {Object} - Users object
 */
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : {};
}

/**
 * Save users to localStorage
 * @param {Object} users - Users object
 */
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Get user data from localStorage
 * @param {string} email - User email
 * @returns {Object} - User data object
 */
function getUserData(email) {
    const userData = localStorage.getItem(`userData_${email}`);
    return userData ? JSON.parse(userData) : { foods: [] };
}

/**
 * Save user data to localStorage
 * @param {string} email - User email
 * @param {Object} data - User data object
 */
function saveUserData(email, data) {
    localStorage.setItem(`userData_${email}`, JSON.stringify(data));
}

