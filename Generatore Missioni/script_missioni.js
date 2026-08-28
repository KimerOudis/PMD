let cronologiaMissioni = [];
let mossaCorrente = null;

// Riferimenti HTML
const btnGenera = document.getElementById('btn-genera-missione');
const selectGradoMin = document.getElementById('select-grado-min');
const selectGradoMax = document.getElementById('select-grado-max');
const selectForzaSecondaria = document.getElementById('select-forza-secondaria');
const cardMissione = document.getElementById('card-missione');
const listaCronologia = document.getElementById('lista-cronologia');

const mTipo = document.getElementById('m-tipo');
const mGrado = document.getElementById('m-grado');
const mDescrizione = document.getElementById('m-descrizione');
const mCommittente = document.getElementById('m-committente');
const mTarget = document.getElementById('m-target');
const lblTarget = document.getElementById('lbl-target');
const mDungeon = document.getElementById('m-dungeon');
const mPiano = document.getElementById('m-piano');
const mOggetto = document.getElementById('m-oggetto');
const mRicompensa = document.getElementById('m-ricompensa');

const boxTarget = document.getElementById('box-target');
const boxOggetto = document.getElementById('box-oggetto');

// Pulsanti mini-rigenerazione
const btnRegenCommittente = document.getElementById('btn-regen-committente');
const btnRegenTarget = document.getElementById('btn-regen-target');
const btnRegenDungeon = document.getElementById('btn-regen-dungeon');
const btnRegenPiano = document.getElementById('btn-regen-piano');
const btnRegenOggetto = document.getElementById('btn-regen-oggetto');
const btnRegenRicompensa = document.getElementById('btn-regen-ricompensa');

// --- DATI DI GIOCO ---

const ORDINE_GRADI = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];

const DUNGEONS = [
    { nome: "Bosco dei Rintocchi", maxPiani: 3 },
{ nome: "Sabbie Ardenti", maxPiani: 3 },
{ nome: "Fossa Ardente", maxPiani: 5 },
{ nome: "Miniere Marmoree", maxPiani: 3 }
];

const OGGETTI_BASE = [
    "Baccarancia", "Baccaliegia", "Baccastagna", "Baccapesca", "Baccafrago", "Baccapera",
"Mela", "Grande Mela", "Semevista", "Semefuoco", "Pietriseme", "Revitalseme",
"Semeimpeto", "Semepuro", "Semesalute", "Semedormita", "Semesprint", "Semestrabico",
"Semeturpe", "Stordiseme", "Teleseme", "Geosasso", "Bastone"
];

// Liste specifiche per le quest secondarie
const SEMI_O_CIBO = [
    "Baccarancia", "Baccaliegia", "Baccastagna", "Mela", "Grande Mela",
"Semevista", "Semesalute", "Semesprint"
];

const BACCHE_E_SEMI = [
    "Baccarancia", "Baccaliegia", "Baccastagna", "Baccapesca", "Baccafrago", "Baccapera",
"Semesalute", "Semevista"
];

const ORB_LIST = [
    "All-Mach Orb", "Blowback Orb", "Cleanse Orb", "Decoy Orb", "Drought Orb",
"Escape Orb", "Foe-Seal Orb", "Foe-Fear Orb", "Snowy Orb", "Identify Orb",
"Invisify Orb", "Lasso Orb", "Luminous Orb", "Mobile Orb", "Nullify Orb",
"One-Room Orb", "One-Shot Orb", "Pierce Orb", "Radar Orb", "Rainy Orb",
"Rebound Orb", "Rollcall Orb", "Sandy Orb", "Scanner Orb", "See-Trap Orb",
"Silence Orb", "Slow Orb", "Sunny Orb", "Totter Orb", "Trawl Orb",
"Lock Orb", "Warp Orb"
];

const GOMME_COLORATE = [
    "Gommabianca", "Gommablu", "Gommachiara", "Gommacielo", "Gommadoro",
"Gommaerba", "Gommagialla", "Gommagrigia", "Gommaincanto", "Gommamarrone",
"Gommanera", "Gommarancia", "Gommareale", "Gommargento", "Gommarosea",
"Gommarossa", "Gommaverde", "Gommaviola"
];

const GRADI_BASE = {
    'F': { poke: 100, rep: 100 },
    'E': { poke: 150, rep: 200 },
    'D': { poke: 200, rep: 400 },
    'C': { poke: 300, rep: 500 },
    'B': { poke: 400, rep: 1000 },
    'A': { poke: 500, rep: 1600 },
    'S': { poke: 600, rep: 3200 }
};

const TIPI_MISSIONE = {
    'RESCUE': { nome: 'RESCUE', pokeMod: 1.0, repMod: 1.0 },
    'ITEM_REQUEST': { nome: 'ITEM REQUEST', pokeMod: 1.25, repMod: 1.25 },
    'ITEM_DELIVERY': { nome: 'ITEM DELIVERY', pokeMod: 1.25, repMod: 1.25 },
    'ESCORT': { nome: 'ESCORT', pokeMod: 1.5, repMod: 1.5 },
    'OUTLAW_BOUNTY': { nome: 'OUTLAW BOUNTY', pokeMod: 1.75, repMod: 1.75 }
};

const SET_ESCLUSI = new Set([
    "articuno", "articunogalar", "zapdos", "zapdosgalar", "moltres", "moltresgalar", "mewtwo", "mew",
    "raikou", "entei", "suicune", "lugia", "hooh", "celebi", "regirock", "regice", "registeel",
    "latias", "latios", "kyogre", "groudon", "rayquaza", "jirachi", "deoxys", "uxie", "mesprit",
    "azelf", "dialga", "palkia", "heatran", "regigigas", "giratina", "cresselia", "phione", "manaphy",
    "darkrai", "shaymin", "arceus", "victini", "cobalion", "terrakion", "virizion", "tornadus",
    "thundurus", "reshiram", "zekrom", "landorus", "kyurem", "keldeo", "meloetta", "genesect",
    "xerneas", "yveltal", "zygarde", "diancie", "hoopa", "volcanion", "silvally", "tapukoko",
    "tapulele", "tapubulu", "tapufini", "cosmog", "cosmoem", "solgaleo", "lunala", "nihilego",
    "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana", "guzzlord", "necrozma",
    "magearna", "marshadow", "poipole", "naganadel", "stakataka", "blacephalon", "zeraora", "meltan",
    "melmetal", "zacian", "zamazenta", "eternatus", "kubfu", "urshifu", "zarude", "regieleki",
    "regidrago", "glastrier", "spectrier", "calyrex", "enamorus", "greattusk", "screamtail",
    "brutebonnet", "fluttermane", "slitherwing", "sandyshocks", "irontreads", "ironbundle",
    "ironhands", "ironjugulis", "ironmoth", "ironthorns", "wochien", "chienpao", "tinglu",
    "chiyu", "roaringmoon", "ironvaliant", "koraidon", "miraidon", "walkingwake", "ironleaves",
    "okidogi", "munkidori", "fezandipiti", "ogerpon", "gougingfire", "ragingbolt", "ironboulder",
    "ironcrown", "terapagos", "pecharunt", "missingno"
]);

// Lista Pokémon tecnologici per Algo e Spunzy (Bounty)
const POKEMON_TECNOLOGICI = [
    "Voltorb", "Electrode", "Voltorb-Hisui", "Electrode-Hisui",
"Magnemite", "Magneton", "Magnezone", "Grimer", "Muk",
"Koffing", "Weezing", "Porygon", "Porygon2", "Porygon-Z",
"Klink", "Klang", "Klinklang", "Trubbish", "Garbodor",
"Rotom", "Tynamo", "Eelektrik", "Eelektross", "Duraludon", "Archaludon"
];

// Lista Pokémon antichi/fossili per Graphe
const POKEMON_ANTICHI_FOSSILI = [
    "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl",
"Lileep", "Cradily", "Anorith", "Armaldo", "Cranidos",
"Rampardos", "Shieldon", "Bastiodon", "Tirtouga", "Carracosta",
"Archen", "Archeops", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Yamask"
];

// --- HELPER FUNZIONI ESTRATTORI ---

function pulisciStringa(str) {
    return str ? str.toString().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomItemExcept(array, current) {
    if (!array || array.length === 0) return null;
    const filtrati = array.filter(item => item !== current);
    if (filtrati.length === 0) return array[0];
    return randomItem(filtrati);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomIntExcept(min, max, current) {
    if (min === max) return min;
    let val = randomInt(min, max);
    while (val === current) {
        val = randomInt(min, max);
    }
    return val;
}

function estraiPokemonPerGrado(grado, pokemonAttuale = null, soloStretto = false) {
    const pokedexObj = (typeof exports !== 'undefined' && exports.BattlePokedex) ? exports.BattlePokedex : {};
    const chiavi = Object.keys(pokedexObj);

    if (chiavi.length === 0) return "Bulbasaur";

    const chiaviValide = chiavi.filter(k => {
        const kPuro = pulisciStringa(k);
        const pkm = pokedexObj[k];

        if (SET_ESCLUSI.has(kPuro) || kPuro.startsWith("pokestar") || kPuro.startsWith("arceus")) return false;
        if (pkm.isNonstandard && pkm.isNonstandard !== "Past" && pkm.isNonstandard !== "Future") return false;
        if (pkm.forme || pkm.baseSpecies || kPuro.includes("-") || kPuro.includes("mega") || kPuro.includes("gmax") || kPuro.includes("totem") || kPuro.includes("alola") || kPuro.includes("galar") || kPuro.includes("hisui") || kPuro.includes("paldea")) {
            return false;
        }

        const haEvoluzioni = Array.isArray(pkm.evos) && pkm.evos.length > 0;
        const haPreEvoluzione = Boolean(pkm.prevo);

        if (!haEvoluzioni && !haPreEvoluzione) return true;

        if (soloStretto) {
            // Per i criminali (Outlaw): rigorosi sul grado esatto
            if (grado === 'F' || grado === 'E') return haEvoluzioni && !haPreEvoluzione;
            if (grado === 'D' || grado === 'C') return haEvoluzioni && haPreEvoluzione;
            return !haEvoluzioni && haPreEvoluzione;
        } else {
            // Per clienti, scorte e salvataggi: flessibili verso il basso (stadi precedenti ammessi)
            if (grado === 'F' || grado === 'E') {
                return haEvoluzioni && !haPreEvoluzione;
            } else if (grado === 'D' || grado === 'C') {
                return (!haPreEvoluzione) || (haEvoluzioni && haPreEvoluzione);
            } else {
                return true;
            }
        }
    });

    if (chiaviValide.length === 0) return "Pikachu";

    const nomiValidi = chiaviValide.map(k => pokedexObj[k].name || k);
    if (pokemonAttuale) {
        const diversi = nomiValidi.filter(n => n !== pokemonAttuale);
        if (diversi.length > 0) return randomItem(diversi);
    }

    return randomItem(nomiValidi);
}

function estraiPokemonErba() {
    const pokedexObj = (typeof exports !== 'undefined' && exports.BattlePokedex) ? exports.BattlePokedex : {};
    const chiavi = Object.keys(pokedexObj);
    const erbaValidi = chiavi.filter(k => {
        const pkm = pokedexObj[k];
        const kPuro = pulisciStringa(k);
        return pkm.types && pkm.types.includes("Grass") && !SET_ESCLUSI.has(kPuro) && !pkm.forme;
    }).map(k => pokedexObj[k].name || k);

    return erbaValidi.length > 0 ? randomItem(erbaValidi) : "Bulbasaur";
}

function aggiornaDescrizioneMissione(m) {
    if (m.isSecondariaFissa) {
        m.descrizione = m.descrizioneSecondariaCustom;
        return;
    }

    switch (m.tipoChiave) {
        case 'RESCUE':
            if (m.targetPkm === m.committente) {
                m.descrizione = `Andare al piano ${m.piano} di ${m.dungeonObj.nome} a trovare il Pokémon smarrito.`;
            } else {
                m.descrizione = `Andare al piano ${m.piano} di ${m.dungeonObj.nome} a trovare il Pokémon smarrito (${m.targetPkm}) per conto di ${m.committente}.`;
            }
            break;

        case 'ITEM_REQUEST':
            m.descrizione = `Raccogliere ${m.oggRichiesto} al piano ${m.piano} di ${m.dungeonObj.nome} per conto di ${m.committente}.`;
            break;

        case 'ITEM_DELIVERY':
            m.descrizione = `Trovare ${m.committente} al piano ${m.piano} di ${m.dungeonObj.nome} e consegnargli ${m.oggRichiesto}.`;
            break;

        case 'ESCORT':
            m.descrizione = `Scortare ${m.committente} al piano ${m.piano} di ${m.dungeonObj.nome}.`;
            break;

        case 'OUTLAW_BOUNTY':
            m.descrizione = `Trovare il ricercato ${m.targetPkm} al piano ${m.piano} di ${m.dungeonObj.nome} per conto di ${m.committente}.`;
            break;
    }
}

function calcolaRicompensa(grado, tipoChiave, committenteNome) {
    const base = GRADI_BASE[grado] || GRADI_BASE['F'];
    const tInfo = TIPI_MISSIONE[tipoChiave];

    const pokeTotali = Math.round(base.poke * tInfo.pokeMod);
    const repTotali = Math.round(base.rep * tInfo.repMod);

    let testo = `${pokeTotali} ₽ | ${repTotali} Punti Reputazione`;

    const listaOggettiExtra = [];
    const numOggetti = (grado === 'S' || grado === 'A') ? 2 : 1;

    for (let i = 0; i < numOggetti; i++) {
        const obj = randomItem(OGGETTI_BASE);
        if (obj === "Bastone" || obj === "Geosasso") {
            const qta = randomInt(10, 20);
            listaOggettiExtra.push(`${obj} x${qta}`);
        } else {
            listaOggettiExtra.push(`${obj} x1`);
        }
    }

    const tiroRaro = randomInt(1, 100);
    if (tiroRaro <= 15) {
        listaOggettiExtra.push(`${randomItem(GOMME_COLORATE)} x1`);
    } else if (tiroRaro >= 90) {
        listaOggettiExtra.push(`Arruolamento di ${committenteNome}`);
    }

    if (listaOggettiExtra.length > 0) {
        testo += `\nStrumenti: ${listaOggettiExtra.join(", ")}`;
    }

    return testo;
}

// --- GENERATORE DI MISSIONI SECONDARIE FISSE (NPC) ---

function generaMissioneSecondariaFissa(npcForzato = null) {
    const listaNPC = ['Chica', 'Tachys', 'Algo', 'Graphe', 'Flora', 'Spunzy'];
    const npcScelto = npcForzato && listaNPC.includes(npcForzato) ? npcForzato : randomItem(listaNPC);

    let gradoScelto = randomItem(ORDINE_GRADI);
    let dungeonObj = randomItem(DUNGEONS);
    let piano = randomInt(1, dungeonObj.maxPiani);
    let tipoChiave = 'RESCUE';
    let committente = "";
    let targetPkm = null;
    let oggRichiesto = null;
    let descCustom = "";

    switch (npcScelto) {
        case 'Chica': // Maractus: Raccolta semi o cibo
            committente = "Maractus";
            tipoChiave = 'ITEM_REQUEST';
            oggRichiesto = randomItem(SEMI_O_CIBO);
            descCustom = `Raccogliere ${oggRichiesto} al piano ${piano} di ${dungeonObj.nome} per conto di Chica (Maractus).`;
            break;

        case 'Tachys': // Zigzagoon galar: Scorta
            committente = "Zigzagoon-Galar";
            tipoChiave = 'ESCORT';
            descCustom = `Scortare Tachys (Zigzagoon Galar) al piano ${piano} di ${dungeonObj.nome}.`;
            break;

        case 'Algo': // Porygon: Bounty con Pokémon tecnologici
            committente = "Porygon";
            tipoChiave = 'OUTLAW_BOUNTY';
            targetPkm = randomItem(POKEMON_TECNOLOGICI);
            descCustom = `Trovare il ricercato tecnologico ${targetPkm} al piano ${piano} di ${dungeonObj.nome} per conto di Algo (Porygon).`;
            break;

        case 'Graphe': // Yamask: Bounty con antichi/fossili oppure raccolta di orb
            committente = "Yamask";
            if (Math.random() < 0.5) {
                tipoChiave = 'OUTLAW_BOUNTY';
                targetPkm = randomItem(POKEMON_ANTICHI_FOSSILI);
                descCustom = `Trovare l'antico ricercato ${targetPkm} al piano ${piano} di ${dungeonObj.nome} per conto di Graphe (Yamask).`;
            } else {
                tipoChiave = 'ITEM_REQUEST';
                oggRichiesto = randomItem(ORB_LIST);
                descCustom = `Recuperare la ${oggRichiesto} al piano ${piano} di ${dungeonObj.nome} per le ricerche di Graphe (Yamask).`;
            }
            break;

        case 'Flora': // Lilligant: Bacche, semesalute o rescue erba
            committente = "Lilligant";
            if (Math.random() < 0.5) {
                tipoChiave = 'ITEM_REQUEST';
                oggRichiesto = randomItem(BACCHE_E_SEMI);
                descCustom = `Raccogliere ${oggRichiesto} al piano ${piano} di ${dungeonObj.nome} per Flora (Lilligant).`;
            } else {
                tipoChiave = 'RESCUE';
                targetPkm = estraiPokemonErba();
                descCustom = `Salvare il Pokémon di tipo Erba (${targetPkm}) smarrito al piano ${piano} di ${dungeonObj.nome} su richiesta di Flora (Lilligant).`;
            }
            break;

        case 'Spunzy': // Spunzy (Pichu): Scorta o Bounty tecnologico
            committente = "Pichu";
            if (Math.random() < 0.5) {
                tipoChiave = 'ESCORT';
                descCustom = `Scortare Spunzy (Pichu) al piano ${piano} di ${dungeonObj.nome}.`;
            } else {
                tipoChiave = 'OUTLAW_BOUNTY';
                targetPkm = randomItem(POKEMON_TECNOLOGICI);
                descCustom = `Catturare il ricercato ${targetPkm} al piano ${piano} di ${dungeonObj.nome} per conto di Spunzy (Pichu).`;
            }
            break;
    }

    const ricompensa = calcolaRicompensa(gradoScelto, tipoChiave, committente);

    return {
        tipoChiave,
        grado: gradoScelto,
        dungeonObj,
        piano,
        committente,
        targetPkm,
        oggRichiesto,
        ricompensa,
        descrizione: descCustom,
        isSecondariaFissa: true,
        descrizioneSecondariaCustom: descCustom
    };
}

// --- LOGICA DI GENERAZIONE MISSIONE PRINCIPALE ---

function generaNuovaMissione() {
    let missione;
    const selectForza = document.getElementById('select-forza-secondaria');
    const forzatura = selectForza ? selectForza.value : 'nessuna';

    if (forzatura && forzatura !== 'nessuna') {
        // Forzatura manuale dal menu a tendina
        missione = generaMissioneSecondariaFissa(forzatura);
    } else if (Math.random() < 0.25) {
        // 25% di probabilità casuale di attivare una quest secondaria
        missione = generaMissioneSecondariaFissa();
    } else {
        // Missione standard normale
        let idxMin = ORDINE_GRADI.indexOf(selectGradoMin.value);
        let idxMax = ORDINE_GRADI.indexOf(selectGradoMax.value);

        if (idxMin > idxMax) {
            [idxMin, idxMax] = [idxMax, idxMin];
        }

        const gradiDisponibili = ORDINE_GRADI.slice(idxMin, idxMax + 1);
        const gradoScelto = randomItem(gradiDisponibili);

        const tipoChiave = randomItem(Object.keys(TIPI_MISSIONE));
        const dungeonObj = randomItem(DUNGEONS);
        const piano = randomInt(1, dungeonObj.maxPiani);

        const committente = estraiPokemonPerGrado(gradoScelto, null, false);
        let targetPkm = null;
        let oggRichiesto = null;

        switch (tipoChiave) {
            case 'RESCUE':
                const eAmico = Math.random() < 0.5;
                targetPkm = eAmico ? estraiPokemonPerGrado(gradoScelto, committente, false) : committente;
                break;

            case 'ITEM_REQUEST':
            case 'ITEM_DELIVERY':
                oggRichiesto = randomItem(OGGETTI_BASE);
                break;

            case 'OUTLAW_BOUNTY':
                targetPkm = estraiPokemonPerGrado(gradoScelto, committente, true);
                break;
        }

        const ricompensa = calcolaRicompensa(gradoScelto, tipoChiave, committente);

        missione = {
            tipoChiave,
            grado: gradoScelto,
            dungeonObj,
            piano,
            committente,
            targetPkm,
            oggRichiesto,
            ricompensa,
            descrizione: "",
            isSecondariaFissa: false
        };

        aggiornaDescrizioneMissione(missione);
    }

    mossaCorrente = missione;
    cronologiaMissioni.unshift(mossaCorrente);
    mostraMissione(mossaCorrente);
    aggiornaCronologiaVisiva();
}

function mostraMissione(m) {
    mTipo.textContent = TIPI_MISSIONE[m.tipoChiave].nome;
    mGrado.textContent = `Grado ${m.grado}`;
    mDescrizione.textContent = m.descrizione;
    mCommittente.textContent = m.committente;
    mDungeon.textContent = m.dungeonObj.nome;
    mPiano.textContent = `Piano ${m.piano}`;
    mRicompensa.value = m.ricompensa;

    if (m.targetPkm) {
        boxTarget.classList.remove('hidden');
        lblTarget.textContent = (m.tipoChiave === 'OUTLAW_BOUNTY') ? 'Ricercato' : 'Pokémon da Aiutare';
        mTarget.textContent = m.targetPkm;
    } else {
        boxTarget.classList.add('hidden');
    }

    if (m.oggRichiesto) {
        boxOggetto.classList.remove('hidden');
        mOggetto.textContent = m.oggRichiesto;
    } else {
        boxOggetto.classList.add('hidden');
    }

    cardMissione.classList.remove('hidden');
}

function aggiornaCronologiaVisiva() {
    listaCronologia.innerHTML = '';

    if (cronologiaMissioni.length === 0) {
        listaCronologia.innerHTML = '<li style="color: #64748b; font-style: italic; text-align: center; padding: 10px 0;">Nessuna missione generata</li>';
        return;
    }

    cronologiaMissioni.forEach((m) => {
        const li = document.createElement('li');
        const eAttiva = mossaCorrente === m;
        li.className = `history-item ${eAttiva ? 'active' : ''}`;

        li.innerHTML = `
        <span>${TIPI_MISSIONE[m.tipoChiave].nome} (${m.committente})</span>
        <span class="badge-rank">${m.grado}</span>
        `;

        li.addEventListener('click', () => {
            mossaCorrente = m;
            mostraMissione(m);
            aggiornaCronologiaVisiva();
        });

        listaCronologia.appendChild(li);
    });
}

// --- AZIONI PULSANTI MINI-RIGENERAZIONE ---

btnGenera.addEventListener('click', generaNuovaMissione);

btnRegenCommittente.addEventListener('click', () => {
    if (!mossaCorrente) return;
    if (mossaCorrente.isSecondariaFissa) return;
    mossaCorrente.committente = estraiPokemonPerGrado(mossaCorrente.grado, mossaCorrente.committente, false);

    if (mossaCorrente.tipoChiave === 'RESCUE' && mossaCorrente.targetPkm === mossaCorrente.committente) {
        mossaCorrente.targetPkm = mossaCorrente.committente;
    }

    aggiornaDescrizioneMissione(mossaCorrente);
    mostraMissione(mossaCorrente);
});

btnRegenTarget.addEventListener('click', () => {
    if (!mossaCorrente || !mossaCorrente.targetPkm) return;
    if (mossaCorrente.isSecondariaFissa) return;
    const eStretto = (mossaCorrente.tipoChiave === 'OUTLAW_BOUNTY');
    mossaCorrente.targetPkm = estraiPokemonPerGrado(mossaCorrente.grado, mossaCorrente.targetPkm, eStretto);
    aggiornaDescrizioneMissione(mossaCorrente);
    mostraMissione(mossaCorrente);
});

btnRegenDungeon.addEventListener('click', () => {
    if (!mossaCorrente) return;
    mossaCorrente.dungeonObj = randomItemExcept(DUNGEONS, mossaCorrente.dungeonObj);
    mossaCorrente.piano = randomInt(1, mossaCorrente.dungeonObj.maxPiani);
    aggiornaDescrizioneMissione(mossaCorrente);
    mostraMissione(mossaCorrente);
});

btnRegenPiano.addEventListener('click', () => {
    if (!mossaCorrente) return;
    mossaCorrente.piano = randomIntExcept(1, mossaCorrente.dungeonObj.maxPiani, mossaCorrente.piano);
    aggiornaDescrizioneMissione(mossaCorrente);
    mostraMissione(mossaCorrente);
});

btnRegenOggetto.addEventListener('click', () => {
    if (!mossaCorrente || !mossaCorrente.oggRichiesto) return;
    if (mossaCorrente.isSecondariaFissa) return;
    mossaCorrente.oggRichiesto = randomItemExcept(OGGETTI_BASE, mossaCorrente.oggRichiesto);
    aggiornaDescrizioneMissione(mossaCorrente);
    mostraMissione(mossaCorrente);
});

btnRegenRicompensa.addEventListener('click', () => {
    if (!mossaCorrente) return;
    mossaCorrente.ricompensa = calcolaRicompensa(mossaCorrente.grado, mossaCorrente.tipoChiave, mossaCorrente.committente);
    mostraMissione(mossaCorrente);
});
