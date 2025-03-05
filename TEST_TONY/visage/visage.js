const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// États globaux
let isHappy = true;
let speaking = false;
let blinking = false;
let eyeHeight = 50;
let blinkDirection = -5;
let mouthHeight = 30;
let mouthDirection = 1;
let tears = [];
let isHappyAnimation = false; // État pour l'animation "Happy"
let happyFrame = 0; // Compteur pour l'animation Happy

// Efface et redessine le fond
function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Dessine l'œil gauche
function drawEyeLeft(x, y, height) {
    ctx.beginPath();
    if (isHappy || isHappyAnimation) {
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
        ctx.moveTo(x - 50, y + 10);
        ctx.bezierCurveTo(x - 17, y - 30, x + 17, y - 30, x + 50, y + 10);
        ctx.bezierCurveTo(x + 17, y - 10, x - 17, y - 10, x - 50, y + 10);
        ctx.fillStyle = "black";
        ctx.fill();
    }
    ctx.closePath();
}

// Dessine l'œil droit
function drawEyeRight(x, y, height) {
    ctx.beginPath();
    if (isHappy || isHappyAnimation) {
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
        ctx.moveTo(x - 50, y + 10);
        ctx.bezierCurveTo(x - 17, y - 30, x + 17, y - 30, x + 50, y + 10);
        ctx.bezierCurveTo(x + 17, y - 10, x - 17, y - 10, x - 50, y + 10);
        ctx.fillStyle = "black";
        ctx.fill();
    }
    ctx.closePath();
}

// Dessine un sourcil
function drawEyebrow(x, y, isLeft) {
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "lightGray";
    if (isLeft) {
        if (isHappyAnimation) {
            // Animation Happy : sourcil qui ondule
            let offset = Math.sin(happyFrame * 0.2) * 10;
            ctx.moveTo(x - 50, y + 20);
            ctx.quadraticCurveTo(x, y - 20 + offset, x + 50, y + 10);
        } else if (isHappy) {
            ctx.moveTo(x - 50, y + 20);
            ctx.quadraticCurveTo(x, y - 20, x + 50, y + 10);
        } else {
            ctx.moveTo(x - 50, y - 10);
            ctx.quadraticCurveTo(x, y + 20, x + 50, y + 30);
        }
    } else {
        if (isHappyAnimation) {
            let offset = Math.sin(happyFrame * 0.2) * 10;
            ctx.moveTo(x + 50, y + 20);
            ctx.quadraticCurveTo(x, y - 20 + offset, x - 50, y + 10);
        } else if (isHappy) {
            ctx.moveTo(x + 50, y + 20);
            ctx.quadraticCurveTo(x, y - 20, x - 50, y + 10);
        } else {
            ctx.moveTo(x + 50, y - 10);
            ctx.quadraticCurveTo(x, y + 20, x - 50, y + 30);
        }
    }
    ctx.stroke();
    ctx.closePath();
}

// Dessine la bouche
function drawMouth(x, y, isHappy, height) {
    ctx.beginPath();
    ctx.moveTo(x - 50, y - 20);
    ctx.quadraticCurveTo(x - 20, y - 20, x, y - 20);
    ctx.quadraticCurveTo(x + 20, y - 20, x + 50, y - 20);
    ctx.quadraticCurveTo(x + 60, y - 20, x + 60, y - 10);
    if (isHappyAnimation) {
        // Grand sourire rebondissant
        let bounce = Math.sin(happyFrame * 0.3) * 10;
        ctx.quadraticCurveTo(x + 55, y + height + bounce, x, y + height + bounce);
        ctx.quadraticCurveTo(x - 50, y + height + bounce, x - 60, y - 10);
    } else if (isHappy) {
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

// Dessine une larme
function drawTear(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x - 5, y + 10, x, y + 20);
    ctx.quadraticCurveTo(x + 5, y + 10, x, y);
    ctx.fillStyle = "#00BFFF";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "rgba(0, 191, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Dessine une étoile (pour l'animation Happy)
function drawStar(x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        let angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
        let outerX = x + Math.cos(angle) * size;
        let outerY = y + Math.sin(angle) * size;
        let innerX = x + Math.cos(angle + Math.PI / 5) * (size / 2);
        let innerY = y + Math.sin(angle + Math.PI / 5) * (size / 2);
        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
}

// Gestion des larmes
function updateTears() {
    if (!isHappy && !isHappyAnimation) {
        if (Math.random() < 0.05) {
            tears.push({
                x: canvas.width / 100 * 75 + (Math.random() * 60 - 30),
                y: 160,
                speed: Math.random() * 2 + 1
            });
            tears.push({
                x: canvas.width / 100 * 25 + (Math.random() * 60 - 30),
                y: 160,
                speed: Math.random() * 2 + 1
            });
        }
    } else {
        tears = [];
    }

    tears = tears.filter(tear => tear.y < canvas.height);
    tears.forEach(tear => {
        tear.y += tear.speed;
        drawTear(tear.x, tear.y);
    });
}

// Gestion de l'animation Happy
function updateHappyAnimation() {
    if (isHappyAnimation) {
        happyFrame++;
        // Yeux qui s'agrandissent et clignent
        if (happyFrame % 20 < 10) eyeHeight = 60; // Agrandir
        else eyeHeight = 40; // Rétrécir (simule un clignement rapide)

        // Arrêter l'animation après 2 secondes (120 frames à 60 FPS)
        if (happyFrame > 120) {
            isHappyAnimation = false;
            happyFrame = 0;
            eyeHeight = 50;
        }

        // Dessiner des étoiles autour du visage
        drawStar(canvas.width / 100 * 75 - 60, 100, 15 + Math.sin(happyFrame * 0.2) * 5);
        drawStar(canvas.width / 100 * 25 + 60, 100, 15 + Math.sin(happyFrame * 0.2 + 1) * 5);
    }
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

    // Mise à jour des larmes et animation Happy
    updateTears();
    updateHappyAnimation();

    requestAnimationFrame(animate);
}

// Lancer l'animation au démarrage
animate();

// Changer l'émotion
function toggleEmotion() {
    isHappy = !isHappy;
}

// Activer/désactiver la parole
function toggleSpeaking() {
    speaking = !speaking;
    if (!speaking) mouthHeight = 30;
}

// Lancer le clignement aléatoire
function startBlinking() {
    if (!blinking && isHappy && !isHappyAnimation) {
        blinking = true;
        eyeHeight = 50;
        blinkDirection = -5;
    }
}

// Déclencher l'animation Happy
function triggerHappyAnimation() {
    if (!isHappyAnimation) {
        isHappyAnimation = true;
        happyFrame = 0;
        isHappy = true; // Forcer l'état joyeux pendant l'animation
        tears = []; // Supprimer les larmes
    }
}

// Événements des boutons
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("changeEmotionBtn").addEventListener("click", toggleEmotion);
    document.getElementById("talkButton").addEventListener("click", toggleSpeaking);
    document.getElementById("happyButton").addEventListener("click", triggerHappyAnimation);
});

// Clignement automatique toutes les 3 à 6 secondes
setInterval(startBlinking, Math.random() * 3000 + 3000);