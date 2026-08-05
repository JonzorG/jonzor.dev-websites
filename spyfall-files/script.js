const locations = [
    "Flygplan", 
    "Bank", 
    "Strand", 
    "Kasino", 
    "Sjukhus", 
    "Hotell", 
    "Militärbas", 
    "Polisstation", 
    "Restaurang", 
    "Skola", 
    "Rymdstation", 
    "Ubåt", 
    "Matbutik", 
    "Badhus",
    "Kärnkraftverk",
    "Fotbollsstadion",
    "Kryssningsfartyg",
    "Filminspelning",
    "Zoo",
    "Tågstation"
];

let activePlayers = [];
let playersData = [];
let currentPlayerIndex = 0;
let currentSecretLocation = "";
let currentImposters = [];
let isCardFlipped = false;

document.addEventListener('DOMContentLoaded', () => {
    renderPlayers();
    document.getElementById('new-player-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') addNewPlayer();
    });
});

function renderPlayers() {
    const list = document.getElementById('player-list');
    list.innerHTML = '';
    activePlayers.forEach((name, index) => {
        const li = document.createElement('li');
        li.className = 'player-item';
        const span = document.createElement('span');
        span.textContent = name;
        const btn = document.createElement('button');
        btn.className = 'btn-remove';
        btn.textContent = '✕';
        btn.onclick = () => removePlayer(index);
        li.appendChild(span);
        li.appendChild(btn);
        list.appendChild(li);
    });
    list.scrollTop = list.scrollHeight;
    updateImposterLimit();
}

function addNewPlayer() {
    const input = document.getElementById('new-player-input');
    const name = input.value.trim();
    if (name && activePlayers.length < 20) {
        activePlayers.push(name);
        input.value = '';
        renderPlayers();
    } else if (activePlayers.length >= 20) {
        alert("Max 20 spelare!");
    }
}

function removePlayer(index) {
    activePlayers.splice(index, 1);
    renderPlayers();
}

function changeImposterCount(amount) {
    const input = document.getElementById('imposter-count');
    const playerCount = activePlayers.length;
    let currentValue = parseInt(input.value);
    let newValue = currentValue + amount;
    let maxImposters = Math.max(1, Math.floor(playerCount / 2));
    if (playerCount <= 3) maxImposters = 1;
    if (newValue >= 1 && newValue <= maxImposters) input.value = newValue;
}

function updateImposterLimit() {
    const input = document.getElementById('imposter-count');
    const playerCount = activePlayers.length;
    let maxImposters = Math.max(1, Math.floor(playerCount / 2));
    if (playerCount <= 3) maxImposters = 1;
    if (parseInt(input.value) > maxImposters) input.value = maxImposters;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function startGame() {
    if (activePlayers.length < 3) {
        alert("Ni måste vara minst 3 spelare!");
        return;
    }
    setupRound(activePlayers);
}

function playAgainSamePlayers() {
    if (playersData.length === 0) return resetGame();
    setupRound(playersData.map(p => p.name));
}

function setupRound(names) {
    const locIndex = Math.floor(Math.random() * locations.length);
    currentSecretLocation = locations[locIndex];
    playersData = [];
    currentImposters = [];

    const imposterCount = parseInt(document.getElementById('imposter-count').value) || 1;
    let roleAssignments = Array(names.length).fill(false);
    for (let i = 0; i < imposterCount; i++) roleAssignments[i] = true;
    roleAssignments = shuffleArray(roleAssignments);

    for (let i = 0; i < names.length; i++) {
        if (roleAssignments[i]) {
            currentImposters.push(names[i]);
            playersData.push({ name: names[i], role: "SPION" });
        } else {
            playersData.push({ name: names[i], role: currentSecretLocation });
        }
    }

    currentPlayerIndex = 0;
    updatePassScreen();
    showScreen('pass-screen');
}

function updatePassScreen() {
    document.getElementById('pass-title').textContent = playersData[currentPlayerIndex].name;
    isCardFlipped = false;
    document.getElementById('role-card').classList.remove('flipped');
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('role-card-back').className = 'flip-card-back';
    document.getElementById('location-pool').classList.add('hidden');
}

function showRole() {
    const player = playersData[currentPlayerIndex];
    const roleDisplay = document.getElementById('role-display');
    const cardBack = document.getElementById('role-card-back');
    const roleLabel = document.getElementById('role-label-text');
    const locPool = document.getElementById('location-pool');
    
    document.getElementById('reveal-player-name').textContent = player.name;
    roleDisplay.textContent = player.role;
    cardBack.classList.remove('is-spy', 'is-word');

    if (player.role === "SPION") {
        cardBack.classList.add('is-spy');
        roleLabel.textContent = "IDENTITET:";
        
        locPool.innerHTML = '';
        locations.forEach(loc => {
            const div = document.createElement('div');
            div.textContent = '[ ] ' + loc;
            locPool.appendChild(div);
        });
        locPool.classList.remove('hidden');
    } else {
        cardBack.classList.add('is-word');
        roleLabel.textContent = "AKTUELL PLATS:";
        locPool.classList.add('hidden');
    }

    showScreen('reveal-screen');
}

function flipCard() {
    if (isCardFlipped) return;
    document.getElementById('role-card').classList.add('flipped');
    setTimeout(() => document.getElementById('next-btn').classList.remove('hidden'), 400);
    isCardFlipped = true;
}

function nextPlayer() {
    currentPlayerIndex++;
    if (currentPlayerIndex < playersData.length) {
        updatePassScreen();
        showScreen('pass-screen');
    } else {
        const startPlayer = playersData[Math.floor(Math.random() * playersData.length)].name;
        document.getElementById('starting-player-display').textContent = `> ${startPlayer} <`;
        showScreen('end-screen');
    }
}

function confirmReveal() { showScreen('confirm-screen'); }
function cancelReveal() { showScreen('end-screen'); }

function revealImposter() {
    const container = document.getElementById('imposter-names-container');
    container.innerHTML = ''; 
    currentImposters.forEach(name => {
        const div = document.createElement('div');
        div.className = 'imposter-badge';
        div.textContent = name;
        container.appendChild(div);
    });
    document.getElementById('secret-word-display').textContent = currentSecretLocation;
    showScreen('imposter-screen');
}

function resetGame() {
    playersData = [];
    showScreen('setup-screen');
}
