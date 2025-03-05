const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// États globaux
let isHappy = true;
let speaking = false;
let blinking = false;
let eyeHeight = 50; // Hauteur des yeux
let blinkDirection = -5;
let mouthHeight = 30; // Hauteur de la bouche
let mouthDirection = 1;
let tearY = 0; // Position des larmes

// Efface et redessine le fond
function clearCanvas() {
    ctx.fillStyle = "white"; // Fond blanc (tu peux remettre #8888ff si tu préfères)
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Dessine l'œil gauche
function drawEyeLeft(x, y, height) {
    ctx.beginPath();
    if (isHappy) {
        ctx.ellipse(x, y, 50, height, 0, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        if (height > 20) {
            ctx.beginPath();
            ctx.arc(x - 20, y - 20, 10, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 10, y - 10, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#444488";
            ctx.fill();
        }
    } else {
        // Œil fermé avec larmes
        ctx.moveTo(x - 50, y + 10);
        ctx.bezierCurveTo(x - 17, y - 30, x + 17, y - 30, x + 50, y + 10);
        ctx.bezierCurveTo(x + 17, y - 10, x - 17, y - 10, x - 50, y + 10);
        ctx.fillStyle = "black";
        ctx.fill();
        // Larmes
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x - 10 + (i * 10), y - 40 + tearY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#00BFFF";
            ctx.fill();
        }
    }
    ctx.closePath();
}

// Dessine l'œil droit (uniformisé avec l'état triste)
function drawEyeRight(x, y, height) {
    ctx.beginPath();
    if (isHappy) {
        ctx.ellipse(x, y, 50, height, 0, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        if (height > 20) {
            ctx.beginPath();
            ctx.arc(x + 20, y - 20, 10, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 10, y - 10, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#444488";
            ctx.fill();
        }
    } else {
        // Œil fermé avec larmes
        ctx.moveTo(x - 50, y + 10);
        ctx.bezierCurveTo(x - 17, y - 30, x + 17, y - 30, x + 50, y + 10);
        ctx.bezierCurveTo(x + 17, y - 10, x - 17, y - 10, x - 50, y + 10);
        ctx.fillStyle = "black";
        ctx.fill();
        // Larmes
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x - 10 + (i * 10), y - 40 + tearY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#00BFFF";
            ctx.fill();
        }
    }
    ctx.closePath();
}

// Dessine un sourcil
function drawEyebrow(x, y, isLeft) {
    ctx.beginPath();
    if (isLeft) {
        ctx.moveTo(x - 40, y + 10);
        ctx.bezierCurveTo(x - 25, y - 15, x + 25, y - 15, x + 40, y + 10);
        ctx.bezierCurveTo(x + 25, y + 20, x - 25, y + 20, x - 40, y + 10);
    } else {
        ctx.moveTo(x + 40, y + 10);
        ctx.bezierCurveTo(x + 25, y - 15, x - 25, y - 15, x - 40, y + 10);
        ctx.bezierCurveTo(x - 25, y + 20, x + 25, y + 20, x + 40, y + 10);
    }
    ctx.fillStyle = "lightGray";
    ctx.fill();
    ctx.closePath();
}

// Dessine la bouche
function drawMouth(x, y, isHappy, height) {
    ctx.beginPath();
    ctx.moveTo(x - 50, y - 20);
    ctx.quadraticCurveTo(x - 20, y - 20, x, y - 20);
    ctx.quadraticCurveTo(x + 20, y - 20, x + 50, y - 20);
    ctx.quadraticCurveTo(x + 60, y - 20, x + 60, y - 10);
    if (isHappy) {
        ctx.quadraticCurveTo(x + 55, y + height, x, y + height);
        ctx.quadraticCurveTo(x - 50, y + height, x - 60, y - 10);
    } else {
        ctx.quadraticCurveTo(x + 55, y - 20, x, y - 20);
        ctx.quadraticCurveTo(x - 50, y - 20, x - 60, y - 10);
    }
    ctx.quadraticCurveTo(x - 60, y - 20, x - 50, y - 20);
    ctx.fillStyle = "#2D1B3C";
    ctx.fill();
    ctx.closePath();
}

// Boucle d'animation centrale
function animate() {
    clearCanvas();
    drawEyeLeft(canvas.width / 100 * 75, 140, eyeHeight);
    drawEyeRight(canvas.width / 100 * 25, 140, eyeHeight);
    drawEyebrow(canvas.width / 100 * 75, 50, true);
    drawEyebrow(canvas.width / 100 * 25, 50, false);
    drawMouth(canvas.width / 2, 300, isHappy, mouthHeight);

    // Animation de la bouche (parler)
    if (speaking) {
        mouthHeight += mouthDirection * 5;
        if (mouthHeight > 40 || mouthHeight < 10) mouthDirection *= -1;
    }

    // Animation du clignement
    if (blinking) {
        eyeHeight += blinkDirection;
        if (eyeHeight <= 5 || eyeHeight >= 50) blinkDirection *= -1;
        if (eyeHeight === 50 && blinkDirection === -5) blinking = false;
    }

    // Animation des larmes
    if (!isHappy) {
        tearY += 2;
        if (tearY > 100) tearY = 0; // Réinitialisation quand les larmes sortent du canvas
    } else {
        tearY = 0; // Réinitialiser les larmes quand on repasse à heureux
    }

    requestAnimationFrame(animate);
}

// Lancer l'animation au démarrage
animate();

// Changer l'émotion
function toggleEmotion() {
    isHappy = !isHappy;
    tearY = 0; // Réinitialiser les larmes au changement
}

// Activer/désactiver la parole
function toggleSpeaking() {
    speaking = !speaking;
    if (!speaking) mouthHeight = 30; // Réinitialiser la bouche quand on arrête
}

// Lancer le clignement aléatoire
function startBlinking() {
    if (!blinking && isHappy) { // Pas de clignement si triste
        blinking = true;
        eyeHeight = 50;
        blinkDirection = -5;
    }
}

// Événements des boutons
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("changeEmotionBtn").addEventListener("click", toggleEmotion);
    document.getElementById("talkButton").addEventListener("click", toggleSpeaking);
});

// Clignement automatique toutes les 3 à 6 secondes
setInterval(startBlinking, Math.random() * 3000 + 3000);