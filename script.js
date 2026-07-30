// ==========================================
// 1. TELEGRAM BOT SOZLAMALARI
// ==========================================
const TELEGRAM_BOT_TOKEN = '8908906277:AAHc3SFpNAu3gnC7JLLyWp59OXwMZaQn508'; 
const TELEGRAM_CHAT_ID = '93372553';     

// Boshlang'ich holat
let selectedGame = 'Free Fire';
let selectedPackage = '100 Diamant';
let selectedPrice = '13,000 UZS';

// ==========================================
// 2. O'YINLAR VA PAKETLAR RO'YXATI (NARXLAR)
// ==========================================
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

// O'yin almashganda paketlarni ekranga chiqarish
function selectGame(gameType) {
    const container = document.querySelector('.package-grid')  document.querySelector('.section-container');
    
    if (gameType === 'ff') {
        selectedGame = 'Free Fire';
    } else {
        selectedGame = 'PUBG Mobile';
    }

    // Odatiy birinchi elementni tanlab qo'yish
    const list = packagesData[gameType];
    if (list && list.length > 0) {
        selectedPackage = list[0].name;
        selectedPrice = list[0].price;
        updateSummary();
    }
}

// Pastki panelda tanlangan paket va narxni ko'rsatish
function updateSummary() {
    const displayItem = document.getElementById('selected-item-display')  document.querySelector('.selected-summary span');
    const displayPrice = document.getElementById('selected-price-display')  document.querySelector('.selected-summary strong');

    if (displayItem) displayItem.innerText = selectedPackage;
    if (displayPrice) displayPrice.innerText = selectedPrice;
}

// Card bosilganda paket va narxni tutib olish
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.item-card');
        if (card) {
            document.querySelectorAll('.item-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Card ichidagi yozuvlardan paket nomi va narxini ajratib olish
            const lines = card.innerText.split('\n').filter(t => t.trim() !== '');
            if (lines.length >= 2) {
                selectedPackage = lines[0].trim();
                selectedPrice = lines[1].trim();
            } else if (lines.length === 1) {
                selectedPackage = lines[0].trim();
            }

            updateSummary();
        }
    });
});

// ==========================================
// 3. BUYNOW - BOTGA YUBORISH
// ==========================================
async function processOrder() {
    const playerIdInput = document.getElementById('player-id')  document.querySelector('.input-group input');
    const playerId = playerIdInput ? playerIdInput.value.trim() : '';

    if (!playerId) {
        alert("Iltimos, avval Player ID kiriting!");
        return;
    }

    const message = 🛒 *YANGI BUYURTMA (GamePayUZB)*%0A%0A🎮 *O'yin:* ${selectedGame}%0A🆔 *Player ID:* \${playerId}\%0A💎 *Paket:* ${selectedPackage}%0A💰 *Narxi:* ${selectedPrice};

    try {
        const url = https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}&parse_mode=Markdown;
        
        const res = await fetch(url);
        const data = await res.json();if (data.ok) {
            alert(Buyurtmangiz qabul qilindi!\n\nO'yin: ${selectedGame}\nPaket: ${selectedPackage}\nNarxi: ${selectedPrice});
        } else {
            alert("Xatolik: Bot Token yoki Chat ID xato kiritilgan.");
        }
    } catch (err) {
        alert("Internet ulanishida xatolik yuz berdi!");
    }
}
