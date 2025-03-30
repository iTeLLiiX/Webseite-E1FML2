// Login State
const loginState = {
    users: [],
    currentUser: null
};

// Initialize Login Page
function initLoginPage() {
    loadUsers();
    setupEventListeners();
}

// Load Users from localStorage
function loadUsers() {
    const users = localStorage.getItem('users');
    if (users) {
        loginState.users = JSON.parse(users);
    }
}

// Save Users to localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(loginState.users));
}

// Setup Event Listeners
function setupEventListeners() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Show Register Modal
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => {
            const modal = document.getElementById('registerModal');
            if (modal) {
                modal.style.display = 'block';
            }
        });
    }

    // Close Register Modal
    const closeRegisterBtn = document.getElementById('closeRegisterBtn');
    if (closeRegisterBtn) {
        closeRegisterBtn.addEventListener('click', () => {
            const modal = document.getElementById('registerModal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Close Modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('registerModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Check for admin login
    if (username === 'admin' && password === 'admin123') {
        const adminUser = {
            username: 'admin',
            role: 'admin',
            email: 'admin@example.com'
        };
        loginState.currentUser = adminUser;
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
        }
        window.location.href = 'dashboard.html';
        return;
    }

    // Check for user login
    const user = loginState.users.find(u => u.username === username && u.password === hashPassword(password));
    if (user) {
        loginState.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
        }
        window.location.href = 'dashboard.html';
        return;
    }

    showNotification('Ungültige Anmeldedaten', 'error');
}

// Handle Register
function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
        showNotification('Bitte füllen Sie alle Felder aus', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Die Passwörter stimmen nicht überein', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Das Passwort muss mindestens 6 Zeichen lang sein', 'error');
        return;
    }

    // Check if username or email already exists
    if (loginState.users.some(u => u.username === username || u.email === email)) {
        showNotification('Benutzername oder E-Mail-Adresse existiert bereits', 'error');
        return;
    }

    // Create new user
    const newUser = {
        username,
        email,
        password: hashPassword(password),
        role: 'user'
    };

    loginState.users.push(newUser);
    saveUsers();
    loginState.currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Close modal and redirect
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'none';
    }
    showNotification('Registrierung erfolgreich!', 'success');
    window.location.href = 'dashboard.html';
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Hash Password
function hashPassword(password) {
    return btoa(password); // Simple base64 encoding for demo purposes
}

// Validate Email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize Login Page when DOM is loaded
document.addEventListener('DOMContentLoaded', initLoginPage); 