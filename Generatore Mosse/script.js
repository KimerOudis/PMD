let listaMosse = [];
const cronologia = [];
let mossaSelezionata = null;

const btn = document.getElementById('btn-estrai');
const btnCopiaClipboard = document.getElementById('btn-copia-clipboard');
const filtroStelle = document.getElementById('filtro-stelle');
const listaCronologiaElem = document.getElementById('lista-cronologia');

const risDiv = document.getElementById('risultato');
const mtNome = document.getElementById('mt-nome');
const mtStelle = document.getElementById('mt-stelle');
const mtTipo = document.getElementById('mt-tipo');
const mtCategoria = document.getElementById('mt-categoria');
const mtPotenza = document.getElementById('mt-potenza');
const mtPP = document.getElementById('mt-pp');
const mtBersaglio = document.getElementById('mt-bersaglio');
const mtPrezzo = document.getElementById('mt-prezzo');
const mtCondizioni = document.getElementById('mt-condizioni');
const mtEffetti = document.getElementById('mt-effetti');

// Carica i dati da mosse_data.js
Papa.parse(datiCSV, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        listaMosse = results.data.filter(riga => riga['[Name]'] && riga['[Name]'] !== '[Name]');
    }
});

// Funzione per calcolare il prezzo basato sul numero di stelle (500 * stelle)
function calcolaPrezzo(stelleStr) {
    if (!stelleStr) return "0 ₽";
    const numeroStelle = (stelleStr.match(/★/g) || []).length;
    const prezzo = (numeroStelle > 0 ? numeroStelle : 1) * 500;
    return `${prezzo.toLocaleString('it-IT')} ₽`;
}

function mostraDettagliMossa(mossa) {
    mossaSelezionata = mossa;

    const stelle = mossa['[LEVEL]'] || '★';

    mtNome.textContent = mossa['[Name]'] || 'Senza Nome';
    mtStelle.textContent = stelle;
    mtTipo.textContent = mossa['[Type]'] || '-';
    mtCategoria.textContent = mossa['[Category]'] || '-';
    mtPotenza.textContent = mossa['[Power]'] || '-';
    mtPP.textContent = mossa['[PP]'] || '-';
    mtBersaglio.textContent = mossa['[Targets]'] || '-';
    mtPrezzo.textContent = calcolaPrezzo(stelle);
    mtCondizioni.textContent = mossa['Conditions'] || 'Nessuna';
    mtEffetti.value = mossa['Other Effects'] || 'Nessuno';

    risDiv.classList.remove('hidden');
    aggiornaCronologia();
}

btn.addEventListener('click', () => {
    const livelloSelezionato = filtroStelle.value;

    let poolMosse = listaMosse;
    if (livelloSelezionato !== 'tutte') {
        poolMosse = listaMosse.filter(mossa => mossa['[LEVEL]'] === livelloSelezionato);
    }

    if (poolMosse.length === 0) {
        alert("Nessuna mossa trovata per questo livello!");
        return;
    }

    const indiceCasuale = Math.floor(Math.random() * poolMosse.length);
    const mossa = poolMosse[indiceCasuale];

    cronologia.unshift(mossa);
    mostraDettagliMossa(mossa);
});

// Evento per copiare le informazioni della mossa estratta negli appunti
btnCopiaClipboard.addEventListener('click', () => {
    if (!mossaSelezionata) return;

    const stelle = mossaSelezionata['[LEVEL]'] || '★';
    const prezzo = calcolaPrezzo(stelle);

    const testoDaCopiare =
    `MT: ${mossaSelezionata['[Name]']} (${stelle})
    Tipo: ${mossaSelezionata['[Type]'] || '-'} | Categoria: ${mossaSelezionata['[Category]'] || '-'}
    Potenza: ${mossaSelezionata['[Power]'] || '-'} | PP: ${mossaSelezionata['[PP]'] || '-'} | Bersaglio: ${mossaSelezionata['[Targets]'] || '-'}
    Prezzo: ${prezzo}
    Condizioni: ${mossaSelezionata['Conditions'] || 'Nessuna'}
    Altri Effetti: ${mossaSelezionata['Other Effects'] || 'Nessuno'}`;

    navigator.clipboard.writeText(testoDaCopiare).then(() => {
        const testoOriginale = btnCopiaClipboard.innerHTML;
        btnCopiaClipboard.innerHTML = '<span>Copiato!</span> ✅';
        setTimeout(() => {
            btnCopiaClipboard.innerHTML = testoOriginale;
        }, 2000);
    }).catch(err => {
        alert("Errore durante la copia negli appunti: " + err);
    });
});

function aggiornaCronologia() {
    listaCronologiaElem.innerHTML = '';

    cronologia.forEach(mossa => {
        const li = document.createElement('li');
        const eAttiva = mossaSelezionata === mossa;
        li.className = `history-item ${eAttiva ? 'active' : ''}`;

        li.innerHTML = `
        <span>${mossa['[Name]']}</span>
        <span class="badge-star">${mossa['[LEVEL]']}</span>
        `;

        li.addEventListener('click', () => {
            mostraDettagliMossa(mossa);
        });

        listaCronologiaElem.appendChild(li);
    });
}
