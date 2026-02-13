// Matrix Rain Effect (2D Canvas)

const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

const fontSize = 16;
const columns = canvas.width / fontSize;

const rainDrops = [];

for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
}

const colors = [
    '#64ffda', // Cyan
    '#00f2fe', // Bright Blue
    '#4facfe'  // Sky Blue
];

function draw() {
    // Semi-transparent black to create trail effect
    // Very low opacity to keep background visible
    ctx.fillStyle = 'rgba(2, 12, 27, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0'; // Default green, overwritten below
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        // Random character
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));

        // Random color from our theme palette
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        // Extra low opacity for the characters themselves so they don't overpower
        ctx.globalAlpha = 0.15;
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        ctx.globalAlpha = 1.0; // Reset

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
}

setInterval(draw, 30);

// Handle Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Reset drops
    const newColumns = canvas.width / fontSize;
    rainDrops.length = 0;
    for (let x = 0; x < newColumns; x++) {
        rainDrops[x] = 1;
    }
});
