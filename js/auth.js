/**
 * Authentication functions
 */

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    hideAuthError();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validate inputs
    if (!(await validateLoginForm(email, password))) {
        return;
    }
    
    // Get users from storage
    const users = getUsers();
    
    // Check if user exists
    if (!users[email]) {
        showFieldError('emailError', 'User not found. Please sign up first.');
        return;
    }
    
    // Check if email is verified
    if (!isEmailVerified(email)) {
        showAuthError('Please verify your email address before logging in. Check your email for the verification code.');
        return;
    }
    
    // Hash the provided password
    const hashedPassword = await hashPassword(password);
    
    // Verify password
    if (users[email].password !== hashedPassword) {
        showFieldError('passwordError', 'Incorrect password.');
        return;
    }
    
    // Login successful - set current user and redirect
    setCurrentUser(email);
    window.location.href = 'dashboard.html';
}

/**
 * Handle register form submission
 * @param {Event} e - Form submit event
 */
async function handleRegister(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    hideAuthError();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate inputs
    if (!(await validateRegisterForm(email, password, confirmPassword))) {
        return;
    }
    
    // Get users from storage
    const users = getUsers();
    
    // Check if user already exists
    if (users[email]) {
        showFieldError('emailError', 'Email already registered. Please sign in.');
        return;
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    users[email] = {
        email: email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    
    // Save users
    saveUsers(users);
    
    // Initialize user data
    saveUserData(email, { foods: [] });
    
    // Registration successful - set current user and redirect
    setCurrentUser(email);
    window.location.href = 'dashboard.html';
}

/**
 * Validate login form
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Promise<boolean>} - True if valid
 */
async function validateLoginForm(email, password) {
    let isValid = true;
    
    if (!email) {
        showFieldError('emailError', 'Email is required.');
        isValid = false;
    } else {
        // Use enhanced email validation
        const emailValidation = await validateEmail(email);
        if (!emailValidation.valid) {
            showFieldError('emailError', emailValidation.message);
            isValid = false;
        }
    }
    
    if (!password) {
        showFieldError('passwordError', 'Password is required.');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate register form
 * @param {string} email - Email address
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {Promise<boolean>} - True if valid
 */
async function validateRegisterForm(email, password, confirmPassword) {
    let isValid = true;
    
    if (!email) {
        showFieldError('emailError', 'Email is required.');
        isValid = false;
    } else {
        // Use enhanced email validation
        const emailValidation = await validateEmail(email);
        if (!emailValidation.valid) {
            showFieldError('emailError', emailValidation.message);
            isValid = false;
        }
    }
    
    if (!password) {
        showFieldError('passwordError', 'Password is required.');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError('passwordError', 'Password must be at least 6 characters long.');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showFieldError('confirmPasswordError', 'Please confirm your password.');
        isValid = false;
    } else if (password !== confirmPassword) {
        showFieldError('confirmPasswordError', 'Passwords do not match.');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate password match in real-time
 */
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('confirmPasswordError');
    
    if (confirmPassword && password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match.';
    } else {
        errorElement.textContent = '';
    }
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
 * Clear all field errors
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
}

/**
 * Show authentication error
 * @param {string} message - Error message
 */
function showAuthError(message) {
    const errorElement = document.getElementById('authError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

/**
 * Hide authentication error
 */
function hideAuthError() {
    const errorElement = document.getElementById('authError');
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

