// --- DATI DELLE SPECIE PER DUNGEON ED EVOLUZIONI ---

const DUNGEON_POKEMON = {
    "Sabbie Ardenti": [
        { base: "Skorupi", evo1: "Drapion", evo2: null },
        { base: "Crabrawler", evo1: "Crabominable", evo2: null },
        { base: "Anorith", evo1: "Armaldo", evo2: null },
        { base: "Taillow", evo1: "Swellow", evo2: null },
        { base: "Corphish", evo1: "Crawdaunt", evo2: null },
        { base: "Sandygast", evo1: "Palossand", evo2: null },
        { base: "Aron", evo1: "Lairon", evo2: "Aggron" },
        { base: "Numel", evo1: "Camerupt", evo2: null },
        { base: "Corsola", evo1: null, evo2: null },
        { base: "Pyukumuku", evo1: null, evo2: null }
    ],
    "Fossa Ardente": [
        { base: "Frillish", evo1: "Jellicent", evo2: null },
        { base: "Chinchou", evo1: "Lanturn", evo2: null },
        { base: "Clauncher", evo1: "Clawitzer", evo2: null },
        { base: "Tirtouga", evo1: "Carracosta", evo2: null },
        { base: "Swoobat", evo1: null, evo2: null },
        { base: "Sableye", evo1: null, evo2: null },
        { base: "Shellos", evo1: "Gastrodon", evo2: null },
        { base: "Mawile", evo1: null, evo2: null },
        { base: "Carbink", evo1: null, evo2: null }
    ],
    "Bosco dei Rintocchi": [
        { base: "Morelull", evo1: "Shiinotic", evo2: null },
        { base: "Hatenna", evo1: "Hattrem", evo2: "Hatterene" },
        { base: "Hoothoot", evo1: "Noctowl", evo2: null },
        { base: "Paras", evo1: "Parasect", evo2: null },
        { base: "Gligar", evo1: "Gliscor", evo2: null },
        { base: "Ponyta-Galar", evo1: "Rapidash-Galar", evo2: null },
        { base: "Chingling", evo1: "Chimecho", evo2: null },
        { base: "Seedot", evo1: "Nuzleaf", evo2: "Shiftry" },
        { base: "Sentret", evo1: "Furret", evo2: null },
        { base: "Flabebe", evo1: "Floette", evo2: "Florges" }
    ],
    "Miniere Marmoree": [
        { base: "Machop", evo1: "Machoke", evo2: "Machamp" },
        { base: "Roggenrola", evo1: "Boldore", evo2: "Gigalith" },
        { base: "Sandshrew", evo1: "Sandslash", evo2: null },
        { base: "Pancham", evo1: "Pangoro", evo2: null },
        { base: "Rolycoly", evo1: "Carkol", evo2: "Coalossal" },
        { base: "Dwebble", evo1: "Crustle", evo2: null },
        { base: "Diglett", evo1: "Dugtrio", evo2: null },
        { base: "Drilbur", evo1: "Excadrill", evo2: null },
        { base: "Noibat", evo1: "Noivern", evo2: null },
        { base: "Onix", evo1: "Steelix", evo2: null }
    ],
    "Biblioteca Silente": [
        { base: "Litwick", evo1: "Lampent", evo2: "Chandelure" },
        { base: "Misdreavus", evo1: "Mismagius", evo2: null },
        { base: "Golett", evo1: "Golurk", evo2: null },
        { base: "Sinistea", evo1: "Polteageist", evo2: null },
        { base: "Impidimp", evo1: "Morgrem", evo2: "Grimmsnarl" },
        { base: "Murkrow", evo1: "Honchkrow", evo2: null },
        { base: "Blipbug", evo1: "Dottler", evo2: "Orbeetle" },
        { base: "Wynaut", evo1: "Wobbuffet", evo2: null },
        { base: "Karrablast", evo1: "Escavalier", evo2: null },
        { base: "Shelmet", evo1: "Accelgor", evo2: null }
    ]
};

// --- PREZZI OGGETTI E CATEGORIE ---

const PREZZI_OGGETTI = {
    "Baccarancia": 50, "Baccaliegia": 25, "Baccastagna": 25, "Baccapesca": 25,
    "Baccafrago": 25, "Baccapera": 25, "Mela": 25, "Grande Mela": 25,
    "Semevista": 75, "Semefuoco": 30, "Pietriseme": 75, "Revitalseme": 300,
    "Semeimpeto": 300, "Semepuro": 500, "Semesalute": 50, "Semedormita": 75,
    "Semesprint": 50, "Semestrabico": 75, "Semeturpe": 300, "Stordiseme": 75, "Teleseme": 75,
    "Bastone": 5, "Geosasso": 5, "Gravelroccia": 10
};

const CATEGORIE_OGGETTI = {
    "Bastone": "Lanciabile", "Geosasso": "Lanciabile", "Gravelroccia": "Lanciabile",
    "Baccarancia": "Bacca", "Baccaliegia": "Bacca", "Baccastagna": "Bacca", "Baccapesca": "Bacca",
    "Baccafrago": "Bacca", "Baccapera": "Bacca", "Mela": "Bacca", "Grande Mela": "Bacca",
    "Semevista": "Seme", "Semefuoco": "Seme", "Pietriseme": "Seme", "Revitalseme": "Seme",
    "Semeimpeto": "Seme", "Semepuro": "Seme", "Semesalute": "Seme", "Semedormita": "Seme",
    "Semesprint": "Seme", "Semestrabico": "Seme", "Semeturpe": "Seme", "Stordiseme": "Seme", "Teleseme": "Seme"
};

const LISTA_BACCHE = [
    "Baccarancia", "Baccaliegia", "Baccastagna", "Baccapesca",
"Baccafrago", "Baccapera", "Mela", "Grande Mela"
];

const LISTA_SEMI = [
    "Semevista", "Semefuoco", "Pietriseme", "Revitalseme",
"Semeimpeto", "Semepuro", "Semesalute", "Semedormita",
"Semesprint", "Semestrabico", "Semeturpe", "Stordiseme", "Teleseme"
];

const TRAPPOLE = [
    "Trip Trap", "Random Trap", "Pokémon Trap", "Grudge Trap",
"Summon Trap", "Grimy Trap", "Sticky Trap", "Chestnut Trap",
"Explosion Trap", "SelfDestruct Trap", "Spin Trap", "Poison Trap",
"Slumber Trap", "PP-Zero Trap", "Seal Trap", "Pitfall Trap",
"Wonder Tile", "Mud Trap", "Gust Trap", "Slow Trap"
];

// Stato della stanza
let stanzaStato = {
    dungeon: "Sabbie Ardenti",
    evento: "NORMALE",
    pokemonList: [],
    strumentiList: [],
    trappoleList: []
};

// Cronologia stanze
let cronologiaStanze = [];

// Riferimenti HTML
const selectDungeon = document.getElementById('select-dungeon');
const selectGiocatori = document.getElementById('select-giocatori');
const inputMaxLevel = document.getElementById('input-max-level');
const selectForceEvento = document.getElementById('select-force-evento');

const inputNumPkm = document.getElementById('input-num-pkm');
const inputNumItem = document.getElementById('input-num-item');
const inputNumTrap = document.getElementById('input-num-trap');

const btnRndPkm = document.getElementById('btn-rnd-pkm');
const btnRndItem = document.getElementById('btn-rnd-item');
const btnRndTrap = document.getElementById('btn-rnd-trap');
const btnGeneraStanza = document.getElementById('btn-genera-stanza');
const btnSalvaCronologia = document.getElementById('btn-salva-cronologia');

const bannerEvento = document.getElementById('banner-evento');
const containerStanza = document.getElementById('container-stanza');
const listaPokemonElem = document.getElementById('lista-pokemon');
const listaStrumentiElem = document.getElementById('lista-strumenti');
const listaTrappoleElem = document.getElementById('lista-trappole');

const countPkm = document.getElementById('count-pkm');
const countItem = document.getElementById('count-item');
const countTrap = document.getElementById('count-trap');

const listaCronologiaElem = document.getElementById('lista-cronologia-stanze');
const btnSvuotaCronologia = document.getElementById('btn-svuota-cronologia');
const btnExportJson = document.getElementById('btn-export-json');
const inputImportJson = document.getElementById('input-import-json');

// --- HELPER FUNZIONI ---

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pulisciChiavePkm(str) {
    return str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

function estraiGenerePokemon(specieNome) {
    const pokedexObj = (typeof exports !== 'undefined' && exports.BattlePokedex) ? exports.BattlePokedex : {};
    const chiave = pulisciChiavePkm(specieNome);
    const pkmData = pokedexObj[chiave];

    if (pkmData) {
        if (pkmData.gender === "N") return { icon: "⚪", css: "gender-none" };
        if (pkmData.gender === "M") return { icon: "♂️", css: "gender-male" };
        if (pkmData.gender === "F") return { icon: "♀️", css: "gender-female" };

        if (pkmData.genderRatio) {
            const ratioM = pkmData.genderRatio.M !== undefined ? pkmData.genderRatio.M : 0.5;
            return Math.random() < ratioM
            ? { icon: "♂️", css: "gender-male" }
            : { icon: "♀️", css: "gender-female" };
        }
    }

    return Math.random() < 0.5
    ? { icon: "♂️", css: "gender-male" }
    : { icon: "♀️", css: "gender-female" };
}

function estraiIsShiny() {
    return Math.random() < (1 / 4096);
}

function estraiQuantitaPokemonBase() {
    const t = Math.random();
    if (t < 0.30) return 0;
    if (t < 0.55) return 1;
    if (t < 0.75) return 2;
    if (t < 0.90) return 3;
    return 4;
}

function estraiQuantitaStrumenti() {
    const t = Math.random();
    if (t < 0.35) return 0;
    if (t < 0.67) return 1;
    if (t < 0.90) return 2;
    return 3;
}

function estraiQuantitaTrappole() {
    const t = Math.random();
    if (t < 0.42) return 0;
    if (t < 0.80) return 1;
    if (t < 0.96) return 2;
    return 3;
}

// --- GENERAZIONE POKEMON ---

function generaPoolSpecieValide(dungeonNome, maxLevel) {
    const specieDungeon = DUNGEON_POKEMON[dungeonNome] || DUNGEON_POKEMON["Sabbie Ardenti"];
    const opzioni = [];

    specieDungeon.forEach(linea => {
        opzioni.push({ nome: linea.base, minLv: 1 });
        if (linea.evo1 && maxLevel >= 3) opzioni.push({ nome: linea.evo1, minLv: 3 });
        if (linea.evo2 && maxLevel >= 6) opzioni.push({ nome: linea.evo2, minLv: 6 });
    });

    return opzioni;
}

function estraiSingoloPokemon(dungeonNome, maxLevel, specieForzata = null) {
    let specieScelta = specieForzata;
    let minLv = 1;

    if (!specieScelta) {
        const opzioni = generaPoolSpecieValide(dungeonNome, maxLevel);
        const scelta = randomItem(opzioni);
        specieScelta = scelta.nome;
        minLv = scelta.minLv;
    }

    const livello = randomInt(minLv, Math.max(minLv, maxLevel));
    const sessoObj = estraiGenerePokemon(specieScelta);
    const isShiny = estraiIsShiny();

    return {
        nome: specieScelta,
        livello: livello,
        sesso: sessoObj.icon,
        sessoCss: sessoObj.css,
        isShiny: isShiny
    };
}

function generaGruppoPokemonConDuplicati(dungeonNome, maxLevel, quantita) {
    const lista = [];
    if (quantita <= 0) return lista;

    const specieValide = generaPoolSpecieValide(dungeonNome, maxLevel);
    let specieDominante = randomItem(specieValide).nome;

    for (let i = 0; i < quantita; i++) {
        if (Math.random() < 0.55) {
            lista.push(estraiSingoloPokemon(dungeonNome, maxLevel, specieDominante));
        } else {
            lista.push(estraiSingoloPokemon(dungeonNome, maxLevel));
        }
    }

    return lista;
}

// --- GENERAZIONE STRUMENTI ---

function estraiDaListaPonderata(listaNomi) {
    let pool = [];
    listaNomi.forEach(nome => {
        const prezzo = PREZZI_OGGETTI[nome] || 25;
        const peso = Math.max(1, Math.round(1000 / prezzo));
        for (let p = 0; p < peso; p++) {
            pool.push(nome);
        }
    });
    return randomItem(pool);
}

function estraiSingoloStrumento(dungeonNome, isShop = false) {
    const rollCat = Math.random();
    let categoriaScelta = "Lanciabile";
    if (rollCat < 0.40) {
        categoriaScelta = "Lanciabile";
    } else if (rollCat < 0.75) {
        categoriaScelta = "Bacca";
    } else {
        categoriaScelta = "Seme";
    }

    let nomeEstratto = "";

    if (categoriaScelta === "Lanciabile") {
        let poolLanciabili = [];
        if (dungeonNome === "Sabbie Ardenti") {
            poolLanciabili.push("Bastone", "Geosasso");
        } else if (dungeonNome === "Bosco dei Rintocchi") {
            poolLanciabili.push("Bastone");
        } else {
            poolLanciabili.push("Geosasso");
        }

        if (isShop || Math.random() < 0.25) {
            poolLanciabili.push("Gravelroccia");
        }

        nomeEstratto = estraiDaListaPonderata(poolLanciabili);
    } else if (categoriaScelta === "Bacca") {
        nomeEstratto = estraiDaListaPonderata(LISTA_BACCHE);
    } else {
        nomeEstratto = estraiDaListaPonderata(LISTA_SEMI);
    }

    const categoria = CATEGORIE_OGGETTI[nomeEstratto] || categoriaScelta;
    const prezzo = PREZZI_OGGETTI[nomeEstratto] || 25;

    return {
        nome: nomeEstratto,
        categoria: categoria,
        prezzo: isShop ? prezzo : null
    };
}

function estraiSingolaTrappola() {
    return {
        nome: randomItem(TRAPPOLE)
    };
}

// --- RIGENERAZIONE GRUPPI ---

function rigeneraGruppoPokemon() {
    const dungeonNome = selectDungeon.value;
    const numGiocatori = parseInt(selectGiocatori.value) || 2;
    const maxLevel = parseInt(inputMaxLevel.value) || 5;
    const basePkm = parseInt(inputNumPkm.value) || 0;

    const extraPkmMod = Math.max(0, numGiocatori - 2) * 0.25;
    const countPkmFinal = Math.round(basePkm * (1 + extraPkmMod));

    stanzaStato.pokemonList = generaGruppoPokemonConDuplicati(dungeonNome, maxLevel, countPkmFinal);
    renderingStanza();
}

function rigeneraGruppoStrumenti() {
    const dungeonNome = selectDungeon.value;
    const countItemFinal = parseInt(inputNumItem.value) || 0;
    const isShop = stanzaStato.evento === "KECLEON";

    stanzaStato.strumentiList = [];
    for (let i = 0; i < countItemFinal; i++) {
        stanzaStato.strumentiList.push(estraiSingoloStrumento(dungeonNome, isShop));
    }
    renderingStanza();
}

function rigeneraGruppoTrappole() {
    const countTrapFinal = parseInt(inputNumTrap.value) || 0;

    stanzaStato.trappoleList = [];
    for (let i = 0; i < countTrapFinal; i++) {
        stanzaStato.trappoleList.push(estraiSingolaTrappola());
    }
    renderingStanza();
}

btnRndPkm.addEventListener('click', () => {
    inputNumPkm.value = estraiQuantitaPokemonBase();
    rigeneraGruppoPokemon();
});

btnRndItem.addEventListener('click', () => {
    inputNumItem.value = estraiQuantitaStrumenti();
    rigeneraGruppoStrumenti();
});

btnRndTrap.addEventListener('click', () => {
    inputNumTrap.value = estraiQuantitaTrappole();
    rigeneraGruppoTrappole();
});

inputNumPkm.addEventListener('change', rigeneraGruppoPokemon);
inputNumItem.addEventListener('change', rigeneraGruppoStrumenti);
inputNumTrap.addEventListener('change', rigeneraGruppoTrappole);

// --- GENERAZIONE COMPLETA ---

btnGeneraStanza.addEventListener('click', () => {
    const dungeonNome = selectDungeon.value;
    const forceEvento = selectForceEvento.value;

    let evento = "NORMALE";
    if (forceEvento === "CASUALE") {
        const tiro = Math.random();
        if (tiro < 0.05) evento = "KECLEON";
        else if (tiro < 0.10) evento = "MONSTER_HOUSE";
    } else {
        evento = forceEvento;
    }

    stanzaStato.dungeon = dungeonNome;
    stanzaStato.evento = evento;

    if (evento === "KECLEON") {
        inputNumPkm.value = 0;
        inputNumTrap.value = 0;
        inputNumItem.value = randomInt(5, 10);
    } else if (evento === "MONSTER_HOUSE") {
        inputNumPkm.value = randomInt(6, 10);
        inputNumItem.value = estraiQuantitaStrumenti();
        inputNumTrap.value = estraiQuantitaTrappole();
    } else {
        inputNumPkm.value = estraiQuantitaPokemonBase();
        inputNumItem.value = estraiQuantitaStrumenti();
        inputNumTrap.value = estraiQuantitaTrappole();
    }

    rigeneraGruppoPokemon();
    rigeneraGruppoStrumenti();
    rigeneraGruppoTrappole();
});

// --- RENDERING VISIVO ---

function renderingStanza() {
    const isKecleon = stanzaStato.evento === "KECLEON";
    const isMonsterHouse = stanzaStato.evento === "MONSTER_HOUSE";

    if (isKecleon) {
        bannerEvento.className = "event-banner event-kecleon";
        bannerEvento.innerHTML = "🏪 Negozio di Kecleon! (Nessun nemico, strumenti in vendita)";
        bannerEvento.classList.remove('hidden');
    } else if (isMonsterHouse) {
        bannerEvento.className = "event-banner event-monster-house";
        bannerEvento.innerHTML = "💥 Tana di Pokémon! (Orda di nemici in agguato)";
        bannerEvento.classList.remove('hidden');
    } else {
        bannerEvento.classList.add('hidden');
    }

    // 1. Pokémon
    countPkm.textContent = stanzaStato.pokemonList.length;
    listaPokemonElem.innerHTML = '';
    if (stanzaStato.pokemonList.length === 0) {
        listaPokemonElem.innerHTML = '<li style="color:#64748b; font-style:italic; padding:6px;">Nessun Pokémon</li>';
    } else {
        stanzaStato.pokemonList.forEach((pkm, idx) => {
            const li = document.createElement('li');
            li.className = 'item-row';
            const genderClass = pkm.sessoCss || (pkm.sesso === '♂️' ? 'gender-male' : (pkm.sesso === '♀️' ? 'gender-female' : 'gender-none'));
            li.innerHTML = `
            <span>
            <strong>${pkm.nome}</strong> <span class="${genderClass}">${pkm.sesso}</span>
            ${pkm.isShiny ? '<span class="badge-tag badge-shiny">✨ SHINY</span>' : ''}
            </span>
            <div style="display:flex; align-items:center; gap:6px;">
            <span class="badge-tag badge-level">Lv. ${pkm.livello}</span>
            <button class="mini-regen-btn" onclick="rigeneraSingoloPokemon(${idx})" title="Riestrai">🔄</button>
            </div>
            `;
            listaPokemonElem.appendChild(li);
        });
    }

    // 2. Strumenti
    countItem.textContent = stanzaStato.strumentiList.length;
    listaStrumentiElem.innerHTML = '';
    if (stanzaStato.strumentiList.length === 0) {
        listaStrumentiElem.innerHTML = '<li style="color:#64748b; font-style:italic; padding:6px;">Nessuno Strumento</li>';
    } else {
        stanzaStato.strumentiList.forEach((item, idx) => {
            const li = document.createElement('li');
            li.className = 'item-row';
            li.innerHTML = `
            <span>${item.nome}</span>
            <div style="display:flex; align-items:center; gap:6px;">
            ${item.prezzo ? `<span class="badge-tag badge-price">${item.prezzo} ₽</span>` : ''}
            <span class="badge-tag badge-category">${item.categoria}</span>
            <button class="mini-regen-btn" onclick="rigeneraSingoloStrumento(${idx})" title="Riestrai">🔄</button>
            </div>
            `;
            listaStrumentiElem.appendChild(li);
        });
    }

    // 3. Trappole
    countTrap.textContent = stanzaStato.trappoleList.length;
    listaTrappoleElem.innerHTML = '';
    if (stanzaStato.trappoleList.length === 0) {
        listaTrappoleElem.innerHTML = '<li style="color:#64748b; font-style:italic; padding:6px;">Nessuna Trappola</li>';
    } else {
        stanzaStato.trappoleList.forEach((trap, idx) => {
            const li = document.createElement('li');
            li.className = 'item-row';
            li.innerHTML = `
            <span>${trap.nome}</span>
            <button class="mini-regen-btn" onclick="rigeneraSingolaTrappola(${idx})" title="Riestrai">🔄</button>
            `;
            listaTrappoleElem.appendChild(li);
        });
    }

    containerStanza.classList.remove('hidden');
}

// Rigeneratori singoli
window.rigeneraSingoloPokemon = function(idx) {
    const dungeonNome = selectDungeon.value;
    const maxLevel = parseInt(inputMaxLevel.value) || 5;
    stanzaStato.pokemonList[idx] = estraiSingoloPokemon(dungeonNome, maxLevel);
    renderingStanza();
};

window.rigeneraSingoloStrumento = function(idx) {
    const dungeonNome = selectDungeon.value;
    const isShop = stanzaStato.evento === "KECLEON";
    stanzaStato.strumentiList[idx] = estraiSingoloStrumento(dungeonNome, isShop);
    renderingStanza();
};

window.rigeneraSingolaTrappola = function(idx) {
    stanzaStato.trappoleList[idx] = estraiSingolaTrappola();
    renderingStanza();
};

// --- GESTIONE CRONOLOGIA & SALVATAGGI STANZE ---

function salvaCronologiaInStorage() {
    localStorage.setItem('dungeon_stanze_salvate', JSON.stringify(cronologiaStanze));
}

function caricaCronologiaDaStorage() {
    const dati = localStorage.getItem('dungeon_stanze_salvate');
    if (dati) {
        try {
            cronologiaStanze = JSON.parse(dati);
        } catch (e) {
            cronologiaStanze = [];
        }
    }
    aggiornaListaCronologiaVisiva();
}

btnSalvaCronologia.addEventListener('click', () => {
    const stanzaSalvata = {
        id: Date.now(),
                                    dungeon: selectDungeon.value,
                                    evento: stanzaStato.evento,
                                    numPkm: stanzaStato.pokemonList.length,
                                    numItem: stanzaStato.strumentiList.length,
                                    numTrap: stanzaStato.trappoleList.length,
                                    inputNumPkm: inputNumPkm.value,
                                    inputNumItem: inputNumItem.value,
                                    inputNumTrap: inputNumTrap.value,
                                    pokemonList: JSON.parse(JSON.stringify(stanzaStato.pokemonList)),
                                    strumentiList: JSON.parse(JSON.stringify(stanzaStato.strumentiList)),
                                    trappoleList: JSON.parse(JSON.stringify(stanzaStato.trappoleList))
    };

    cronologiaStanze.unshift(stanzaSalvata);
    salvaCronologiaInStorage();
    aggiornaListaCronologiaVisiva();

    const originalHtml = btnSalvaCronologia.innerHTML;
    btnSalvaCronologia.innerHTML = '<span>Stanza Salvata!</span> ✅';
    setTimeout(() => { btnSalvaCronologia.innerHTML = originalHtml; }, 1500);
});

function aggiornaListaCronologiaVisiva() {
    listaCronologiaElem.innerHTML = '';

    if (cronologiaStanze.length === 0) {
        listaCronologiaElem.innerHTML = '<li style="color: #64748b; font-style: italic; text-align: center; padding: 10px 0;">Nessuna stanza salvata</li>';
        return;
    }

    cronologiaStanze.forEach((st, idx) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
        <div style="flex: 1;" onclick="caricaStanzaSalvata(${idx})">
        <strong>${st.dungeon}</strong> ${st.evento !== "NORMALE" ? `<small style="color: #e3350d;">(${st.evento})</small>` : ''}
        <div style="font-size: 0.75rem; color: #64748b;">👾 ${st.numPkm} | 🎒 ${st.numItem} | ⚠️ ${st.numTrap}</div>
        </div>
        <button class="btn-del-item" onclick="eliminaStanzaSalvata(event, ${idx})" title="Elimina">🗑️</button>
        `;
        listaCronologiaElem.appendChild(li);
    });
}

window.caricaStanzaSalvata = function(idx) {
    const st = cronologiaStanze[idx];
    if (!st) return;

    selectDungeon.value = st.dungeon;
    stanzaStato.dungeon = st.dungeon;
    stanzaStato.evento = st.evento;
    stanzaStato.pokemonList = JSON.parse(JSON.stringify(st.pokemonList));
    stanzaStato.strumentiList = JSON.parse(JSON.stringify(st.strumentiList));
    stanzaStato.trappoleList = JSON.parse(JSON.stringify(st.trappoleList));

    inputNumPkm.value = st.inputNumPkm || st.pokemonList.length;
    inputNumItem.value = st.inputNumItem || st.strumentiList.length;
    inputNumTrap.value = st.inputNumTrap || st.trappoleList.length;

    renderingStanza();
};

window.eliminaStanzaSalvata = function(e, idx) {
    e.stopPropagation();
    cronologiaStanze.splice(idx, 1);
    salvaCronologiaInStorage();
    aggiornaListaCronologiaVisiva();
};

btnSvuotaCronologia.addEventListener('click', () => {
    if (confirm("Vuoi cancellare tutte le stanze salvate?")) {
        cronologiaStanze = [];
        salvaCronologiaInStorage();
        aggiornaListaCronologiaVisiva();
    }
});

btnExportJson.addEventListener('click', () => {
    if (cronologiaStanze.length === 0) {
        alert("Nessuna stanza salvata da esportare!");
        return;
    }
    const blob = new Blob([JSON.stringify(cronologiaStanze, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `Stanze_Dungeon_Export_${Date.now()}.json`;
    link.href = url;
    link.click();
});

inputImportJson.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importati = JSON.parse(event.target.result);
            if (Array.isArray(importati)) {
                cronologiaStanze = [...importati, ...cronologiaStanze];
                salvaCronologiaInStorage();
                aggiornaListaCronologiaVisiva();
                alert("Stanze importate con successo!");
            }
        } catch (err) {
            alert("Errore nel file JSON importato!");
        }
    };
    reader.readAsText(file);
});

// Inizializzazione storage all'avvio
window.addEventListener('DOMContentLoaded', caricaCronologiaDaStorage);
