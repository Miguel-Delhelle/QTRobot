const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Fond violet
ctx.fillStyle = "white";//"#8888ff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Détermine l'état de l'émotion (sourire ou tristesse)
let isHappy = true;
let startY = 0;

// Pour la fonction parler
let speaking = false;
let mouthHeight = 30;
let mouthDirection = 1;

// Pour le clignement des yeux
let blinking = false;
let eyeHeight = 50; // Hauteur normale des yeux
let blinkDirection = -5;

function drawEyeLeft(x, y) {
    // Grand cercle noir (œil)
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    // Petit reflet blanc
    ctx.beginPath();
    ctx.arc(x - 20, y - 20, 10, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    // Petit reflet bleu foncé
    ctx.beginPath();
    ctx.arc(x - 10, y - 10, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#444488";
    ctx.fill();
    ctx.closePath();
}

function drawEyeRight(x, y) {
    if (isHappy) {
        // Grand cercle noir (œil)
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();

        // Petit reflet blanc (inversé)
        ctx.beginPath();
        ctx.arc(x + 20, y - 20, 10, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();

        // Petit reflet bleu foncé (inversé)
        ctx.beginPath();
        ctx.arc(x + 10, y - 10, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#444488";
        ctx.fill();
        ctx.closePath();
    } else {
        // Oeil fermé pleur
        ctx.beginPath();
        ctx.moveTo(x - 50, y + 10);
        ctx.bezierCurveTo(x - 17, y - 30, x + 17, y - 30, x + 50, y + 10);
        ctx.bezierCurveTo(x + 17, y - 10, x - 17, y - 10, x - 50, y + 10);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();

        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x - 10 + (i * 10), y - 40 + startY, 5, 0, Math.PI * 2, false);
            ctx.fillStyle = "#00BFFF";
            ctx.fill();
            ctx.closePath();
        }

        // TEST Larmes
        ctx.beginPath();
        ctx.moveTo(x + 25, y - 1);
        ctx.quadraticCurveTo(x - 10, y - 11, x - 45, y + 8);
        //ctx.bezierCurveTo(x + 17, y - 10, x - 17, y - 10, x - 50, y + 10);
        ctx.quadraticCurveTo(x - 10, y + 100, x + 25, y - 1);
        ctx.fillStyle = "#00BFFF";
        ctx.fill();
        ctx.closePath();

        // Mise à jour de la position des larmes
        startY += 2;
    }
}

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


function drawMouth(x, y, isHappy, height = 30) {
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

// Dessiner les deux yeux
drawEyeLeft(canvas.width / 100 * 75, 140);
drawEyeRight(canvas.width / 100 * 25, 140);

// Dessiner les sourcils
//drawEyebrow(canvas.width / 100 * 75, 60);
//drawEyebrow(canvas.width / 100 * 25, 60);
drawEyebrow(canvas.width / 100 * 75, 50, true);  // Sourcil gauche
drawEyebrow(canvas.width / 100 * 25, 50, false); // Sourcil droit



// Dessiner la bouche (initiale avec sourire)
drawMouth(canvas.width / 2, 300, isHappy);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";//"#8888ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Fonction pour changer l'émotion
function toggleEmotion() {
    isHappy = !isHappy;
    startY = 0;
    animate();
}

// Fonction pour faire parler
function animateMouth() {
    if (!speaking) return;
    
    mouthHeight += mouthDirection * 5;
    if (mouthHeight > 40 || mouthHeight < 10) {
        mouthDirection *= -1;
    }
    
    clearCanvas();
    drawEyeLeft(canvas.width / 100 * 75, 140);
    drawEyeRight(canvas.width / 100 * 25, 140);
    drawEyebrow(canvas.width / 100 * 75, 60);
    drawEyebrow(canvas.width / 100 * 25, 60);
    drawMouth(canvas.width / 2, 300, isHappy, mouthHeight);
    
    requestAnimationFrame(animateMouth);
}

function toggleSpeaking() {
    speaking = !speaking;
    if (speaking) animateMouth();
}

function animate() {
    if (!isHappy) {
        startY += 2;
        if (startY > 40) {
            startY = 0;
        }
        clearCanvas();
        drawEyeLeft(canvas.width / 100 * 75, 140);
        drawEyeRight(canvas.width / 100 * 25, 140);
        drawEyebrow(canvas.width / 100 * 75, 60);
        drawEyebrow(canvas.width / 100 * 25, 60);
        drawMouth(canvas.width / 2, 300, isHappy);
    } else {
        clearCanvas();
        drawEyeLeft(canvas.width / 100 * 75, 140);
        drawEyeRight(canvas.width / 100 * 25, 140);
        drawEyebrow(canvas.width / 100 * 75, 60);
        drawEyebrow(canvas.width / 100 * 25, 60);
        drawMouth(canvas.width / 2, 300, isHappy);
    }
    requestAnimationFrame(animate);
}

// Fonction clignement des yeux
function animateBlink() {
    if (!blinking) return;

    eyeHeight += blinkDirection;

    // Fermer complètement l'œil, puis inverser le mouvement
    if (eyeHeight <= 5 || eyeHeight >= 50) {
        blinkDirection *= -1;
    }

    // Si l'œil est revenu à sa taille normale, arrêter l'animation
    if (eyeHeight === 50 && blinkDirection === -5) {
        blinking = false;
        return;
    }

    clearCanvas();
    drawEyeLeft(canvas.width / 100 * 75, 140, eyeHeight);
    drawEyeRight(canvas.width / 100 * 25, 140, eyeHeight);
    drawEyebrow(canvas.width / 100 * 75, 60);
    drawEyebrow(canvas.width / 100 * 25, 60);
    drawMouth(canvas.width / 2, 300, isHappy);

    requestAnimationFrame(animateBlink);
}

function startBlinking() {
    if (!blinking) {
        blinking = true;
        eyeHeight = 50;
        blinkDirection = -5;
        animateBlink();
    }
}

// Adapter les fonctions des yeux pour prendre en compte la hauteur
function drawEyeLeft(x, y, height = 50) {
    ctx.beginPath();
    ctx.ellipse(x, y, 50, height, 0, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    if (height > 20) { // Afficher les reflets seulement si l'œil n'est pas trop fermé
        ctx.beginPath();
        ctx.arc(x - 20, y - 20, 10, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(x - 10, y - 10, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#444488";
        ctx.fill();
        ctx.closePath();
    }
}

function drawEyeRight(x, y, height = 50) {
    ctx.beginPath();
    ctx.ellipse(x, y, 50, height, 0, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    if (height > 20) {
        ctx.beginPath();
        ctx.arc(x + 20, y - 20, 10, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(x + 10, y - 10, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#444488";
        ctx.fill();
        ctx.closePath();
    }
}

// Ajouter l'événement pour les boutons
document.getElementById("changeEmotionBtn").addEventListener("click", toggleEmotion);
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("talkButton").addEventListener("click", toggleSpeaking);
});

// Lancer un clignement automatique toutes les 3 à 6 secondes
setInterval(startBlinking, Math.random() * 3000 + 3000);

