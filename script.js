const startButton = document.getElementById("start");
const message = document.getElementById("message");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const timerDisplay = document.getElementById("timer"); 
const highScoreDisplay = document.getElementById("highScore"); 

let correctAnswer = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; 
let difficulty = "";
let countdown;
// Temps limite pour répondre (en secondes)
const TIME_LIMIT = 15; 

// Affiche le meilleur score au démarrage
highScoreDisplay.textContent = `Meilleur score : ${highScore}`;

// Vérifier si le navigateur supporte l'API Web Speech
if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
} else {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        speechSynthesis.speak(utterance);
    }

    function startTimer() {
        let timeLeft = TIME_LIMIT;
        timerDisplay.textContent = `Temps restant : ${timeLeft}s`;

        countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Temps restant : ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                message.textContent = `Temps écoulé ! Le bon résultat était ${correctAnswer}.`;
                speak(`Temps écoulé ! Le bon résultat était ${correctAnswer}.`);
                setTimeout(generateMathProblem, 2000);
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(countdown);
    }

    function generateMathProblem() {
        let num1, num2, operator;

        if (difficulty === "facile") {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            operator = "+";
            correctAnswer = num1 + num2;
        } else if (difficulty === "moyen") {
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            operator = Math.random() > 0.5 ? "+" : "-";

            if (operator === "-") {
                if (num1 < num2) [num1, num2] = [num2, num1];
                correctAnswer = num1 - num2;
            } else {
                correctAnswer = num1 + num2;
            }
        } else if (difficulty === "difficile") {
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            operator = Math.random() > 0.5 ? "*" : "/";

            if (operator === "*") {
                correctAnswer = num1 * num2;
            } else {
                num1 = num2 * (Math.floor(Math.random() * 10) + 1);
                correctAnswer = num1 / num2;
            }
        } else {
            message.textContent = "Dites 'facile', 'moyen' ou 'difficile' pour choisir.";
            speak("Dites facile, moyen ou difficile.");
            return;
        }

        message.textContent = `Résolvez : ${num1} ${operator} ${num2}`;
        speak(`Quel est le résultat de ${num1} ${operator} ${num2} ?`);

        stopTimer();
        startTimer();
        recognition.start();
    }

    startButton.addEventListener("click", () => {
        message.textContent = "Parlez...";
        recognition.start();
    });

    recognition.onresult = (event) => {
        stopTimer();
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Reconnu :", transcript);

        if (["facile", "moyen", "difficile"].includes(transcript)) {
            difficulty = transcript;
            message.textContent = "Difficulté choisie : " + difficulty;
            speak("Difficulté " + difficulty + " choisie.");
            setTimeout(generateMathProblem, 2000);
        } else {
            let userAnswer = parseInt(transcript);
            if (!isNaN(userAnswer)) {
                if (userAnswer === correctAnswer) {
                    score++;
                    message.textContent = `Bravo ! Score : ${score}`;
                    correctSound.play();
                    speak("Bonne réponse !");

                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem("highScore", highScore);
                        highScoreDisplay.textContent = `Meilleur score : ${highScore}`;
                    }
                } else {
                    message.textContent = `Mauvaise réponse. Le bon résultat était ${correctAnswer}. Score : ${score}`;
                    wrongSound.play();
                    speak(`Mauvaise réponse. Le bon résultat était ${correctAnswer}.`);
                }
                setTimeout(generateMathProblem, 2000);
            } else {
                message.textContent = "Je n'ai pas compris, peux-tu répéter ?";
                speak("Je n'ai pas compris, peux-tu répéter ?");
                recognition.start();
            }
        }
    };

    recognition.onerror = (event) => {
        message.textContent = "Erreur de reconnaissance : " + event.error;
    };

}
