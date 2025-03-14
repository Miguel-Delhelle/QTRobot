const startButton = document.getElementById("start");
const message = document.getElementById("message");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

let correctAnswer = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let difficulty = "";
let countdown;
const TIME_LIMIT = 15;

// Initialisation des affichages
scoreDisplay.textContent = `Score : ${score}`;
highScoreDisplay.textContent = `Meilleur score : ${highScore}`;

// Vérification de la compatibilité Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    message.textContent = "Votre navigateur ne supporte pas la reconnaissance vocale.";
    startButton.disabled = true;
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Fonction pour parler
    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        utterance.rate = 1.1; // Légère accélération pour plus de dynamisme
        speechSynthesis.speak(utterance);
    }

    // Gestion du minuteur
    function startTimer() {
        let timeLeft = TIME_LIMIT;
        timerDisplay.textContent = `Temps restant : ${timeLeft}s`;

        countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Temps restant : ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                message.textContent = `Temps écoulé ! Réponse : ${correctAnswer}`;
                speak(`Temps écoulé ! La réponse était ${correctAnswer}`);
                wrongSound.play();
                setTimeout(generateMathProblem, 2000);
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(countdown);
        timerDisplay.textContent = `Temps restant : ${TIME_LIMIT}s`;
    }

    // Génération des problèmes mathématiques
    function generateMathProblem() {
        let num1, num2, operator;

        if (!difficulty) {
            message.textContent = "Dites 'facile', 'moyen' ou 'difficile' pour choisir.";
            speak("Dites facile, moyen ou difficile pour commencer.");
            return;
        }

        switch (difficulty) {
            case "facile":
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operator = "+";
                correctAnswer = num1 + num2;
                break;
            case "moyen":
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                operator = Math.random() > 0.5 ? "+" : "-";
                correctAnswer = operator === "+" ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2);
                break;
            case "difficile":
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operator = Math.random() > 0.5 ? "*" : "/";
                if (operator === "/") {
                    num1 = num2 * (Math.floor(Math.random() * 10) + 1); // Assure un résultat entier
                    correctAnswer = num1 / num2;
                } else {
                    correctAnswer = num1 * num2;
                }
                break;
        }

        message.textContent = `Résolvez : ${num1} ${operator} ${num2}`;
        speak(`Quel est le résultat de ${num1} ${operator} ${num2} ?`);
        stopTimer();
        startTimer();
        recognition.start();
    }

    // Événement du bouton "Commencer"
    startButton.addEventListener("click", () => {
        stopTimer();
        message.textContent = "Parlez...";
        recognition.start();
    });

    // Gestion des résultats de la reconnaissance vocale
    recognition.onresult = (event) => {
        stopTimer();
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        console.log("Reconnu :", transcript);

        if (["facile", "moyen", "difficile"].includes(transcript)) {
            difficulty = transcript;
            message.textContent = `Difficulté choisie : ${difficulty}`;
            speak(`Difficulté ${difficulty} choisie`);
            setTimeout(generateMathProblem, 1000);
        } else {
            const userAnswer = parseInt(transcript);
            if (!isNaN(userAnswer) && correctAnswer !== 0) {
                if (userAnswer === correctAnswer) {
                    score++;
                    scoreDisplay.textContent = `Score : ${score}`;
                    message.textContent = "Bravo !";
                    correctSound.play();
                    speak("Bonne réponse !");
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem("highScore", highScore);
                        highScoreDisplay.textContent = `Meilleur score : ${highScore}`;
                    }
                } else {
                    message.textContent = `Faux ! Réponse : ${correctAnswer}`;
                    wrongSound.play();
                    speak(`Faux ! La réponse était ${correctAnswer}`);
                }
                setTimeout(generateMathProblem, 2000);
            } else {
                message.textContent = "Je n'ai pas compris, répétez.";
                speak("Je n'ai pas compris, répétez.");
                setTimeout(() => recognition.start(), 500);
            }
        }
    };

    recognition.onerror = (event) => {
        stopTimer();
        message.textContent = `Erreur : ${event.error}. Réessayez.`;
        speak("Erreur de reconnaissance, réessayez.");
        setTimeout(() => recognition.start(), 1000);
    };

    recognition.onend = () => {
        if (!difficulty) recognition.start(); // Relance si aucune difficulté n'est choisie
    };
}