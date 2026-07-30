// Telegram Bot sozlamalari
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Masalan: '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ'
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';     // Masalan: '987654321' yoki '-100...' (guruh ID)

let selectedGame = 'Free Fire';
let selectedPackage = '100 Diamant';
let selectedPrice = '13,000 UZS';

// Login tugmasi bosilganda
document.querySelector('.login-btn')?.addEventListener('click', function() {
    const playerId = document.querySelector('.input-group input').value.trim();
    
    if (!playerId) {
        alert('Iltimos, Player ID kiritasiz!');
        return;
    }

    // Player ID qabul qilindi
    alert(`Player ID (${playerId}) muvaffaqiyatli saqlandi! Endi paketni tanlab 'Buy Now' tugmasini bosing.`);
});

// Paketlarni tanlash
document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.item-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        
        // Tanlangan ma'lumotlarni saqlash
        const textContent = this.innerText.split('\n');
        selectedPackage = textContent[0] || '100 Diamant';
        selectedPrice = textContent[1] || '13,000 UZS';

        // Pastki paneldagi narxni yangilash
        document.querySelector('.selected-summary span').innerText = selectedPackage;
        document.querySelector('.selected-summary strong').innerText = selectedPrice;
    });
});

// Buy Now (Sotib olish) tugmasi
document.querySelector('.buy-now-btn')?.addEventListener('click', function() {
    const playerId = document.querySelector('.input-group input').value.trim();

    if (!playerId) {
        alert('Iltimos, avval Player ID kiriting va Login tugmasini bosing!');
        return;
    }

    const message = `🛒 *Yangi Buyurtma!*%0A%0A🎮 *O'yin:* ${selectedGame}%0A🆔 *Player ID:* \`${playerId}\`%0A💎 *Paket:* ${selectedPackage}%0A💰 *Narxi:* ${selectedPrice}`;

    // Telegram Botga yuborish
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}&parse_mode=Markdown`)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('Buyurtmangiz qabul qilindi! Tez orada aloqaga chiqamiz.');
            } else {
                alert('Xatolik yuz berdi! Telegram Bot token yoki Chat ID xato kiritilgan.');
            }
        })
        .catch(error => {
            alert('Tarmoqda xatolik yuz berdi. Qayta urinib ko\'ring!');
        });
});
