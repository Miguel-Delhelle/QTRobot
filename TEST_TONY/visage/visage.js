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
let isHappyAnimation = false;
let happyFrame = 0;
let bounceOffset = 0; // Décalage pour le saut

// Efface et redessine le fond
function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Dessine l'œil gauche
function drawEyeLeft(x, y, height) {
    ctx.beginPath();
    if (isHappyAnimation) {
        // Yeux en arc pour Happy
        ctx.moveTo(x - 50, y + 20 + bounceOffset);
        ctx.quadraticCurveTo(x, y - 20 + bounceOffset, x + 50, y + 20 + bounceOffset);
        ctx.fillStyle = "black";
        ctx.fill();
    } else if (isHappy) {
        ctx.ellipse(x, y + bounceOffset, 50, height, 0, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        if (height > 20) {
            ctx.beginPath();
            ctx.arc(x - 20, y - 20 + bounceOffset, 10, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 10, y - 10 + bounceOffset, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#444488";
            ctx.fill();
        }
    } else {
        ctx.moveTo(x - 50, y + 10 + bounceOffset);
        ctx.bezierCurveTo(x - 17, y - 30 + bounceOffset, x + 17, y - 30 + bounceOffset, x + 50, y + 10 + bounceOffset);
        ctx.bezierCurveTo(x + 17, y - 10 + bounceOffset, x - 17, y - 10 + bounceOffset, x - 50, y + 10 + bounceOffset);
        ctx.fillStyle = "black";
        ctx.fill();
    }
    ctx.closePath();
}

// Dessine l'œil droit
function drawEyeRight(x, y, height) {
    ctx.beginPath();
    if (isHappyAnimation) {
        // Yeux en arc pour Happy
        ctx.moveTo(x - 50, y + 20 + bounceOffset);
        ctx.quadraticCurveTo(x, y - 20 + bounceOffset, x + 50, y + 20 + bounceOffset);
        ctx.fillStyle = "black";
        ctx.fill();
    } else if (isHappy) {
        ctx.ellipse(x, y + bounceOffset, 50, height, 0, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        if (height > 20) {
            ctx.beginPath();
            ctx.arc(x + 20, y - 20 + bounceOffset, 10, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 10, y - 10 + bounceOffset, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#444488";
            ctx.fill();
        }
    } else {
        ctx.moveTo(x - 50, y + 10 + bounceOffset);
        ctx.bezierCurveTo(x - 17, y - 30 + bounceOffset, x + 17, y - 30 + bounceOffset, x + 50, y + 10 + bounceOffset);
        ctx.bezierCurveTo(x + 17, y - 10 + bounceOffset, x - 17, y - 10 + bounceOffset, x - 50, y + 10 + bounceOffset);
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
            // Sourcils relevés et inclinés pour Happy
            ctx.moveTo(x - 50, y + 10 + bounceOffset);
            ctx.quadraticCurveTo(x, y - 30 + bounceOffset, x + 50, y - 10 + bounceOffset);
        } else if (isHappy) {
            ctx.moveTo(x - 50, y + 20 + bounceOffset);
            ctx.quadraticCurveTo(x, y - 20 + bounceOffset, x + 50, y + 10 + bounceOffset);
        } else {
            ctx.moveTo(x - 50, y - 10 + bounceOffset);
            ctx.quadraticCurveTo(x, y + 20 + bounceOffset, x + 50, y + 30 + bounceOffset);
        }
    } else {
        if (isHappyAnimation) {
            ctx.moveTo(x + 50, y + 10 + bounceOffset);
            ctx.quadraticCurveTo(x, y - 30 + bounceOffset, x - 50, y - 10 + bounceOffset);
        } else if (isHappy) {
            ctx.moveTo(x + 50, y + 20 + bounceOffset);
            ctx.quadraticCurveTo(x, y - 20 + bounceOffset, x - 50, y + 10 + bounceOffset);
        } else {
            ctx.moveTo(x + 50, y - 10 + bounceOffset);
            ctx.quadraticCurveTo(x, y + 20 + bounceOffset, x - 50, y + 30 + bounceOffset);
        }
    }
    ctx.stroke();
    ctx.closePath();
}

// Dessine la bouche
function drawMouth(x, y, isHappy, height) {
    ctx.beginPath();
    if (isHappyAnimation) {
        // Grand sourire en U avec langue
        ctx.moveTo(x - 70, y + bounceOffset);
        ctx.quadraticCurveTo(x, y + 60 + bounceOffset, x + 70, y + bounceOffset);
        ctx.lineTo(x + 60, y - 10 + bounceOffset);
        ctx.quadraticCurveTo(x, y + 40 + bounceOffset, x - 60, y - 10 + bounceOffset);
        ctx.fillStyle = "#2D1B3C";
        ctx.fill();

        // Langue (apparaît brièvement)
        if (happyFrame % 40 < 20) {
            ctx.beginPath();
            ctx.moveTo(x - 20, y + 20 + bounceOffset);
            ctx.quadraticCurveTo(x, y + 50 + bounceOffset, x + 20, y + 20 + bounceOffset);
            ctx.fillStyle = "#FF69B4"; // Rose pour la langue
            ctx.fill();
        }
    } else {
        ctx.moveTo(x - 50, y - 20 + bounceOffset);
        ctx.quadraticCurveTo(x - 20, y - 20 + bounceOffset, x, y - 20 + bounceOffset);
        ctx.quadraticCurveTo(x + 20, y - 20 + bounceOffset, x + 50, y - 20 + bounceOffset);
        ctx.quadraticCurveTo(x + 60, y - 20 + bounceOffset, x + 60, y - 10 + bounceOffset);
        if (isHappy) {
            ctx.quadraticCurveTo(x + 55, y + height + bounceOffset, x, y + height + bounceOffset);
            ctx.quadraticCurveTo(x - 50, y + height + bounceOffset, x - 60, y - 10 + bounceOffset);
        } else {
            ctx.quadraticCurveTo(x + 55, y - 20 + bounceOffset, x, y - 20 + bounceOffset);
            ctx.quadraticCurveTo(x - 50, y - 20 + bounceOffset, x - 60, y - 10 + bounceOffset);
        }
        ctx.quadraticCurveTo(x - 60, y - 20 + bounceOffset, x - 50, y - 20 + bounceOffset);
        ctx.fillStyle = "#2D1B3C";
        ctx.fill();
    }
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

// Dessine des lignes d'énergie (pour Happy)
function drawEnergyLines(x, y) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFD700"; // Jaune doré
    for (let i = 0; i < 4; i++) {
        let angle = (Math.PI / 2) * i;
        let offset = Math.sin(happyFrame * 0.2) * 10;
        ctx.moveTo(x + Math.cos(angle) * 60, y + Math.sin(angle) * 60 + bounceOffset);
        ctx.lineTo(x + Math.cos(angle) * (70 + offset), y + Math.sin(angle) * (70 + offset) + bounceOffset);
    }
    ctx.stroke();
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
        // Mouvement de saut
        bounceOffset = Math.sin(happyFrame * 0.3) * 20; // Saut de 20px max

        // Arrêter l'animation après 2 secondes (120 frames)
        if (happyFrame > 120) {
            isHappyAnimation = false;
            happyFrame = 0;
            bounceOffset = 0;
            eyeHeight = 50;
        }

        // Ajouter des lignes d'énergie
        drawEnergyLines(canvas.width / 100 * 75, 140);
        drawEnergyLines(canvas.width / 100 * 25, 140);
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
        isHappy = true; // Forcer l'état joyeux
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