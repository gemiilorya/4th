const dropZone = document.getElementById("dropZone");
const pot = document.getElementById("pot-container");  // Update the reference
const message = document.getElementById("message");

const bgMusic = document.getElementById("bgMusic");
const dropSound = document.getElementById("dropSound");
const cookSound = document.getElementById("cookSound");
const serveSound = document.getElementById("serveSound");

let addedIngredients = [];
let musicStarted = false;
let steamActive = false;

// Start background music on first interaction
document.body.addEventListener("click", () => {
    if (!musicStarted) {
    bgMusic.play();
    musicStarted = true;
    }
});

// Drag start
document.querySelectorAll(".ingredients img").forEach(img => {
    img.addEventListener("dragstart", e => {
    e.dataTransfer.setData("id", e.target.id);
    });
});

// Allow drop
dropZone.addEventListener("dragover", e => {
    e.preventDefault();
});

// Handle drop
dropZone.addEventListener("drop", e => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    if (!addedIngredients.includes(id)) {
    addedIngredients.push(id);
    let clone = document.getElementById(id).cloneNode(true);
    clone.style.width = "50px";
    pot.appendChild(clone);
    dropSound.play();
    }
});

// Add steam functions
function addSteam() {
    steamActive = true;
    // Remove existing steam elements
    document.querySelectorAll('.steam').forEach(el => el.remove());
    
    // Create multiple steam particles
    for (let i = 0; i < 6; i++) {
        createSteamParticle();
    }

    // Continue creating steam particles
    setInterval(() => {
        if (steamActive) {
            createSteamParticle();
        }
    }, 500);
}

function createSteamParticle() {
    const steam = document.createElement("div");
    steam.classList.add("steam");
    
    // Random position within the pot width
    const xOffset = Math.random() * 80 - 40; // Range: -40px to 40px
    steam.style.setProperty('--x-offset', `${xOffset}px`);
    steam.style.left = `calc(50% + ${Math.random() * 60 - 30}px)`; // Random starting position
    
    pot.appendChild(steam);
    
    // Remove the steam element after animation completes
    steam.addEventListener('animationend', () => {
        steam.remove();
    });
}

function cook() {
    if (addedIngredients.length < 4) {
        message.textContent = "Hmm... it's not ready yet. Add all ingredients!";
        return;
    }
    message.textContent = "Cooking... the aroma of carbonara fills the room!";
    if (!steamActive) {
        addSteam();
    }
    
    // Show popup and overlay
    document.querySelector('.overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
    cookSound.play();
    
    // Auto close after 5 seconds
    setTimeout(() => {
        document.querySelector('.overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    }, 5000);
}

function serve() {
    if (addedIngredients.length < 4) {
        message.textContent = "You can't serve yet! Some ingredients are missing.";
        return;
    }
    message.textContent = "You served a delicious Carbonara 💜 Perfect surprise!";
    
    // Show serve popup and overlay
    document.querySelector('.overlay').style.display = 'block';
    document.getElementById('serve-popup').style.display = 'block';
    
    // Create multiple steam particles
    const serveContainer = document.querySelector('.serve-container');
    for (let i = 0; i < 3; i++) {
        const steam = document.createElement('div');
        steam.className = 'serve-steam';
        steam.style.left = `${30 + (i * 20)}%`;
        steam.style.animationDelay = `${i * 0.3}s`;
        serveContainer.appendChild(steam);
    }
    
    serveSound.play();
}

function continueGame() {
    // Redirect to placeholder page
    window.location.href = 'letter.html';
}

// Update resetGame to also hide serve popup
function resetGame() {
    addedIngredients = [];
    pot.innerHTML = "";
    message.textContent = "";
    steamActive = false;
    document.querySelectorAll('.steam').forEach(el => el.remove());
    document.querySelector('.overlay').style.display = 'none';
    document.getElementById('serve-popup').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
    document.querySelectorAll('.serve-steam').forEach(el => el.remove());
}

// Add modal close functionality
document.querySelectorAll(".close-button").forEach(button => {
    button.addEventListener("click", function() {
        this.closest('.modal').style.display = "none";
    });
});

// Close modals when clicking outside
window.addEventListener("click", function(event) {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
});