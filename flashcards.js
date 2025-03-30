// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Update progress bar
function updateProgress() {
    const progress = localStorage.getItem('flashcards_progress') || 0;
    const progressBar = document.getElementById('flashcards-progress');
    const progressText = document.getElementById('progress-text');

    if (progressBar && progressText) {
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
    }
}

// Flashcard data structure
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentCardIndex = 0;
let learningStartTime = null;

// Game State
const gameState = {
    currentLanguage: 'de',
    currentCategory: null,
    currentCardIndex: 0,
    cards: [],
    progress: 0
};

// Sample Cards (in production, these would come from a database)
const sampleCards = {
    networking: [
        {
            question: 'Was ist eine IP-Adresse?',
            answer: 'Eine eindeutige numerische Adresse, die jedem Gerät in einem Netzwerk zugewiesen wird.',
            translations: {
                en: {
                    question: 'What is an IP address?',
                    answer: 'A unique numerical address assigned to each device in a network.'
                },
                ru: {
                    question: 'Что такое IP-адрес?',
                    answer: 'Уникальный числовой адрес, назначаемый каждому устройству в сети.'
                },
                so: {
                    question: 'Waa maxay IP address?',
                    answer: 'Cinwaanka lambar ah oo gaar ah oo la siiyo qalab kasta oo network-ka ku jira.'
                }
            }
        },
        {
            question: 'Was ist ein Router?',
            answer: 'Ein Netzwerkgerät, das Datenpakete zwischen verschiedenen Netzwerken weiterleitet.',
            translations: {
                en: {
                    question: 'What is a router?',
                    answer: 'A network device that forwards data packets between different networks.'
                },
                ru: {
                    question: 'Что такое маршрутизатор?',
                    answer: 'Сетевое устройство, которое пересылает пакеты данных между разными сетями.'
                },
                so: {
                    question: 'Waa maxay router?',
                    answer: 'Qalab network ah oo soo gudbiya xogta network-ka kala duwan.'
                }
            }
        }
    ],
    programming: [
        {
            question: 'Was ist eine Variable?',
            answer: 'Ein Container für Daten, der einen Wert speichert, der sich während der Programmausführung ändern kann.',
            translations: {
                en: {
                    question: 'What is a variable?',
                    answer: 'A container for data that stores a value that can change during program execution.'
                },
                ru: {
                    question: 'Что такое переменная?',
                    answer: 'Контейнер для данных, который хранит значение, которое может изменяться во время выполнения программы.'
                },
                so: {
                    question: 'Waa maxay variable?',
                    answer: 'Container-ka xogta oo keydiyo qiime ka duwan kaa baxa marka program-ka la fuliyo.'
                }
            }
        },
        {
            question: 'Was ist eine Funktion?',
            answer: 'Ein Codeblock, der eine bestimmte Aufgabe ausführt und möglicherweise einen Wert zurückgibt.',
            translations: {
                en: {
                    question: 'What is a function?',
                    answer: 'A block of code that performs a specific task and may return a value.'
                },
                ru: {
                    question: 'Что такое функция?',
                    answer: 'Блок кода, который выполняет определенную задачу и может возвращать значение.'
                },
                so: {
                    question: 'Waa maxay function?',
                    answer: 'Block-ka code-ka oo fuliya hawlo gaar ah oo soo celiya qiime.'
                }
            }
        }
    ],
    security: [
        {
            question: 'Was ist eine Firewall?',
            answer: 'Ein Sicherheitssystem, das den Netzwerkverkehr überwacht und basierend auf Sicherheitsregeln filtert.',
            translations: {
                en: {
                    question: 'What is a firewall?',
                    answer: 'A security system that monitors and filters network traffic based on security rules.'
                },
                ru: {
                    question: 'Что такое файрвол?',
                    answer: 'Система безопасности, которая отслеживает и фильтрует сетевой трафик на основе правил безопасности.'
                },
                so: {
                    question: 'Waa maxay firewall?',
                    answer: 'Nidaam amniga oo hubiya oo soo saara network traffic-ka iyadoo la isticmaalo xeerarka amniga.'
                }
            }
        },
        {
            question: 'Was ist Verschlüsselung?',
            answer: 'Der Prozess der Umwandlung von Daten in ein unlesbares Format, um sie vor unbefugtem Zugriff zu schützen.',
            translations: {
                en: {
                    question: 'What is encryption?',
                    answer: 'The process of converting data into an unreadable format to protect it from unauthorized access.'
                },
                ru: {
                    question: 'Что такое шифрование?',
                    answer: 'Процесс преобразования данных в нечитаемый формат для защиты от несанкционированного доступа.'
                },
                so: {
                    question: 'Waa maxay encryption?',
                    answer: 'Habka u beddelista xogta si aan la isticmaalin karin si aan la ilaaliyo.'
                }
            }
        }
    ],
    databases: [
        {
            question: 'Was ist SQL?',
            answer: 'Eine standardisierte Abfragesprache für relationale Datenbanken.',
            translations: {
                en: {
                    question: 'What is SQL?',
                    answer: 'A standardized query language for relational databases.'
                },
                ru: {
                    question: 'Что такое SQL?',
                    answer: 'Стандартизированный язык запросов для реляционных баз данных.'
                },
                so: {
                    question: 'Waa maxay SQL?',
                    answer: 'Luqad su\'aalaha oo la isticmaalo database-ka relational.'
                }
            }
        },
        {
            question: 'Was ist eine Tabelle in einer Datenbank?',
            answer: 'Eine strukturierte Sammlung von Daten, die in Zeilen und Spalten organisiert ist.',
            translations: {
                en: {
                    question: 'What is a table in a database?',
                    answer: 'A structured collection of data organized in rows and columns.'
                },
                ru: {
                    question: 'Что такое таблица в базе данных?',
                    answer: 'Структурированная коллекция данных, организованная в строки и столбцы.'
                },
                so: {
                    question: 'Waa maxay table database-ka?',
                    answer: 'Urur xog ah oo la habeeyay saf iyo tiir.'
                }
            }
        }
    ]
};

// Create new flashcard
function createFlashcard(event) {
    event.preventDefault();

    const category = document.getElementById('card-category').value;
    const front = document.getElementById('card-front').value;
    const back = document.getElementById('card-back').value;
    const difficulty = document.getElementById('card-difficulty').value;

    const newCard = {
        id: Date.now(),
        category,
        front,
        back,
        difficulty,
        created: new Date().toISOString(),
        lastReviewed: null,
        reviewCount: 0,
        correctCount: 0
    };

    flashcards.push(newCard);
    localStorage.setItem('flashcards', JSON.stringify(flashcards));

    // Reset form
    event.target.reset();
    showNotification('Karteikarte erfolgreich erstellt!', 'success');

    // Update cards display
    displayCards();
}

// Display all cards
function displayCards() {
    const cardsGrid = document.getElementById('cards-grid');
    cardsGrid.innerHTML = '';

    flashcards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-item';
        cardElement.innerHTML = `
            <h3>${card.category}</h3>
            <p>${card.front}</p>
            <div class="card-meta">
                <span>Schwierigkeit: ${card.difficulty}</span>
                <span>Erstellt: ${new Date(card.created).toLocaleDateString()}</span>
            </div>
        `;
        cardElement.onclick = () => editCard(card.id);
        cardsGrid.appendChild(cardElement);
    });
}

// Edit card
function editCard(cardId) {
    const card = flashcards.find(c => c.id === cardId);
    if (!card) return;

    // TODO: Implement edit functionality
    showNotification('Bearbeitung wird implementiert', 'info');
}

// Initialize learning session
function startLearning() {
    const category = document.getElementById('learn-category').value;
    const difficulty = document.getElementById('learn-difficulty').value;

    // Filter cards based on selection
    let filteredCards = flashcards;
    if (category !== 'all') {
        filteredCards = filteredCards.filter(card => card.category === category);
    }
    if (difficulty !== 'all') {
        filteredCards = filteredCards.filter(card => card.difficulty === difficulty);
    }

    if (filteredCards.length === 0) {
        showNotification('Keine Karten gefunden!', 'error');
        return;
    }

    // Shuffle cards
    filteredCards = shuffleArray(filteredCards);

    // Start learning session
    currentCardIndex = 0;
    learningStartTime = new Date();
    displayCurrentCard(filteredCards);
}

// Display current card
function displayCurrentCard(cards) {
    if (currentCardIndex >= cards.length) {
        endLearningSession(cards);
        return;
    }

    const card = cards[currentCardIndex];
    document.getElementById('card-front-text').textContent = card.front;
    document.getElementById('card-back-text').textContent = card.back;
    document.getElementById('card-counter').textContent = `${currentCardIndex + 1}/${cards.length}`;

    // Reset card flip
    const flashcard = document.getElementById('current-card');
    flashcard.classList.remove('flipped');
}

// Flip card
function flipCard() {
    const flashcard = document.getElementById('current-card');
    flashcard.classList.toggle('flipped');
}

// Previous card
function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        displayCurrentCard(flashcards);
    }
}

// Next card
function nextCard() {
    currentCardIndex++;
    displayCurrentCard(flashcards);
}

// End learning session
function endLearningSession(cards) {
    const endTime = new Date();
    const duration = Math.round((endTime - learningStartTime) / 1000 / 60); // in minutes

    // Update statistics
    updateStatistics(cards, duration);

    // Show completion message
    showNotification(`Lernsession abgeschlossen! Dauer: ${duration} Minuten`, 'success');
}

// Update statistics
function updateStatistics(cards, duration) {
    const totalCards = cards.length;
    const learnedCards = cards.filter(card => card.lastReviewed).length;
    const successRate = cards.reduce((acc, card) => {
        return acc + (card.correctCount / (card.reviewCount || 1));
    }, 0) / totalCards * 100;

    // Update display
    document.getElementById('learned-cards').textContent = learnedCards;
    document.getElementById('success-rate').textContent = `${Math.round(successRate)}%`;
    document.getElementById('learning-time').textContent = `${duration} min`;

    // Update category statistics
    const categoryStats = document.getElementById('category-stats');
    categoryStats.innerHTML = '';

    const categories = [...new Set(cards.map(card => card.category))];
    categories.forEach(category => {
        const categoryCards = cards.filter(card => card.category === category);
        const stat = document.createElement('div');
        stat.className = 'category-stat';
        stat.innerHTML = `
            <span>${category}</span>
            <span>${categoryCards.length} Karten</span>
        `;
        categoryStats.appendChild(stat);
    });
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateProgress();
    displayCards();

    // Add form submit handler
    const cardForm = document.getElementById('card-form');
    if (cardForm) {
        cardForm.addEventListener('submit', createFlashcard);
    }

    // Add learning controls
    const learnCategory = document.getElementById('learn-category');
    const learnDifficulty = document.getElementById('learn-difficulty');
    if (learnCategory && learnDifficulty) {
        learnCategory.addEventListener('change', startLearning);
        learnDifficulty.addEventListener('change', startLearning);
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

    // Initialize the game
    initGame();
});

// Initialize the game
function initGame() {
    setupEventListeners();
    loadGameState();
    updateLanguage(gameState.currentLanguage);
}

// Event Listeners
function setupEventListeners() {
    // Flashcard click event
    document.querySelector('.flashcard').addEventListener('click', flipCard);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
}

// Handle keyboard navigation
function handleKeyPress(event) {
    if (event.key === 'ArrowLeft') {
        previousCard();
    } else if (event.key === 'ArrowRight') {
        nextCard();
    } else if (event.key === ' ') {
        flipCard();
    }
}

// Language handling
function changeLanguage(lang) {
    gameState.currentLanguage = lang;
    updateLanguage(lang);
    saveGameState();
}

function updateLanguage(lang) {
    // Update all language-specific elements
    document.querySelectorAll('[data-lang]').forEach(element => {
        if (element.getAttribute('data-lang') === lang) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.querySelector(`img[alt="${lang}"]`)) {
            btn.classList.add('active');
        }
    });

    // Update current card if one is displayed
    if (gameState.currentCategory && gameState.cards.length > 0) {
        updateCardDisplay();
    }

    // Update page title
    const title = document.querySelector(`title[data-lang="${lang}"]`);
    if (title) {
        document.title = title.textContent;
    }
}

// Category selection
function selectCategory(category) {
    gameState.currentCategory = category;
    gameState.currentCardIndex = 0;
    gameState.cards = sampleCards[category];
    gameState.progress = 0;
    
    // Show flashcard interface
    document.querySelector('.categories').style.display = 'none';
    document.querySelector('.flashcard-interface').style.display = 'block';
    
    // Update category title
    const categoryTitle = document.querySelector(`.category-card[onclick="selectCategory('${category}')"] h3[data-lang="${gameState.currentLanguage}"]`);
    if (categoryTitle) {
        document.getElementById('category-title').textContent = categoryTitle.textContent;
    }
    
    // Update card display
    updateCardDisplay();
    saveGameState();
}

// Card navigation
function previousCard() {
    if (gameState.currentCardIndex > 0) {
        gameState.currentCardIndex--;
        updateCardDisplay();
    }
}

function nextCard() {
    if (gameState.currentCardIndex < gameState.cards.length - 1) {
        gameState.currentCardIndex++;
        updateCardDisplay();
    }
}

function flipCard() {
    const card = document.querySelector('.flashcard');
    card.classList.toggle('flipped');
}

// Update card display
function updateCardDisplay() {
    const card = gameState.cards[gameState.currentCardIndex];
    const question = card.translations[gameState.currentLanguage]?.question || card.question;
    const answer = card.translations[gameState.currentLanguage]?.answer || card.answer;
    
    document.getElementById('card-question').textContent = question;
    document.getElementById('card-answer').textContent = answer;
    
    // Update progress
    gameState.progress = ((gameState.currentCardIndex + 1) / gameState.cards.length) * 100;
    document.getElementById('progress-text').textContent = `${Math.round(gameState.progress)}%`;
    document.getElementById('card-progress').style.width = `${gameState.progress}%`;
    
    // Reset card flip state
    document.querySelector('.flashcard').classList.remove('flipped');
}

// Create new card
function showCreateCard() {
    document.querySelector('.create-card-interface').style.display = 'block';
}

function closeCreateCard() {
    document.querySelector('.create-card-interface').style.display = 'none';
}

function saveCard() {
    const category = document.getElementById('card-category').value;
    const question = document.getElementById('card-question-input').value;
    const answer = document.getElementById('card-answer-input').value;
    
    if (!question || !answer) {
        const messages = {
            de: 'Bitte füllen Sie beide Felder aus.',
            en: 'Please fill in both fields.',
            ru: 'Пожалуйста, заполните оба поля.',
            so: 'Fadlan buuxi labada meelood.'
        };
        alert(messages[gameState.currentLanguage]);
        return;
    }
    
    // In production, this would save to a database
    console.log('Saving new card:', { category, question, answer });
    
    // Clear form and close interface
    document.getElementById('card-question-input').value = '';
    document.getElementById('card-answer-input').value = '';
    closeCreateCard();
}

// State management
function loadGameState() {
    const savedState = localStorage.getItem('flashcardGameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        Object.assign(gameState, state);
    }
}

function saveGameState() {
    localStorage.setItem('flashcardGameState', JSON.stringify(gameState));
} 