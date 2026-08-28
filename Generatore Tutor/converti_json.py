import json

# 1. Legge il tuo file learnsets.json
with open('learnsets.json', 'r', encoding='utf-8') as f:
    dati = json.load(f)

# 2. Scrive il file learnsets_data.js racchiudendo i dati in una variabile JS
js_content = f"const datiLearnsetsObj = {json.dumps(dati, ensure_ascii=False)};"

with open('learnsets_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"File learnsets_data.js generato con successo! (Estratti {len(dati)} Pokémon)")
