document.addEventListener("DOMContentLoaded", () => {
    const homeContainer = document.getElementById("home");
    const gameContainer = document.getElementById("game");
    const difficultyButtons = document.querySelectorAll(".difficulty-btn");
    const questionCountButtons = document.querySelectorAll(".question-count-btn");
    const startGameBtn = document.getElementById("start-game");
    const loginInput = document.getElementById("login-input");
    const toggleTextBtn = document.getElementById("toggle-text");
    const toggleFullscreenBtn = document.getElementById("toggle-fullscreen");
    const toggleReduceBtn = document.getElementById("toggle-reduce");
    const textPanel = document.getElementById("text-panel");
    const avatar = document.getElementById("avatar");
    const rulesBtn = document.getElementById("rules-btn");
    const rulesPanel = document.getElementById("rules-panel");
    const closeRulesBtn = document.getElementById("close-rules");

    let selectedLevel = null;
    let questionCount = null;
    let playerLogin = null;
    let isFullscreen = false;

    // Gestion du bouton "Règles du jeu"
    rulesBtn.addEventListener("click", () => {
        rulesPanel.style.display = "block";
    });

    // Gestion du bouton "Fermer" du panneau des règles
    closeRulesBtn.addEventListener("click", () => {
        rulesPanel.style.display = "none";
    });

    // Gestion du bouton "Afficher/Masquer le texte"
    toggleTextBtn.addEventListener("click", () => {
        const isHidden = textPanel.style.display === "none" || textPanel.style.display === "";
        textPanel.style.display = isHidden ? "block" : "none";
        textPanel.classList.toggle("visible", isHidden);
        toggleTextBtn.textContent = isHidden ? "Masquer le texte" : "Afficher le texte";
    });

    // Gestion du bouton "Plein écran"
    toggleFullscreenBtn.addEventListener("click", () => {
        avatar.classList.add("fullscreen");
        toggleFullscreenBtn.style.display = "none"; // Cacher "Plein écran"
        toggleReduceBtn.style.display = "block"; // Afficher "Réduire"
        toggleTextBtn.style.display = "none"; // Cacher "Afficher le texte"
        isFullscreen = true;
    });

    // Gestion du bouton "Réduire"
    toggleReduceBtn.addEventListener("click", () => {
        avatar.classList.remove("fullscreen");
        toggleFullscreenBtn.style.display = "block"; // Afficher "Plein écran"
        toggleReduceBtn.style.display = "none"; // Cacher "Réduire"
        toggleTextBtn.style.display = "block"; // Réafficher "Afficher le texte"
        isFullscreen = false;
    });

    difficultyButtons.forEach(button => {
        button.addEventListener("click", () => {
            difficultyButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedLevel = button.dataset.level;
            checkReadyToStart();
        });
    });

    questionCountButtons.forEach(button => {
        button.addEventListener("click", () => {
            questionCountButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            questionCount = parseInt(button.dataset.count);
            checkReadyToStart();
        });
    });

    loginInput.addEventListener("input", () => {
        playerLogin = loginInput.value.trim();
        checkReadyToStart();
    });

    function checkReadyToStart() {
        if (selectedLevel && questionCount && playerLogin) {
            startGameBtn.style.display = "block";
        } else {
            startGameBtn.style.display = "none";
        }
    }

    startGameBtn.addEventListener("click", () => {
        homeContainer.parentElement.style.display = "none";
        gameContainer.style.display = "flex";
        startGame(selectedLevel, questionCount, playerLogin);
    });

    // Gestion de l'avatar avec des GIF
    let state = "neutral";
    let neutralToggle = true; // Pour alterner entre les deux GIF neutres
    let idleFrame = 0;

    // Fonction pour mettre à jour l'image de l'avatar en fonction de l'état
    function updateAvatar() {
        if (state === "neutral") {
            avatar.src = "GIF_EMOTIONS/QT_QT_neutral_state_blinking.gif";
        } else if (state === "good") {
            avatar.src = "GIF_EMOTIONS/QT_QT_happy.gif";
        } else if (state === "bad") {
            avatar.src = "GIF_EMOTIONS/QT_QT_cry.gif";
        } else if (state === "talk") {
            avatar.src = "GIF_EMOTIONS/QT_QT_talking.gif";
        } else if (state === "confused") {
            avatar.src = "GIF_EMOTIONS/QT_QT_confused.gif";
        }
    }

    // Animation pour l'état neutre (alternance des GIF)
    function animateNeutral() {
        if (state === "neutral") {
            idleFrame++;
            updateAvatar();
        }
        requestAnimationFrame(animateNeutral);
    }

    // Lancer l'animation pour l'état neutre
    animateNeutral();

    // Fonctions pour changer l'état de l'avatar
    function setTalk() {
        state = "talk";
        updateAvatar();
    }

    function setGoodAnswer() {
        state = "good";
        updateAvatar();
        setTimeout(() => {
            state = "neutral";
            updateAvatar();
        }, 2600); // Durée approximative du GIF
    }

    function setBadAnswer() {
        state = "bad";
        updateAvatar();
        setTimeout(() => {
            state = "neutral";
            updateAvatar();
        }, 2600); // Durée approximative du GIF
    }

    function setConfused() {
        state = "confused";
        updateAvatar();
        setTimeout(() => {
            state = "neutral";
            updateAvatar();
        }, 2600); // Durée approximative du GIF
    }

    // Logique du jeu
    function startGame(difficulty, totalQuestions, login) {
        const message = document.getElementById("message");
        const timerDisplay = document.getElementById("timer");
        const scoreDisplay = document.getElementById("score");
        const highScoreDisplay = document.getElementById("highScore");
        const progressDisplay = document.getElementById("progress");
        const questionText = document.getElementById("question-text");
        const correctSound = document.getElementById("correctSound");
        const wrongSound = document.getElementById("wrongSound");
        const qcmOptions = document.getElementById("qcm-options");
        const backToHomeBtn = document.getElementById("back-to-home");

        let correctAnswer = 0;
        let score = 0;
        let highScore = parseInt(localStorage.getItem("highScore")) || 0;
        let currentQuestion = 1;
        let countdown;
        const TIME_LIMIT = 15;

        scoreDisplay.textContent = `Score : ${score}`;
        highScoreDisplay.textContent = `Meilleur score : ${highScore}`;
        progressDisplay.textContent = `Question ${currentQuestion}/${totalQuestions}`;
        questionText.textContent = "Question : Préparez-vous...";
        message.textContent = "Préparez-vous...";
        textPanel.style.display = "none";
        textPanel.classList.remove("visible");
        toggleTextBtn.textContent = "Afficher le texte";

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            message.textContent = "Votre navigateur ne supporte pas la reconnaissance vocale.";
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "fr-FR";
        recognition.interimResults = false;
        recognition.continuous = false;

        function speak(text, callback) {
            setTalk();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "fr-FR";
            utterance.rate = 1.1;
            utterance.volume = 1.0;
            utterance.onend = () => {
                state = "neutral";
                updateAvatar();
                if (callback) callback();
            };
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
                    message.textContent = `Temps écoulé ! Réponse : ${correctAnswer}`;
                    speak(`Temps écoulé ! La réponse était ${correctAnswer}`);
                    wrongSound.play();
                    setBadAnswer();
                    qcmOptions.childNodes.forEach(btn => {
                        if (parseInt(btn.textContent) === correctAnswer) btn.classList.add("correct");
                    });
                    recognition.stop();
                    setTimeout(nextQuestion, 2000);
                }
            }, 1000);
        }

        function stopTimer() {
            clearInterval(countdown);
            timerDisplay.textContent = `Temps restant : ${TIME_LIMIT}s`;
        }

        function generateQCMOptions(correct) {
            qcmOptions.innerHTML = "";
            const options = [correct];
            while (options.length < 4) {
                const randomOffset = Math.floor(Math.random() * 10) + 1;
                const wrongAnswer = correct + (Math.random() > 0.5 ? randomOffset : -randomOffset);
                if (!options.includes(wrongAnswer) && wrongAnswer >= 0) options.push(wrongAnswer);
            }
            options.sort(() => Math.random() - 0.5);
            options.forEach(opt => {
                const btn = document.createElement("button");
                btn.textContent = opt;
                btn.addEventListener("click", () => checkQCMAnswer(opt));
                qcmOptions.appendChild(btn);
            });
        }

        function checkQCMAnswer(userAnswer) {
            stopTimer();
            recognition.stop();
            qcmOptions.childNodes.forEach(btn => {
                if (parseInt(btn.textContent) === correctAnswer) btn.classList.add("correct");
                else if (parseInt(btn.textContent) === userAnswer) btn.classList.add("wrong");
            });
            if (userAnswer === correctAnswer) {
                score++;
                scoreDisplay.textContent = `Score : ${score}`;
                message.textContent = "Bravo !";
                questionText.textContent = `Question : Bravo !`;
                correctSound.play();
                speak("Bonne réponse !");
                setGoodAnswer();
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem("highScore", highScore);
                    highScoreDisplay.textContent = `Meilleur score : ${highScore}`;
                }
            } else {
                message.textContent = `Faux ! Réponse : ${correctAnswer}`;
                questionText.textContent = `Question : Faux ! Réponse : ${correctAnswer}`;
                wrongSound.play();
                speak(`Faux ! La réponse était ${correctAnswer}`);
                setBadAnswer();
            }
            setTimeout(nextQuestion, 2000);
        }

        function generateMathProblem() {
            let num1, num2, operator, spokenOperator;
            switch (difficulty) {
                case "facile":
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                    operator = "+";
                    spokenOperator = "plus";
                    correctAnswer = num1 + num2;
                    break;
                case "moyen":
                    num1 = Math.floor(Math.random() * 50) + 1;
                    num2 = Math.floor(Math.random() * 50) + 1;
                    operator = Math.random() > 0.5 ? "+" : "-";
                    spokenOperator = operator === "+" ? "plus" : "moins";
                    correctAnswer = operator === "+" ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2);
                    break;
                case "difficile":
                    num1 = Math.floor(Math.random() * 100) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                    operator = Math.random() > 0.5 ? "*" : "/";
                    spokenOperator = operator === "*" ? "multiplié par" : "divisé par";
                    if (operator === "/") {
                        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
                        correctAnswer = num1 / num2;
                    } else {
                        correctAnswer = num1 * num2;
                    }
                    break;
            }

            const questionTextDisplay = `${num1} ${operator} ${num2}`; // Pour l'affichage
            const questionSpoken = `${num1} ${spokenOperator} ${num2}`; // Pour la synthèse vocale
            message.textContent = `Résolvez : ${questionTextDisplay}`;
            questionText.textContent = `Question : ${questionTextDisplay}`;
            generateQCMOptions(correctAnswer);
            stopTimer();
            startTimer();
            speak(`Quel est le résultat de ${questionSpoken} ?`, () => {
                if (currentQuestion <= totalQuestions) recognition.start();
            });
        }

        function nextQuestion() {
            currentQuestion++;
            progressDisplay.textContent = `Question ${currentQuestion}/${totalQuestions}`;
            if (currentQuestion <= totalQuestions) {
                generateMathProblem();
            } else {
                endGame();
            }
        }

        function endGame() {
            message.textContent = `Jeu terminé, ${login} ! Score : ${score}/${totalQuestions}`;
            questionText.textContent = `Question : Jeu terminé ! Score : ${score}/${totalQuestions}`;
            speak(`Jeu terminé, ${login} ! Votre score est de ${score} sur ${totalQuestions}`);
            timerDisplay.style.display = "none";
            progressDisplay.style.display = "none";
            qcmOptions.innerHTML = "";
            recognition.stop();
        }

        backToHomeBtn.addEventListener("click", () => {
            gameContainer.style.display = "none";
            homeContainer.parentElement.style.display = "flex";
            timerDisplay.style.display = "block";
            progressDisplay.style.display = "block";
            qcmOptions.innerHTML = "";
            startGameBtn.style.display = "none";
            difficultyButtons.forEach(btn => btn.classList.remove("selected"));
            questionCountButtons.forEach(btn => btn.classList.remove("selected"));
            currentQuestion = 1;
            score = 0;
            scoreDisplay.textContent = `Score : ${score}`;
            progressDisplay.textContent = `Question ${currentQuestion}/${totalQuestions}`;
            questionText.textContent = "Question : Préparez-vous...";
            message.textContent = "Préparez-vous...";
            selectedLevel = null;
            questionCount = null;
            playerLogin = null;
            loginInput.value = "";
            recognition.stop();
            clearInterval(countdown);
            state = "neutral";
            updateAvatar();
            textPanel.style.display = "none";
            textPanel.classList.remove("visible");
            toggleTextBtn.textContent = "Afficher le texte";
            toggleTextBtn.style.display = "block"; // Réafficher "Afficher le texte"
            // Réinitialiser le mode plein écran
            avatar.classList.remove("fullscreen");
            toggleFullscreenBtn.style.display = "block";
            toggleReduceBtn.style.display = "none";
            isFullscreen = false;
        });

        recognition.onresult = (event) => {
            stopTimer();
            recognition.stop();
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            const userAnswer = parseInt(transcript);
            if (!isNaN(userAnswer) && correctAnswer !== 0) {
                checkQCMAnswer(userAnswer);
            } else {
                message.textContent = "Je n'ai pas compris, répétez.";
                speak("Je n'ai pas compris, répétez.", () => {
                    if (currentQuestion <= totalQuestions) recognition.start();
                });
                setConfused();
            }
        };

        recognition.onerror = (event) => {
            stopTimer();
            recognition.stop();
            if (event.error !== "aborted") {
                message.textContent = `Erreur de reconnaissance : ${event.error}. Réessayez.`;
                speak("Erreur, réessayez.", () => {
                    if (currentQuestion <= totalQuestions) recognition.start();
                });
                setConfused();
            }
        };

        generateMathProblem();
    }
});