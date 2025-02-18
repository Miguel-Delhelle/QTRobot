const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Fond violet
ctx.fillStyle = "#8888ff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Détermine l'état de l'émotion (sourire ou tristesse)
let isHappy = true;

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
}

function drawEyebrow(x, y) {
    ctx.beginPath();
    ctx.ellipse(x, y, 60, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#444488";
    ctx.fill();
    ctx.closePath();
}

function drawMouth(x, y, isHappy) {
    ctx.beginPath();
    ctx.moveTo(x - 60, y);

    // Inverser la courbe de la bouche en fonction de l'émotion
    if (isHappy) {
        ctx.quadraticCurveTo(x, y + 20, x + 60, y);  // Sourire
    } else {
        ctx.quadraticCurveTo(x, y - 20, x + 60, y);  // Triste
    }

    ctx.lineWidth = 15;
    ctx.strokeStyle = "black";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.closePath();
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
    ctx.fillStyle = "#8888ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Fonction pour changer l'émotion
function toggleEmotion() {
    // Inverser l'état de l'émotion
    isHappy = !isHappy;
    clearCanvas();
    // Redessiner les yeux
    drawEyeLeft(canvas.width / 100 * 75, 140);
    drawEyeRight(canvas.width / 100 * 25, 140);
    // Redessiner les sourcils
    drawEyebrow(canvas.width / 100 * 75, 60);
    drawEyebrow(canvas.width / 100 * 25, 60);
    // Redessiner la bouche avec la nouvelle émotion
    drawMouth(canvas.width / 2, 300, isHappy);
}

// Ajouter l'événement pour le bouton
document.getElementById("changeEmotionBtn").addEventListener("click", toggleEmotion);
