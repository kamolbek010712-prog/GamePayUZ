const TELEGRAM_BOT_TOKEN = '8908906277:AAHc3SFpNAu3gnC7JLLyWp59OXwMZaQn508'; 
const TELEGRAM_CHAT_ID = '8785880742';     

let selectedGame = 'Free Fire';
let selectedPackage = '100 Diamant';
let selectedPrice = '13,000 UZS';

// Rasmli Paketlar
const packagesData = {
    ff: [
        { name: '100 Diamant', price: '13,000 UZS', img: 'https://img.icons8.com/emoji/48/diamond-emoji.png' },
        { name: '310 Diamant', price: '38,000 UZS', img: 'https://img.icons8.com/emoji/48/diamond-emoji.png' },
        { name: '520 Diamant', price: '63,000 UZS', img: 'https://img.icons8.com/emoji/48/diamond-emoji.png' },
        { name: '1060 Diamant', price: '125,000 UZS', img: 'https://img.icons8.com/emoji/48/diamond-emoji.png' },
        { name: '2200 Diamant', price: '250,000 UZS', img: 'https://img.icons8.com/emoji/48/diamond-emoji.png' },
        { name: 'Weekly Pass', price: '25,000 UZS', img: 'https://img.icons8.com/color/48/ticket.png' },
        { name: 'Monthly Pass', price: '110,000 UZS', img: 'https://img.icons8.com/color/48/vip.png' }
    ],
    pubg: [
        { name: '60 UC', price: '14,000 UZS', img: 'https://img.icons8.com/color/48/coins.png' },
        { name: '325 UC', price: '65,000 UZS', img: 'https://img.icons8.com/color/48/coins.png' },
        { name: '660 UC', price: '128,000 UZS', img: 'https://img.icons8.com/color/48/coins.png' },
        { name: '1800 UC', price: '330,000 UZS', img: 'https://img.icons8.com/color/48/coins.png' },
        { name: '3850 UC', price: '650,000 UZS', img: 'https://img.icons8.com/color/48/coins.png' }
    ]
};

function selectGame(gameType) {
    document.getElementById('game-ff')?.classList.toggle('active', gameType === 'ff');
    document.getElementById('game-pubg')?.classList.toggle('active', gameType === 'pubg');
    
    selectedGame = gameType === 'ff' ? 'Free Fire' : 'PUBG Mobile';
    renderPackages(gameType);
}

// 📌 USER "CHECK ID" BOSGANDA TELEGRAMGA HABAR BORADI
async function requestCheckId() {
    const playerId = document.getElementById('player-id')?.value.trim();
    const statusBox = document.getElementById('nickname-status');

    if (!playerId) {
        alert("Iltimos, Player ID kiriting!");
        return;
    }

    if (statusBox) {
        statusBox.style.background = "#3b2a1a";
        statusBox.style.color = "#ffc107";
        statusBox.innerHTML = `⏳ <b>ID: ${playerId}</b> tekshirish uchun yuborildi. Botingiz orqali tekshirilmoqda...`;
    }

    // Telegram Admin'ga xabar yuborish
    const msg = `🔍 *PLAYER ID TEKSHIRISH SO'ROVI*%0A%0A🎮 *O'yin:* ${selectedGame}%0A🆔 *Player ID:* \`${playerId}\`%0A%0A_Iltimos, Top-up Center'dan Nickname'ni ko'rib javob bering!_`;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${msg}&parse_mode=Markdown`);
    } catch (e) {}
}

function renderPackages(gameType) {
    const container = document.getElementById('package-container');
    if (!container) return;

    container.innerHTML = '';
    const list = packagesData[gameType];

    list.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `item-card ${index === 0 ? 'active' : ''}`;
        card.innerHTML = `
            <img src="${item.img}" alt="icon">
            <h3>${item.name}</h3>
            <p>${item.price}</p>
        `;

        card.addEventListener('click', () => {
            document.querySelectorAll('.item-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedPackage = item.name;
            selectedPrice = item.price;
            updateSummary();
        });

        container.appendChild(card);
    });

    if (list.length > 0) {
        selectedPackage = list[0].name;
        selectedPrice = list[0].price;
        updateSummary();
    }
}

function updateSummary() {
    document.getElementById('selected-item-display').innerText = selectedPackage;
    document.getElementById('selected-price-display').innerText = selectedPrice;
}

// Buyurtma berish
async function processOrder() {
    const playerId = document.getElementById('player-id')?.value.trim();

    if (!playerId) {
        alert("Iltimos, Player ID kiriting!");
        return;
    }

    const message = `🛒 *YANGI BUYURTMA (GamePayUZB)*%0A%0A🎮 *O'yin:* ${selectedGame}%0A🆔 *Player ID:* \`${playerId}\`%0A💎 *Paket:* ${selectedPackage}%0A💰 *Narxi:* ${selectedPrice}`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}&parse_mode=Markdown`);
        const data = await res.json();

        if (data.ok) {
            alert(`Buyurtmangiz qabul qilindi!\n\nPlayer ID: ${playerId}\nPaket: ${selectedPackage}`);
        }
    } catch (err) {
        alert("Xatolik yuz berdi!");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderPackages('ff');
});
