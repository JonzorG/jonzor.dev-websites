const words = [
    "Tacos", "Kebabrulle", "Sushi", "Foodtruck", "Havremjölk", "Islatte", "Proteinshake", "Knäckebröd", 
    "Lussebulle", "Semla", "Kanelbulle", "Julmust", "Påskmust", "godis", "Chokladkaka", "Chips", "Dipp", 
    "Popcorn", "Ostbågar", "Avokadomacka", "Pannkakor", "Våfflor", "Köttbullar", "Falukorv", "Ärtsoppa", 
    "Energidryck", "Margerita", "Bearnaisesås", "Kalles Kaviar", "Bregott", "Swish", "BankID", "TikTok", 
    "Instagram", "Snapchat", "Meme", "Gruppchatt", "E-sport", "AI", "ChatGPT", "Server", "Wifi", "Lösenord", 
    "Powerbank", "Airpods", "Headset", "Tangentbord", "Musmatta", "Elsparkcykel", "Drönare", "Influencer", 
    "Youtuber", "Streamer", "Vlogg", "Fredagsmys", "Lördagsgodis", "Fika", "A-traktor/epa", "Mopedbil", 
    "Busskort", "Kollektivtrafik", "Cykelhjälm", "Reflex", "Vinterjacka", "Mjukisbyxor", "Matlåda", "Termos", 
    "Loppis", "Karantän", "Handsprit", "Hemmakontor", "Systembolaget", "Skatteverket", "Körkort", "Tvättstuga", 
    "Hemläxa", "Skolgård", "Matsal", "Gympasal", "Betyg", "Högskoleprovet", "CSN", "Månadspeng", "Veckopeng", 
    "Lön", "Skatt", "Faktura", "Rea", "Självskanning", "Kvitto", "Chef", "Kollega", "Fikarast", "After Work", 
    "Utvecklingssamtal", "Möte", "Presentation", "Pärm", "Kopieringsmaskin", "Fotboll", "Innebandy", "Ridning", 
    "Gym", "Simhall", "Fritidsgård", "Bibliotek", "Biograf", "Bowling", "Gokart", "Liseberg", "Gröna Lund", 
    "Ullared", "IKEA", "Camping", "Husvagn", "Tält", "Fjällen", "Skidbacke", "Skärgård", "Strand", "Brygga", 
    "Badplats", "Nattklubb", "Festival", "Konsert", "Melodifestivalen", "Eurovision", "Kalle Anka", "Netflix", 
    "Spotify", "Skräckfilm", "Dokumentär", "Brädspel", "Norrsken", "Myggbett", "Fästing", "Pollenallergi", 
    "Snöbollskrig", "Pulka", "Studentflak", "Midsommarstång", "Kräftskiva", "Surströmming", "Julklapp", 
    "Nyårslöfte", "Stjärntecken", "Slask", "Halka", "Snöstorm", "Evolution", "Universum", "Deodorant", 
    "Parfym", "Tandställning", "Solglasögon", "Keps", "Mössa", "Vantar", "Paraply", "Gummistövlar", 
    "Regnjacka", "Plåster", "Huvudvärkstablett", "Feber", "Förkylning", "Toalettpapper", "Tvättmaskin", 
    "Dammsugare", "Diskborste", "Disktrasa", "Tatuering", "Piercing", "Superkraft", "Teleportation", "Tidsresor"
];

let activePlayers = [];
let playersData = [];
let currentPlayerIndex = 0;
let currentSecretWord = "";
let currentFakeWord = "";
let currentImposters = [];
let isCardFlipped = false;

document.addEventListener('DOMContentLoaded', () => {
    renderPlayers();
    
    document.getElementById('new-player-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addNewPlayer();
        }
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
        btn.textContent = '−';
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

    if (newValue >= 1 && newValue <= maxImposters) {
        input.value = newValue;
    }
}

function updateImposterLimit() {
    const input = document.getElementById('imposter-count');
    const playerCount = activePlayers.length;
    let maxImposters = Math.max(1, Math.floor(playerCount / 2));
    if (playerCount <= 3) maxImposters = 1;
    
    if (parseInt(input.value) > maxImposters) {
        input.value = maxImposters;
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
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
        alert("Ni måste vara minst 3 spelare för att starta spelet!");
        return;
    }
    setupRound(activePlayers);
}

function playAgainSamePlayers() {
    if (playersData.length === 0) return resetGame();
    const names = playersData.map(p => p.name);
    setupRound(names);
}

function setupRound(names) {
    let availableWords = [...words];
    
    const wordIndex = Math.floor(Math.random() * availableWords.length);
    currentSecretWord = availableWords.splice(wordIndex, 1)[0];
    
    currentFakeWord = "";
    let fakeWord = "";
    const isKaos = document.getElementById('kaos-mode').checked;
    
    if (isKaos) {
        fakeWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        currentFakeWord = fakeWord;
    }

    playersData = [];
    currentImposters = [];

    const imposterCount = parseInt(document.getElementById('imposter-count').value) || 1;

    let roleAssignments = Array(names.length).fill(false);
    for (let i = 0; i < imposterCount; i++) {
        roleAssignments[i] = true;
    }
    roleAssignments = shuffleArray(roleAssignments);

    for (let i = 0; i < names.length; i++) {
        const isImposter = roleAssignments[i];
        let roleText = currentSecretWord;
        
        if (isImposter) {
            currentImposters.push(names[i]);
            roleText = isKaos ? fakeWord : "IMPOSTER";
        }

        playersData.push({
            name: names[i],
            role: roleText
        });
    }

    currentPlayerIndex = 0;
    
    updatePassScreen();
    showScreen('pass-screen');
}

function updatePassScreen() {
    const player = playersData[currentPlayerIndex];
    document.getElementById('pass-title').textContent = player.name;
    
    isCardFlipped = false;
    document.getElementById('role-card').classList.remove('flipped');
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('role-card-back').className = 'flip-card-back';
}

function showRole() {
    const player = playersData[currentPlayerIndex];
    const roleDisplay = document.getElementById('role-display');
    const cardBack = document.getElementById('role-card-back');
    const roleLabel = document.getElementById('role-label-text');
    
    document.getElementById('reveal-player-name').textContent = player.name;
    roleDisplay.textContent = player.role;
    
    cardBack.classList.remove('is-imposter', 'is-word');

    if (player.role === "IMPOSTER") {
        cardBack.classList.add('is-imposter');
        roleLabel.textContent = "Din roll är:";
    } else {
        cardBack.classList.add('is-word');
        roleLabel.textContent = "Ordet är:";
    }

    showScreen('reveal-screen');
}

function flipCard() {
    if (isCardFlipped) return;
    
    document.getElementById('role-card').classList.add('flipped');
    
    setTimeout(() => {
        document.getElementById('next-btn').classList.remove('hidden');
    }, 400);
    
    isCardFlipped = true;
}

function nextPlayer() {
    currentPlayerIndex++;
    
    if (currentPlayerIndex < playersData.length) {
        updatePassScreen();
        showScreen('pass-screen');
    } else {
        const startingPlayer = playersData[Math.floor(Math.random() * playersData.length)].name;
        document.getElementById('starting-player-display').textContent = `${startingPlayer} börjar!`;
        showScreen('end-screen');
    }
}

function confirmReveal() {
    showScreen('confirm-screen');
}

function cancelReveal() {
    showScreen('end-screen');
}

function revealImposter() {
    const container = document.getElementById('imposter-names-container');
    container.innerHTML = ''; 
    
    currentImposters.forEach(name => {
        const div = document.createElement('div');
        div.className = 'imposter-badge';
        div.textContent = name;
        container.appendChild(div);
    });

    document.getElementById('secret-word-display').textContent = currentSecretWord;
    
    const isKaos = document.getElementById('kaos-mode').checked;
    const fakeWordContainer = document.getElementById('fake-word-container');
    
    if (isKaos) {
        document.getElementById('fake-word-display').textContent = currentFakeWord;
        fakeWordContainer.classList.remove('hidden');
    } else {
        fakeWordContainer.classList.add('hidden');
    }

    showScreen('imposter-screen');
}

function resetGame() {
    playersData = [];
    showScreen('setup-screen');
}
