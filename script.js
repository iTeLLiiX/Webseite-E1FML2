// User credentials (in a real application, this would be handled server-side)
const validCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (isLoggedIn && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (username === validCredentials.username && password === validCredentials.password) {
        // Successful login
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('username', username);

        // Show success notification
        showNotification('Login erfolgreich!', 'success');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

        return false;
    } else {
        // Failed login
        errorMessage.textContent = translations[document.documentElement.lang].login.error;
        errorMessage.style.display = 'block';
        showNotification('Login fehlgeschlagen!', 'error');
        return false;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout function
function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// Check login status when page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification.success {
        background-color: #2ecc71;
    }
    
    .notification.error {
        background-color: #e74c3c;
    }
    
    .notification.info {
        background-color: #3498db;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 