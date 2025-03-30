// Game State
const gameState = {
    currentLanguage: 'de',
    timeRemaining: 1800, // 30 minutes in seconds
    inventory: [],
    completedPuzzles: new Set(),
    currentPuzzle: null,
    gameStarted: false,
    gameOver: false
};

// Puzzles Configuration
const puzzles = {
    serverPuzzle: {
        id: 'server-puzzle',
        title: {
            de: 'Server-Konfiguration',
            en: 'Server Configuration',
            ru: 'Конфигурация сервера',
            so: 'Qaabeynta Server'
        },
        description: {
            de: 'Konfiguriere den Server neu, um die Tür zu öffnen.',
            en: 'Reconfigure the server to open the door.',
            ru: 'Перенастройте сервер, чтобы открыть дверь.',
            so: 'Dib u qaabeynta server si aad u furto albaabka.'
        },
        type: 'code',
        solution: 'admin123',
        position: { x: 20, y: 30, width: 100, height: 100 }
    },
    networkPuzzle: {
        id: 'network-puzzle',
        title: {
            de: 'Netzwerk-Rätsel',
            en: 'Network Puzzle',
            ru: 'Сетевая головоломка',
            so: 'Xalitaanka Network'
        },
        description: {
            de: 'Verbinde die Netzwerkgeräte in der richtigen Reihenfolge.',
            en: 'Connect the network devices in the correct order.',
            ru: 'Подключите сетевые устройства в правильном порядке.',
            so: 'Ku xir qalabka network si sax ah.'
        },
        type: 'connection',
        solution: ['router', 'switch', 'server'],
        position: { x: 40, y: 50, width: 150, height: 150 }
    },
    binaryPuzzle: {
        id: 'binary-puzzle',
        title: {
            de: 'Binär-Code',
            en: 'Binary Code',
            ru: 'Двоичный код',
            so: 'Binary Code'
        },
        description: {
            de: 'Entschlüssle die binäre Nachricht.',
            en: 'Decode the binary message.',
            ru: 'Расшифруйте двоичное сообщение.',
            so: 'Fur farriimaha binary.'
        },
        type: 'binary',
        solution: '101010',
        position: { x: 60, y: 70, width: 120, height: 120 }
    }
};

// Initialize Game
function initGame() {
    setupEventListeners();
    loadGameState();
    createInteractiveAreas();
    startTimer();
    addLogEntry('game_start');
}

// Setup Event Listeners
function setupEventListeners() {
    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            updateLanguage(lang);
        });
    });

    // Close puzzle button
    const closePuzzleBtn = document.querySelector('.close-puzzle');
    if (closePuzzleBtn) {
        closePuzzleBtn.addEventListener('click', closePuzzle);
    }
}

// Update Language
function updateLanguage(lang) {
    gameState.currentLanguage = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(lang)) {
            btn.classList.add('active');
        }
    });

    // Update content visibility
    document.querySelectorAll('[data-lang]').forEach(element => {
        element.classList.remove('active');
        if (element.getAttribute('data-lang') === lang) {
            element.classList.add('active');
        }
    });

    // Update puzzle content if open
    if (gameState.currentPuzzle) {
        updatePuzzleContent(gameState.currentPuzzle);
    }
}

// Create Interactive Areas
function createInteractiveAreas() {
    const container = document.querySelector('.interactive-elements');
    
    Object.values(puzzles).forEach(puzzle => {
        const area = document.createElement('div');
        area.className = 'interactive-area';
        area.style.left = `${puzzle.position.x}%`;
        area.style.top = `${puzzle.position.y}%`;
        area.style.width = `${puzzle.position.width}px`;
        area.style.height = `${puzzle.position.height}px`;
        
        area.addEventListener('click', () => openPuzzle(puzzle));
        container.appendChild(area);
    });
}

// Open Puzzle
function openPuzzle(puzzle) {
    gameState.currentPuzzle = puzzle;
    const interface = document.querySelector('.puzzle-interface');
    const title = document.getElementById('puzzle-title');
    const content = document.querySelector('.puzzle-content');
    
    // Set puzzle title
    title.textContent = puzzle.title[gameState.currentLanguage];
    
    // Create puzzle content based on type
    content.innerHTML = createPuzzleContent(puzzle);
    
    // Show interface
    interface.style.display = 'block';
    
    addLogEntry('puzzle_open', puzzle.id);
}

// Create Puzzle Content
function createPuzzleContent(puzzle) {
    switch (puzzle.type) {
        case 'code':
            return `
                <div class="puzzle-code">
                    <p>${puzzle.description[gameState.currentLanguage]}</p>
                    <input type="text" id="code-input" placeholder="Code eingeben">
                    <button onclick="checkCode('${puzzle.id}')">Überprüfen</button>
                </div>
            `;
        case 'connection':
            return `
                <div class="puzzle-connection">
                    <p>${puzzle.description[gameState.currentLanguage]}</p>
                    <div class="connection-grid">
                        ${puzzle.solution.map(device => `
                            <div class="connection-device" draggable="true" data-device="${device}">
                                ${device}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        case 'binary':
            return `
                <div class="puzzle-binary">
                    <p>${puzzle.description[gameState.currentLanguage]}</p>
                    <div class="binary-display">${puzzle.solution}</div>
                    <input type="text" id="binary-input" placeholder="Binär-Code eingeben">
                    <button onclick="checkBinary('${puzzle.id}')">Überprüfen</button>
                </div>
            `;
        default:
            return '<p>Unbekanntes Rätsel-Typ</p>';
    }
}

// Close Puzzle
function closePuzzle() {
    const interface = document.querySelector('.puzzle-interface');
    interface.style.display = 'none';
    gameState.currentPuzzle = null;
}

// Check Code
function checkCode(puzzleId) {
    const input = document.getElementById('code-input');
    const puzzle = puzzles[puzzleId];
    
    if (input.value === puzzle.solution) {
        solvePuzzle(puzzleId);
    } else {
        addLogEntry('puzzle_fail', puzzleId);
    }
}

// Check Binary
function checkBinary(puzzleId) {
    const input = document.getElementById('binary-input');
    const puzzle = puzzles[puzzleId];
    
    if (input.value === puzzle.solution) {
        solvePuzzle(puzzleId);
    } else {
        addLogEntry('puzzle_fail', puzzleId);
    }
}

// Solve Puzzle
function solvePuzzle(puzzleId) {
    const puzzle = puzzles[puzzleId];
    gameState.completedPuzzles.add(puzzleId);
    
    addLogEntry('puzzle_solve', puzzleId);
    closePuzzle();
    
    // Check if all puzzles are solved
    if (gameState.completedPuzzles.size === Object.keys(puzzles).length) {
        gameWon();
    }
}

// Game Won
function gameWon() {
    gameState.gameOver = true;
    clearInterval(gameState.timerInterval);
    
    addLogEntry('game_won');
    showGameOverScreen(true);
}

// Game Over
function gameOver() {
    gameState.gameOver = true;
    clearInterval(gameState.timerInterval);
    
    addLogEntry('game_over');
    showGameOverScreen(false);
}

// Show Game Over Screen
function showGameOverScreen(won) {
    const container = document.createElement('div');
    container.className = 'game-over-screen';
    container.innerHTML = `
        <div class="game-over-content">
            <h2>${won ? 'Gewonnen!' : 'Zeit abgelaufen!'}</h2>
            <p>Verbleibende Zeit: ${formatTime(gameState.timeRemaining)}</p>
            <p>Gelöste Rätsel: ${gameState.completedPuzzles.size}/${Object.keys(puzzles).length}</p>
            <button onclick="restartGame()">Erneut spielen</button>
        </div>
    `;
    
    document.body.appendChild(container);
}

// Start Timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        if (!gameState.gameOver) {
            gameState.timeRemaining--;
            updateTimer();
            
            if (gameState.timeRemaining <= 0) {
                gameOver();
            }
        }
    }, 1000);
}

// Update Timer
function updateTimer() {
    const display = document.getElementById('time-display');
    if (display) {
        display.textContent = formatTime(gameState.timeRemaining);
    }
}

// Format Time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Add Log Entry
function addLogEntry(type, puzzleId = null) {
    const log = document.querySelector('.log-content');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    let message = '';
    switch (type) {
        case 'game_start':
            message = 'Spiel gestartet';
            break;
        case 'puzzle_open':
            message = `Rätsel geöffnet: ${puzzles[puzzleId].title[gameState.currentLanguage]}`;
            break;
        case 'puzzle_solve':
            message = `Rätsel gelöst: ${puzzles[puzzleId].title[gameState.currentLanguage]}`;
            break;
        case 'puzzle_fail':
            message = `Falscher Versuch: ${puzzles[puzzleId].title[gameState.currentLanguage]}`;
            break;
        case 'game_won':
            message = 'Spiel gewonnen!';
            break;
        case 'game_over':
            message = 'Spiel beendet - Zeit abgelaufen';
            break;
    }
    
    entry.textContent = `${formatTime(gameState.timeRemaining)} - ${message}`;
    log.insertBefore(entry, log.firstChild);
}

// Load Game State
function loadGameState() {
    const savedState = localStorage.getItem('escapeRoomState');
    if (savedState) {
        const state = JSON.parse(savedState);
        gameState.completedPuzzles = new Set(state.completedPuzzles);
        gameState.timeRemaining = state.timeRemaining;
    }
}

// Save Game State
function saveGameState() {
    const state = {
        completedPuzzles: Array.from(gameState.completedPuzzles),
        timeRemaining: gameState.timeRemaining
    };
    localStorage.setItem('escapeRoomState', JSON.stringify(state));
}

// Restart Game
function restartGame() {
    gameState.timeRemaining = 1800;
    gameState.completedPuzzles.clear();
    gameState.gameOver = false;
    gameState.currentPuzzle = null;
    
    // Remove game over screen
    const gameOverScreen = document.querySelector('.game-over-screen');
    if (gameOverScreen) {
        gameOverScreen.remove();
    }
    
    // Reset puzzle interface
    const puzzleInterface = document.querySelector('.puzzle-interface');
    if (puzzleInterface) {
        puzzleInterface.style.display = 'none';
    }
    
    // Clear log
    const log = document.querySelector('.log-content');
    if (log) {
        log.innerHTML = '';
    }
    
    // Start timer
    startTimer();
    addLogEntry('game_start');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame); 