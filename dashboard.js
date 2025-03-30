// Dashboard State
const dashboardState = {
    user: null,
    progress: {
        sql: 0,
        subnetting: 0,
        binary: 0
    },
    recentActivity: [],
    stats: {
        learningTime: 0,
        flashcardsLearned: 0,
        gamesPlayed: 0,
        toolsUsed: 0
    }
};

// Current language state
let currentLanguage = 'de';

// Initialize Dashboard
function initDashboard() {
    checkAuth();
    loadUserData();
    loadProgress();
    loadRecentActivity();
    loadStats();
    setupEventListeners();
    initDarkMode();
    const preferredLang = localStorage.getItem('preferredLanguage') || 'de';
    changeLanguage(preferredLang);
}

// Check Authentication
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    dashboardState.user = JSON.parse(user);
}

// Load User Data
function loadUserData() {
    const username = document.getElementById('username');
    if (username) {
        username.textContent = dashboardState.user.username;
    }
}

// Load Progress
function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('progress')) || {};
    dashboardState.progress = { ...dashboardState.progress, ...progress };

    // Update progress bars
    Object.entries(dashboardState.progress).forEach(([area, value]) => {
        const progressBar = document.querySelector(`#${area}-progress .progress`);
        if (progressBar) {
            progressBar.style.width = `${value}%`;
        }
    });
}

// Load Recent Activity
function loadRecentActivity() {
    const activity = JSON.parse(localStorage.getItem('activity')) || [];
    dashboardState.recentActivity = activity.slice(0, 5); // Get last 5 activities

    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = dashboardState.recentActivity.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${getActivityIcon(activity.type)}</div>
                <div class="activity-info">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
            </div>
        `).join('');
    }
}

// Load Stats
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('stats')) || {};
    dashboardState.stats = { ...dashboardState.stats, ...stats };

    // Update stats display
    Object.entries(dashboardState.stats).forEach(([stat, value]) => {
        const statElement = document.querySelector(`#${stat}-value`);
        if (statElement) {
            statElement.textContent = formatStatValue(stat, value);
        }
    });
}

// Get Activity Icon
function getActivityIcon(type) {
    const icons = {
        flashcard: '📝',
        game: '🎮',
        tool: '🛠️',
        quiz: '📊',
        achievement: '🏆'
    };
    return icons[type] || '📌';
}

// Format Stat Value
function formatStatValue(stat, value) {
    switch (stat) {
        case 'learningTime':
            return `${Math.floor(value / 60)}h ${value % 60}m`;
        case 'flashcardsLearned':
        case 'gamesPlayed':
        case 'toolsUsed':
            return value.toString();
        default:
            return value.toString();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Logout Button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Language Selector
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(button => {
        button.addEventListener('click', () => changeLanguage(button.dataset.lang));
    });
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeIcon(isDarkMode);
}

// Update Dark Mode Icon
function updateDarkModeIcon(isDark) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    }
}

// Change Language
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateLanguage();
}

// Update Language
function updateLanguage() {
    const lang = localStorage.getItem('language') || 'de';
    const translations = getTranslations(lang);

    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

// Get Translations
function getTranslations(lang) {
    const translations = {
        de: {
            welcome: 'Willkommen zurück',
            progress: 'Fortschritt',
            goals: 'Ziele',
            learningAreas: 'Lernbereiche',
            interactiveTools: 'Interaktive Tools',
            recentActivity: 'Letzte Aktivitäten',
            quickStats: 'Schnellstatistiken',
            logout: 'Abmelden'
        },
        en: {
            welcome: 'Welcome back',
            progress: 'Progress',
            goals: 'Goals',
            learningAreas: 'Learning Areas',
            interactiveTools: 'Interactive Tools',
            recentActivity: 'Recent Activity',
            quickStats: 'Quick Stats',
            logout: 'Logout'
        }
    };
    return translations[lang] || translations['en'];
}

// Logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);

// Navigation function
function navigateTo(page) {
    window.location.href = page;
}

// Handle difficulty selection
document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', function () {
        // Remove active class from all buttons in this selector
        this.parentElement.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        this.classList.add('active');

        // Store selected difficulty
        const game = this.closest('.game-card').querySelector('h3').textContent;
        localStorage.setItem(`${game.toLowerCase()}_difficulty`, this.dataset.level);

        // Show notification
        showNotification(`Schwierigkeitsgrad für ${game} auf ${this.textContent} gesetzt`, 'info');
    });
});

// Load saved difficulties
function loadSavedDifficulties() {
    document.querySelectorAll('.game-card').forEach(card => {
        const game = card.querySelector('h3').textContent;
        const savedDifficulty = localStorage.getItem(`${game.toLowerCase()}_difficulty`);
        if (savedDifficulty) {
            const button = card.querySelector(`[data-level="${savedDifficulty}"]`);
            if (button) {
                button.classList.add('active');
            }
        }
    });
}

// Update progress bars
function updateProgress() {
    const topics = ['sql', 'subnetting', 'binary', 'prefix'];
    topics.forEach(topic => {
        const progress = localStorage.getItem(`${topic}_progress`) || 0;
        const progressBar = document.querySelector(`[onclick="navigateTo('${topic}.html')"]`)
            .closest('.topic-card')
            .querySelector('.progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    });
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add intersection observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.topic-card, .tool-card, .game-card').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.5s ease-out";
    observer.observe(card);
}); 