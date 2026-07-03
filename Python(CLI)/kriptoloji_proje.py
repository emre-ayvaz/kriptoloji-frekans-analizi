import collections

ALPHABET = "abcdefghijklmnopqrstuvwxyz"

# İngilizce harf frekansları (pi)
ENGLISH_FREQ = {
    'a': 0.0817, 'b': 0.0150, 'c': 0.0278, 'd': 0.0425, 'e': 0.1270,
    'f': 0.0223, 'g': 0.0202, 'h': 0.0609, 'i': 0.0697, 'j': 0.0015,
    'k': 0.0077, 'l': 0.0403, 'm': 0.0241, 'n': 0.0675, 'o': 0.0751,
    'p': 0.0193, 'q': 0.0010, 'r': 0.0599, 's': 0.0633, 't': 0.0906,
    'u': 0.0276, 'v': 0.0098, 'w': 0.0236, 'x': 0.0015, 'y': 0.0197, 'z': 0.0007
}


# FREKANS HESAPLA (qi)
# ---------------------------
def letter_frequency(text):
    counts = collections.Counter(c for c in text if c in ALPHABET)
    total = sum(counts.values())

    freq = {c: 0 for c in ALPHABET}

    if total == 0:
        return freq

    for c in ALPHABET:
        freq[c] = counts[c] / total

    return freq



# Ij SKOR
# ---------------------------
def ij_score(text):
    qi = letter_frequency(text)
    score = 0

    for c in ALPHABET:
        pi = ENGLISH_FREQ[c]
        score += pi * qi[c]

    return score


# CAESAR ŞİFRE ÇÖZ
# ---------------------------
def caesar_decrypt(text, key):
    result = ""

    for c in text:
        if c in ALPHABET:
            index = ALPHABET.index(c)
            new_index = (index - key) % 26
            result += ALPHABET[new_index]
        else:
            result += c

    return result



# CAESAR KIRICI (OTOMATİK)
# ---------------------------
def caesar_break(cipher):
    best_text = ""
    best_key = 0
    best_score = -1

    print("\n--- TÜM OLASILIKLAR ---")

    for k in range(26):
        decrypted = caesar_decrypt(cipher, k)
        score = ij_score(decrypted)

        print(f"k={k} → skor={round(score,5)} → {decrypted}")

        if score > best_score:
            best_score = score
            best_text = decrypted
            best_key = k

    print("\n✔ EN DOĞRU SONUÇ:", best_text)
    print("✔ ANAHTAR:", best_key)
    print("✔ Ij:", round(best_score,5))
    print("✔ 0.065'e yakınlık:", round(abs(best_score - 0.065),5))

    return best_text



# SUBSTITUTION ANALİZ + ÇÖZÜM
# ---------------------------1
def substitution_break(cipher):
    counts = collections.Counter(c for c in cipher if c in ALPHABET)

    sorted_cipher = [c for c, _ in counts.most_common()]
    english_order = "etaoinshrdlcumwfgypbvkjxqz"

    mapping = {}

    for i, c in enumerate(sorted_cipher):
        if i < len(english_order):
            mapping[c] = english_order[i]

    # tahmini çözüm üret
    result = ""
    for c in cipher:
        if c in mapping:
            result += mapping[c]
        else:
            result += c

    print("\n--- HARF EŞLEME ---")
    for k, v in mapping.items():
        print(f"{k} → {v}")

    print("\n--- TAHMİNİ ÇÖZÜM ---")
    print(result)



# TESTLER
# ---------------------------
def run_tests():
    tests = [
        ("khoor", "hello"),

        # UZUN TEST 1
        ("wklv lv d orqjhu whvw phvvdjh iru fdhvdu flskhu",
         "this is a longer test message for caesar cipher"),

        #uzun  TEST 2
        ("surjudpplqj lv ixq zkhq brx xqghuvwdqg wkh orjlf",
         "programming is fun when you understand the logic"),

        ("zruog", "world")
    ]

    correct = 0

    print("\n--- TESTLER ---")

    for cipher, expected in tests:
        result = caesar_break(cipher)

        if result == expected:
            print("✔ DOĞRU:", cipher)
            correct += 1
        else:
            print("✘ HATALI:", cipher)

    print(f"\nBaşarı: {correct}/{len(tests)}")


# MENÜ (CLI)
# ---------------------------
def menu():
    while True:
        print("\n--- FREKANS ANALİZİ ŞİFRE KIRMA ARACI ---")
        print("1. Caesar kır")
        print("2. Substitution analiz")
        print("3. Testleri çalıştır")
        print("4. Çıkış")

        secim = input("Seçim: ")

        if secim == "1":
            txt = input("Şifreli metin: ").lower()
            caesar_break(txt)

        elif secim == "2":
            txt = input("Şifreli metin: ").lower()
            substitution_break(txt)

        elif secim == "3":
            run_tests()

        elif secim == "4":
            break

        else:
            print("Hatalı seçim!")



menu()