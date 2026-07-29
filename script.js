// 1. Firebase Konfiguratsiyasi (Firebase konsolingizdan olingan ma'lumotlarni bu yerga qo'ying)
const firebaseConfig = {
    apiKey: "GamePayUZ",
    authDomain: "fifaakk28888@gmail.com",
    projectId: "6856443145",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "Iltimos biz ham odam sabirli bo'ling!!!",
    appId: "YOUR_APP_ID"
};

// Firebase-ni ishga tushirish
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Telegram Bot Sozlamalari
const TG_BOT_TOKEN = "8883755668:AAEcJOozXHDlQTqD3KSj1ShRupoYMWaCoKw";
const TG_CHAT_ID = "93372553";
const ADMIN_PASSWORD = "GamePayUzAdmin2026!"; // Admin panel paroli

// O'yinlar Ma'lumoti
const gameData = {
    ff: {
        name: "Free Fire",
        banner: "Free Fire - 100% Xavfsiz Olmoslar",
        unit: " Olmos",
        packages: [
            { id: "ff_53", amount: "53 + 53", price: 13000 },
            { id: "ff_108", amount: "1080", price: 130000 },
            { id: "ff_220", amount: "2200", price: 260000 },
            { id: "ff_560", amount: "5600", price: 520000 }
        ]
    },
    pubg: {
        name: "PUBG Mobile",
        banner: "PUBG Mobile - Tezkor UC Yuklash",
        unit: " UC",
        packages: [
            { id: "pubg_60", amount: "60", price: 14000 },
            { id: "pubg_325", amount: "325", price: 65000 },
            { id: "pubg_660", amount: "660", price: 125000 },
            { id: "pubg_1800", amount: "1800", price: 310000 }
        ]
    }
};

let currentGame = 'ff';
let selectedPackage = null;
let isVerified = false;
let allOrders = [];

// DOM Elementlar
const userPage = document.getElementById('userPage');
const adminPage = document.getElementById('adminPage');
const adminToggleBtn = document.getElementById('adminToggleBtn');
const packagesGrid = document.getElementById('packagesGrid');
const bannerText = document.getElementById('bannerText');
const playerIdInput = document.getElementById('playerIdInput');
const verifyBtn = document.getElementById('verifyBtn');
const verifyStatus = document.getElementById('verifyStatus');
const checkoutPackage = document.getElementById('checkoutPackage');
const checkoutPrice = document.getElementById('checkoutPrice');
const buyBtn = document.getElementById('buyBtn');

// Sahifani render qilish
function renderPackages() {
    packagesGrid.innerHTML = '';
    gameData[currentGame].packages.forEach(pkg => {
        const card = document.createElement('div');
        card.className = `package-card ${selectedPackage?.id === pkg.id ? 'active' : ''}`;
        card.innerHTML = `
            <div class="package-amount">${pkg.amount} ${gameData[currentGame].unit}</div>
            <div class="package-price">${pkg.price.toLocaleString()} UZS</div>
        `;
        card.onclick = () => {
            selectedPackage = pkg;
            renderPackages();
            updateCheckoutBar();
        };
        packagesGrid.appendChild(card);
    });
}

function updateCheckoutBar() {
    if (selectedPackage) {
        checkoutPackage.innerText = `${gameData[currentGame].name} - ${selectedPackage.amount}`;
        checkoutPrice.innerText = `${selectedPackage.price.toLocaleString()} UZS`;
    } else {
        checkoutPackage.innerText = "Tanlanmagan";
        checkoutPrice.innerText = "0 UZS";
    }
}

// O'yinni almashtirish jalyoni
document.getElementById('gameFF').onclick = () => {
    currentGame = 'ff';
    selectedPackage = null;
    document.getElementById('gameFF').classList.add('active');
    document.getElementById('gamePUBG').classList.remove('active');
    bannerText.innerText = gameData.ff.banner;
    renderPackages();
    updateCheckoutBar();
};

document.getElementById('gamePUBG').onclick = () => {
    currentGame = 'pubg';
    selectedPackage = null;
    document.getElementById('gamePUBG').classList.add('active');
    document.getElementById('gameFF').classList.remove('active');
    bannerText.innerText = gameData.pubg.banner;
    renderPackages();
    updateCheckoutBar();
};

// ID tekshirish
verifyBtn.onclick = () => {
    const id = playerIdInput.value.trim();
    if (id.length >= 5) {
        isVerified = true;
        verifyStatus.innerText = `✓ ID Qabul qilindi: ${id}`;
        verifyStatus.style.color = 'green';
    } else {
        alert("Iltimos, to'g'ri o'yinchi ID-sini kiriting!");
        isVerified = false;
        verifyStatus.innerText = '';
    }
};

// Sotib olish va Telegram + Firebase-ga yuborish
buyBtn.onclick = async () => {
    const id = playerIdInput.value.trim();
    if (!isVerified || !id) return alert("Avval ID-ni tekshiring!");
    if (!selectedPackage) return alert("Tarifni tanlang!");

    const orderId = "GP" + Date.now();
    const orderData = {
        order_id: orderId,
        game: gameData[currentGame].name,
        player_id: id,
        amount: selectedPackage.amount + gameData[currentGame].unit,
        price: selectedPackage.price,
        status: "Kutilmoqda",
        created_at: new Date().toLocaleString()
    };

    try {
        // Firebase Firestore-ga saqlash (Xavfsiz ma'lumotlar bazasi)
        await db.collection("orders").doc(orderId).set(orderData);

        // Telegramga yuborish
        const message = `🛍 *YANGI BUYURTMA*:\n\n` +
                        `🆔 *ID*: \`${orderId}\`\n` +
                        `🎮 *O'yin*: ${orderData.game}\n` +
                        `👤 *O'yinchi ID*: \`${orderData.player_id}\`\n` +
                        `💎 *Miqdor*: ${orderData.amount}\n` +
                        `💰 *Narxi*: ${orderData.price.toLocaleString()} UZS\n` +
                        `⏳ *Holati*: Kutilmoqda`;

        await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: TG_CHAT_ID, text: message, parse_mode: "Markdown" })
        });

        alert(`🎉 Buyurtma muvaffaqiyatli yuborildi! ID: ${orderId}`);
        playerIdInput.value = '';
        verifyStatus.innerText = '';
        selectedPackage = null;
        isVerified = false;
        updateCheckoutBar();
        renderPackages();

    } catch (error) {
        alert("Xatolik yuz berdi. Internetni tekshiring!");
    }
};

// ADMIN PANEL FUNKSIYALARI
adminToggleBtn.onclick = () => {
    userPage.classList.toggle('hidden');
    adminPage.classList.toggle('hidden');
    if (adminPage.classList.contains('hidden')) {
        adminToggleBtn.innerText = "Admin Panel";
    } else {
        adminToggleBtn.innerText = "Asosiy Sahifa";
        checkAdminSession();
    }
};

document.getElementById('adminLoginBtn').onclick = () => {
    const pass = document.getElementById('adminPasswordInput').value;
    if (pass === ADMIN_PASSWORD) {
        localStorage.setItem('admin_logged', 'true');
        checkAdminSession();
    } else {
        alert("Parol noto'g'ri!");
    }
};

document.getElementById('adminLogoutBtn').onclick = () => {
    localStorage.removeItem('admin_logged');
    checkAdminSession();
};

function checkAdminSession() {
    const isLogged = localStorage.getItem('admin_logged') === 'true';
    if (isLogged) {
        document.getElementById('adminLoginBox').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        listenToOrders();
    } else {
        document.getElementById('adminLoginBox').classList.remove('hidden');
        document.getElementById('adminDashboard').classList.add('hidden');
    }
}

// Ma'lumotlarni real vaqtda bazadan o'qish va statistika qilish
function listenToOrders() {
    db.collection("orders").orderBy("order_id", "desc").onSnapshot(snapshot => {
        allOrders = [];
        let totalCount = 0;
        let totalSum = 0;
        let pendingCount = 0;
        let successCount = 0;

        snapshot.forEach(doc => {
            const order = doc.data();
            allOrders.push(order);

            totalCount++;
            totalSum += order.price;
            if (order.status === "Kutilmoqda") pendingCount++;
            if (order.status === "Bajarildi") successCount++;
        });

        // Statistikani yangilash
        document.getElementById('statTotalCount').innerText = totalCount + " ta";
        document.getElementById('statTotalSum').innerText = totalSum.toLocaleString() + " UZS";
        document.getElementById('statPendingCount').innerText = pendingCount + " ta";
        document.getElementById('statSuccessCount').innerText = successCount + " ta";

        renderOrdersTable(allOrders);
    });
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';

    orders.forEach(order => {
        const tr = document.createElement('tr');
        let statusColor = order.status === 'Bajarildi' ? 'green' : order.status === 'Rad etildi' ? 'red' : 'orange';
        
        tr.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.game}</td>
            <td>${order.player_id}</td>
            <td>${order.amount}</td>
            <td>${order.price.toLocaleString()} UZS</td>
            <td style="font-weight: bold; color: ${statusColor}">${order.status}</td>
            <td>
                ${order.status === 'Kutilmoqda' ? `
                    <div class="action-buttons">
                        <button onclick="updateStatus('${order.order_id}', 'Bajarildi')" class="btn-action btn-success">✓</button>
                        <button onclick="updateStatus('${order.order_id}', 'Rad etildi')" class="btn-action btn-danger">X</button>
                    </div>
                ` : 'Tugallangan'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.updateStatus = async (orderId, newStatus) => {
    try {
        await db.collection("orders").doc(orderId).update({ status: newStatus });
    } catch (error) {
        alert("Statusni o'zgartirishda xatolik!");
    }
};

// Qidiruv tizimi
document.getElementById('searchInput').oninput = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allOrders.filter(o => 
        o.order_id.toLowerCase().includes(query) || 
        o.player_id.toLowerCase().includes(query)
    );
    renderOrdersTable(filtered);
};

// Ilk yuklanganda paketlarni ko'rsatish
renderPackages();