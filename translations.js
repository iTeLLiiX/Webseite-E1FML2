const translations = {
    de: {
        login: {
            title: "Willkommen bei E1FL2",
            subtitle: "Bitte melden Sie sich an, um fortzufahren",
            username: "Benutzername",
            password: "Passwort",
            submit: "Anmelden",
            forgot: "Passwort vergessen?",
            register: "Noch kein Konto? Registrieren",
            error: "Falscher Benutzername oder Passwort"
        },
        dashboard: {
            title: "Dashboard",
            welcome: "Willkommen zurück!",
            progress: "Ihr Fortschritt",
            level: "Ihr Level",
            topics: "Lernbereiche",
            tools: "Tools",
            games: "Lernspiele",
            logout: "Abmelden"
        },
        topics: {
            sql: "SQL-Datenbanken",
            subnetting: "Subnetting & Subnetzmaske",
            binary: "Binär- & Dezimalzahlen",
            prefix: "Präfix-Berechnung"
        },
        tools: {
            binary: "Binärrechner",
            subnet: "Subnetzrechner",
            sql: "SQL-Formatter",
            network: "Netzwerk-Tools"
        },
        games: {
            flashcards: "Karteikarten",
            escape: "Escape Room",
            difficulty: "Schwierigkeitsgrad",
            beginner: "Anfänger",
            advanced: "Fortgeschritten",
            expert: "Experte"
        }
    },
    en: {
        login: {
            title: "Welcome to E1FL2",
            subtitle: "Please login to continue",
            username: "Username",
            password: "Password",
            submit: "Login",
            forgot: "Forgot password?",
            register: "No account? Register",
            error: "Invalid username or password"
        },
        dashboard: {
            title: "Dashboard",
            welcome: "Welcome back!",
            progress: "Your Progress",
            level: "Your Level",
            topics: "Learning Areas",
            tools: "Tools",
            games: "Learning Games",
            logout: "Logout"
        },
        topics: {
            sql: "SQL Databases",
            subnetting: "Subnetting & Subnet Mask",
            binary: "Binary & Decimal Numbers",
            prefix: "Prefix Calculation"
        },
        tools: {
            binary: "Binary Calculator",
            subnet: "Subnet Calculator",
            sql: "SQL Formatter",
            network: "Network Tools"
        },
        games: {
            flashcards: "Flashcards",
            escape: "Escape Room",
            difficulty: "Difficulty Level",
            beginner: "Beginner",
            advanced: "Advanced",
            expert: "Expert"
        }
    },
    ru: {
        login: {
            title: "Добро пожаловать в E1FL2",
            subtitle: "Пожалуйста, войдите для продолжения",
            username: "Имя пользователя",
            password: "Пароль",
            submit: "Войти",
            forgot: "Забыли пароль?",
            register: "Нет аккаунта? Зарегистрироваться",
            error: "Неверное имя пользователя или пароль"
        },
        dashboard: {
            title: "Панель управления",
            welcome: "С возвращением!",
            progress: "Ваш прогресс",
            level: "Ваш уровень",
            topics: "Области обучения",
            tools: "Инструменты",
            games: "Обучающие игры",
            logout: "Выйти"
        },
        topics: {
            sql: "SQL Базы данных",
            subnetting: "Подсети и маска подсети",
            binary: "Двоичные и десятичные числа",
            prefix: "Расчет префикса"
        },
        tools: {
            binary: "Двоичный калькулятор",
            subnet: "Калькулятор подсетей",
            sql: "SQL Форматтер",
            network: "Сетевые инструменты"
        },
        games: {
            flashcards: "Карточки",
            escape: "Квест",
            difficulty: "Уровень сложности",
            beginner: "Начинающий",
            advanced: "Продвинутый",
            expert: "Эксперт"
        }
    },
    so: {
        login: {
            title: "Ku soo dhawoow E1FL2",
            subtitle: "Fadlan geli si aad u sii wadato",
            username: "Magaca isticmaalaha",
            password: "Furaha sirta ah",
            submit: "Geli",
            forgot: "Ma ilowday furaha sirta ah?",
            register: "Ma haysataa xisaab? Is diiwaangeli",
            error: "Magaca ama furaha sirta ah waa khalad"
        },
        dashboard: {
            title: "Dashboard",
            welcome: "Ku soo dhawoow!",
            progress: "Hagaajintaada",
            level: "Heerkaaga",
            topics: "Qaybaha Barashada",
            tools: "Qalabka",
            games: "Ciyaaraha Barashada",
            logout: "Ka bax"
        },
        topics: {
            sql: "SQL Databases",
            subnetting: "Subnetting & Subnet Mask",
            binary: "Lambarada Binary & Decimal",
            prefix: "Xisaabinta Prefix"
        },
        tools: {
            binary: "Calculator Binary",
            subnet: "Calculator Subnet",
            sql: "SQL Formatter",
            network: "Qalabka Network"
        },
        games: {
            flashcards: "Kartarka",
            escape: "Qolka Bixitaanka",
            difficulty: "Heerka Dhibaatada",
            beginner: "Bilowga",
            advanced: "Kor u kacay",
            expert: "Khabiir"
        }
    }
};

// Function to change language
function changeLanguage(lang) {
    document.documentElement.lang = lang;
    const elements = document.querySelectorAll('[data-translate]');

    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const keys = key.split('.');
        let value = translations[lang];

        for (const k of keys) {
            value = value[k];
        }

        if (value) {
            element.textContent = value;
        }
    });

    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Load preferred language on page load
document.addEventListener('DOMContentLoaded', () => {
    const preferredLang = localStorage.getItem('preferredLanguage') || 'de';
    changeLanguage(preferredLang);
}); 