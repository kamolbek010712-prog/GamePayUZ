import requests
import telebot
from telebot import types

# Sozlamalar
BOT_TOKEN = '8908906277:AAHc3SFpNAu3gnC7JLLyWp59OXwMZaQn508'
FIREBASE_URL = "https://gamepay-web-default-rtdb.firebaseio.com/checks"

bot = telebot.TeleBot(BOT_TOKEN)

# Saytga "Muvaffaqiyatli" (Nick bilan) habar yuborish
def approve_player(player_id, nickname):
    url = f"{FIREBASE_URL}/{player_id}.json"
    data = {
        "status": "success",
        "nickname": nickname
    }
    requests.patch(url, json=data)

# Saytga "Xatolik" habarini yuborish
def reject_player(player_id):
    url = f"{FIREBASE_URL}/{player_id}.json"
    data = {
        "status": "error"
    }
    requests.patch(url, json=data)

# /start buyrug'i
@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "GamePayUZ Admin Boti ishga tushdi! 🚀\n\nSaytdan tekshirish so'rovlari shu yerga tushadi.")

# Nickname tasdiqlash uchun buyruq: /nick ID NICKNAME
# Masalan: /nick 9775793347 GAMER_UZ
@bot.message_handler(commands=['nick'])
def set_nickname(message):
    try:
        args = message.text.split(maxsplit=2)
        if len(args) < 3:
            bot.reply_to(message, "⚠️ Qolib: `/nick PLAYER_ID NICKNAME`\nMasalan: `/nick 9775793347 PRO_PLAYER`", parse_mode="Markdown")
            return
        
        player_id = args[1]
        nickname = args[2]
        
        approve_player(player_id, nickname)
        bot.reply_to(message, f"✅ **ID:** `{player_id}`\n👤 **Nick:** `{nickname}`\n\nSaytga muvaffaqiyatli yuborildi!", parse_mode="Markdown")
    except Exception as e:
        bot.reply_to(message, f"❌ Xatolik: {str(e)}")

# ID xatoligini bildirish uchun buyruq: /xato ID
# Masalan: /xato 9775793347
@bot.message_handler(commands=['xato'])
def set_error(message):
    try:
        args = message.text.split()
        if len(args) < 2:
            bot.reply_to(message, "⚠️ Qolib: `/xato PLAYER_ID`\nMasalan: `/xato 9775793347`", parse_mode="Markdown")
            return
        
        player_id = args[1]
        reject_player(player_id)
        bot.reply_to(message, f"❌ **ID:** `{player_id}` uchun xatolik buyrug'i saytga yuborildi!", parse_mode="Markdown")
    except Exception as e:
        bot.reply_to(message, f"❌ Xatolik: {str(e)}")

# Botni uzluksiz eshitish rejimi
print("Bot ishga tushdi...")
bot.infinity_polling()
