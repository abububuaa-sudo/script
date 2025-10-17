// DOM Elements
const registrationForm = document.getElementById('registration-form');
const loginForm = document.getElementById('login-form');
const welcomeMessage = document.getElementById('welcome-message');
const guestButtons = document.getElementById('guest-buttons');
const userInfo = document.getElementById('user-info');
const usernameDisplay = document.getElementById('username-display');
const userAvatar = document.getElementById('user-avatar');
const welcomeUsername = document.getElementById('welcome-username');
const welcomeEmail = document.getElementById('welcome-email');

// Buttons
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const heroRegisterBtn = document.getElementById('hero-register-btn');
const logoutBtn = document.getElementById('logout-btn');
const showLogin = document.getElementById('show-login');
const showRegister = document.getElementById('show-register');
const continueToSite = document.getElementById('continue-to-site');

// Forms
const registerForm = document.getElementById('register-form');
const loginFormElement = document.getElementById('login-form-element');

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        showUserInterface(currentUser);
    } else {
        showGuestInterface();
    }
});

// Event Listeners
registerBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showRegistrationForm();
});

loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showLoginForm();
});

heroRegisterBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showRegistrationForm();
});

showLogin.addEventListener('click', function(e) {
    e.preventDefault();
    showLoginForm();
});

showRegister.addEventListener('click', function(e) {
    e.preventDefault();
    showRegistrationForm();
});

logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    logout();
});

continueToSite.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllForms();
});

// Form submissions
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleRegistration();
});

loginFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    handleLogin();
});

// Functions
function showRegistrationForm() {
    hideAllForms();
    registrationForm.classList.remove('hidden');
}

function showLoginForm() {
    hideAllForms();
    loginForm.classList.remove('hidden');
}

function showWelcomeMessage(user) {
    hideAllForms();
    welcomeUsername.textContent = user.username;
    welcomeEmail.textContent = user.email;
    welcomeMessage.classList.remove('hidden');
}

function hideAllForms() {
    registrationForm.classList.add('hidden');
    loginForm.classList.add('hidden');
    welcomeMessage.classList.add('hidden');
}

function showUserInterface(user) {
    guestButtons.classList.add('hidden');
    userInfo.classList.remove('hidden');
    usernameDisplay.textContent = user.username;
    userAvatar.textContent = user.username.charAt(0).toUpperCase();
}

function showGuestInterface() {
    guestButtons.classList.remove('hidden');
    userInfo.classList.add('hidden');
    hideAllForms();
}

function handleRegistration() {
    // Get form values
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Reset error messages
    resetErrorMessages();
    
    // Validate inputs
    let isValid = true;
    
    if (username.length < 3) {
        document.getElementById('username-error').style.display = 'block';
        isValid = false;
    }
    
    if (!isValidEmail(email)) {
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
    }
    
    if (password.length < 6) {
        document.getElementById('password-error').style.display = 'block';
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('confirm-password-error').style.display = 'block';
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Check if user already exists
    if (userExists(email)) {
        alert('A user with this email already exists.');
        return;
    }
    
    // Register user
    registerUser({ username, email, password });
    
    // Show success message and login
    showWelcomeMessage({ username, email });
    showUserInterface({ username, email });
}

function handleLogin() {
    // Get form values
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Reset error messages
    resetErrorMessages('login');
    
    // Validate inputs
    let isValid = true;
    
    if (!isValidEmail(email)) {
        document.getElementById('login-email-error').style.display = 'block';
        isValid = false;
    }
    
    if (password.length === 0) {
        document.getElementById('login-password-error').style.display = 'block';
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Check credentials
    const user = authenticateUser(email, password);
    
    if (user) {
        // Login successful
        setCurrentUser(user);
        showWelcomeMessage(user);
        showUserInterface(user);
    } else {
        alert('Invalid email or password.');
    }
}

function logout() {
    clearCurrentUser();
    showGuestInterface();
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function resetErrorMessages(type = 'all') {
    if (type === 'all' || type === 'register') {
        document.getElementById('username-error').style.display = 'none';
        document.getElementById('email-error').style.display = 'none';
        document.getElementById('password-error').style.display = 'none';
        document.getElementById('confirm-password-error').style.display = 'none';
    }
    
    if (type === 'all' || type === 'login') {
        document.getElementById('login-email-error').style.display = 'none';
        document.getElementById('login-password-error').style.display = 'none';
    }
}

// User management functions (using localStorage for demo)
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function userExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}

function registerUser(userData) {
    const users = getUsers();
    // In a real app, you would hash the password before storing
    users.push(userData);
    saveUsers(users);
}

function authenticateUser(email, password) {
    const users = getUsers();
    // In a real app, you would compare hashed passwords
    return users.find(user => user.email === email && user.password === password);
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}