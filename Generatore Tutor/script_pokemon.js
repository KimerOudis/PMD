let listaMosse = [];
let attualiMossePokemon = [];
let mosseAttualmenteVisibili = [];
let mossaSelezionata = null;

// 1. Pokémon NON completamente evoluti (Stadi base e intermedi)
const setNonEvoluti = new Set([
    // Gen 1
    "bulbasaur", "ivysaur", "charmander", "charmeleon", "squirtle", "wartortle",
    "caterpie", "metapod", "weedle", "kakuna", "pidgey", "pidgeotto", "rattata", "rattataalola",
    "spearow", "ekans", "pikachu", "pikachualola", "pikachugalar", "sandshrew", "sandshrewalola",
    "nidoranf", "nidorina", "nidoranm", "nidorino", "clefairy", "vulpix", "vulpixalola",
    "jigglypuff", "zubat", "golbat", "oddish", "gloom", "paras", "venonat", "diglett", "diglettalola",
    "meowth", "meowthalola", "meowthgalar", "psyduck", "mankey", "primeape", "growlithe", "growlithehisui",
    "poliwag", "poliwhirl", "abra", "kadabra", "machop", "machoke", "bellsprout", "weepinbell",
    "tentacool", "geodude", "geodudealola", "graveler", "graveleralola", "ponyta", "ponytagalar",
    "slowpoke", "slowpokegalar", "magnemite", "magneton", "farfetchd", "farfetchdgalar",
    "doduo", "seel", "grimer", "grimeralola", "shellder", "gastly", "haunter", "onix", "drowzee",
    "krabby", "voltorb", "voltorbhisui", "exeggcute", "cubone", "lickitung", "koffing", "rhyhorn", "rhydon",
    "chansey", "tangela", "horsea", "seadra", "goldeen", "staryu", "scyther", "electabuzz", "magmar",
    "magikarp", "eevee", "porygon", "porygon2", "omanyte", "kabuto", "dratini", "dragonair",
    // Gen 2
    "chikorita", "bayleef", "cyndaquil", "quilava", "totodile", "croconaw", "sentret", "hoothoot",
    "ledyba", "spinarak", "chinchou", "pichu", "pichuspikyeared", "cleffa", "igglybuff", "togepi", "togetic",
    "natu", "mareep", "flaaffy", "marill", "hoppip", "skiploom", "sunkern", "wooper", "wooperpaldea",
    "murkrow", "misdreavus", "unown", "pineco", "dunsparce", "gligar", "snubbull", "qwilfish", "qwilfishhisui",
    "sneasel", "sneaselhisui", "teddiursa", "slugma", "swinub", "piloswine", "corsola", "corsolagalar",
    "remoraid", "houndour", "phanpy", "stantler", "tyrogue", "smoochum", "elekid", "magby",
    "larvitar", "pupitar",
    // Gen 3
    "treecko", "grovyle", "torchic", "combusken", "mudkip", "marshtomp", "poochyena", "zigzagoon", "zigzagoongalar",
    "wurmple", "silcoon", "cascoon", "lotad", "lombre", "seedot", "nuzleaf", "taillow", "wingull",
    "ralts", "kirlia", "surskit", "shroomish", "slakoth", "vigoroth", "nincada", "whismur", "loudred",
    "makuhita", "azurill", "nosepass", "skitty", "sableye", "mawile", "aron", "lairon", "meditite",
    "electrike", "gulpin", "carvanha", "wailmer", "numel", "spoink", "trapinch", "vibrava",
    "cacnea", "swablu", "barboach", "corphish", "baltoy", "lileep", "anorith", "feebas", "shuppet",
    "duskull", "dusclops", "chimecho", "snorunt", "spheal", "sealeo", "clamperl", "bagon", "shelgon",
    "beldum", "metang",
    // Gen 4
    "turtwig", "grotle", "chimchar", "monferno", "piplup", "prinplup", "starly", "staravia", "bidoof",
    "kricketot", "shinx", "luxio", "budew", "roserade", "cranidos", "shieldon", "burmy", "combee",
    "buizel", "cherubi", "shellos", "drifloon", "buneary", "glameow", "chingling", "stunky", "bronzor",
    "bonsly", "mimejr", "happiny", "gible", "gabite", "munchlax", "riolu", "hippopotas", "skorupi",
    "croagunk", "finneon", "mantyke", "snover",
    // Gen 5
    "snivy", "servine", "tepig", "pignite", "oshawott", "dewott", "patrat", "lillipup", "herdier",
    "purrloin", "pansage", "pansear", "panpour", "munna", "pidove", "tranquill", "blitzle", "roggenrola", "boldore",
    "woobat", "drilbur", "timburr", "gurdurr", "tympole", "palpitoad", "sewaddle", "swadloon",
    "venipede", "whirlipede", "cottonee", "petilil", "basculin", "sandile", "krokorok", "darumaka", "darumakagalar",
    "dwebble", "scraggy", "yamask", "yamaskgalar", "tirtouga", "archen", "trubbish", "zorua", "zoruahisui",
    "minccino", "gothita", "gothorita", "solosis", "duosion", "ducklett", "vanillite", "vanillish",
    "deerling", "karrablast", "foongus", "frillish", "joltik", "ferroseed", "klink", "klang",
    "tynamo", "eelektrik", "elgyem", "litwick", "lampent", "axew", "fraxure", "cubchoo", "shelmet",
    "mienfoo", "golett", "pawniard", "bisharp", "rufflet", "vullaby", "deino", "zweilous", "larvesta",
    "cosmog", "cosmoem", "poipole",
    // Gen 6
    "chespin", "quilladin", "fennekin", "braixen", "froakie", "frogadier", "bunnelby", "fletchling",
    "fletchinder", "scatterbug", "spewpa", "litleo", "flabebe", "floette", "skiddo", "pancham", "espurr",
    "honedge", "doublade", "spritzee", "swirlix", "inkay", "binacle", "skrelp", "clauncher", "helioptile",
    "tyrunt", "amaura", "goomy", "sliggoo", "sliggoohisui", "phantump", "pumpkaboo", "bergmite", "noibat",
    // Gen 7
    "rowlet", "dartrix", "litten", "torracat", "popplio", "brionne", "pikipek", "trumbeak", "yungoos",
    "grubbin", "charjabug", "crabrawler", "cutiefly", "rockruff", "wimpod", "sandygast", "stufful",
    "bounsweet", "steenee", "jangmoo", "hakamoo", "meltan",
    // Gen 8
    "grookey", "thwackey", "scorbunny", "raboot", "sobble", "drizzile", "skwovet", "rookidee", "corvisquire",
    "blipbug", "dottler", "nickit", "gossifleur", "wooloo", "chewtle", "yamper", "rolycoly", "carkol",
    "applin", "silicobra", "arrokuda", "toxel", "sizzlipede", "clobbopus", "sinistea", "hatenna", "hattrem",
    "impidimp", "morgrem", "milcery", "cufant", "dreepy", "drakloak", "kubfu",
    // Gen 9
    "sprigatito", "floragato", "fuecoco", "crocalor", "quaxly", "quaxwell", "lechonk", "tarountula",
    "nymble", "pawmi", "pawmo", "tandemaus", "fidough", "smoliv", "dolliv", "nacli", "naclstack",
    "charcadet", "tadbulb", "wattrel", "maschiff", "shroodle", "bramblin", "toedscool", "capsakid",
    "rellor", "flittle", "tinkatink", "tinkatuff", "wiglett", "finizen", "varoom", "glimmet",
    "greavard", "cetoddle", "frigibax", "arctibax", "gimmighoul", "dipplin", "poltchageist"
]);

// 2. Leggendari, Mitici e Paradosso
const setLeggendari = new Set([
    "articuno", "articunogalar", "zapdos", "zapdosgalar", "moltres", "moltresgalar", "mewtwo", "mew",
    "raikou", "entei", "suicune", "lugia", "hooh", "celebi", "regirock", "regice", "registeel",
    "latias", "latios", "kyogre", "groudon", "rayquaza", "jirachi", "deoxys", "deoxysattack", "deoxysdefense", "deoxysspeed",
    "uxie", "mesprit", "azelf", "dialga", "dialgaorigin", "palkia", "palkiaorigin", "heatran",
    "regigigas", "giratina", "giratinaorigin", "cresselia", "phione", "manaphy", "darkrai", "shaymin",
    "shayminsky", "arceus", "victini", "cobalion", "terrakion", "virizion", "tornadus", "tornadustherian",
    "thundurus", "thundurustherian", "reshiram", "zekrom", "landorus", "landorustherian", "kyurem",
    "kyuremblack", "kyuremwhite", "keldeo", "keldeoresolute", "meloetta", "meloettapirouette", "genesect",
    "xerneas", "yveltal", "zygarde", "zygarde10", "zygardecomplete", "diancie", "hoopa", "hoopaunbound", "volcanion",
    "null", "typenull", "silvally", "tapukoko", "tapulele", "tapubulu", "tapufini", "cosmog", "cosmoem",
    "solgaleo", "lunala", "nihilego", "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana",
    "guzzlord", "necrozma", "necrozmaduskmane", "necrozmadawnwings", "necrozmaultra", "magearna",
    "marshadow", "poipole", "naganadel", "stakataka", "blacephalon", "zeraora", "meltan", "melmetal",
    "zacian", "zamazenta", "eternatus", "kubfu", "urshifu", "urshifurapidstrike", "zarude", "regieleki",
    "regidrago", "glastrier", "spectrier", "calyrex", "calyrexice", "calyrexshadow", "enamorus", "enamorustherian",
    "greattusk", "screamtail", "brutebonnet", "fluttermane", "slitherwing", "sandyshocks", "irontreads",
    "ironbundle", "ironhands", "ironjugulis", "ironmoth", "ironthorns", "wochien", "chienpao", "tinglu",
    "chiyu", "roaringmoon", "ironvaliant", "koraidon", "miraidon", "walkingwake", "ironleaves", "okidogi",
    "munkidori", "fezandipiti", "ogerpon", "gougingfire", "ragingbolt", "ironboulder", "ironcrown",
    "terapagos", "terapagosterastal", "terapagosstellar", "pecharunt"
]);

// 3. Fanmade, CAP Smogon e Pokestar Studios
const setFanmade = new Set([
    "missingno", "ababo", "argalis", "arghonaut", "astrolotl", "aurumoth", "breezi", "caimanoe",
    "caribolt", "cawdet", "cawmodore", "chromera", "chuggalong", "chuggon", "colossoil", "coribalis",
    "cresceidon", "crucibelle", "cupra", "cyclohm", "dorsoil", "draggalong", "electrelk", "embirch",
    "equilibra", "fawnifer", "fidgit", "floatoy", "flox", "flarelm", "hemogoblin", "jumbao", "justyke",
    "kerfluffle", "kitsunoh", "krilowatt", "malaconda", "miasmaw", "miasmite", "mollux", "monohm",
    "mumbao", "naviathan", "necturna", "necturine", "nohface", "obliteryx", "pajantom", "plasmanta",
    "pluffle", "privatyke", "protowatt", "pyroak", "ramnarok", "rebble", "revenankh", "saharascal",
    "saharaja", "scratchet", "scattervein", "shox", "smogecko", "smoguana", "smokomodo", "snaelstrom",
    "snugglow", "solotl", "stratagem", "swirlpool", "syclant", "syclar", "tactite", "tomohawk",
    "venomicon", "venomiconepilogue", "volkraken", "volkritter", "voodoll", "voodoom",
    "pokestarbrycenman", "pokestarf00", "pokestarf002", "pokestargiant", "pokestarhumanoid",
    "pokestarmonster", "pokestarmt", "pokestarmt2", "pokestaruf0", "pokestaruf02", "pokestarufopropu2",
    "pokestarblackbelt", "pokestarblackdoor", "pokestarsmeargle", "pokestarspirit", "pokestartransport",
    "pokestarwhitedoor"
]);

const btnEstraiPkm = document.getElementById('btn-estrai-pkm');
const btnEstraiMossa = document.getElementById('btn-estrai-mossa');
const btnCopiaClipboard = document.getElementById('btn-copia-clipboard');
const filtroStelle = document.getElementById('filtro-stelle');

const pkmCard = document.getElementById('pkm-card');
const pkmNome = document.getElementById('pkm-nome');
const pkmTotaleMosse = document.getElementById('pkm-totale-mosse');

const mossaDettaglioCard = document.getElementById('mossa-dettaglio');
const listaMosseElem = document.getElementById('lista-mosse-imparabili');
const badgeCount = document.getElementById('badge-count');

// Elementi Dettaglio Mossa
const mtNome = document.getElementById('mt-nome');
const mtStelle = document.getElementById('mt-stelle');
const mtTipo = document.getElementById('mt-tipo');
const mtCategoria = document.getElementById('mt-categoria');
const mtPotenza = document.getElementById('mt-potenza');
const mtPP = document.getElementById('mt-pp');
const mtBersaglio = document.getElementById('mt-bersaglio');
const mtCondizioni = document.getElementById('mt-condizioni');
const mtEffetti = document.getElementById('mt-effetti');

// Carica il CSV delle mosse
Papa.parse(datiCSV, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        listaMosse = results.data.filter(riga => riga['[Name]'] && riga['[Name]'] !== '[Name]');
    }
});

function pulisciNomePuro(nome) {
    return nome ? nome.toString().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

// Estrazione del Pokémon
btnEstraiPkm.addEventListener('click', () => {
    if (typeof datiLearnsetsObj === 'undefined') {
        alert("Errore: Impossibile trovare il file learnsets_data.js!");
        return;
    }

    const chiaviPokemon = Object.keys(datiLearnsetsObj).filter(pkm => {
        const pkmPuro = pulisciNomePuro(pkm);
        return !setNonEvoluti.has(pkmPuro) &&
        !setLeggendari.has(pkmPuro) &&
        !setFanmade.has(pkmPuro) &&
        !pkmPuro.startsWith("arceus") &&
        !pkmPuro.startsWith("silvally") &&
        !pkmPuro.startsWith("pokestar");
    });

    if (chiaviPokemon.length === 0) {
        alert("Nessun Pokémon trovato con i filtri applicati!");
        return;
    }

    const nomePkmCasuale = chiaviPokemon[Math.floor(Math.random() * chiaviPokemon.length)];
    const pokemonDati = datiLearnsetsObj[nomePkmCasuale];
    const learnsetObj = (pokemonDati && pokemonDati.learnset) ? pokemonDati.learnset : {};
    const mosseDelPkm = Object.keys(learnsetObj);

    const nomeFormattato = nomePkmCasuale.charAt(0).toUpperCase() + nomePkmCasuale.slice(1);
    pkmNome.textContent = nomeFormattato;
    pkmCard.classList.remove('hidden');
    mossaDettaglioCard.classList.add('hidden');
    mossaSelezionata = null;

    attualiMossePokemon = [];
    mosseDelPkm.forEach(nomeMossaLearnset => {
        const nomeNormalizzato = pulisciNomePuro(nomeMossaLearnset);
        const mossaTrovata = listaMosse.find(m => pulisciNomePuro(m['[Name]']) === nomeNormalizzato);

        if (mossaTrovata) {
            attualiMossePokemon.push(mossaTrovata);
        }
    });

    applicaFiltroEPopola();
});

// Evento cambio filtro stelle
filtroStelle.addEventListener('change', () => {
    applicaFiltroEPopola();
});

// Evento estrazione singola mossa tra quelle attualmente filtrate
btnEstraiMossa.addEventListener('click', () => {
    if (mosseAttualmenteVisibili.length === 0) {
        alert("Nessuna mossa disponibile da estrarre!");
        return;
    }

    const indiceCasuale = Math.floor(Math.random() * mosseAttualmenteVisibili.length);
    const mossaEstratta = mosseAttualmenteVisibili[indiceCasuale];

    mossaSelezionata = mossaEstratta;
    popolaListaMosse(mosseAttualmenteVisibili);
    mostraDettagliMossa(mossaEstratta);
});

// Evento Copia negli Appunti (Clipboard)
btnCopiaClipboard.addEventListener('click', () => {
    if (!mossaSelezionata) return;

    const testoDaCopiare =
    `Pokémon: ${pkmNome.textContent}
    Mossa: ${mossaSelezionata['[Name]']} (${mossaSelezionata['[LEVEL]'] || '★'})
    Tipo: ${mossaSelezionata['[Type]'] || '-'} | Categoria: ${mossaSelezionata['[Category]'] || '-'}
    Potenza: ${mossaSelezionata['[Power]'] || '-'} | PP: ${mossaSelezionata['[PP]'] || '-'} | Bersaglio: ${mossaSelezionata['[Targets]'] || '-'}
    Condizioni: ${mossaSelezionata['Conditions'] || 'Nessuna'}
    Altri Effetti: ${mossaSelezionata['Other Effects'] || 'Nessuno'}`;

    navigator.clipboard.writeText(testoDaCopiare).then(() => {
        const testoOriginale = btnCopiaClipboard.innerHTML;
        btnCopiaClipboard.innerHTML = '<span>Copiato!</span> ✅';
        setTimeout(() => {
            btnCopiaClipboard.innerHTML = testoOriginale;
        }, 2000);
    }).catch(err => {
        alert("Errore nella copia negli appunti: " + err);
    });
});

function applicaFiltroEPopola() {
    const livelloSelezionato = filtroStelle.value;

    mosseAttualmenteVisibili = attualiMossePokemon;
    if (livelloSelezionato !== 'tutte') {
        mosseAttualmenteVisibili = attualiMossePokemon.filter(m => (m['[LEVEL]'] || '★') === livelloSelezionato);
    }

    pkmTotaleMosse.textContent = `${mosseAttualmenteVisibili.length} mosse`;
    badgeCount.textContent = `(${mosseAttualmenteVisibili.length})`;

    btnEstraiMossa.disabled = mosseAttualmenteVisibili.length === 0;

    popolaListaMosse(mosseAttualmenteVisibili);
}

function popolaListaMosse(mosse) {
    listaMosseElem.innerHTML = '';

    if (mosse.length === 0) {
        listaMosseElem.innerHTML = '<li style="color: #64748b; font-style: italic; text-align: center; padding: 10px 0;">Nessuna mossa trovata</li>';
        return;
    }

    mosse.forEach(mossa => {
        const li = document.createElement('li');
        const eAttiva = mossaSelezionata === mossa;
        li.className = `move-item ${eAttiva ? 'active' : ''}`;

        li.innerHTML = `
        <span>${mossa['[Name]']}</span>
        <span class="badge-star">${mossa['[LEVEL]'] || '★'}</span>
        `;

        li.addEventListener('click', () => {
            mossaSelezionata = mossa;
            document.querySelectorAll('.move-item').forEach(el => el.classList.remove('active'));
            li.classList.add('active');

            mostraDettagliMossa(mossa);
        });

        listaMosseElem.appendChild(li);
    });
}

function mostraDettagliMossa(mossa) {
    const stelle = mossa['[LEVEL]'] || '★';

    mtNome.textContent = mossa['[Name]'] || 'Senza Nome';
    mtStelle.textContent = stelle;
    mtTipo.textContent = mossa['[Type]'] || '-';
    mtCategoria.textContent = mossa['[Category]'] || '-';
    mtPotenza.textContent = mossa['[Power]'] || '-';
    mtPP.textContent = mossa['[PP]'] || '-';
    mtBersaglio.textContent = mossa['[Targets]'] || '-';
    mtCondizioni.textContent = mossa['Conditions'] || 'Nessuna';
    mtEffetti.value = mossa['Other Effects'] || 'Nessuno';

    mossaDettaglioCard.classList.remove('hidden');
}
