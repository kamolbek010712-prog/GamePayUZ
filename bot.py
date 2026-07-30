import requests
import telebot
from telebot import types

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
    bot.reply_to(message, "GamePayUZ Admin Boti ishga tushdi! 🚀\n\nBuyruqlar:\n/nick ID NICKNAME - ID ni tasdiqlash\n/xato ID - ID xatoligini yuborish")

# Nickname tasdiqlash: /nick 9775793347 PRO_PLAYER
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
        bot.reply_to(message, f"✅ **ID:** `{player_id}`\n👤 **Nick:** `{nickname}`\n\nSaytga tasdiq yuborildi!", parse_mode="Markdown")
    except Exception as e:
        bot.reply_to(message, f"❌ Xatolik: {str(e)}")

# ID xatoligi: /xato 9775793347
@bot.message_handler(commands=['xato'])
def set_error(message):
    try:
        args = message.text.split()
        if len(args) < 2:
            bot.reply_to(message, "⚠️ Qolib: `/xato PLAYER_ID`\nMasalan: `/xato 9775793347`", parse_mode="Markdown")
            return
        
        player_id = args[1]
        reject_player(player_id)
        bot.reply_to(message, f"❌ **ID:** `{player_id}` rad etildi va saytga yuborildi!", parse_mode="Markdown")
    except Exception as e:
        bot.reply_to(message, f"❌ Xatolik: {str(e)}")

# Inline tugmalar bosilganda ishlaydigan qism
@bot.callback_query_handler(func=lambda call: True)
def callback_inline(call):
    if call.data.startswith("reject_"):
        player_id = call.data.split("_")[1]
        reject_player(player_id)
        bot.answer_callback_query(call.id, "ID rad etildi!")
        bot.edit_message_text(chat_id=call.message.chat.id, message_id=call.message.message_id, 
                              text=f"❌ **ID:** `{player_id}` rad etildi!", parse_mode="Markdown")

print("Bot ishga tushdi...")
bot.infinity_polling()
