// Telegram Bot Sozlamalari
const TELEGRAM_BOT_TOKEN = '8908906277:AAHc3SFpNAu3gnC7JLLyWp59OXwMZaQn508'; 
const TELEGRAM_CHAT_ID = '8785880742';     

let selectedGame = 'Free Fire';
let selectedPackage = '100 + 100 Bonus';
let selectedPrice = '13,000 UZS';
let wonBonus = 'Yo\'q';

// FREE FIRE VA PUBG UCHUN HAQIQIY O'YIN RASMLARI
const packagesData = {
    ff: [
        { 
            name: '100 + 100 Bonus', 
            price: '13,000 UZS', 
            img: 'https://img.icons8.com/3d-fluency/94/diamond.png', 
            tag: 'BONUS' 
        },
        { 
            name: '310 + 310 Bonus', 
            price: '38,000 UZS', 
            img: 'https://cdn-icons-png.flaticon.com/512/8146/8146767.png', 
            tag: 'BONUS' 
        },
        { 
            name: '520 + 520 Bonus', 
            price: '63,000 UZS', 
            img: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png', 
            tag: 'POPULAR' 
        },
        { 
            name: '1060 Diamant', 
            price: '125,000 UZS', 
            img: 'https://cdn-icons-png.flaticon.com/512/2855/2855589.png', 
            tag: 'CHEST' 
        },
        { 
            name: '2180 Diamant', 
            price: '250,000 UZS', 
            img: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', 
            tag: 'VAULT' 
        },
        { 
            name: '5600 Diamant', 
            price: '610,000 UZS', 
            img: 'https://cdn-icons-png.flaticon.com/512/3514/3514242.png', 
            tag: 'BIG VAULT' 
        },
        { 
            name: 'Weekly Pass (Haftalik)', 
            price: '25,000 UZS', 
            img: 'https://cdn-icons-png.flaticon.com/512/9378/9378276.png', 
            tag: 'WEEKLY' 
        },
        { 
            name: 'Monthly Pass (Oylik)', 
            price: '110,000 UZS', 
            img: 'https://cdn-icons-png.flaticon.com/512/2543/2543206.png', 
            tag: 'MONTHLY' 
        }
    ],
    pubg: [
        { name: '60 UC', price: '14,000 UZS', img: 'https://cdn-icons-png.flaticon.com/512/9378/9378276.png', tag: '60 UC' },
        { name: '325 UC', price: '65,000 UZS', img: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png', tag: '300+25 UC' },
        { name: '660 UC', price: '128,000 UZS', img: 'https://cdn-icons-png.flaticon.com/512/2855/2855622.png', tag: '600+60 UC' },
        { name: '1800 UC', price: '330,000 UZS', img: 'https://cdn-icons-png.flaticon.com/512/2855/2855589.png', tag: '1500+300 UC' },
        { name: '3850 UC', price: '650,000 UZS', img: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', tag: '3000+850 UC' },
        { name: '8100 UC', price: '1,320,000 UZS', img: 'https://cdn-icons-png.flaticon.com/512/3514/3514242.png', tag: '6000+2100 UC' },
        { name: 'Royale Pass Pack', price: '110,000 UZS', img: 'https://cdn-icons-png.flaticon.com/512/2543/2543332.png', tag: 'RP VAUCHER' }
    ]
};

// O'yinni tanlash
window.selectGame = function(gameType) {
    document.getElementById('game-ff')?.classList.toggle('active', gameType === 'ff');
    document.getElementById('game-pubg')?.classList.toggle('active', gameType === 'pubg');
    
    selectedGame = gameType === 'ff' ? 'Free Fire' : 'PUBG Mobile';
    renderPackages(gameType);
};

// Player ID ni Telegram'ga yuborish (Check ID)
window.requestCheckId = async function() {
    const playerId = document.getElementById('player-id')?.value.trim();
    const statusBox = document.getElementById('nickname-status');

    if (!playerId) {
        alert("Iltimos, Player ID kiriting!");
        return;
    }

    if (statusBox) {
        statusBox.style.background = "#3b2a1a";
        statusBox.style.color = "#ffc107";
        statusBox.innerHTML = `⏳ <b>ID: ${playerId}</b> tekshirish uchun admin botiga yuborildi...`;
    }

    const messageText = `🔍 *NEW ID CHECK REQUEST*\n\n🎮 *O'yin:* ${selectedGame}\n🆔 *Player ID:* \`${playerId}\`\n\nTasdiqlash uchun botga yozing:\n\`/nick ${playerId} NICKNAME\``;

    const checkUrl = selectedGame === 'Free Fire' 
        ? `https://shop2game.com/` 
        : `https://www.midasbuy.com/`;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: messageText,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🔗 Rasmiy Saytdan Tekshirish", url: checkUrl }],
                        [{ text: "❌ Xato ID (Rad etish)", callback_data: `reject_${playerId}` }]
                    ]
                }
            })
        });

    } catch(e) {
        if (statusBox) {
            statusBox.style.background = "#3b1a1a";
            statusBox.style.color = "#dc3545";
            statusBox.innerHTML = `❌ Xatolik yuz berdi! Internetni tekshiring.`;
        }
    }
};

// Omad Barabani
window.spinWheel = function() {
    const wheel = document.getElementById('wheel');
    const resultText = document.getElementById('bonus-result');
    const bonusDisplay = document.getElementById('bonus-display');

    const prizes = ['+10 Diamant', '+50 Diamant', '+100 Diamant', '+20 Diamant', '+200 Diamant', 'Weekly Pass'];
    const randomDegree = Math.floor(1800 + Math.random() * 360);
    
    if (wheel) wheel.style.transform = `rotate(${randomDegree}deg)`;

    setTimeout(() => {
        const prizeIndex = Math.floor(Math.random() * prizes.length);
        wonBonus = prizes[prizeIndex];

        if (resultText) resultText.innerHTML = `🎉 Tabriklaymiz! Siz <b>${wonBonus}</b> bonus yutdingiz!`;
        if (bonusDisplay) bonusDisplay.innerText = `🎁 Bonus: ${wonBonus}`;
    }, 4000);
};

// Paketlarni ekranga chiqarish
function renderPackages(gameType) {
    const container = document.getElementById('package-container');
    if (!container) return;

    container.innerHTML = '';
    const list = packagesData[gameType];

    list.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `item-card ${index === 0 ? 'active' : ''}`;
        card.innerHTML = `
            ${item.tag ? `<span class="badge-bonus">${item.tag}</span>` : ''}
            <img src="${item.img}" alt="${item.name}">
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
    const itemDisp = document.getElementById('selected-item-display');
    const priceDisp = document.getElementById('selected-price-display');
    if (itemDisp) itemDisp.innerText = selectedPackage;
    if (priceDisp) priceDisp.innerText = selectedPrice;
}

// Buyurtma Yuborish (Buy Now)
window.processOrder = async function() {
    const playerId = document.getElementById('player-id')?.value.trim();

    if (!playerId) {
        alert("Iltimos, Player ID kiriting!");
        return;
    }

    const message = `🛒 *YANGI BUYURTMA (GamePayUZB)*\n\n🎮 *O'yin:* ${selectedGame}\n🆔 *Player ID:* \`${playerId}\`\n💎 *Paket:* ${selectedPackage}\n💰 *Narxi:* ${selectedPrice}\n🎁 *Bonus:* ${wonBonus}`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await res.json();
        if (data.ok) {
            alert(`Buyurtmangiz qabul qilindi!\n\nPlayer ID: ${playerId}\nPaket: ${selectedPackage}\nBonus: ${wonBonus}`);
        }
    } catch (err) {
        alert("Xatolik yuz berdi!");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderPackages('ff');
});
