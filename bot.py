import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

# Botingiz tokeni
BOT_TOKEN = "8908906277:AAHc3SFpNAu3gnC7JLLyWp59OXwMZaQn508"
bot = telebot.TeleBot(BOT_TOKEN)

# /start bosilganda ishlovchi funksiya
@bot.message_handler(commands=['start'])
def send_welcome(message):
    user_id = message.from_user.id
    
    # Saytingiz (GamePayUZB) manzili — o'zingiznikiga almashtirishingiz mumkin
    site_url = f"https://sizning-app-nomingiz.onrender.com/?user_id={user_id}"
    
    # Rasmdagidek Tugmalarni (Inline Keyboard) yaratish
    keyboard = InlineKeyboardMarkup()
    
    # 1. Nusxalash uchun qulay ID tugmasi (Rasmdagi kabi)
    copy_id_btn = InlineKeyboardButton(
        text=f"📋 {user_id}", 
        switch_inline_query=str(user_id)
    )
    
    # 2. Saytga o'tish uchun ssilka tugmasi
    site_btn = InlineKeyboardButton(
        text="🌐 GamePayUZB Saytiga o'tish", 
        url=site_url
    )
    
    # 3. Ulashish tugmasi (Share)
    share_btn = InlineKeyboardButton(
        text="🔗 ID'ni ulashish", 
        switch_inline_query=f"Mening ID'im: {user_id}"
    )
    
    # Tugmalarni qatorma-qator joylash
    keyboard.add(copy_id_btn)
    keyboard.add(site_btn)
    keyboard.add(share_btn)
    
    # Xabar matni
    text_message = (
        f"<b>Loading...</b>\n\n"
        f"✅ <b>User ID :</b> <code>{user_id}</code>\n\n"
        f"<i>Saytda nikni chiqarish uchun quyidagi tugma orqali o'ting:</i>"
    )
    
    bot.send_message(
        chat_id=message.chat.id, 
        text=text_message, 
        parse_mode="HTML", 
        reply_markup=keyboard
    )

print("Bot ishga tushdi...")
bot.infinity_polling()# Foydalanuvchi yuborgan ID ni qabul qiluvchi handler (Python)
@bot.message_handler(func=lambda message: message.text.isdigit())
def handle_user_id(message):
    user_input_id = message.text # Foydalanuvchi yozgan Free Fire ID (masalan: 8785880742)
    
    # Saytingiz manzili va oxiriga parametrlarni ulaymiz
    site_link = f"https://kamolbek010712-prog.github.io/GamePayUZB/?user_id={user_input_id}"
    
    # Ssilka tugmasini yaratish
    keyboard = InlineKeyboardMarkup()
    site_button = InlineKeyboardButton(text="🌐 Saytda nikni ko'rish", url=site_link)
    keyboard.add(site_button)
    
    bot.send_message(
        chat_id=message.chat.id,
        text=f"✅ <b>ID qabul qilindi:</b> <code>{user_input_id}</code>\n\nNikni va kartalarni tekshirish uchun tugmani bosing:",
        parse_mode="HTML",
        reply_markup=keyboard
    )
