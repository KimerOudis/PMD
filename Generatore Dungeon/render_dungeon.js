export const TILE_SIZE = 24; // Dimensione nativa PMD Explorers (24x24 px)
export const MAP_WIDTH = 56;  // Larghezza fissa griglia generatore
export const MAP_HEIGHT = 32; // Altezza fissa griglia generatore

// Tabella di corrispondenza delle coordinate [colonna, riga] sullo spritesheet (24x24 a tessera)
const SPRITE_COORDS = {
    // Pavimento calpestabile standard
    floor: { col: 1, row: 0 },

    // Terreno secondario (acqua/lava/ghiaccio)
    water: { col: 2, row: 4 },

    // Muri calcolati tramite la maschera a 4 vicini (valori 0 - 15)
    // Maschera: Nord (1) | Est (2) | Sud (4) | Ovest (8)
    wall: {
        0:  { col: 0, row: 0 }, // Muro isolato / sfondo vuoto
        1:  { col: 2, row: 2 }, // Connesso solo a Nord
        2:  { col: 1, row: 1 }, // Connesso solo a Est
        3:  { col: 0, row: 2 }, // Angolo Nord-Est
        4:  { col: 2, row: 0 }, // Connesso solo a Sud
        5:  { col: 2, row: 1 }, // Corridoio verticale (Nord-Sud)
        6:  { col: 0, row: 1 }, // Angolo Sud-Est
        7:  { col: 0, row: 2 }, // Giunzione T
        8:  { col: 3, row: 1 }, // Connesso solo a Ovest
        9:  { col: 4, row: 2 }, // Angolo Nord-Ovest
        10: { col: 2, row: 1 }, // Corridoio orizzontale (Est-Ovest)
        11: { col: 1, row: 2 }, // Giunzione T
        12: { col: 4, row: 1 }, // Angolo Sud-Ovest
        13: { col: 3, row: 2 }, // Giunzione T
        14: { col: 2, row: 0 }, // Giunzione T
        15: { col: 0, row: 0 }  // Muro pieno circondato / bordo esterno
    }
};

// Cache interna per non ricaricare la stessa immagine più volte
const imageCache = new Map();

export function caricaTileset(path) {
    if (imageCache.has(path)) {
        return Promise.resolve(imageCache.get(path));
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            imageCache.set(path, img);
            resolve(img);
        };
        img.onerror = () => reject(new Error(`Impossibile caricare il tileset: ${path}`));
    });
}

function calcolaMascheraMuro(map, x, y) {
    let mask = 0;

    const isWall = (tx, ty) => {
        if (tx < 0 || ty < 0 || tx >= MAP_WIDTH || ty >= MAP_HEIGHT) return true;
        return map[tx][ty].terrain_flags.terrain_type === 0; // 0 = TERRAIN_WALL
    };

    if (isWall(x, y - 1)) mask |= 1; // Nord (valore 1)
    if (isWall(x + 1, y)) mask |= 2; // Est (valore 2)
    if (isWall(x, y + 1)) mask |= 4; // Sud (valore 4)
    if (isWall(x - 1, y)) mask |= 8; // Ovest (valore 8)

    return mask;
}

export function drawDungeonOnCanvas(canvas, mapTiles, tilesetImg) {
    const ctx = canvas.getContext('2d');
    canvas.width = MAP_WIDTH * TILE_SIZE;
    canvas.height = MAP_HEIGHT * TILE_SIZE;
    ctx.imageSmoothingEnabled = false; // Mantiene la pixel art nitida

    for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const tile = mapTiles[x][y];
            const terrain = tile.terrain_flags.terrain_type;
            let coord;

            if (terrain === 1) {
                // TERRAIN_NORMAL (Pavimento)
                coord = SPRITE_COORDS.floor;
            } else if (terrain === 2) {
                // TERRAIN_SECONDARY (Acqua / Lava / Ghiaccio)
                coord = SPRITE_COORDS.water;
            } else {
                // TERRAIN_WALL (Muro)
                const mask = calcolaMascheraMuro(mapTiles, x, y);
                coord = SPRITE_COORDS.wall[mask] || SPRITE_COORDS.wall[15];
            }

            // Taglio della cella 24x24 px dallo spritesheet e disegno sul canvas
            ctx.drawImage(
                tilesetImg,
                coord.col * TILE_SIZE,
                coord.row * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE,
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );

            // Marker visivi sovrapposti per elementi interattivi
            if (tile.spawn_or_visibility_flags.f_stairs) {
                ctx.fillStyle = '#facc15';
                ctx.fillRect(x * TILE_SIZE + 6, y * TILE_SIZE + 6, 12, 12);
            } else if (tile.spawn_or_visibility_flags.f_item) {
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + 12, y * TILE_SIZE + 12, 5, 0, Math.PI * 2);
                ctx.fill();
            } else if (tile.spawn_or_visibility_flags.f_monster) {
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + 12, y * TILE_SIZE + 12, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
