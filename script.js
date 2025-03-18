document.addEventListener("DOMContentLoaded", () => {
    const homeContainer = document.getElementById("home");
    const gameContainer = document.getElementById("game");
    const difficultyButtons = document.querySelectorAll(".difficulty-btn");
    const questionCountButtons = document.querySelectorAll(".question-count-btn");
    const startGameBtn = document.getElementById("start-game");
    const loginInput = document.getElementById("login-input");
    const toggleTextBtn = document.getElementById("toggle-text");
    const textPanel = document.getElementById("text-panel");

    let selectedLevel = null;
    let questionCount = null;
    let playerLogin = null;

    toggleTextBtn.addEventListener("click", () => {
        const isHidden = textPanel.style.display === "none" || textPanel.style.display === "";
        textPanel.style.display = isHidden ? "block" : "none";
        textPanel.classList.toggle("visible", isHidden);
        toggleTextBtn.textContent = isHidden ? "Masquer le texte" : "Afficher le texte";
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

    // Code de l'avatar
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // Ajuster la taille du canvas dynamiquement
    canvas.width = window.innerWidth * 0.80;
    canvas.height = window.innerHeight * 0.60;

    let state = "neutral";
    let stateFrame = 0;
    let eyeHeight = 50;
    let blinkDirection = -5;
    let blinking = false;
    let mouthHeight = 30;
    let mouthDirection = 1;
    let tears = [];
    let bounceOffset = 0;
    let idleFrame = 0;
    let eyebrowOffset = 0;
    let reflectOffsetX = 0;
    let reflectOffsetY = 0;
    let trembleOffset = 0;

    function clearCanvas() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawEyeLeft(x, y, height) {
        ctx.beginPath();
        if (state === "good") {
            ctx.ellipse(x, y + bounceOffset, 60, height + 10, 0, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 20, y - 20 + bounceOffset, 12, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 10, y - 10 + bounceOffset, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#444488";
            ctx.fill();
        } else if (state === "bad") {
            ctx.moveTo(x - 50 + trembleOffset, y + 10 + bounceOffset);
            ctx.bezierCurveTo(x - 17 + trembleOffset, y - 30 + bounceOffset, x + 17 + trembleOffset, y - 30 + bounceOffset, x + 50 + trembleOffset, y + 10 + bounceOffset);
            ctx.bezierCurveTo(x + 17 + trembleOffset, y - 10 + bounceOffset, x - 17 + trembleOffset, y - 10 + bounceOffset, x - 50 + trembleOffset, y + 10 + bounceOffset);
            ctx.fillStyle = "black";
            ctx.fill();
        } else {
            ctx.ellipse(x, y, 50, height, 0, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            if (height > 20) {
                ctx.beginPath();
                ctx.arc(x - 20 + reflectOffsetX, y - 20 + reflectOffsetY, 10, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x - 10 + reflectOffsetX, y - 10 + reflectOffsetY, 5, 0, Math.PI * 2);
                ctx.fillStyle = "#444488";
                ctx.fill();
            }
        }
        ctx.closePath();
    }

    function drawEyeRight(x, y, height) {
        ctx.beginPath();
        if (state === "good") {
            ctx.ellipse(x, y + bounceOffset, 60, height + 10, 0, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 20, y - 20 + bounceOffset, 12, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 10, y - 10 + bounceOffset, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#444488";
            ctx.fill();
        } else if (state === "bad") {
            ctx.moveTo(x - 50 + trembleOffset, y + 10 + bounceOffset);
            ctx.bezierCurveTo(x - 17 + trembleOffset, y - 30 + bounceOffset, x + 17 + trembleOffset, y - 30 + bounceOffset, x + 50 + trembleOffset, y + 10 + bounceOffset);
            ctx.bezierCurveTo(x + 17 + trembleOffset, y - 10 + bounceOffset, x - 17 + trembleOffset, y - 10 + bounceOffset, x - 50 + trembleOffset, y + 10 + bounceOffset);
            ctx.fillStyle = "black";
            ctx.fill();
        } else {
            ctx.ellipse(x, y, 50, height, 0, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            if (height > 20) {
                ctx.beginPath();
                ctx.arc(x + 20 + reflectOffsetX, y - 20 + reflectOffsetY, 10, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + 10 + reflectOffsetX, y - 10 + reflectOffsetY, 5, 0, Math.PI * 2);
                ctx.fillStyle = "#444488";
                ctx.fill();
            }
        }
        ctx.closePath();
    }

    function drawEyebrow(x, y, isLeft) {
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "lightGray";
        if (isLeft) {
            if (state === "good") {
                ctx.moveTo(x - 50, y + 10 + bounceOffset);
                ctx.quadraticCurveTo(x, y - 30 + bounceOffset, x + 50, y - 10 + bounceOffset);
            } else if (state === "bad") {
                ctx.moveTo(x - 50, y + 10 + trembleOffset);
                ctx.quadraticCurveTo(x, y - 10 + trembleOffset, x + 50, y + 20 + trembleOffset);
            } else {
                ctx.moveTo(x - 50, y + 20 + eyebrowOffset);
                ctx.quadraticCurveTo(x, y - 20 + eyebrowOffset, x + 50, y + 10 + eyebrowOffset);
            }
        } else {
            if (state === "good") {
                ctx.moveTo(x + 50, y + 10 + bounceOffset);
                ctx.quadraticCurveTo(x, y - 30 + bounceOffset, x - 50, y - 10 + bounceOffset);
            } else if (state === "bad") {
                ctx.moveTo(x + 50, y + 10 + trembleOffset);
                ctx.quadraticCurveTo(x, y - 10 + trembleOffset, x - 50, y + 20 + trembleOffset);
            } else {
                ctx.moveTo(x + 50, y + 20 - eyebrowOffset);
                ctx.quadraticCurveTo(x, y - 20 - eyebrowOffset, x - 50, y + 10 - eyebrowOffset);
            }
        }
        ctx.stroke();
        ctx.closePath();
    }

    function drawMouth(x, y, height) {
        ctx.beginPath();
        if (state === "good") {
            ctx.moveTo(x - 70, y + bounceOffset);
            ctx.quadraticCurveTo(x, y + 60 + bounceOffset, x + 70, y + bounceOffset);
            ctx.lineTo(x + 60, y - 10 + bounceOffset);
            ctx.quadraticCurveTo(x, y + 40 + bounceOffset, x - 60, y - 10 + bounceOffset);
            ctx.fillStyle = "#2D1B3C";
            ctx.fill();
        } else if (state === "bad") {
            ctx.moveTo(x - 50, y - 20 + trembleOffset);
            ctx.quadraticCurveTo(x, y + 20 + trembleOffset, x + 50, y - 20 + trembleOffset);
            ctx.fillStyle = "#2D1B3C";
            ctx.fill();
        } else {
            ctx.moveTo(x - 50, y - 20);
            ctx.quadraticCurveTo(x - 20, y - 20, x, y - 20);
            ctx.quadraticCurveTo(x + 20, y - 20, x + 50, y - 20);
            ctx.quadraticCurveTo(x + 60, y - 20, x + 60, y - 10);
            ctx.quadraticCurveTo(x + 55, y + height, x, y + height);
            ctx.quadraticCurveTo(x - 50, y + height, x - 60, y - 10);
            ctx.quadraticCurveTo(x - 60, y - 20, x - 50, y - 20);
            ctx.fillStyle = "#2D1B3C";
            ctx.fill();
        }
        ctx.closePath();
    }

    function drawTear(x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x - size / 2, y + size, x, y + size * 2);
        ctx.quadraticCurveTo(x + size / 2, y + size, x, y);
        ctx.fillStyle = "#00BFFF";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "rgba(0, 191, 255, 0.5)";
        ctx.lineWidth = size / 2;
        ctx.stroke();
    }

    function drawSymbol(x, y, type) {
        ctx.beginPath();
        ctx.fillStyle = state === "good" ? "#FFD700" : state === "bad" ? "#FF4500" : "#8888ff";
        ctx.font = "20px Arial";
        if (type === "plus") ctx.fillText("+", x, y);
        if (type === "x") ctx.fillText("×", x, y);
        if (type === "question") ctx.fillText("?", x, y);
        ctx.closePath();
    }

    function updateTears() {
        if (state === "bad") {
            stateFrame++;
            if (Math.random() < 0.15) {
                let size = Math.random() * 10 + 5;
                tears.push({
                    x: canvas.width / 100 * 75 + (Math.random() * 60 - 30),
                    y: 160,
                    speed: Math.random() * 2 + 1 + size / 10,
                    size: size
                });
                tears.push({
                    x: canvas.width / 100 * 25 + (Math.random() * 60 - 30),
                    y: 160,
                    speed: Math.random() * 2 + 1 + size / 10,
                    size: size
                });
            }
            trembleOffset = Math.sin(stateFrame * 0.25) * 3;
        } else {
            tears = [];
            trembleOffset = 0;
        }

        tears = tears.filter(tear => tear.y < canvas.height);
        tears.forEach(tear => {
            tear.y += tear.speed;
            drawTear(tear.x, tear.y, tear.size);
        });
    }

    function updateTalkAnimation() {
        if (state === "talk") {
            stateFrame++;
            mouthHeight += mouthDirection * 5;
            if (mouthHeight > 40 || mouthHeight < 10) mouthDirection *= -1;
            eyebrowOffset = Math.sin(stateFrame * 0.1) * 5;
            if (stateFrame > 120) {
                state = "neutral";
                stateFrame = 0;
                mouthHeight = 30;
                eyebrowOffset = 0;
            }
        }
    }

    function updateGoodAnimation() {
        if (state === "good") {
            stateFrame++;
            bounceOffset = Math.sin(stateFrame * 0.3) * 15;
            if (stateFrame < 60) {
                drawSymbol(canvas.width / 100 * 75 - 60, 100, "plus");
                drawSymbol(canvas.width / 100 * 25 + 60, 100, "plus");
            }
            if (stateFrame > 120) {
                state = "neutral";
                stateFrame = 0;
                bounceOffset = 0;
                eyeHeight = 50;
            }
        }
    }

    function updateBadAnimation() {
        if (state === "bad") {
            stateFrame++;
            if (stateFrame < 60) {
                drawSymbol(canvas.width / 100 * 75 - 60, 100, "x");
                drawSymbol(canvas.width / 100 * 25 + 60, 100, "x");
            }
            if (stateFrame > 120) {
                state = "neutral";
                stateFrame = 0;
                bounceOffset = 0;
                eyeHeight = 50;
            }
        }
    }

    function updateNeutralAnimation() {
        if (state === "neutral") {
            idleFrame++;
            reflectOffsetX = Math.sin(idleFrame * 0.05) * 5;
            reflectOffsetY = Math.cos(idleFrame * 0.07) * 3;
            if (idleFrame % 120 === 0) {
                eyebrowOffset = Math.random() * 10 - 5;
            } else if (idleFrame % 60 === 0) {
                eyebrowOffset *= 0.5;
            }
            mouthHeight = 30 + Math.sin(idleFrame * 0.03) * 2;

            if (blinking) {
                eyeHeight += blinkDirection;
                if (eyeHeight <= 5 || eyeHeight >= 50) blinkDirection *= -1;
                if (eyeHeight === 50 && blinkDirection === -5) blinking = false;
            }

            if (idleFrame % 30 === 0) {
                drawSymbol(canvas.width / 2 - 100 + Math.random() * 200, 50 + Math.sin(idleFrame * 0.02) * 20, "question");
            }
        }
    }

    function startBlinking() {
        if (!blinking && state === "neutral") {
            blinking = true;
            eyeHeight = 50;
            blinkDirection = -5;
        }
    }

    function animate() {
        clearCanvas();
        drawEyeLeft(canvas.width / 100 * 75, canvas.height / 3, eyeHeight);
        drawEyeRight(canvas.width / 100 * 25, canvas.height / 3, eyeHeight);
        drawEyebrow(canvas.width / 100 * 75, canvas.height / 6, true);
        drawEyebrow(canvas.width / 100 * 25, canvas.height / 6, false);
        drawMouth(canvas.width / 2, canvas.height * 0.75, mouthHeight);

        updateTears();
        updateTalkAnimation();
        updateGoodAnimation();
        updateBadAnimation();
        updateNeutralAnimation();

        requestAnimationFrame(animate);
    }

    animate();
    setInterval(startBlinking, Math.random() * 3000 + 3000);

    function setTalk() {
        state = "talk";
        stateFrame = 0;
        tears = [];
        blinking = false;
    }

    function setGoodAnswer() {
        state = "good";
        stateFrame = 0;
        tears = [];
        blinking = false;
    }

    function setBadAnswer() {
        state = "bad";
        stateFrame = 0;
        blinking = false;
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
            utterance.onend = callback;
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
                    questionText.textContent = `Question : Temps écoulé ! Réponse : ${correctAnswer}`;
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
            let num1, num2, operator;
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
                        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
                        correctAnswer = num1 / num2;
                    } else {
                        correctAnswer = num1 * num2;
                    }
                    break;
            }

            const question = `${num1} ${operator} ${num2}`;
            message.textContent = `Résolvez : ${question}`;
            questionText.textContent = `Question : ${question}`;
            generateQCMOptions(correctAnswer);
            stopTimer();
            startTimer();
            speak(`Quel est le résultat de ${question} ?`, () => {
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
            textPanel.style.display = "none";
            textPanel.classList.remove("visible");
            toggleTextBtn.textContent = "Afficher le texte";
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
                questionText.textContent = "Question : Je n'ai pas compris, répétez.";
                speak("Je n'ai pas compris, répétez.", () => {
                    if (currentQuestion <= totalQuestions) recognition.start();
                });
                setBadAnswer();
            }
        };

        recognition.onerror = (event) => {
            stopTimer();
            recognition.stop();
            if (event.error !== "aborted") {
                message.textContent = `Erreur de reconnaissance : ${event.error}. Réessayez.`;
                questionText.textContent = `Question : Erreur de reconnaissance : ${event.error}. Réessayez.`;
                speak("Erreur, réessayez.", () => {
                    if (currentQuestion <= totalQuestions) recognition.start();
                });
                setBadAnswer();
            }
        };

        generateMathProblem();
    }
});