// Telegram Bot Sozlamalari
const TELEGRAM_BOT_TOKEN = '8908906277:AAHc3SFpNAu3gnC7JLLyWp59OXwMZaQn508'; 
const TELEGRAM_CHAT_ID = '93372553';     

// Boshlang'ich tanlovlar
let selectedGame = 'Free Fire';
let selectedPackage = '100 Diamant';
let selectedPrice = '13,000 UZS';

// O'yinlar va Ularning Narxlari Ro'yxati
const packagesData = {
    ff: [
        { name: '100 Diamant', price: '13,000 UZS' },
        { name: '310 Diamant', price: '38,000 UZS' },
        { name: '520 Diamant', price: '63,000 UZS' },
        { name: '1060 Diamant', price: '125,000 UZS' },
        { name: '2200 Diamant', price: '250,000 UZS' },
        { name: '5600 Diamant', price: '610,000 UZS' },
        { name: 'Weekly Membership', price: '25,000 UZS' },
        { name: 'Monthly Membership', price: '110,000 UZS' }
    ],
    pubg: [
        { name: '60 UC', price: '14,000 UZS' },
        { name: '325 UC', price: '65,000 UZS' },
        { name: '660 UC', price: '128,000 UZS' },
        { name: '1800 UC', price: '330,000 UZS' },
        { name: '3850 UC', price: '650,000 UZS' },
        { name: '8100 UC', price: '1,300,000 UZS' }
    ]
};

// O'yinni o'zgartirish (FF va PUBG)
function selectGame(gameType) {
    const ffBtn = document.getElementById('game-ff');
    const pubgBtn = document.getElementById('game-pubg');
    
    if (gameType === 'ff') {
        selectedGame = 'Free Fire';
        if (ffBtn) ffBtn.classList.add('active');
        if (pubgBtn) pubgBtn.classList.remove('active');
    } else if (gameType === 'pubg') {
        selectedGame = 'PUBG Mobile';
        if (pubgBtn) pubgBtn.classList.add('active');
        if (ffBtn) ffBtn.classList.remove('active');
    }

    renderPackages(gameType);
}

// Tanlangan o'yinga qarab paketlarni ekranga chiqarish
function renderPackages(gameType) {
    const container = document.getElementById('package-container');
    if (!container) return;

    container.innerHTML = '';
    const list = packagesData[gameType];

    list.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `item-card ${index === 0 ? 'active' : ''}`;
        card.innerHTML = `
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

    // Boshlang'ich birinchi elementni tanlab qo'yish
    if (list.length > 0) {
        selectedPackage = list[0].name;
        selectedPrice = list[0].price;
        updateSummary();
    }
}

// Chek panelida narxni yangilash
function updateSummary() {
    const displayItem = document.getElementById('selected-item-display');
    const displayPrice = document.getElementById('selected-price-display');

    if (displayItem) displayItem.innerText = selectedPackage;
    if (displayPrice) displayPrice.innerText = selectedPrice;
}

// Buyurtmani botga yuborish
async function processOrder() {
    const playerIdInput = document.getElementById('player-id');
    const playerId = playerIdInput ? playerIdInput.value.trim() : '';

    if (!playerId) {
        alert("Iltimos, avval Player ID kiriting va Login tugmasini bosing!");
        return;
    }

    const message = `🛒 *YANGI BUYURTMA (GamePayUZB)*%0A%0A🎮 *O'yin:* ${selectedGame}%0A🆔 *Player ID:* \`${playerId}\`%0A💎 *Paket:* ${selectedPackage}%0A💰 *Narxi:* ${selectedPrice}`;

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}&parse_mode=Markdown`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (data.ok) {
            alert(`Buyurtmangiz qabul qilindi!\n\nO'yin: ${selectedGame}\nPaket: ${selectedPackage}\nNarxi: ${selectedPrice}`);
        } else {
            alert("Xatolik: Bot Token yoki Chat ID xato kiritilgan.");
        }
    } catch (err) {
        alert("Internet ulanishida xatolik yuz berdi!");
    }
}

// Boshlang'ich yuklanish
document.addEventListener('DOMContentLoaded', () => {
    renderPackages('ff');
});
