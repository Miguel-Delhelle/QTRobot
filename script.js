document.addEventListener("DOMContentLoaded", () => {
    // Références DOM
    const elements = {
        home: document.getElementById("home"),
        game: document.getElementById("game"),
        difficultyButtons: document.querySelectorAll(".difficulty-btn"),
        questionCountButtons: document.querySelectorAll(".question-count-btn"),
        startGameBtn: document.getElementById("start-game"),
        loginInput: document.getElementById("login-input"),
        loginError: document.getElementById("login-error"),
        toggleTextBtn: document.getElementById("toggle-text"),
        toggleFullscreenBtn: document.getElementById("toggle-fullscreen"),
        toggleReduceBtn: document.getElementById("toggle-reduce"),
        textPanel: document.getElementById("text-panel"),
        avatar: document.getElementById("avatar"),
        rulesBtn: document.getElementById("rules-btn"),
        rulesPanel: document.getElementById("rules-panel"),
        closeRulesBtn: document.getElementById("close-rules"),
        leaderboardList: document.getElementById("leaderboard-list"),
        message: document.getElementById("message"),
        timerDisplay: document.getElementById("timer"),
        scoreDisplay: document.getElementById("score"),
        highScoreDisplay: document.getElementById("highScore"),
        progressDisplay: document.getElementById("progress"),
        questionText: document.getElementById("question-text"),
        correctSound: document.getElementById("correctSound"),
        wrongSound: document.getElementById("wrongSound"),
        qcmOptions: document.getElementById("qcm-options"),
        backToHomeBtn: document.getElementById("back-to-home")
    };

    // État initial
    let state = {
        selectedLevel: null,
        questionCount: null,
        playerLogin: null,
        isFullscreen: false,
        avatarState: "neutral",
        currentQuestion: 1,
        score: 0,
        highScore: parseInt(localStorage.getItem("highScore")) || 0,
        countdown: null,
        correctAnswer: 0,
        totalQuestions: 0
    };

    // Gestion du classement
    function updateLeaderboard(score = null) {
        let leaderboard = [];
        
        // Essayer de charger le classement depuis localStorage
        try {
            const stored = localStorage.getItem("leaderboard");
            if (stored) {
                leaderboard = JSON.parse(stored);
                // Vérifier que leaderboard est un tableau valide
                if (!Array.isArray(leaderboard)) {
                    leaderboard = [];
                }
            }
        } catch (e) {
            console.error("Erreur lors du chargement du classement :", e);
            leaderboard = [];
        }

        // Ajouter un nouveau score si fourni
        if (score !== null && state.playerLogin) {
            leaderboard.push({ name: state.playerLogin, score });
        }

        // Trier le classement (du plus grand au plus petit score)
        leaderboard.sort((a, b) => {
            // Gérer les cas où score est undefined ou non numérique
            const scoreA = Number(a.score) || 0;
            const scoreB = Number(b.score) || 0;
            return scoreB - scoreA;
        });

        // Limiter à 10 entrées
        leaderboard = leaderboard.slice(0, 10);

        // Sauvegarder dans localStorage
        try {
            localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        } catch (e) {
            console.error("Erreur lors de la sauvegarde du classement :", e);
        }

        // Afficher le classement
        elements.leaderboardList.innerHTML = leaderboard.map((entry, i) => `
            <li>
                <span class="position">${i + 1}</span>
                <span class="avatar">${entry.name ? entry.name.charAt(0) : '?'}</span>
                <span class="name">${entry.name || 'Inconnu'}</span>
                <span class="score">${entry.score ?? 0}/${state.totalQuestions || 20}</span>
            </li>
        `).join("");
    }

    // Générer un classement initial si vide
    try {
        if (!localStorage.getItem("leaderboard")) {
            const fakeNames = ["Alex", "Luna", "Max", "Sophie", "Tom", "Emma", "Leo", "Julia", "Sam", "Chloe"];
            const fakeLeaderboard = fakeNames.map(name => ({
                name,
                score: Math.floor(Math.random() * 21)
            }));
            localStorage.setItem("leaderboard", JSON.stringify(fakeLeaderboard));
        }
    } catch (e) {
        console.error("Erreur lors de l'initialisation du classement :", e);
    }
    updateLeaderboard();

    // Gestion des règles
    elements.rulesBtn.addEventListener("click", () => {
        elements.rulesPanel.style.display = "block";
    });

    elements.closeRulesBtn.addEventListener("click", () => {
        elements.rulesPanel.style.display = "none";
    });

    // Gestion du panneau de texte
    elements.toggleTextBtn.addEventListener("click", () => {
        const isHidden = elements.textPanel.style.display === "none";
        elements.textPanel.style.display = isHidden ? "block" : "none";
        elements.textPanel.classList.toggle("visible", isHidden);
        elements.toggleTextBtn.textContent = isHidden ? "Masquer le texte" : "Afficher le texte";
    });

    // Gestion du mode plein écran
    elements.toggleFullscreenBtn.addEventListener("click", () => {
        elements.avatar.classList.add("fullscreen");
        elements.toggleFullscreenBtn.style.display = "none";
        elements.toggleReduceBtn.style.display = "block";
        elements.toggleTextBtn.style.display = "none";
        state.isFullscreen = true;
    });

    elements.toggleReduceBtn.addEventListener("click", () => {
        elements.avatar.classList.remove("fullscreen");
        elements.toggleFullscreenBtn.style.display = "block";
        elements.toggleReduceBtn.style.display = "none";
        elements.toggleTextBtn.style.display = "block";
        state.isFullscreen = false;
    });

    // Sélection des options
    elements.difficultyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            elements.difficultyButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            state.selectedLevel = btn.dataset.level;
            checkReadyToStart();
        });
    });

    elements.questionCountButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            elements.questionCountButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            state.questionCount = parseInt(btn.dataset.count);
            checkReadyToStart();
        });
    });

    elements.loginInput.addEventListener("input", () => {
        state.playerLogin = elements.loginInput.value.trim();
        elements.loginError.style.display = state.playerLogin ? "none" : "block";
        checkReadyToStart();
    });

    function checkReadyToStart() {
        elements.startGameBtn.style.display = state.selectedLevel && state.questionCount && state.playerLogin ? "block" : "none";
    }

    // Gestion de l'avatar
    const avatarStates = {
        neutral: "GIF_EMOTIONS/QT_QT_neutral_state_blinking.gif",
        good: "GIF_EMOTIONS/QT_QT_happy.gif",
        bad: "GIF_EMOTIONS/QT_QT_cry.gif",
        talk: "GIF_EMOTIONS/QT_QT_talking.gif",
        confused: "GIF_EMOTIONS/QT_QT_confused.gif"
    };

    function updateAvatar(newState) {
        state.avatarState = newState;
        elements.avatar.src = avatarStates[newState];
        elements.avatar.alt = `Avatar ${newState}`;
    }

    function animateAvatar() {
        if (state.avatarState === "neutral") {
            updateAvatar("neutral");
        }
        requestAnimationFrame(animateAvatar);
    }

    animateAvatar();

    // Gestion des états temporaires
    function setTemporaryState(newState, duration = 2600) {
        updateAvatar(newState);
        setTimeout(() => updateAvatar("neutral"), duration);
    }

    // Logique du jeu
    function startGame(difficulty, totalQuestions, login) {
        state.totalQuestions = totalQuestions;
        elements.home.parentElement.style.display = "none";
        elements.game.style.display = "flex";
        elements.scoreDisplay.textContent = `Score : ${state.score}`;
        elements.highScoreDisplay.textContent = `Meilleur score : ${state.highScore}`;
        elements.progressDisplay.textContent = `Question ${state.currentQuestion}/${totalQuestions}`;
        elements.questionText.textContent = "Question : Préparez-vous...";
        elements.message.textContent = "Préparez-vous...";
        elements.textPanel.style.display = "none";
        elements.textPanel.classList.remove("visible");
        elements.toggleTextBtn.textContent = "Afficher le texte";

        const TIME_LIMIT = 15;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = SpeechRecognition ? new SpeechRecognition() : null;

        if (!SpeechRecognition) {
            elements.message.textContent = "La reconnaissance vocale n'est pas supportée par votre navigateur.";
            return;
        }

        recognition.lang = "fr-FR";
        recognition.interimResults = false;
        recognition.continuous = false;

        function speak(text, callback) {
            updateAvatar("talk");
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "fr-FR";
            utterance.rate = 1.1;
            utterance.volume = 1.0;
            utterance.onend = () => {
                updateAvatar("neutral");
                if (callback) callback();
            };
            speechSynthesis.speak(utterance);
        }

        function startTimer() {
            let timeLeft = TIME_LIMIT;
            elements.timerDisplay.textContent = `Temps restant : ${timeLeft}s`;
            state.countdown = setInterval(() => {
                timeLeft--;
                elements.timerDisplay.textContent = `Temps restant : ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(state.countdown);
                    state.countdown = null;
                    recognition.stop();
                    elements.message.textContent = `Temps écoulé ! Réponse : ${state.correctAnswer}`;
                    elements.questionText.textContent = `Question : Temps écoulé ! Réponse : ${state.correctAnswer}`;
                    speak(`Temps écoulé ! La réponse était ${state.correctAnswer}`);
                    elements.wrongSound.play();
                    setTemporaryState("bad");
                    highlightCorrectAnswer();
                    setTimeout(nextQuestion, 2000);
                }
            }, 1000);
        }
        
        function stopTimer() {
            clearInterval(state.countdown);
            state.countdown = null;
            elements.timerDisplay.textContent = `Temps restant : ${TIME_LIMIT}s`;
        }

        function highlightCorrectAnswer() {
            elements.qcmOptions.childNodes.forEach(btn => {
                if (parseInt(btn.textContent) === state.correctAnswer) btn.classList.add("correct");
            });
        }

        function generateQCMOptions(correct) {
            elements.qcmOptions.innerHTML = "";
            const options = [correct];
            while (options.length < 4) {
                const offset = Math.floor(Math.random() * 10) + 1;
                const wrongAnswer = correct + (Math.random() > 0.5 ? offset : -offset);
                if (!options.includes(wrongAnswer) && wrongAnswer >= 0) options.push(wrongAnswer);
            }
            options.sort(() => Math.random() - 0.5);
            options.forEach(opt => {
                const btn = document.createElement("button");
                btn.textContent = opt;
                btn.addEventListener("click", () => checkQCMAnswer(opt));
                elements.qcmOptions.appendChild(btn);
            });
        }

        function checkQCMAnswer(userAnswer) {
            stopTimer();
            recognition.stop();
            elements.qcmOptions.childNodes.forEach(btn => {
                if (parseInt(btn.textContent) === state.correctAnswer) btn.classList.add("correct");
                else if (parseInt(btn.textContent) === userAnswer) btn.classList.add("wrong");
            });
            if (userAnswer === state.correctAnswer) {
                state.score++;
                elements.scoreDisplay.textContent = `Score : ${state.score}`;
                elements.message.textContent = "Bravo !";
                elements.questionText.textContent = `Question : Bravo !`;
                elements.correctSound.play();
                speak("Bonne réponse !");
                setTemporaryState("good");
                if (state.score > state.highScore) {
                    state.highScore = state.score;
                    localStorage.setItem("highScore", state.highScore);
                    elements.highScoreDisplay.textContent = `Meilleur score : ${state.highScore}`;
                }
            } else {
                elements.message.textContent = `Faux ! Réponse : ${state.correctAnswer}`;
                elements.questionText.textContent = `Question : Faux ! Réponse : ${state.correctAnswer}`;
                elements.wrongSound.play();
                speak(`Faux ! La réponse était ${state.correctAnswer}`);
                setTemporaryState("bad");
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
                    state.correctAnswer = num1 + num2;
                    break;
                case "moyen":
                    num1 = Math.floor(Math.random() * 50) + 1;
                    num2 = Math.floor(Math.random() * 50) + 1;
                    operator = Math.random() > 0.5 ? "+" : "-";
                    spokenOperator = operator === "+" ? "plus" : "moins";
                    state.correctAnswer = operator === "+" ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2);
                    break;
                case "difficile":
                    num1 = Math.floor(Math.random() * 100) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                    operator = Math.random() > 0.5 ? "*" : "/";
                    spokenOperator = operator === "*" ? "multiplié par" : "divisé par";
                    if (operator === "/") {
                        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
                        state.correctAnswer = num1 / num2;
                    } else {
                        state.correctAnswer = num1 * num2;
                    }
                    break;
            }

            const questionTextDisplay = `${num1} ${operator} ${num2}`;
            const questionSpoken = `${num1} ${spokenOperator} ${num2}`;
            elements.message.textContent = `Résolvez : ${questionTextDisplay}`;
            elements.questionText.textContent = `Question : ${questionTextDisplay}`;
            generateQCMOptions(state.correctAnswer);
            stopTimer();
            startTimer();
            speak(`Quel est le résultat de ${questionSpoken} ?`, () => {
                if (state.currentQuestion <= totalQuestions) recognition.start();
            });
        }

        function nextQuestion() {
            state.currentQuestion++;
            elements.progressDisplay.textContent = `Question ${state.currentQuestion}/${totalQuestions}`;
            if (state.currentQuestion <= totalQuestions) {
                generateMathProblem();
            } else {
                endGame();
            }
        }

        function endGame() {
            elements.message.textContent = `Jeu terminé, ${login} ! Score : ${state.score}/${totalQuestions}`;
            elements.questionText.textContent = `Question : Jeu terminé ! Score : ${state.score}/${totalQuestions}`;
            speak(`Jeu terminé, ${login} ! Votre score est de ${state.score} sur ${totalQuestions}`);
            elements.timerDisplay.style.display = "none";
            elements.progressDisplay.style.display = "none";
            elements.qcmOptions.innerHTML = "";
            recognition.stop();
            updateLeaderboard(state.score);
        }

        elements.backToHomeBtn.addEventListener("click", () => {
            elements.game.style.display = "none";
            elements.home.parentElement.style.display = "flex";
            elements.timerDisplay.style.display = "block";
            elements.progressDisplay.style.display = "block";
            elements.qcmOptions.innerHTML = "";
            elements.startGameBtn.style.display = "none";
            elements.difficultyButtons.forEach(btn => btn.classList.remove("selected"));
            elements.questionCountButtons.forEach(btn => btn.classList.remove("selected"));
            state.currentQuestion = 1;
            state.score = 0;
            elements.scoreDisplay.textContent = `Score : ${state.score}`;
            elements.progressDisplay.textContent = `Question ${state.currentQuestion}/${totalQuestions}`;
            elements.questionText.textContent = "Question : Préparez-vous...";
            elements.message.textContent = "Préparez-vous...";
            state.selectedLevel = null;
            state.questionCount = null;
            state.playerLogin = null;
            elements.loginInput.value = "";
            recognition.stop();
            clearInterval(state.countdown);
            updateAvatar("neutral");
            elements.textPanel.style.display = "none";
            elements.textPanel.classList.remove("visible");
            elements.toggleTextBtn.textContent = "Afficher le texte";
            elements.toggleTextBtn.style.display = "block";
            elements.avatar.classList.remove("fullscreen");
            elements.toggleFullscreenBtn.style.display = "block";
            elements.toggleReduceBtn.style.display = "none";
            state.isFullscreen = false;
        });

        recognition.onresult = (event) => {
            recognition.stop();
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            const userAnswer = parseInt(transcript);
            if (!isNaN(userAnswer) && state.correctAnswer !== 0) {
                stopTimer(); // Arrêter le chronomètre seulement pour une réponse valide
                checkQCMAnswer(userAnswer);
            } else {
                elements.message.textContent = "Je n'ai pas compris, répétez.";
                elements.questionText.textContent = "Question : Je n'ai pas compris, répétez.";
                speak("Je n'ai pas compris, répétez.", () => {
                    if (state.currentQuestion <= totalQuestions && state.countdown) {
                        recognition.start(); // Relancer la reconnaissance seulement si le chronomètre est actif
                    }
                });
                setTemporaryState("confused");
            }
        };

        recognition.onerror = (event) => {
            recognition.stop();
            if (event.error === "no-speech" || event.error === "aborted") {
                return;
            }
            elements.message.textContent = `Erreur de reconnaissance : ${event.error}. Continuez.`;
            elements.questionText.textContent = `Question : Erreur, continuez.`;
            speak("Erreur, continuez.", () => {
                if (state.currentQuestion <= totalQuestions && state.countdown) {
                    recognition.start();
                }
            });
            setTemporaryState("confused");
        };

        generateMathProblem();
    }

    elements.startGameBtn.addEventListener("click", () => {
        if (!elements.loginInput.validity.valid) {
            elements.loginError.style.display = "block";
            return;
        }
        startGame(state.selectedLevel, state.questionCount, state.playerLogin);
    });
});