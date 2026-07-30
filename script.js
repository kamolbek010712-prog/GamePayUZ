// GamePayUZB Paketlar Bazasi
const DB = {
  ff: {
    standard: [
      { id: 'ff_100', name: '100 Diamant', price: 13000 },
      { id: 'ff_310', name: '310 Diamant', price: 38000 },
      { id: 'ff_520', name: '520 Diamant', price: 63000 },
      { id: 'ff_1060', name: '1060 Diamant', price: 125000 },
      { id: 'ff_2200', name: '2200 Diamant', price: 250000 },
      { id: 'ff_5600', name: '5600 Diamant', price: 610000 }
    ],
    special: [
      { id: 'ff_weekly', name: 'Weekly Membership', price: 25000 },
      { id: 'ff_monthly', name: 'Monthly Membership', price: 110000 },
      { id: 'ff_booyah', name: 'Booyah Pass Card', price: 45000 }
    ]
  },
  pubg: {
    standard: [
      { id: 'pubg_60', name: '60 UC', price: 14000 },
      { id: 'pubg_325', name: '325 UC', price: 68000 },
      { id: 'pubg_660', name: '660 UC', price: 135000 },
      { id: 'pubg_1800', name: '1800 UC', price: 360000 },
      { id: 'pubg_3850', name: '3850 UC', price: 730000 },
      { id: 'pubg_8100', name: '8100 UC', price: 1450000 }
    ],
    special: [
      { id: 'pubg_rp', name: 'Royale Pass (RP)', price: 120000 },
      { id: 'pubg_elite', name: 'Elite Pass Plus', price: 290000 },
      { id: 'pubg_voucher', name: 'Vaucher Paketi', price: 30000 }
    ]
  }
};

let selectedGame = 'ff';
let selectedItem = null;
let hasPaid = false; // To'lov holati

function selectGame(game) {
  selectedGame = game;
  selectedItem = null;
  document.getElementById('game-ff').classList.toggle('active', game === 'ff');
  document.getElementById('game-pubg').classList.toggle('active', game === 'pubg');
  renderPackages();
  updateCheckout();
}

function renderPackages() {
  const stdContainer = document.getElementById('standard-packages');
  const spcContainer = document.getElementById('special-packages');
  
  stdContainer.innerHTML = '';
  spcContainer.innerHTML = '';

  DB[selectedGame].standard.forEach(item => {
    stdContainer.appendChild(createCard(item));
  });

  DB[selectedGame].special.forEach(item => {
    spcContainer.appendChild(createCard(item));
  });
}

function createCard(item) {
  const div = document.createElement('div');
  div.className = `item-card ${selectedItem?.id === item.id ? 'active' : ''}`;
  div.innerHTML = `<div>${item.name}</div><small style="color:#888;">${item.price.toLocaleString()} UZS</small>`;
  div.onclick = () => {
    selectedItem = item;
    renderPackages();
    updateCheckout();
  };
  return div;
}

function updateCheckout() {
  if (selectedItem) {
    document.getElementById('selected-item-display').innerText = selectedItem.name;
    document.getElementById('selected-price-display').innerText = `${selectedItem.price.toLocaleString()} UZS`;
  } else {
    document.getElementById('selected-item-display').innerText = 'Hali hech narsa tanlanmadi';
    document.getElementById('selected-price-display').innerText = '0 UZS';
  }
}

function verifyId() {
  const playerId = document.getElementById('player-id').value.trim();
  if (!playerId) {
    alert("Iltimos, Player ID raqamingizni kiriting!");
  } else {
    alert(`Player ID (${playerId}) tasdiqlandi! Endi paketni tanlang.`);
  }
}

async function processOrder() {
  const playerId = document.getElementById('player-id').value.trim();
  if (!playerId) return alert("Iltimos, Player ID kiring!");
  if (!selectedItem) return alert("Iltimos, paketni tanlang!");

  // Serverga to'lov so'rovi
  try {
    const res = await fetch('/api/pay', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ playerId, itemId: selectedItem.id, game: selectedGame })
    });

    const data = await res.json();
    if (data.success) {
      hasPaid = true; // To'lov tasdiqlandi
      alert("To'lov muvaffaqiyatli bajarildi!");
      
      // Omad barabani modalini ochish
      document.getElementById('wheel-modal').style.display = 'flex';
    }
  } catch (err) {
    alert("Serverga ulanishda xatolik yuz berdi!");
  }
}

// Omad Barabani Aylantirish Logikasi
function spinWheel() {
  if (!hasPaid) return alert("Barabanni aylantirish uchun avval to'lov qilishingiz kerak!");

  const wheel = document.getElementById('wheel');
  const btn = document.getElementById('spin-btn');
  btn.disabled = true;

  const randomDegree = Math.floor(1800 + Math.random() * 360); // Kamida 5 marta to'liq aylanadi
  wheel.style.transform = `rotate(${randomDegree}deg)`;

  setTimeout(() => {
    alert("Tabriklaymiz! Bonusingiz Player ID hisobingizga muvaffaqiyatli o'tkazildi!");
    document.getElementById('wheel-modal').style.display = 'none';
    hasPaid = false; // Baraban ishlatib bo'lindi
    btn.disabled = false;
  }, 4000);
}

// Dastlabki yuklanish
renderPackages();
