// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Update progress bar
function updateProgress() {
    const progress = localStorage.getItem('binary_progress') || 0;
    const progressBar = document.getElementById('binary-progress');
    const progressText = document.getElementById('progress-text');

    if (progressBar && progressText) {
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
    }
}

// Show theory content
function showTheory(section) {
    const theoryContent = document.querySelectorAll('.theory-content');
    theoryContent.forEach(content => {
        content.style.display = 'none';
    });

    const selectedContent = document.querySelector(`.theory-card:nth-child(${section}) .theory-content`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
}

// Convert decimal to binary
function convertToBinary() {
    const decimalInput = document.getElementById('decimal-input');
    const binaryInput = document.getElementById('binary-input');
    const calculationSteps = document.getElementById('calculation-steps');
    const decimal = parseInt(decimalInput.value);

    if (isNaN(decimal)) {
        showNotification('Bitte geben Sie eine gültige Dezimalzahl ein.', 'error');
        return;
    }

    let steps = [];
    let num = decimal;
    let binary = '';

    while (num > 0) {
        const remainder = num % 2;
        binary = remainder + binary;
        steps.push(`${num} ÷ 2 = ${Math.floor(num / 2)} Rest ${remainder}`);
        num = Math.floor(num / 2);
    }

    if (binary === '') binary = '0';

    binaryInput.value = binary;
    calculationSteps.innerHTML = steps.map(step => `<div>${step}</div>`).join('');
}

// Convert binary to decimal
function convertToDecimal() {
    const decimalInput = document.getElementById('decimal-input');
    const binaryInput = document.getElementById('binary-input');
    const calculationSteps = document.getElementById('calculation-steps');
    const binary = binaryInput.value;

    if (!/^[01]+$/.test(binary)) {
        showNotification('Bitte geben Sie eine gültige Binärzahl ein (nur 0 und 1).', 'error');
        return;
    }

    let steps = [];
    let decimal = 0;
    let power = 1;

    for (let i = binary.length - 1; i >= 0; i--) {
        const digit = parseInt(binary[i]);
        decimal += digit * power;
        steps.push(`${digit} × ${power} = ${digit * power}`);
        power *= 2;
    }

    decimalInput.value = decimal;
    calculationSteps.innerHTML = steps.map(step => `<div>${step}</div>`).join('');
}

// Show hint for exercise
function showHint(exerciseId) {
    const hintContent = document.getElementById(`hint-${exerciseId}`);
    if (hintContent) {
        hintContent.style.display = hintContent.style.display === 'none' ? 'block' : 'none';
    }
}

// Quiz functionality
let currentQuestion = 1;
const totalQuestions = 5;
const questions = [
    {
        question: 'Was ist die Dezimalzahl für die Binärzahl 1010?',
        options: [
            '8',
            '10',
            '12',
            '14'
        ],
        correct: 1
    },
    {
        question: 'Was ist die Binärzahl für die Dezimalzahl 42?',
        options: [
            '101010',
            '110010',
            '100110',
            '111000'
        ],
        correct: 0
    },
    {
        question: 'Wie viele Bits hat ein Byte?',
        options: [
            '4',
            '6',
            '8',
            '10'
        ],
        correct: 2
    },
    {
        question: 'Was ist das Ergebnis der binären Addition: 1010 + 0101?',
        options: [
            '1110',
            '1111',
            '10011',
            '10111'
        ],
        correct: 1
    },
    {
        question: 'Was ist das Ergebnis der binären Subtraktion: 1100 - 0110?',
        options: [
            '0100',
            '0110',
            '1000',
            '1010'
        ],
        correct: 1
    }
];

function checkAnswer(selectedOption) {
    const feedback = document.getElementById('quiz-feedback');
    const currentQ = questions[currentQuestion - 1];

    if (selectedOption === currentQ.correct) {
        feedback.className = 'quiz-feedback correct';
        feedback.textContent = 'Richtig!';
        updateProgress();
    } else {
        feedback.className = 'quiz-feedback incorrect';
        feedback.textContent = 'Falsch. Versuche es noch einmal!';
    }

    setTimeout(() => {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            loadQuestion();
        } else {
            showQuizComplete();
        }
    }, 1500);
}

function loadQuestion() {
    const currentQ = questions[currentQuestion - 1];
    const questionElement = document.getElementById('quiz-question');
    const optionsContainer = questionElement.querySelector('.quiz-options');
    const currentQuestionSpan = document.getElementById('current-question');
    const quizProgress = document.getElementById('quiz-progress');

    questionElement.querySelector('h3').textContent = currentQ.question;
    optionsContainer.innerHTML = '';

    currentQ.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    currentQuestionSpan.textContent = currentQuestion;
    quizProgress.style.width = `${(currentQuestion / totalQuestions) * 100}%`;
}

function showQuizComplete() {
    const quizContainer = document.querySelector('.quiz-container');
    const score = Math.round((currentQuestion / totalQuestions) * 100);

    quizContainer.innerHTML = `
        <h2>Quiz abgeschlossen!</h2>
        <p>Dein Ergebnis: ${score}%</p>
        <button onclick="restartQuiz()" class="quiz-btn">Quiz wiederholen</button>
    `;
}

function restartQuiz() {
    currentQuestion = 1;
    loadQuestion();
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
    loadQuestion();

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
}); 