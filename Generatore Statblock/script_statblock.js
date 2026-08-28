let listaMosseDB = [];
let listaAbilitaGeneriche = [];
let pokemonSelezionatoData = null;
let mosseImparabiliSpecie = [];

let mosseSelezionateStatblock = [];
let abilitaSelezionateStatblock = [];

// Array della cronologia salvata (memorizzato in localStorage)
let cronologiaSalvati = [];

// Tabella Tipi Pokémon Ufficiale
const TYPE_CHART = {
    "Normal":   { "Rock": 0.5, "Ghost": 0, "Steel": 0.5 },
    "Fire":     { "Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 2, "Bug": 2, "Rock": 0.5, "Dragon": 0.5, "Steel": 2 },
    "Water":    { "Fire": 2, "Water": 0.5, "Grass": 0.5, "Ground": 2, "Rock": 2, "Dragon": 0.5 },
    "Electric": { "Water": 2, "Electric": 0.5, "Grass": 0.5, "Ground": 0, "Flying": 2, "Dragon": 0.5 },
    "Grass":    { "Fire": 0.5, "Water": 2, "Grass": 0.5, "Poison": 0.5, "Ground": 2, "Flying": 0.5, "Bug": 0.5, "Rock": 2, "Dragon": 0.5, "Steel": 0.5 },
    "Ice":      { "Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 0.5, "Ground": 2, "Flying": 2, "Dragon": 2, "Steel": 0.5 },
    "Fighting": { "Normal": 2, "Ice": 2, "Poison": 0.5, "Flying": 0.5, "Psychic": 0.5, "Bug": 0.5, "Rock": 2, "Ghost": 0, "Steel": 2, "Fairy": 0.5, "Dark": 2 },
    "Poison":   { "Grass": 2, "Poison": 0.5, "Ground": 0.5, "Rock": 0.5, "Ghost": 0.5, "Steel": 0, "Fairy": 2 },
    "Ground":   { "Fire": 2, "Electric": 2, "Grass": 0.5, "Poison": 2, "Flying": 0, "Bug": 0.5, "Rock": 2, "Steel": 2 },
    "Flying":   { "Electric": 0.5, "Grass": 2, "Fighting": 2, "Bug": 2, "Rock": 0.5, "Steel": 0.5 },
    "Psychic":  { "Fighting": 2, "Poison": 2, "Psychic": 0.5, "Steel": 0.5, "Dark": 0 },
    "Bug":      { "Fire": 0.5, "Grass": 2, "Fighting": 0.5, "Poison": 0.5, "Flying": 0.5, "Psychic": 2, "Ghost": 0.5, "Steel": 0.5, "Fairy": 0.5, "Dark": 2 },
    "Rock":     { "Fire": 2, "Ice": 2, "Fighting": 0.5, "Ground": 0.5, "Flying": 2, "Bug": 2, "Steel": 0.5 },
    "Ghost":    { "Normal": 0, "Psychic": 2, "Ghost": 2, "Dark": 0.5 },
    "Dragon":   { "Dragon": 2, "Steel": 0.5, "Fairy": 0 },
    "Steel":    { "Fire": 0.5, "Water": 0.5, "Electric": 0.5, "Ice": 2, "Rock": 2, "Steel": 0.5, "Fairy": 2 },
    "Fairy":    { "Fire": 0.5, "Fighting": 2, "Poison": 0.5, "Dragon": 2, "Steel": 0.5, "Dark": 2 },
    "Dark":     { "Fighting": 0.5, "Psychic": 2, "Ghost": 2, "Fairy": 0.5, "Dark": 0.5 }
};

const COLORI_TIPI = {
    "Normal": "#A8A77A", "Fire": "#EE8130", "Water": "#6390F0", "Electric": "#F7D02C",
    "Grass": "#7AC74C", "Ice": "#96D9D6", "Fighting": "#C22E28", "Poison": "#A33EA1",
    "Ground": "#E2BF65", "Flying": "#A98FF3", "Psychic": "#F95587", "Bug": "#A6B91A",
    "Rock": "#B6A136", "Ghost": "#735797", "Dragon": "#6F35FC", "Steel": "#B7B7CE",
    "Fairy": "#D685AD", "Dark": "#705746"
};

const TUTTI_I_TIPI = Object.keys(COLORI_TIPI);

// Riferimenti HTML
const inputPkmSearch = document.getElementById('input-pkm-search');
const listPokedex = document.getElementById('list-pokedex');
const inputLivello = document.getElementById('input-livello');
const chkIsBoss = document.getElementById('chk-is-boss');
const btnRecalcolaStat = document.getElementById('btn-recalcola-stat');

const statHpInput = document.getElementById('stat-hp');
const statAtkInput = document.getElementById('stat-atk');
const statDefInput = document.getElementById('stat-def');
const statSpaInput = document.getElementById('stat-spa');
const statSpdInput = document.getElementById('stat-spd');
const statSpeInput = document.getElementById('stat-spe');
const statIqInput = document.getElementById('stat-iq');

const filtroStelleMosse = document.getElementById('filtro-stelle-mosse');
const chkForceMosse = document.getElementById('chk-force-mosse');
const boxCercaMossaExtra = document.getElementById('box-cerca-mossa-extra');
const inputCercaMossaExtra = document.getElementById('input-cerca-mossa-extra');
const listaMosseElem = document.getElementById('lista-mosse-imparabili');

const inputCercaAbilita = document.getElementById('input-cerca-abilita');
const chkForceAbilita = document.getElementById('chk-force-abilita');
const listaAbilitaElem = document.getElementById('lista-abilita');

const btnClearMosse = document.getElementById('btn-clear-mosse');
const btnClearAbilita = document.getElementById('btn-clear-abilita');

const sbNome = document.getElementById('sb-nome');
const sbTipi = document.getElementById('sb-tipi');
const sbLivello = document.getElementById('sb-livello');
const sbStatHp = document.getElementById('sb-stat-hp');
const sbStatAtk = document.getElementById('sb-stat-atk');
const sbStatDef = document.getElementById('sb-stat-def');
const sbStatSpa = document.getElementById('sb-stat-spa');
const sbStatSpd = document.getElementById('sb-stat-spd');
const sbStatSpe = document.getElementById('sb-stat-spe');
const sbStatIq = document.getElementById('sb-stat-iq');

const sbDebolezze = document.getElementById('sb-debolezze');
const sbResistenze = document.getElementById('sb-resistenze');
const sbImmunita = document.getElementById('sb-immunita');

const sbAbilitaList = document.getElementById('sb-abilita-list');
const sbMosseList = document.getElementById('sb-mosse-list');
const btnSalvaImmagine = document.getElementById('btn-salva-immagine');
const btnSalvaCronologia = document.getElementById('btn-salva-cronologia');

const listaCronologiaPkm = document.getElementById('lista-cronologia-pkm');
const btnSvuotaCronologia = document.getElementById('btn-svuota-cronologia');
const btnExportJson = document.getElementById('btn-export-json');
const inputImportJson = document.getElementById('input-import-json');

function pulisciNomePuro(nome) {
    return nome ? nome.toString().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

// Inizializzazione pagina all'avvio
window.addEventListener('DOMContentLoaded', () => {
    if (inputPkmSearch) inputPkmSearch.value = "";
    pokemonSelezionatoData = null;
    mosseImparabiliSpecie = [];
    mosseSelezionateStatblock = [];
    abilitaSelezionateStatblock = [];

    if (listaMosseElem) {
        listaMosseElem.innerHTML = '<li style="padding: 10px; color: #64748b; font-style: italic;">Seleziona prima un Pokémon</li>';
    }
    if (listaAbilitaElem) {
        listaAbilitaElem.innerHTML = '<li style="padding: 10px; color: #64748b; font-style: italic;">Seleziona prima un Pokémon</li>';
    }

    caricaCronologiaDaStorage();
});

// 1. Carica DB Mosse
if (typeof datiCSV !== 'undefined') {
    Papa.parse(datiCSV, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            listaMosseDB = results.data.filter(riga => riga['[Name]'] && riga['[Name]'] !== '[Name]');
        }
    });
}

// 2. Carica DB Abilità
if (typeof datiAbilitiesCSV !== 'undefined') {
    Papa.parse(datiAbilitiesCSV, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            listaAbilitaGeneriche = results.data.filter(riga => {
                const name = riga['[Name]'];
                return name && name !== '[Name]' && !name.startsWith('[');
            });
            popolaListaAbilitaVisibili();
        }
    });
}

// 3. Popola Autocomplete Pokémon
function popolaDatalistPokedex() {
    const pokedexObj = (typeof exports !== 'undefined' && exports.BattlePokedex) ? exports.BattlePokedex : {};
    listPokedex.innerHTML = '';

    Object.keys(pokedexObj).forEach(key => {
        const pkm = pokedexObj[key];
        const option = document.createElement('option');
        option.value = pkm.name || key;
        listPokedex.appendChild(option);
    });
}
popolaDatalistPokedex();

// --- CALCOLO STATISTICHE CON OSCILLAZIONE HP BOSS (90-150%) ---

function calcolaEDistribuisciStatistiche() {
    if (!pokemonSelezionatoData && inputPkmSearch.value.trim() !== "") {
        cercaEImpostaPokemon(inputPkmSearch.value.trim());
    }
    if (!pokemonSelezionatoData) return;

    const livello = parseInt(inputLivello.value) || 1;
    const eBoss = chkIsBoss.checked;

    // Valori medi base: Lv.1 = 30 HP / 10 Modificatori (+10 per livello)
    const teamHpBase = 30 + (livello - 1) * 10;
    const teamModBase = 10 + (livello - 1) * 10;

    const base = pokemonSelezionatoData.baseStats || { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 };
    const baseIq = Math.round((base.spa + base.spd) / 2) || 50;
    const baseStatsList = { atk: base.atk, def: base.def, spa: base.spa, spd: base.spd, spe: base.spe, iq: baseIq };
    const sommaBase = baseStatsList.atk + baseStatsList.def + baseStatsList.spa + baseStatsList.spd + baseStatsList.spe + baseStatsList.iq;

    const hpBaseNorm = Math.min(Math.max(base.hp, 10), 250);

    let targetHp = 0;
    let targetModPool = 0;

    if (eBoss) {
        // Boss: HP oscillano tra 90% e 150% (0.90 - 1.50) in base al peso della specie
        const frazioneHpBoss = 0.90 + ((hpBaseNorm - 10) / 240) * (1.50 - 0.90);
        targetHp = Math.round(teamHpBase * frazioneHpBoss);
        targetModPool = teamModBase;
    } else {
        // Nemico Standard: HP e Modificatori oscillano tra 50% e 75%
        const frazioneHpStandard = 0.50 + ((hpBaseNorm - 10) / 240) * (0.75 - 0.50);
        targetHp = Math.round(teamHpBase * frazioneHpStandard);
        targetModPool = Math.round(teamModBase * frazioneHpStandard);
    }

    // 1. HP calcolati SENZA +livello
    statHpInput.value = targetHp;

    // 2. Modificatori con +livello post-calcolo
    statAtkInput.value = Math.round(targetModPool * (baseStatsList.atk / sommaBase)) + livello;
    statDefInput.value = Math.round(targetModPool * (baseStatsList.def / sommaBase)) + livello;
    statSpaInput.value = Math.round(targetModPool * (baseStatsList.spa / sommaBase)) + livello;
    statSpdInput.value = Math.round(targetModPool * (baseStatsList.spd / sommaBase)) + livello;
    statSpeInput.value = Math.round(targetModPool * (baseStatsList.spe / sommaBase)) + livello;
    statIqInput.value = Math.round(targetModPool * (baseStatsList.iq / sommaBase)) + livello;

    popolaListaAbilitaVisibili();
    aggiornaPreviewStatblock();
}

// --- CALCOLO RELAZIONI DI TIPO ---

function calcolaEfficaciaTipi(tipiPkm) {
    const tuttiTipi = Object.keys(TYPE_CHART);
    const risultati = {};

    tuttiTipi.forEach(atkType => {
        let moltiplicatore = 1.0;
        tipiPkm.forEach(defType => {
            if (TYPE_CHART[atkType] && TYPE_CHART[atkType][defType] !== undefined) {
                moltiplicatore *= TYPE_CHART[atkType][defType];
            }
        });
        risultati[atkType] = moltiplicatore;
    });

    const debolezze = [];
    const resistenze = [];
    const immunita = [];

    Object.keys(risultati).forEach(tipo => {
        const mult = risultati[tipo];
        if (mult === 0) {
            immunita.push(tipo);
        } else if (mult > 1.0) {
            const debolezzaStr = mult > 2 ? `${tipo} (x4)` : tipo;
            debolezze.push(debolezzaStr);
        } else if (mult < 1.0) {
            const resistenzaStr = mult < 0.5 ? `${tipo} (x1/4)` : tipo;
            resistenze.push(resistenzaStr);
        }
    });

    return { debolezze, resistenze, immunita };
}

function creaBadgeTipo(tipoNome) {
    const nomePulito = tipoNome.split(' ')[0];
    const colore = COLORI_TIPI[nomePulito] || "#64748b";
    return `<span class="type-badge" style="background-color: ${colore};">${tipoNome}</span>`;
}

// --- GESTIONE SELEZIONE POKÉMON ---

function cercaEImpostaPokemon(nomeInserito) {
    const pokedexObj = (typeof exports !== 'undefined' && exports.BattlePokedex) ? exports.BattlePokedex : {};
    const chiaveTrovata = Object.keys(pokedexObj).find(k => (pokedexObj[k].name || k).toLowerCase() === nomeInserito.toLowerCase());

    if (chiaveTrovata) {
        pokemonSelezionatoData = pokedexObj[chiaveTrovata];
        caricaLearnsetEAbilitaPkm(chiaveTrovata);
        calcolaEDistribuisciStatistiche();
    }
}

inputPkmSearch.addEventListener('change', () => cercaEImpostaPokemon(inputPkmSearch.value.trim()));
inputPkmSearch.addEventListener('input', () => cercaEImpostaPokemon(inputPkmSearch.value.trim()));

[inputLivello, chkIsBoss].forEach(elem => {
    elem.addEventListener('input', calcolaEDistribuisciStatistiche);
    elem.addEventListener('change', calcolaEDistribuisciStatistiche);
});

if (btnRecalcolaStat) {
    btnRecalcolaStat.addEventListener('click', calcolaEDistribuisciStatistiche);
}

[statHpInput, statAtkInput, statDefInput, statSpaInput, statSpdInput, statSpeInput, statIqInput].forEach(elem => {
    elem.addEventListener('input', aggiornaPreviewStatblock);
});

// --- CARICAMENTO MOSSE E ABILITÀ ---

function caricaLearnsetEAbilitaPkm(chiavePkm) {
    mosseSelezionateStatblock = [];
    abilitaSelezionateStatblock = [];

    mosseImparabiliSpecie = [];
    if (typeof datiLearnsetsObj !== 'undefined') {
        const pkmLearnObj = datiLearnsetsObj[pulisciNomePuro(chiavePkm)];
        const learnsetList = (pkmLearnObj && pkmLearnObj.learnset) ? Object.keys(pkmLearnObj.learnset) : [];

        learnsetList.forEach(mName => {
            const mNorm = pulisciNomePuro(mName);
            const mMatch = listaMosseDB.find(m => pulisciNomePuro(m['[Name]']) === mNorm);
            if (mMatch && !mosseImparabiliSpecie.includes(mMatch)) {
                mosseImparabiliSpecie.push(mMatch);
            }
        });
    }

    popolaListaMosseVisibili();
    popolaListaAbilitaVisibili();
    aggiornaPreviewStatblock();
}

filtroStelleMosse.addEventListener('change', popolaListaMosseVisibili);

chkForceMosse.addEventListener('change', () => {
    if (chkForceMosse.checked) {
        boxCercaMossaExtra.classList.remove('hidden');
    } else {
        boxCercaMossaExtra.classList.add('hidden');
        inputCercaMossaExtra.value = '';
    }
    popolaListaMosseVisibili();
});

inputCercaMossaExtra.addEventListener('input', popolaListaMosseVisibili);

function ottieniDescrizioneMossa(m) {
    const cond = m['Conditions'] ? m['Conditions'].trim() : '';
    const eff = m['Other Effects'] ? m['Other Effects'].trim() : '';

    if (cond && eff) {
        return `<strong>Condizione:</strong> ${cond}<br><strong>Effetto:</strong> ${eff}`;
    } else if (cond) {
        return `<strong>Condizione:</strong> ${cond}`;
    } else if (eff) {
        return `<strong>Effetto:</strong> ${eff}`;
    }
    return 'Nessun effetto aggiuntivo';
}

function popolaListaMosseVisibili() {
    const stella = filtroStelleMosse.value;
    const forzaMosse = chkForceMosse.checked;
    const ricercaMossa = inputCercaMossaExtra.value.trim().toLowerCase();

    listaMosseElem.innerHTML = '';

    let mosseSorgente = forzaMosse ? listaMosseDB : mosseImparabiliSpecie;

    if (stella !== 'tutte') {
        mosseSorgente = mosseSorgente.filter(m => (m['[LEVEL]'] || '★') === stella);
    }

    if (forzaMosse && ricercaMossa) {
        mosseSorgente = mosseSorgente.filter(m => m['[Name]'] && m['[Name]'].toLowerCase().includes(ricercaMossa));
    }

    if (mosseSorgente.length === 0) {
        listaMosseElem.innerHTML = '<li style="padding: 10px; color: #64748b; font-style: italic;">Nessuna mossa trovata</li>';
        return;
    }

    const tipiPkm = pokemonSelezionatoData ? (pokemonSelezionatoData.types || []) : [];

    mosseSorgente.forEach(m => {
        const li = document.createElement('li');
        const isSelected = mosseSelezionateStatblock.includes(m);
        li.className = `item-row ${isSelected ? 'selected' : ''}`;

        const mType = m['[Type]'] || 'Normal';
        const mCat = m['[Category]'] || 'Physical';
        const isStab = tipiPkm.map(t => t.toLowerCase()).includes(mType.toLowerCase());

        li.innerHTML = `
        <span>
        <strong>${m['[Name]']}</strong>
        <span style="color:#64748b; font-size:0.75rem;">(${mType} - ${mCat})</span>
        ${isStab ? '<span class="badge-stab">STAB</span>' : ''}
        </span>
        <span class="badge-star">${m['[LEVEL]'] || '★'}</span>
        `;

        li.addEventListener('click', () => {
            if (isSelected) {
                mosseSelezionateStatblock = mosseSelezionateStatblock.filter(x => x !== m);
            } else {
                if (mosseSelezionateStatblock.length >= 4) {
                    alert("Puoi selezionare al massimo 4 mosse!");
                    return;
                }
                mosseSelezionateStatblock.push(m);
            }
            popolaListaMosseVisibili();
            aggiornaPreviewStatblock();
        });

        listaMosseElem.appendChild(li);
    });
}

// --- VERIFICA PREREQUISITI ABILITÀ ---

chkForceAbilita.addEventListener('change', popolaListaAbilitaVisibili);

function verificaCompatibilitaAbilita(abilitaObj) {
    if (chkForceAbilita.checked) return true;
    if (!pokemonSelezionatoData) return false;

    const livelloAttuale = parseInt(inputLivello.value) || 1;

    const reqLevel = parseInt(abilitaObj['[Level Prerequisite]']);
    if (!isNaN(reqLevel) && livelloAttuale < reqLevel) {
        return false;
    }

    const prereqText = abilitaObj['[Prerequisite]'];
    if (prereqText && prereqText.toLowerCase().includes("-type")) {
        const tipiPkmLower = (pokemonSelezionatoData.types || []).map(t => t.toLowerCase());
        const tipiRichiesti = TUTTI_I_TIPI.filter(t => prereqText.toLowerCase().includes(t.toLowerCase() + "-type"));

        if (tipiRichiesti.length > 0) {
            if (prereqText.includes("&") || prereqText.toLowerCase().includes("and")) {
                const haTutti = tipiRichiesti.every(tr => tipiPkmLower.includes(tr.toLowerCase()));
                if (!haTutti) return false;
            } else {
                const haAlmenoUno = tipiRichiesti.some(tr => tipiPkmLower.includes(tr.toLowerCase()));
                if (!haAlmenoUno) return false;
            }
        }
    }

    return true;
}

inputCercaAbilita.addEventListener('input', popolaListaAbilitaVisibili);

function popolaListaAbilitaVisibili() {
    listaAbilitaElem.innerHTML = '';

    const ricerca = inputCercaAbilita.value.trim().toLowerCase();
    const abilitaInserite = new Set();
    const forzaAbilita = chkForceAbilita.checked;

    if (pokemonSelezionatoData && pokemonSelezionatoData.abilities) {
        Object.values(pokemonSelezionatoData.abilities).forEach(aNome => {
            if (aNome && !abilitaInserite.has(aNome)) {
                const matchGen = listaAbilitaGeneriche.find(x => pulisciNomePuro(x['[Name]']) === pulisciNomePuro(aNome));
                if (matchGen && (forzaAbilita || verificaCompatibilitaAbilita(matchGen))) {
                    abilitaInserite.add(aNome);
                    if (!ricerca || aNome.toLowerCase().includes(ricerca)) {
                        aggiungiRigaAbilita(aNome, matchGen['[Effect]'], "Specie");
                    }
                }
            }
        });
    }

    listaAbilitaGeneriche.forEach(a => {
        const aNome = a['[Name]'];
        if (aNome && !abilitaInserite.has(aNome)) {
            if (forzaAbilita || verificaCompatibilitaAbilita(a)) {
                abilitaInserite.add(aNome);
                if (!ricerca || aNome.toLowerCase().includes(ricerca)) {
                    aggiungiRigaAbilita(aNome, a['[Effect]'] || 'Nessun effetto registrato.', "Generica");
                }
            }
        }
    });

    if (listaAbilitaElem.children.length === 0) {
        listaAbilitaElem.innerHTML = '<li style="padding: 10px; color: #64748b; font-style: italic;">Nessuna abilità trovata</li>';
    }
}

function aggiungiRigaAbilita(aNome, effetto, categoria) {
    const li = document.createElement('li');
    const objAb = { nome: aNome, effetto: effetto };
    const isSelected = abilitaSelezionateStatblock.some(x => x.nome === aNome);

    li.className = `item-row ${isSelected ? 'selected' : ''}`;
    li.innerHTML = `<span><strong>${aNome}</strong> <small style="color:#64748b;">(${categoria})</small></span>`;

    li.addEventListener('click', () => {
        if (isSelected) {
            abilitaSelezionateStatblock = abilitaSelezionateStatblock.filter(x => x.nome !== aNome);
        } else {
            if (abilitaSelezionateStatblock.length >= 4) {
                alert("Puoi selezionare al massimo 4 abilità in totale!");
                return;
            }
            abilitaSelezionateStatblock.push(objAb);
        }
        popolaListaAbilitaVisibili();
        aggiornaPreviewStatblock();
    });

    listaAbilitaElem.appendChild(li);
}

// --- PULSANTI DESELEZIONA TUTTO ---

btnClearMosse.addEventListener('click', () => {
    mosseSelezionateStatblock = [];
    popolaListaMosseVisibili();
    aggiornaPreviewStatblock();
});

btnClearAbilita.addEventListener('click', () => {
    abilitaSelezionateStatblock = [];
    popolaListaAbilitaVisibili();
    aggiornaPreviewStatblock();
});

// --- PREVIEW STATBLOCK ---

function aggiornaPreviewStatblock() {
    if (!pokemonSelezionatoData) return;

    const isBoss = chkIsBoss.checked;
    sbNome.textContent = (pokemonSelezionatoData.name || "Pokémon") + (isBoss ? " (BOSS)" : "");
    const tipiPkm = pokemonSelezionatoData.types || ["Normal"];
    sbTipi.textContent = tipiPkm.join(" / ");
    sbLivello.textContent = `Lv. ${inputLivello.value}`;

    sbStatHp.textContent = statHpInput.value;
    sbStatAtk.textContent = statAtkInput.value;
    sbStatDef.textContent = statDefInput.value;
    sbStatSpa.textContent = statSpaInput.value;
    sbStatSpd.textContent = statSpdInput.value;
    sbStatSpe.textContent = statSpeInput.value;
    sbStatIq.textContent = statIqInput.value;

    const rel = calcolaEfficaciaTipi(tipiPkm);
    sbDebolezze.innerHTML = rel.debolezze.length > 0 ? rel.debolezze.map(creaBadgeTipo).join(" ") : 'Nessuna';
    sbResistenze.innerHTML = rel.resistenze.length > 0 ? rel.resistenze.map(creaBadgeTipo).join(" ") : 'Nessuna';
    sbImmunita.innerHTML = rel.immunita.length > 0 ? rel.immunita.map(creaBadgeTipo).join(" ") : 'Nessuna';

    if (abilitaSelezionateStatblock.length === 0) {
        sbAbilitaList.innerHTML = '<span style="color: #64748b; font-style: italic;">Nessuna abilità selezionata</span>';
    } else {
        sbAbilitaList.innerHTML = abilitaSelezionateStatblock.map(a => `
        <div style="margin-bottom: 6px;">
        <strong>${a.nome}:</strong> ${a.effetto}
        </div>
        `).join("");
    }

    if (mosseSelezionateStatblock.length === 0) {
        sbMosseList.innerHTML = '<div style="font-size: 0.9rem; color: #64748b; font-style: italic;">Nessuna mossa selezionata (max 4)</div>';
    } else {
        const tipiPkmLower = tipiPkm.map(t => t.toLowerCase());
        sbMosseList.innerHTML = mosseSelezionateStatblock.map(m => {
            const mType = m['[Type]'] || 'Normal';
            const isStab = tipiPkmLower.includes(mType.toLowerCase());
            const range = m['[Targets]'] || 'Adiacente';
            const descr = ottieniDescrizioneMossa(m);

            return `
            <div class="sb-move-card">
            <div><strong>${m['[Name]']}</strong> ${isStab ? '<strong style="color: #15803d;">(STAB)</strong>' : ''} (${m['[LEVEL]'] || '★'})</div>
            <div><strong>Tipo:</strong> ${mType} | <strong>Cat:</strong> ${m['[Category]']}</div>
            <div><strong>Pwr:</strong> ${m['[Power]']} | <strong>PP:</strong> ${m['[PP]']} | <strong>Range:</strong> ${range}</div>
            <div style="margin-top: 4px; font-size: 0.78rem; color: #334155;">${descr}</div>
            </div>
            `;
        }).join("");
    }
}

// --- GESTIONE CRONOLOGIA & SALVATAGGI (LOCALSTORAGE & JSON) ---

function salvaInStorage() {
    localStorage.setItem('statblock_cronologia_salvata', JSON.stringify(cronologiaSalvati));
}

function caricaCronologiaDaStorage() {
    const data = localStorage.getItem('statblock_cronologia_salvata');
    if (data) {
        try {
            cronologiaSalvati = JSON.parse(data);
        } catch(e) {
            cronologiaSalvati = [];
        }
    }
    aggiornaListaCronologiaVisiva();
}

btnSalvaCronologia.addEventListener('click', () => {
    if (!pokemonSelezionatoData) {
        alert("Seleziona prima un Pokémon da salvare!");
        return;
    }

    const statblockCorrente = {
        id: Date.now(),
                                    pokemonName: pokemonSelezionatoData.name,
                                    livello: inputLivello.value,
                                    isBoss: chkIsBoss.checked,
                                    stats: {
                                        hp: statHpInput.value,
                                        atk: statAtkInput.value,
                                        def: statDefInput.value,
                                        spa: statSpaInput.value,
                                        spd: statSpdInput.value,
                                        spe: statSpeInput.value,
                                        iq: statIqInput.value
                                    },
                                    mosse: [...mosseSelezionateStatblock],
                                    abilita: [...abilitaSelezionateStatblock]
    };

    cronologiaSalvati.unshift(statblockCorrente);
    salvaInStorage();
    aggiornaListaCronologiaVisiva();

    const originalHtml = btnSalvaCronologia.innerHTML;
    btnSalvaCronologia.innerHTML = '<span>Salvato!</span> ✅';
    setTimeout(() => { btnSalvaCronologia.innerHTML = originalHtml; }, 1500);
});

function aggiornaListaCronologiaVisiva() {
    listaCronologiaPkm.innerHTML = '';

    if (cronologiaSalvati.length === 0) {
        listaCronologiaPkm.innerHTML = '<li style="color: #64748b; font-style: italic; text-align: center; padding: 10px 0;">Nessun Pokémon salvato</li>';
        return;
    }

    cronologiaSalvati.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
        <div style="flex: 1;" onclick="caricaStatblockSalvato(${index})">
        <strong>${item.pokemonName}</strong> ${item.isBoss ? '<small style="color: #e3350d;">(Boss)</small>' : ''}
        <div style="font-size: 0.75rem; color: #64748b;">Lv. ${item.livello} | HP ${item.stats.hp}</div>
        </div>
        <button class="btn-del-item" onclick="eliminaStatblockSalvato(event, ${index})" title="Elimina">🗑️</button>
        `;
        listaCronologiaPkm.appendChild(li);
    });
}

window.caricaStatblockSalvato = function(index) {
    const sb = cronologiaSalvati[index];
    if (!sb) return;

    inputPkmSearch.value = sb.pokemonName;
    inputLivello.value = sb.livello;
    chkIsBoss.checked = sb.isBoss;

    cercaEImpostaPokemon(sb.pokemonName);

    statHpInput.value = sb.stats.hp;
    statAtkInput.value = sb.stats.atk;
    statDefInput.value = sb.stats.def;
    statSpaInput.value = sb.stats.spa;
    statSpdInput.value = sb.stats.spd;
    statSpeInput.value = sb.stats.spe;
    statIqInput.value = sb.stats.iq;

    mosseSelezionateStatblock = [...sb.mosse];
    abilitaSelezionateStatblock = [...sb.abilita];

    popolaListaMosseVisibili();
    popolaListaAbilitaVisibili();
    aggiornaPreviewStatblock();
};

window.eliminaStatblockSalvato = function(event, index) {
    event.stopPropagation();
    cronologiaSalvati.splice(index, 1);
    salvaInStorage();
    aggiornaListaCronologiaVisiva();
};

btnSvuotaCronologia.addEventListener('click', () => {
    if (confirm("Sei sicuro di voler cancellare tutti i Pokémon salvati nella cronologia?")) {
        cronologiaSalvati = [];
        salvaInStorage();
        aggiornaListaCronologiaVisiva();
    }
});

// Esporta JSON
btnExportJson.addEventListener('click', () => {
    if (cronologiaSalvati.length === 0) {
        alert("Nessun Pokémon da esportare!");
        return;
    }
    const blob = new Blob([JSON.stringify(cronologiaSalvati, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `Statblocks_Export_${Date.now()}.json`;
    link.href = url;
    link.click();
});

// Importa JSON
inputImportJson.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const datiImportati = JSON.parse(event.target.result);
            if (Array.isArray(datiImportati)) {
                cronologiaSalvati = [...datiImportati, ...cronologiaSalvati];
                salvaInStorage();
                aggiornaListaCronologiaVisiva();
                alert("Pokémon importati con successo!");
            }
        } catch(err) {
            alert("Errore nel file JSON importato!");
        }
    };
    reader.readAsText(file);
});

// Salva Immagine PNG
btnSalvaImmagine.addEventListener('click', () => {
    const previewCard = document.getElementById('statblock-preview');

    html2canvas(previewCard, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Statblock_${pokemonSelezionatoData ? pokemonSelezionatoData.name : 'Pokemon'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});
