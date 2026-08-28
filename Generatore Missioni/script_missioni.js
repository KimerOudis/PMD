let cronologiaMissioni = [];
let mossaCorrente = null;

// Riferimenti HTML
const btnGenera = document.getElementById('btn-genera-missione');
const selectGradoMin = document.getElementById('select-grado-min');
const selectGradoMax = document.getElementById('select-grado-max');
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

const GOMME_COLORATE = [
    "Gomma Blue (Quiet)",
    "Gomma Brown (Mild)",
    "Gomma Green (Relaxed)",
    "Gomma Sapphire (Lonely)",
    "Gomma Magenta (Impish)",
    "Gomma Mint (Gentle)",
    "Gomma Olive (Calm)",
    "Gomma Orange (Adamant)",
    "Gomma Pink (Jolly)",
    "Gomma Purple (Careful)",
    "Gomma Red (Hasty)",
    "Gomma Silver (Brave)",
    "Gomma Lime (Quirky)",
    "Gomma Violet (Bold)",
    "Gomma Turquoise (Modest)",
    "Gomma Yellow (Sassy)",
    "Gomma Pearl (Rash)",
    "Gomma Black (Serious)",
    "Gomma Scarlet (Hardy)",
    "Gomma Diamond (Docile)",
    "Gomma White (Naive)",
    "Gomma Platinum (Lax)",
    "Gomma Gold (Bashful)",
    "Gomma Ruby (Naughty)",
    "Gomma Emerald (Timid)"
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

// Lettura e filtraggio corretto da pokedex.js (exports.BattlePokedex)
function estraiPokemonPerGrado(grado, pokemonAttuale = null) {
    const pokedexObj = (typeof exports !== 'undefined' && exports.BattlePokedex) ? exports.BattlePokedex : {};
    const chiavi = Object.keys(pokedexObj);

    if (chiavi.length === 0) return "Bulbasaur";

    const chiaviValide = chiavi.filter(k => {
        const kPuro = pulisciStringa(k);
        const pkm = pokedexObj[k];

        if (SET_ESCLUSI.has(kPuro) || kPuro.startsWith("pokestar") || kPuro.startsWith("arceus")) return false;
        if (pkm.isNonstandard && pkm.isNonstandard !== "Past" && pkm.isNonstandard !== "Future") return false;
        if (pkm.forme && (pkm.forme.includes("Mega") || pkm.forme.includes("Gmax"))) return false;

        const haEvoluzioni = Array.isArray(pkm.evos) && pkm.evos.length > 0;
        const haPreEvoluzione = Boolean(pkm.prevo);

        // Chi non si evolve affatto compie la missione a qualsiasi grado
        if (!haEvoluzioni && !haPreEvoluzione) return true;

        if (grado === 'F' || grado === 'E') {
            return haEvoluzioni && !haPreEvoluzione; // Primo stadio
        } else if (grado === 'D' || grado === 'C') {
            return haEvoluzioni && haPreEvoluzione;  // Secondo stadio
        } else { // B, A, S
            return !haEvoluzioni && haPreEvoluzione; // Terzo stadio
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

// Ricalcola la descrizione in base ai dati aggiornati
function aggiornaDescrizioneMissione(m) {
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

// --- LOGICA DI GENERAZIONE MISSIONE PRINCIPALE ---

function generaNuovaMissione() {
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

    const committente = estraiPokemonPerGrado(gradoScelto);
    let targetPkm = null;
    let oggRichiesto = null;

    switch (tipoChiave) {
        case 'RESCUE':
            const eAmico = Math.random() < 0.5;
            targetPkm = eAmico ? estraiPokemonPerGrado(gradoScelto, committente) : committente;
            break;

        case 'ITEM_REQUEST':
        case 'ITEM_DELIVERY':
            oggRichiesto = randomItem(OGGETTI_BASE);
            break;

        case 'OUTLAW_BOUNTY':
            targetPkm = estraiPokemonPerGrado(gradoScelto, committente);
            break;
    }

    const ricompensa = calcolaRicompensa(gradoScelto, tipoChiave, committente);

    mossaCorrente = {
        tipoChiave,
        grado: gradoScelto,
        dungeonObj,
        piano,
        committente,
        targetPkm,
        oggRichiesto,
        ricompensa,
        descrizione: ""
    };

    aggiornaDescrizioneMissione(mossaCorrente);
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
        <span>${TIPI_MISSIONE[m.tipoChiave].nome}</span>
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
    mossaCorrente.committente = estraiPokemonPerGrado(mossaCorrente.grado, mossaCorrente.committente);

    if (mossaCorrente.tipoChiave === 'RESCUE' && mossaCorrente.targetPkm === mossaCorrente.committente) {
        mossaCorrente.targetPkm = mossaCorrente.committente;
    }

    aggiornaDescrizioneMissione(mossaCorrente);
    mostraMissione(mossaCorrente);
});

btnRegenTarget.addEventListener('click', () => {
    if (!mossaCorrente || !mossaCorrente.targetPkm) return;
    mossaCorrente.targetPkm = estraiPokemonPerGrado(mossaCorrente.grado, mossaCorrente.targetPkm);
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
    mossaCorrente.oggRichiesto = randomItemExcept(OGGETTI_BASE, mossaCorrente.oggRichiesto);
    aggiornaDescrizioneMissione(mossaCorrente);
    mostraMissione(mossaCorrente);
});

btnRegenRicompensa.addEventListener('click', () => {
    if (!mossaCorrente) return;
    mossaCorrente.ricompensa = calcolaRicompensa(mossaCorrente.grado, mossaCorrente.tipoChiave, mossaCorrente.committente);
    mostraMissione(mossaCorrente);
});
