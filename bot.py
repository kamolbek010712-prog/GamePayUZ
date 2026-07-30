import requests

# Firebase ma'lumotlar bazangiz manzili
FIREBASE_URL = "https://gamepay-web-default-rtdb.firebaseio.com/checks"

# 1. Siz Botda Nickname yozib tasdiqlaganingizda (Buyruq saytga boradi):
def approve_player(player_id, nickname):
    url = f"{FIREBASE_URL}/{player_id}.json"
    data = {
        "status": "success",
        "nickname": nickname
    }
    # Firebase'ga so'rov yuboramiz - sayt buni o'sha soniyada o'qiydi!
    requests.patch(url, json=data)

# 2. Agar Siz Botda "Xato ID" tugmasini bossangiz:
def reject_player(player_id):
    url = f"{FIREBASE_URL}/{player_id}.json"
    data = {
        "status": "error"
    }
    requests.patch(url, json=data)
