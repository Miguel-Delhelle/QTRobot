const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Fond violet
ctx.fillStyle = "lightGray";//"#8888ff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Détermine l'état de l'émotion (sourire ou tristesse)
let isHappy = true;
let startY = 0;

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

function drawEyebrow(x, y) {
    ctx.beginPath();
    ctx.ellipse(x, y, 60, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#444488";
    ctx.fill();
    ctx.closePath();
}

function drawMouth(x, y, isHappy) {
    // Partie supérieure blanche
    /*ctx.beginPath();
    ctx.arc(x, y - 10, 60, 0.2 * Math.PI, 0.8 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.closePath();*/
    
    ctx.beginPath();
    ctx.moveTo(x - 50, y - 20);
    ctx.quadraticCurveTo(x - 20, y - 20, x, y - 20);
    ctx.quadraticCurveTo(x + 20, y - 20, x + 50, y - 20);
    ctx.quadraticCurveTo(x + 60, y - 20, x + 60, y - 10);

    if (isHappy) {
        ctx.quadraticCurveTo(x + 55, y + 30, x, y + 30);  // Sourire
        ctx.quadraticCurveTo(x - 50, y + 30, x - 60, y - 10);
    } else {
        ctx.quadraticCurveTo(x + 55, y - 20, x, y - 20);  // Triste
        ctx.quadraticCurveTo(x - 50, y - 20, x - 60, y - 10);
    }

    ctx.quadraticCurveTo(x - 60, y - 20, x - 50, y - 20);
    ctx.fillStyle = "#2D1B3C";
    ctx.fill();
    ctx.closePath();

    // Intérieur violet
    /*ctx.beginPath();
    ctx.arc(x, y + 5, 40, 0.2 * Math.PI, 0.8 * Math.PI, false);
    ctx.fillStyle = "#8C5BAF";
    ctx.fill();
    ctx.closePath();*/
}

// Dessiner les deux yeux
drawEyeLeft(canvas.width / 100 * 75, 140);
drawEyeRight(canvas.width / 100 * 25, 140);

// Dessiner les sourcils
drawEyebrow(canvas.width / 100 * 75, 60);
drawEyebrow(canvas.width / 100 * 25, 60);

// Dessiner la bouche (initiale avec sourire)
drawMouth(canvas.width / 2, 300, isHappy);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lightGray";//"#8888ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Fonction pour changer l'émotion
function toggleEmotion() {
    isHappy = !isHappy;
    startY = 0;
    animate();
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

// Ajouter l'événement pour le bouton
document.getElementById("changeEmotionBtn").addEventListener("click", toggleEmotion);

