const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// États globaux
let state = "neutral"; // "neutral", "talk", "good", "bad"
let stateFrame = 0; // Compteur pour les animations temporaires
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

// Efface et redessine le fond
function clearCanvas() {
    ctx.fillStyle = "white"; // Fond fixe blanc
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Dessine l'œil gauche
function drawEyeLeft(x, y, height) {
    ctx.beginPath();
    if (state === "good") {
        ctx.ellipse(x, y + bounceOffset, 60, height + 10, 0, 0, Math.PI * 2); // Yeux agrandis
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
    } else { // Neutre ou Talk
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

// Dessine l'œil droit
function drawEyeRight(x, y, height) {
    ctx.beginPath();
    if (state === "good") {
        ctx.ellipse(x, y + bounceOffset, 60, height + 10, 0, 0, Math.PI * 2); // Yeux agrandis
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
    } else { // Neutre ou Talk
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

// Dessine un sourcil
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

// Dessine la bouche
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

// Dessine une larme
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

// Dessine un symbole mathématique ou effet
function drawSymbol(x, y, type) {
    ctx.beginPath();
    ctx.fillStyle = state === "good" ? "#FFD700" : state === "bad" ? "#FF4500" : "#8888ff";
    ctx.font = "20px Arial";
    if (type === "plus") ctx.fillText("+", x, y);
    if (type === "x") ctx.fillText("×", x, y);
    if (type === "question") ctx.fillText("?", x, y);
    ctx.closePath();
}

// Gestion des larmes (pour "bad")
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

// Gestion de l'animation "talk"
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

// Gestion de l'animation "good"
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

// Gestion de l'animation "bad"
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

// Gestion de l'animation neutre avec clignement
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

        // Clignement des yeux
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

// Lancer le clignement aléatoire
function startBlinking() {
    if (!blinking && state === "neutral") {
        blinking = true;
        eyeHeight = 50;
        blinkDirection = -5;
    }
}

// Boucle d'animation centrale
function animate() {
    clearCanvas();
    drawEyeLeft(canvas.width / 100 * 75, 140, eyeHeight);
    drawEyeRight(canvas.width / 100 * 25, 140, eyeHeight);
    drawEyebrow(canvas.width / 100 * 75, 50, true);
    drawEyebrow(canvas.width / 100 * 25, 50, false);
    drawMouth(canvas.width / 2, 300, mouthHeight);

    updateTears();
    updateTalkAnimation();
    updateGoodAnimation();
    updateBadAnimation();
    updateNeutralAnimation();

    requestAnimationFrame(animate);
}

// Lancer l'animation au démarrage
animate();

// Changer l'état
function setTalk() {
    state = "talk";
    stateFrame = 0;
    tears = [];
    blinking = false; // Désactiver le clignement pendant "talk"
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

// Événements des boutons
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("talkBtn").addEventListener("click", setTalk);
    document.getElementById("goodAnswerBtn").addEventListener("click", setGoodAnswer);
    document.getElementById("badAnswerBtn").addEventListener("click", setBadAnswer);
});

// Clignement automatique toutes les 3 à 6 secondes
setInterval(startBlinking, Math.random() * 3000 + 3000);