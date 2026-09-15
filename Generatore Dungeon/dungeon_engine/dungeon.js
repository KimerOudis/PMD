import * as Constants from './constants.js';
import {
    FloorLayout,
    TerrainType,
    DungeonObjectiveType,
    MissionType,
    MissionSubtypeOutlaw,
    FloorSize,
    FloorType,
    DirectionId,
    CardinalDirection,
    SecondaryStructureType,
    HiddenStairsType,
    GenerationStepLevel,
    MajorGenerationType,
    MinorGenerationType,
} from './enums.js';
import { GridCell, Tile, FloorProperties, FloorGenerationStatus, Dungeon, DungeonGenerationInfo } from './key_types.js';
import { RoomFlags, StairsReachableFlags } from './minor_types.js';
import { DungeonRandom } from './random.js';
import { GenerationConstants, AdvancedGenerationSettings } from './settings.js';

const FLOOR_MAX_X = 56;
const FLOOR_MAX_Y = 32;
const DEFAULT_MAX_POSITION = 9999;
const DEFAULT_TILE = new Tile();

let dungeonData;
let dungeonGenerationInfo;
let statusData;
let dungeonRand;
let generationConstants;
let advancedGenerationSettings;
let grid_cell_start_x = [];
let grid_cell_start_y = [];

let dungeonGenerationCallback;
let generationCallbackFrequency;

function PosIsOutOfBounds(x, y) {
    return x < 0 || x >= FLOOR_MAX_X || y < 0 || y >= FLOOR_MAX_Y;
}

function ResetFloor() {
    dungeonData.list_tiles = new Array(FLOOR_MAX_X);

    for (let x = 0; x < FLOOR_MAX_X; x++) {
        dungeonData.list_tiles[x] = new Array(FLOOR_MAX_Y);

        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            dungeonData.list_tiles[x][y] = new Tile();

            if (
                PosIsOutOfBounds(x - 1, y) ||
                PosIsOutOfBounds(x, y - 1) ||
                PosIsOutOfBounds(x + 1, y) ||
                PosIsOutOfBounds(x, y + 1) ||
                PosIsOutOfBounds(x - 1, y - 1) ||
                PosIsOutOfBounds(x - 1, y + 1) ||
                PosIsOutOfBounds(x + 1, y - 1) ||
                PosIsOutOfBounds(x + 1, y + 1)
            ) {
                dungeonData.list_tiles[x][y].terrain_flags.f_impassable_wall = true;
            }
        }
    }

    dungeonGenerationInfo.stairs_spawn_x = -1;
    dungeonGenerationInfo.stairs_spawn_y = -1;

    dungeonData.fixed_room_tiles = new Array(8);

    for (let x = 0; x < 8; x++) {
        dungeonData.fixed_room_tiles[x] = new Array(8);

        for (let y = 0; y < 8; y++) {
            dungeonData.fixed_room_tiles[x][y] = new Tile();
        }
    }

    dungeonData.num_items = 0;
    dungeonData.active_traps = Array(64);

    grid_cell_start_x = [];
    grid_cell_start_y = [];
    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_RESET_FLOOR);
}

function GetGridPositions(grid_size_x, grid_size_y) {
    let sum_x = 0, sum_y = 0;
    let list_x = [], list_y = [];

    for (let x = 0; x <= grid_size_x; x++) {
        list_x.push(sum_x);
        sum_x += Math.floor(FLOOR_MAX_X / grid_size_x);
    }

    for (let y = 0; y <= grid_size_y; y++) {
        list_y.push(sum_y);
        sum_y += Math.floor(FLOOR_MAX_Y / grid_size_y);
    }

    return { list_x, list_y };
}

function InitDungeonGrid(grid_size_x, grid_size_y) {
    let grid = Array(15);

    for (let x = 0; x < 15; x++) {
        grid[x] = Array(15);

        for (let y = 0; y < 15; y++) {
            grid[x][y] = new GridCell();
        }
    }

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            if (statusData.floor_size === FloorSize.FLOOR_SIZE_SMALL && x >= Math.floor(grid_size_x / 2)) {
                grid[x][y].is_invalid = true;
            } else if (statusData.floor_size === FloorSize.FLOOR_SIZE_MEDIUM && x >= Math.floor((3 * grid_size_x) / 4)) {
                grid[x][y].is_invalid = true;
            } else {
                grid[x][y].is_invalid = false;
            }

            grid[x][y].is_room = true;
        }
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_INIT_DUNGEON_GRID);

    return grid;
}

function AssignRooms(grid, grid_size_x, grid_size_y, number_of_rooms) {
    let extraRooms = dungeonRand.RandInt(3);

    if (number_of_rooms < 0) {
        number_of_rooms = -number_of_rooms;
    } else {
        number_of_rooms += extraRooms;
    }

    let random_room_bits = Array(256);

    for (let i = 0; i < number_of_rooms; i++) {
        random_room_bits[i] = true;
    }

    const max_rooms = grid_size_x * grid_size_y;

    for (let x = 0; x < 64; x++) {
        let a = dungeonRand.RandInt(max_rooms);
        let b = dungeonRand.RandInt(max_rooms);

        let temp = random_room_bits[a];
        random_room_bits[a] = random_room_bits[b];
        random_room_bits[b] = temp;
    }

    statusData.num_rooms = 0;

    let odd_x = grid_size_x % 2;
    let counter = 0;

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            if (grid[x][y].is_invalid) continue;

            if (statusData.num_rooms >= 32) {
                grid[x][y].is_room = false;
            }

            if (random_room_bits[counter]) {
                grid[x][y].is_room = true;
                statusData.num_rooms++;

                if (odd_x !== 0 && y === 1 && x === Math.floor((grid_size_x - 1) / 2)) {
                    grid[x][y].is_room = false;
                }
            } else {
                grid[x][y].is_room = false;
            }

            counter++;
        }
    }

    if (statusData.num_rooms >= 2) return;

    let attempts = 0;
    let enoughRooms = false;

    while (attempts < 200 && !enoughRooms) {
        for (let x = 0; x < grid_size_x; x++) {
            for (let y = 0; y < grid_size_y; y++) {
                if (grid[x][y].is_invalid) continue;

                if (dungeonRand.RandInt(100) < 60) {
                    grid[x][y].is_room = true;
                    enoughRooms = true;
                    break;
                }
            }

            if (enoughRooms) break;
        }

        attempts++;
    }

    statusData.second_spawn = false;
}

function CreateRoomsAndAnchors(grid, grid_size_x, grid_size_y, list_x, list_y, room_flags) {
    let room_number = 0;

    for (let y = 0; y < grid_size_y; y++) {
        const cur_val_y = list_y[y];
        const next_val_y = list_y[y + 1];

        for (let x = 0; x < grid_size_x; x++) {
            const cur_val_x = list_x[x];
            const next_val_x = list_x[x + 1];
            const range_x = next_val_x - cur_val_x - 4;
            const range_y = next_val_y - cur_val_y - 3;

            if (grid[x][y].is_invalid) continue;

            if (!grid[x][y].is_room) {
                let unk_x1 = 2;
                let unk_x2 = 4;

                if (x === 0) unk_x1 = 1;
                if (x === grid_size_x - 1) unk_x2 = 2;

                let unk_y1 = 2;
                let unk_y2 = 4;

                if (y === 0) unk_y1 = 1;
                if (y === grid_size_y - 1) unk_y2 = 2;

                const pt_x = dungeonRand.RandRange(cur_val_x + 2 + unk_x1, cur_val_x + 2 + range_x - unk_x2);
                const pt_y = dungeonRand.RandRange(cur_val_y + 2 + unk_y1, cur_val_y + 2 + range_y - unk_y2);

                grid[x][y].start_x = pt_x;
                grid[x][y].start_y = pt_y;
                grid[x][y].end_x = pt_x + 1;
                grid[x][y].end_y = pt_y + 1;

                dungeonData.list_tiles[pt_x][pt_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                dungeonData.list_tiles[pt_x][pt_y].room_index = 0xfe;

                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_ANCHOR);
            } else {
                let room_size_x = dungeonRand.RandRange(5, range_x);
                let room_size_y = dungeonRand.RandRange(4, range_y);

                if ((room_size_x | 1) < range_x) room_size_x |= 1;
                if ((room_size_y | 1) < range_y) room_size_y |= 1;

                if (room_size_x > Math.floor((room_size_y * 3) / 2)) {
                    room_size_x = Math.floor((room_size_y * 3) / 2);
                }

                if (room_size_y > Math.floor((room_size_x * 3) / 2)) {
                    room_size_y = Math.floor((room_size_x * 3) / 2);
                }

                const start_x = dungeonRand.RandInt(range_x - room_size_x) + cur_val_x + 2;
                const end_x = start_x + room_size_x;

                const start_y = dungeonRand.RandInt(range_y - room_size_y) + cur_val_y + 2;
                const end_y = start_y + room_size_y;

                grid[x][y].start_x = start_x;
                grid[x][y].start_y = start_y;
                grid[x][y].end_x = end_x;
                grid[x][y].end_y = end_y;

                for (let room_x = start_x; room_x < end_x; room_x++) {
                    for (let room_y = start_y; room_y < end_y; room_y++) {
                        dungeonData.list_tiles[room_x][room_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                        dungeonData.list_tiles[room_x][room_y].room_index = room_number;
                    }
                }

                let flag_secondary = dungeonRand.RandInt(100) < generationConstants.secondary_structure_flag_chance;
                if (statusData.secondary_structures_budget === 0) {
                    flag_secondary = false;
                }

                let flag_imp = room_flags.f_room_imperfections;

                if (flag_secondary && flag_imp) {
                    if (dungeonRand.RandInt(100) < 50) {
                        flag_imp = false;
                    } else {
                        flag_secondary = false;
                    }
                }

                if (flag_imp) grid[x][y].flag_imperfect = true;
                if (flag_secondary) grid[x][y].flag_secondary_structure = true;

                room_number++;
                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_ROOM);
            }
        }
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_CREATE_ROOMS_AND_ANCHORS);
}

function AssignGridCellConnections(grid, grid_size_x, grid_size_y, cursor_x, cursor_y, floor_props) {
    let direction = dungeonRand.RandInt(4);

    for (let i = 0; i < floor_props.floor_connectivity; i++) {
        const test = dungeonRand.RandInt(8);
        let new_direction = dungeonRand.RandInt(4);

        if (test < 4) direction = new_direction;

        let ok = false;
        while (!ok) {
            switch (direction) {
                case CardinalDirection.DIR_RIGHT:
                    ok = cursor_x < grid_size_x - 1;
                    break;
                case CardinalDirection.DIR_UP:
                    ok = cursor_y > 0;
                    break;
                case CardinalDirection.DIR_LEFT:
                    ok = cursor_x > 0;
                    break;
                case CardinalDirection.DIR_DOWN:
                    ok = cursor_y < grid_size_y - 1;
                    break;
            }

            if (!ok) {
                direction = (direction + 1) % 4;
            }
        }

        if (direction === CardinalDirection.DIR_RIGHT && !grid[cursor_x + 1][cursor_y].is_invalid) {
            grid[cursor_x][cursor_y].connected_to_right = true;
            grid[cursor_x + 1][cursor_y].connected_to_left = true;
            cursor_x++;
        } else if (direction === CardinalDirection.DIR_UP && !grid[cursor_x][cursor_y - 1].is_invalid) {
            grid[cursor_x][cursor_y].connected_to_top = true;
            grid[cursor_x][cursor_y - 1].connected_to_bottom = true;
            cursor_y--;
        } else if (direction === CardinalDirection.DIR_LEFT && !grid[cursor_x - 1][cursor_y].is_invalid) {
            grid[cursor_x][cursor_y].connected_to_left = true;
            grid[cursor_x - 1][cursor_y].connected_to_right = true;
            cursor_x--;
        } else if (direction === CardinalDirection.DIR_DOWN && !grid[cursor_x][cursor_y + 1].is_invalid) {
            grid[cursor_x][cursor_y].connected_to_bottom = true;
            grid[cursor_x][cursor_y + 1].connected_to_top = true;
            cursor_y++;
        }
    }

    if (!floor_props.allow_dead_ends) {
        let more = true;
        while (more) {
            more = false;

            for (let y = 0; y < grid_size_y; y++) {
                for (let x = 0; x < grid_size_x; x++) {
                    if (!grid[x][y].is_invalid && !grid[x][y].is_room) {
                        let count_connect = 0;

                        if (grid[x][y].connected_to_top) count_connect++;
                        if (grid[x][y].connected_to_bottom) count_connect++;
                        if (grid[x][y].connected_to_left) count_connect++;
                        if (grid[x][y].connected_to_right) count_connect++;

                        if (count_connect === 1) {
                            direction = dungeonRand.RandInt(4);
                            let ok = false;

                            for (let i = 0; i < 8; i++) {
                                if (direction === CardinalDirection.DIR_RIGHT && x < grid_size_x - 1 && !grid[x][y].connected_to_right) {
                                    ok = true;
                                } else if (direction === CardinalDirection.DIR_UP && y > 0 && !grid[x][y].connected_to_top) {
                                    ok = true;
                                } else if (direction === CardinalDirection.DIR_LEFT && x > 0 && !grid[x][y].connected_to_left) {
                                    ok = true;
                                } else if (direction === CardinalDirection.DIR_DOWN && y < grid_size_y - 1 && !grid[x][y].connected_to_bottom) {
                                    ok = true;
                                } else {
                                    direction = (direction + 1) % 4;
                                }

                                if (ok) break;
                            }

                            if (!ok) continue;

                            if (advancedGenerationSettings.fix_dead_end_validation_error) {
                                if (direction === CardinalDirection.DIR_RIGHT && !grid[x + 1][y].is_invalid) {
                                    grid[x][y].connected_to_right = true;
                                    grid[x + 1][y].connected_to_left = true;
                                    more = true;
                                    x++;
                                } else if (direction === CardinalDirection.DIR_UP && !grid[x][y - 1].is_invalid) {
                                    grid[x][y].connected_to_top = true;
                                    grid[x][y - 1].connected_to_bottom = true;
                                    more = true;
                                    y--;
                                } else if (direction === CardinalDirection.DIR_LEFT && !grid[x - 1][y].is_invalid) {
                                    grid[x][y].connected_to_left = true;
                                    grid[x - 1][y].connected_to_right = true;
                                    more = true;
                                    x--;
                                } else if (direction === CardinalDirection.DIR_DOWN && !grid[x][y + 1].is_invalid) {
                                    grid[x][y].connected_to_bottom = true;
                                    grid[x][y + 1].connected_to_top = true;
                                    y++;
                                }
                            } else {
                                if (direction === CardinalDirection.DIR_RIGHT && !grid[x + 1][y].is_invalid) {
                                    grid[x][y].connected_to_right = true;
                                    grid[x + 1][y].connected_to_left = true;
                                    more = true;
                                    x++;
                                } else if (direction === CardinalDirection.DIR_UP && !grid[x + 1][y].is_invalid) {
                                    grid[x][y].connected_to_top = true;
                                    grid[x][y - 1].connected_to_bottom = true;
                                    more = true;
                                    y--;
                                } else if (direction === CardinalDirection.DIR_LEFT && !grid[x + 1][y].is_invalid) {
                                    grid[x][y].connected_to_left = true;
                                    grid[x - 1][y].connected_to_right = true;
                                    more = true;
                                    x--;
                                } else if (direction === CardinalDirection.DIR_DOWN && !grid[x + 1][y].is_invalid) {
                                    grid[x][y].connected_to_bottom = true;
                                    grid[x][y + 1].connected_to_top = true;
                                    y++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function CreateHallway(start_x, start_y, end_x, end_y, vertical, turn_x, turn_y) {
    let cur_x = start_x;
    let cur_y = start_y;
    let counter = 0;

    if (!vertical) {
        while (cur_x !== turn_x) {
            if (counter >= 56) return;
            counter++;

            if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                if (start_x !== cur_x) return;
            } else {
                dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
            }

            if (cur_x >= turn_x) cur_x--;
            else cur_x++;
        }

        counter = 0;

        while (cur_y !== end_y) {
            if (counter >= 56) return;
            counter++;

            if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                if (start_x !== cur_x || start_y !== cur_y) return;
            } else {
                dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
            }

            if (cur_y >= end_y) cur_y--;
            else cur_y++;
        }

        counter = 0;

        while (cur_x !== end_x) {
            if (counter >= 56) return;
            counter++;

            if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                if (start_x !== cur_x || start_y !== cur_y) return;
            } else {
                dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
            }

            if (cur_x >= end_x) cur_x--;
            else cur_x++;
        }
    } else {
        while (cur_y !== turn_y) {
            if (counter >= 56) return;
            counter++;

            if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                if (start_y !== cur_y) return;
            } else {
                dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
            }

            if (cur_y >= turn_y) cur_y--;
            else cur_y++;
        }

        counter = 0;

        while (cur_x !== end_x) {
            if (counter >= 56) return;
            counter++;

            if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                if (start_x !== cur_x || start_y !== cur_y) return;
            } else {
                dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
            }

            if (cur_x >= end_x) cur_x--;
            else cur_x++;
        }

        counter = 0;

        while (cur_y !== end_y) {
            if (counter >= 56) return;
            counter++;

            if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                if (start_x !== cur_x || start_y !== cur_y) return;
            } else {
                dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
            }

            if (cur_y >= end_y) cur_y--;
            else cur_y++;
        }
    }
}

function CreateGridCellConnections(grid, grid_size_x, grid_size_y, list_x, list_y, disable_room_merging) {
    for (let y = 0; y < grid_size_y; y++) {
        for (let x = 0; x < grid_size_x; x++) {
            if (!grid[x][y].is_invalid) {
                if (x === 0) grid[x][y].connected_to_left = false;
                if (y === 0) grid[x][y].connected_to_top = false;
                if (x === grid_size_x - 1) grid[x][y].connected_to_right = false;
                if (y === grid_size_y - 1) grid[x][y].connected_to_bottom = false;

                grid[x][y].should_connect_to_top = grid[x][y].connected_to_top;
                grid[x][y].should_connect_to_bottom = grid[x][y].connected_to_bottom;
                grid[x][y].should_connect_to_left = grid[x][y].connected_to_left;
                grid[x][y].should_connect_to_right = grid[x][y].connected_to_right;
            } else {
                grid[x][y].should_connect_to_top = false;
                grid[x][y].should_connect_to_bottom = false;
                grid[x][y].should_connect_to_left = false;
                grid[x][y].should_connect_to_right = false;
            }
        }
    }

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            if (grid[x][y].is_invalid) continue;

            let pt_x, pt_y, pt2_x, pt2_y;

            if (!grid[x][y].is_room) {
                pt_x = grid[x][y].start_x;
                pt_y = grid[x][y].start_y;
            } else {
                pt_x = dungeonRand.RandRange(grid[x][y].start_x + 1, grid[x][y].end_x - 1);
                pt_y = dungeonRand.RandRange(grid[x][y].start_y + 1, grid[x][y].end_y - 1);
            }

            if (grid[x][y].should_connect_to_top) {
                if (!grid[x][y - 1].is_invalid) {
                    if (!grid[x][y - 1].is_room) {
                        pt2_x = grid[x][y - 1].start_x;
                    } else {
                        pt2_x = dungeonRand.RandRange(grid[x][y - 1].start_x + 1, grid[x][y - 1].end_x - 1);
                    }

                    CreateHallway(pt_x, grid[x][y].start_y, pt2_x, grid[x][y - 1].end_y - 1, true, list_x[x], list_y[y]);
                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_HALLWAY);
                }

                grid[x][y].should_connect_to_top = false;
                grid[x][y - 1].should_connect_to_bottom = false;
                grid[x][y].is_connected = true;
                grid[x][y - 1].is_connected = true;
            }

            if (grid[x][y].should_connect_to_bottom) {
                if (!grid[x][y + 1].is_invalid) {
                    if (!grid[x][y + 1].is_room) {
                        pt2_x = grid[x][y + 1].start_x;
                    } else {
                        pt2_x = dungeonRand.RandRange(grid[x][y + 1].start_x + 1, grid[x][y + 1].end_x - 1);
                    }

                    CreateHallway(pt_x, grid[x][y].end_y - 1, pt2_x, grid[x][y + 1].start_y, true, list_x[x], list_y[y + 1] - 1);
                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_HALLWAY);
                }

                grid[x][y].should_connect_to_bottom = false;
                grid[x][y + 1].should_connect_to_top = false;
                grid[x][y].is_connected = true;
                grid[x][y + 1].is_connected = true;
            }

            if (grid[x][y].should_connect_to_left) {
                if (!grid[x - 1][y].is_invalid) {
                    if (!grid[x - 1][y].is_room) {
                        pt2_y = grid[x - 1][y].start_y;
                    } else {
                        pt2_y = dungeonRand.RandRange(grid[x - 1][y].start_y + 1, grid[x - 1][y].end_y - 1);
                    }

                    CreateHallway(grid[x][y].start_x, pt_y, grid[x - 1][y].start_x - 1, pt2_y, false, list_x[x], list_y[y]);
                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_HALLWAY);
                }

                grid[x][y].should_connect_to_left = false;
                grid[x - 1][y].should_connect_to_right = false;
                grid[x][y].is_connected = true;
                grid[x - 1][y].is_connected = true;
            }

            if (grid[x][y].should_connect_to_right) {
                if (!grid[x + 1][y].is_invalid) {
                    if (!grid[x + 1][y].is_room) {
                        pt2_y = grid[x + 1][y].start_y;
                    } else {
                        pt2_y = dungeonRand.RandRange(grid[x + 1][y].start_y + 1, grid[x + 1][y].end_y - 1);
                    }

                    CreateHallway(grid[x][y].end_x - 1, pt_y, grid[x + 1][y].start_x, pt2_y, false, list_x[x + 1] - 1, list_y[y]);
                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_HALLWAY);
                }

                grid[x][y].should_connect_to_right = false;
                grid[x + 1][y].should_connect_to_left = false;
                grid[x][y].is_connected = true;
                grid[x + 1][y].is_connected = true;
            }
        }
    }

    if (disable_room_merging) {
        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_CREATE_GRID_CELL_CONNECTIONS);
        return;
    }

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            let chance = dungeonRand.RandInt(100);
            let src_x, src_y, dst_x, dst_y, merge_room_index;

            if (
                chance < generationConstants.merge_rooms_chance &&
                !grid[x][y].is_invalid &&
                grid[x][y].is_connected &&
                !grid[x][y].is_merged &&
                !grid[x][y].has_secondary_structure &&
                grid[x][y].is_room
            ) {
                let chance_two = dungeonRand.RandInt(4);

                if (
                    chance_two === 0 &&
                    x >= 1 &&
                    !grid[x - 1][y].is_invalid &&
                    grid[x - 1][y].is_connected &&
                    !grid[x - 1][y].is_merged &&
                    !grid[x - 1][y].has_secondary_structure &&
                    grid[x - 1][y].is_room
                ) {
                    src_y = Math.min(grid[x - 1][y].start_y, grid[x][y].start_y);
                    dst_y = Math.max(grid[x - 1][y].end_y, grid[x][y].end_y);
                    src_x = grid[x - 1][y].start_x;
                    dst_x = grid[x][y].end_x;

                    merge_room_index = dungeonData.list_tiles[grid[x][y].start_x][grid[x][y].start_y].room_index;

                    for (let cur_x = src_x; cur_x < dst_x; cur_x++) {
                        for (let cur_y = src_y; cur_y < dst_y; cur_y++) {
                            dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                            dungeonData.list_tiles[cur_x][cur_y].room_index = merge_room_index;
                        }
                    }

                    grid[x - 1][y].start_x = src_x;
                    grid[x - 1][y].start_y = src_y;
                    grid[x - 1][y].end_x = dst_x;
                    grid[x - 1][y].end_y = dst_y;

                    grid[x - 1][y].is_merged = true;
                    grid[x][y].is_merged = true;
                    grid[x][y].is_connected = false;
                    grid[x][y].has_been_merged = true;

                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_MERGE_ROOM);
                } else if (
                    chance_two === 1 &&
                    y >= 1 &&
                    !grid[x][y - 1].is_invalid &&
                    grid[x][y - 1].is_connected &&
                    !grid[x][y - 1].is_merged &&
                    !grid[x][y - 1].has_secondary_structure &&
                    grid[x][y - 1].is_room
                ) {
                    src_x = Math.min(grid[x][y - 1].start_x, grid[x][y].start_x);
                    dst_x = Math.max(grid[x][y - 1].end_x, grid[x][y].end_x);
                    src_y = grid[x][y - 1].start_y;
                    dst_y = grid[x][y].end_y;

                    merge_room_index = dungeonData.list_tiles[grid[x][y].start_x][grid[x][y].start_y].room_index;

                    for (let cur_x = src_x; cur_x < dst_x; cur_x++) {
                        for (let cur_y = src_y; cur_y < dst_y; cur_y++) {
                            dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                            dungeonData.list_tiles[cur_x][cur_y].room_index = merge_room_index;
                        }
                    }

                    grid[x][y - 1].start_x = src_x;
                    grid[x][y - 1].start_y = src_y;
                    grid[x][y - 1].end_x = dst_x;
                    grid[x][y - 1].end_y = dst_y;

                    grid[x][y - 1].is_merged = true;
                    grid[x][y].is_merged = true;
                    grid[x][y].is_connected = false;
                    grid[x][y].has_been_merged = true;

                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_MERGE_ROOM);
                } else if (
                    chance_two === 2 &&
                    x <= grid_size_x - 2 &&
                    !grid[x + 1][y].is_invalid &&
                    grid[x + 1][y].is_connected &&
                    !grid[x + 1][y].is_merged &&
                    !grid[x + 1][y].has_secondary_structure &&
                    grid[x + 1][y].is_room
                ) {
                    src_y = Math.min(grid[x + 1][y].start_y, grid[x][y].start_y);
                    dst_y = Math.max(grid[x + 1][y].end_y, grid[x][y].end_y);
                    src_x = grid[x][y].start_x;
                    dst_x = grid[x + 1][y].end_x;

                    merge_room_index = dungeonData.list_tiles[grid[x][y].start_x][grid[x][y].start_y].room_index;

                    for (let cur_x = src_x; cur_x < dst_x; cur_x++) {
                        for (let cur_y = src_y; cur_y < dst_y; cur_y++) {
                            dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                            dungeonData.list_tiles[cur_x][cur_y].room_index = merge_room_index;
                        }
                    }

                    grid[x + 1][y].start_x = src_x;
                    grid[x + 1][y].start_y = src_y;
                    grid[x + 1][y].end_x = dst_x;
                    grid[x + 1][y].end_y = dst_y;

                    grid[x + 1][y].is_merged = true;
                    grid[x][y].is_merged = true;
                    grid[x][y].is_connected = false;
                    grid[x][y].has_been_merged = true;

                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_MERGE_ROOM);
                } else if (
                    chance_two === 3 &&
                    y <= grid_size_y - 2 &&
                    !grid[x][y + 1].is_invalid &&
                    grid[x][y + 1].is_connected &&
                    !grid[x][y + 1].is_merged &&
                    !grid[x][y + 1].has_secondary_structure &&
                    grid[x][y + 1].is_room
                ) {
                    src_x = Math.min(grid[x][y + 1].start_x, grid[x][y].start_x);
                    dst_x = Math.max(grid[x][y + 1].end_x, grid[x][y].end_x);
                    src_y = grid[x][y].start_y;
                    dst_y = grid[x][y + 1].end_y;

                    merge_room_index = dungeonData.list_tiles[grid[x][y].start_x][grid[x][y].start_y].room_index;

                    for (let cur_x = src_x; cur_x < dst_x; cur_x++) {
                        for (let cur_y = src_y; cur_y < dst_y; cur_y++) {
                            dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                            dungeonData.list_tiles[cur_x][cur_y].room_index = merge_room_index;
                        }
                    }

                    grid[x][y + 1].start_x = src_x;
                    grid[x][y + 1].start_y = src_y;
                    grid[x][y + 1].end_x = dst_x;
                    grid[x][y + 1].end_y = dst_y;

                    grid[x][y + 1].is_merged = true;
                    grid[x][y].is_merged = true;
                    grid[x][y].is_connected = false;
                    grid[x][y].has_been_merged = true;

                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_MERGE_ROOM);
                }
            }
        }
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_CREATE_GRID_CELL_CONNECTIONS);
}

function EnsureConnectedGrid(grid, grid_size_x, grid_size_y, list_x, list_y) {
    let was_grid_changed = false;

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            if (grid[x][y].is_invalid || grid[x][y].is_connected || grid[x][y].has_been_merged) continue;

            let rnd_x, rnd_y, pt_x, pt_y;

            if (grid[x][y].is_room && !grid[x][y].has_secondary_structure) {
                rnd_x = dungeonRand.RandRange(grid[x][y].start_x + 1, grid[x][y].end_x - 1);
                rnd_y = dungeonRand.RandRange(grid[x][y].start_y + 1, grid[x][y].end_y - 1);

                if (y > 0 && !grid[x][y - 1].is_invalid && !grid[x][y - 1].is_merged && grid[x][y - 1].is_connected) {
                    if (!grid[x][y - 1].is_room) {
                        pt_x = grid[x][y - 1].start_x;
                    } else {
                        pt_x = dungeonRand.RandRange(grid[x][y - 1].start_x + 1, grid[x][y - 1].end_x - 1);
                    }

                    CreateHallway(rnd_x, grid[x][y].start_y, pt_x, grid[x][y - 1].end_y - 1, true, list_x[x], list_y[y]);

                    grid[x][y].is_connected = true;
                    grid[x][y].connected_to_top = true;
                    grid[x][y - 1].connected_to_bottom = true;

                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_ENSURE_CONNECTED_HALLWAY);
                    was_grid_changed = true;
                } else if (y < grid_size_y - 1 && !grid[x][y + 1].is_invalid && !grid[x][y + 1].is_merged && grid[x][y + 1].is_connected) {
                    if (!grid[x][y + 1].is_room) {
                        pt_x = grid[x][y + 1].start_x;
                    } else {
                        pt_x = dungeonRand.RandRange(grid[x][y + 1].start_x + 1, grid[x][y + 1].end_x - 1);
                    }

                    CreateHallway(rnd_x, grid[x][y].end_y - 1, pt_x, grid[x][y + 1].start_y, true, list_x[x], list_y[y + 1] - 1);

                    grid[x][y].is_connected = true;
                    grid[x][y].connected_to_bottom = true;
                    grid[x][y + 1].connected_to_top = true;

                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_ENSURE_CONNECTED_HALLWAY);
                    was_grid_changed = true;
                } else if (x > 0 && !grid[x - 1][y].is_invalid && !grid[x - 1][y].is_merged && grid[x - 1][y].is_connected) {
                    if (!grid[x - 1][y].is_room) {
                        pt_y = grid[x - 1][y].start_y;
                    } else {
                        pt_y = dungeonRand.RandRange(grid[x - 1][y].start_y + 1, grid[x - 1][y].end_y - 1);
                    }

                    CreateHallway(grid[x][y].start_x, rnd_y, grid[x - 1][y].start_x - 1, pt_y, false, list_x[x], list_y[y]);

                    grid[x][y].is_connected = true;
                    grid[x][y].connected_to_left = true;
                    grid[x - 1][y].connected_to_right = true;

                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_ENSURE_CONNECTED_HALLWAY);
                    was_grid_changed = true;
                } else if (x < grid_size_x - 1 && !grid[x + 1][y].is_invalid && !grid[x + 1][y].is_merged && grid[x + 1][y].is_connected) {
                    if (!grid[x + 1][y].is_room) {
                        pt_y = grid[x + 1][y].start_y;
                    } else {
                        pt_y = dungeonRand.RandRange(grid[x + 1][y].start_y + 1, grid[x + 1][y].end_y - 1);
                    }

                    CreateHallway(grid[x][y].end_x - 1, rnd_y, grid[x + 1][y].start_x, pt_y, false, list_x[x + 1] - 1, list_y[y]);

                    grid[x][y].is_connected = true;
                    grid[x][y].connected_to_right = true;
                    grid[x + 1][y].connected_to_left = true;

                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_ENSURE_CONNECTED_HALLWAY);
                    was_grid_changed = true;
                }
            } else {
                dungeonData.list_tiles[grid[x][y].start_x][grid[x][y].start_y].terrain_flags.terrain_type = TerrainType.TERRAIN_WALL;
                dungeonData.list_tiles[grid[x][y].start_x][grid[x][y].start_y].spawn_or_visibility_flags.f_stairs = false;
                dungeonData.list_tiles[grid[x][y].start_x][grid[x][y].start_y].spawn_or_visibility_flags.f_item = false;
                dungeonData.list_tiles[grid[x][y].start_x][grid[x][y].start_y].spawn_or_visibility_flags.f_trap = false;

                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_REMOVE_UNCONNECTED_ANCHOR);
                was_grid_changed = true;
            }
        }
    }

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            if (grid[x][y].is_invalid || grid[x][y].has_been_merged || grid[x][y].is_connected || grid[x][y].unk4) continue;

            for (let cur_x = grid[x][y].start_x; cur_x < grid[x][y].end_x; cur_x++) {
                for (let cur_y = grid[x][y].start_y; cur_y < grid[x][y].end_y; cur_y++) {
                    dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_WALL;
                    dungeonData.list_tiles[cur_x][cur_y].spawn_or_visibility_flags.f_stairs = false;
                    dungeonData.list_tiles[cur_x][cur_y].spawn_or_visibility_flags.f_item = false;
                    dungeonData.list_tiles[cur_x][cur_y].spawn_or_visibility_flags.f_trap = false;
                    dungeonData.list_tiles[cur_x][cur_y].room_index = 0xff;

                    if (grid[x][y].is_room) was_grid_changed = true;
                }
            }

            if (grid[x][y].is_room) {
                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_REMOVE_UNCONNECTED_ROOM);
            }
        }
    }

    if (was_grid_changed) {
        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_ENSURE_CONNECTED_GRID);
    }
}

function SetTerrainObstacleChecked(tile, use_secondary_terrain, room_index) {
    if (use_secondary_terrain && tile.room_index === room_index) {
        tile.terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
    } else {
        tile.terrain_flags.terrain_type = TerrainType.TERRAIN_WALL;
    }
}

function GenerateMazeLine(x0, y0, xmin, ymin, xmax, ymax, use_secondary_terrain, room_index) {
    let ok = true;
    while (ok) {
        let direction = dungeonRand.RandInt(4);
        SetTerrainObstacleChecked(dungeonData.list_tiles[x0][y0], use_secondary_terrain, room_index);

        ok = false;
        for (let i = 0; i < 4; i++) {
            let offset_x = 0, offset_y = 0;

            if (direction === CardinalDirection.DIR_RIGHT) {
                offset_x = 2;
                offset_y = 0;
            } else if (direction === CardinalDirection.DIR_UP) {
                offset_x = 0;
                offset_y = -2;
            } else if (direction === CardinalDirection.DIR_LEFT) {
                offset_x = -2;
                offset_y = 0;
            } else if (direction === CardinalDirection.DIR_DOWN) {
                offset_x = 0;
                offset_y = 2;
            }

            const pos_x = x0 + offset_x;
            const pos_y = y0 + offset_y;

            if (pos_x >= xmin && pos_x < xmax && pos_y >= ymin && pos_y < ymax) {
                if (dungeonData.list_tiles[pos_x][pos_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                    ok = true;
                    break;
                }
            }

            direction = (direction + 1) % 4;
        }

        if (ok) {
            if (direction === CardinalDirection.DIR_RIGHT) {
                SetTerrainObstacleChecked(dungeonData.list_tiles[x0 + 1][y0], use_secondary_terrain, room_index);
                x0 += 2;
            } else if (direction === CardinalDirection.DIR_UP) {
                SetTerrainObstacleChecked(dungeonData.list_tiles[x0][y0 - 1], use_secondary_terrain, room_index);
                y0 -= 2;
            } else if (direction === CardinalDirection.DIR_LEFT) {
                SetTerrainObstacleChecked(dungeonData.list_tiles[x0 - 1][y0], use_secondary_terrain, room_index);
                x0 -= 2;
            } else if (direction === CardinalDirection.DIR_DOWN) {
                SetTerrainObstacleChecked(dungeonData.list_tiles[x0][y0 + 1], use_secondary_terrain, room_index);
                y0 += 2;
            }
        }
    }
}

function GenerateMaze(grid_cell, use_secondary_terrain) {
    grid_cell.is_maze_room = true;
    statusData.has_maze = true;

    const room_index = dungeonData.list_tiles[grid_cell.start_x][grid_cell.start_y].room_index;

    for (let cur_x = grid_cell.start_x + 1; cur_x < grid_cell.end_x - 1; cur_x += 2) {
        if (dungeonData.list_tiles[cur_x][grid_cell.start_y - 1].terrain_flags.terrain_type !== TerrainType.TERRAIN_NORMAL) {
            GenerateMazeLine(cur_x, grid_cell.start_y - 1, grid_cell.start_x, grid_cell.start_y, grid_cell.end_x, grid_cell.end_y, use_secondary_terrain, room_index);
        }
    }

    for (let cur_y = grid_cell.start_y + 1; cur_y < grid_cell.end_y - 1; cur_y += 2) {
        if (dungeonData.list_tiles[grid_cell.end_x][cur_y].terrain_flags.terrain_type !== TerrainType.TERRAIN_NORMAL) {
            GenerateMazeLine(grid_cell.end_x, cur_y, grid_cell.start_x, grid_cell.start_y, grid_cell.end_x, grid_cell.end_y, use_secondary_terrain, room_index);
        }
    }

    for (let cur_x = grid_cell.start_x + 1; cur_x < grid_cell.end_x - 1; cur_x += 2) {
        if (dungeonData.list_tiles[cur_x][grid_cell.end_y].terrain_flags.terrain_type !== TerrainType.TERRAIN_NORMAL) {
            GenerateMazeLine(cur_x, grid_cell.end_y, grid_cell.start_x, grid_cell.start_y, grid_cell.end_x, grid_cell.end_y, use_secondary_terrain, room_index);
        }
    }

    for (let cur_y = grid_cell.start_y + 1; cur_y < grid_cell.end_y - 1; cur_y += 2) {
        if (dungeonData.list_tiles[grid_cell.start_x - 1][cur_y].terrain_flags.terrain_type !== TerrainType.TERRAIN_NORMAL) {
            GenerateMazeLine(grid_cell.start_x - 1, cur_y, grid_cell.start_x, grid_cell.start_y, grid_cell.end_x, grid_cell.end_y, use_secondary_terrain, room_index);
        }
    }

    for (let cur_x = grid_cell.start_x + 3; cur_x < grid_cell.end_x - 3; cur_x += 2) {
        for (let cur_y = grid_cell.start_y + 3; cur_y < grid_cell.end_y - 3; cur_y += 2) {
            if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                if (use_secondary_terrain) {
                    dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                } else {
                    dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_WALL;
                }

                GenerateMazeLine(cur_x, cur_y, grid_cell.start_x, grid_cell.start_y, grid_cell.end_x, grid_cell.end_y, use_secondary_terrain, room_index);
            }
        }
    }
}

function GenerateMazeRoom(grid, grid_size_x, grid_size_y, maze_chance) {
    if (maze_chance <= 0) return;
    if (dungeonRand.RandInt(100) >= maze_chance) return;

    if (advancedGenerationSettings.allow_wall_maze_room_generation || dungeonGenerationInfo.floor_generation_attempts < 0) {
        let num_valid = 0;
        for (let y = 0; y < grid_size_y; y++) {
            for (let x = 0; x < grid_size_x; x++) {
                if (
                    !grid[x][y].is_invalid &&
                    !grid[x][y].has_been_merged &&
                    grid[x][y].is_connected &&
                    grid[x][y].is_room &&
                    !grid[x][y].has_secondary_structure &&
                    !grid[x][y].is_kecleon_shop &&
                    !grid[x][y].is_monster_house &&
                    !grid[x][y].unk4
                ) {
                    if ((grid[x][y].end_x - grid[x][y].start_x) % 2 !== 0 && (grid[x][y].end_y - grid[x][y].start_y) % 2 !== 0) {
                        num_valid++;
                    }
                }
            }
        }

        if (num_valid <= 0) return;

        let values = Array(256).fill(false);
        values[0] = true;

        for (let i = 0; i < 64; i++) {
            let a = dungeonRand.RandInt(num_valid);
            let b = dungeonRand.RandInt(num_valid);

            let temp = values[a];
            values[a] = values[b];
            values[b] = temp;
        }

        let counter = 0;

        for (let y = 0; y < grid_size_y; y++) {
            for (let x = 0; x < grid_size_x; x++) {
                if (
                    !grid[x][y].is_invalid &&
                    !grid[x][y].has_been_merged &&
                    grid[x][y].is_connected &&
                    grid[x][y].is_room &&
                    !grid[x][y].has_secondary_structure &&
                    !grid[x][y].is_kecleon_shop &&
                    !grid[x][y].is_monster_house &&
                    !grid[x][y].unk4
                ) {
                    if ((grid[x][y].end_x - grid[x][y].start_x) % 2 !== 0 && (grid[x][y].end_y - grid[x][y].start_y) % 2 !== 0) {
                        if (values[counter]) {
                            GenerateMaze(grid[x][y], false);
                            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_GENERATE_MAZE_ROOM);
                        }
                        counter++;
                    }
                }
            }
        }
    }
}

function GetFloorType() {
    if (dungeonData.dungeon_objective === DungeonObjectiveType.OBJECTIVE_RESCUE && dungeonData.floor === dungeonData.rescue_floor) {
        return FloorType.FLOOR_TYPE_RESCUE;
    }

    if (dungeonGenerationInfo.fixed_room_id > 0 && dungeonGenerationInfo.fixed_room_id <= 0x6e) {
        return FloorType.FLOOR_TYPE_FIXED;
    }

    return FloorType.FLOOR_TYPE_NORMAL;
}

function GenerateKecleonShop(grid, grid_size_x, grid_size_y, kecleon_chance) {
    if (statusData.has_monster_house || GetFloorType() === FloorType.FLOOR_TYPE_RESCUE || kecleon_chance <= 0) return;
    if (dungeonRand.RandInt(100) >= kecleon_chance) return;

    let list_x = [], list_y = [];
    for (let i = 0; i < 0xf; i++) {
        list_x.push(i);
        list_y.push(i);
    }

    for (let x = 0; x < 200; x++) {
        let a = dungeonRand.RandInt(0xf);
        let b = dungeonRand.RandInt(0xf);

        let temp = list_x[a];
        list_x[a] = list_x[b];
        list_x[b] = temp;
    }

    for (let y = 0; y < 200; y++) {
        let a = dungeonRand.RandInt(0xf);
        let b = dungeonRand.RandInt(0xf);

        let temp = list_y[a];
        list_y[a] = list_y[b];
        list_y[b] = temp;
    }

    for (let i = 0; i < list_x.length; i++) {
        if (list_x[i] >= grid_size_x) continue;

        const x = list_x[i];

        for (let j = 0; j < list_y.length; j++) {
            if (list_y[j] >= grid_size_y) continue;

            const y = list_y[j];

            if (
                grid[x][y].is_invalid ||
                grid[x][y].has_been_merged ||
                grid[x][y].is_merged ||
                !grid[x][y].is_connected ||
                !grid[x][y].is_room ||
                grid[x][y].has_secondary_structure ||
                grid[x][y].is_maze_room ||
                grid[x][y].flag_secondary_structure
            )
                continue;

                if (Math.abs(grid[x][y].start_x - grid[x][y].end_x) < 5 || Math.abs(grid[x][y].start_y - grid[x][y].end_y) < 4) continue;

                statusData.has_kecleon_shop = true;
            grid[x][y].is_kecleon_shop = true;

            statusData.kecleon_shop_min_x = grid[x][y].start_x;
            statusData.kecleon_shop_min_y = grid[x][y].start_y;
            statusData.kecleon_shop_max_x = grid[x][y].end_x;
            statusData.kecleon_shop_max_y = grid[x][y].end_y;

            if (grid[x][y].end_y - grid[x][y].start_y < 3) {
                statusData.kecleon_shop_max_y = grid[x][y].end_y + 1;
            }

            dungeonData.kecleon_shop_min_x = DEFAULT_MAX_POSITION;
            dungeonData.kecleon_shop_min_y = DEFAULT_MAX_POSITION;
            dungeonData.kecleon_shop_max_x = -DEFAULT_MAX_POSITION;
            dungeonData.kecleon_shop_max_y = -DEFAULT_MAX_POSITION;

            for (let cur_x = statusData.kecleon_shop_min_x + 1; cur_x < statusData.kecleon_shop_max_x - 1; cur_x++) {
                for (let cur_y = statusData.kecleon_shop_min_y + 1; cur_y < statusData.kecleon_shop_max_y - 1; cur_y++) {
                    dungeonData.list_tiles[cur_x][cur_y].terrain_flags.f_in_kecleon_shop = true;
                    dungeonData.list_tiles[cur_x][cur_y].spawn_or_visibility_flags.f_monster = false;
                    dungeonData.list_tiles[cur_x][cur_y].spawn_or_visibility_flags.f_stairs = false;

                    if (cur_x <= dungeonData.kecleon_shop_min_x) dungeonData.kecleon_shop_min_x = cur_x;
                    if (cur_y <= dungeonData.kecleon_shop_min_y) dungeonData.kecleon_shop_min_y = cur_y;
                    if (cur_x >= dungeonData.kecleon_shop_max_x) dungeonData.kecleon_shop_max_x = cur_x;
                    if (cur_y >= dungeonData.kecleon_shop_max_y) dungeonData.kecleon_shop_max_y = cur_y;
                }
            }

            for (let cur_x = grid[x][y].start_x; cur_x < grid[x][y].end_x; cur_x++) {
                for (let cur_y = grid[x][y].start_y; cur_y < grid[x][y].end_y; cur_y++) {
                    dungeonData.list_tiles[cur_x][cur_y].spawn_or_visibility_flags.f_special_tile = true;
                }
            }

            statusData.kecleon_shop_middle_x = Math.floor((statusData.kecleon_shop_min_x + statusData.kecleon_shop_max_x) / 2);
            statusData.kecleon_shop_middle_y = Math.floor((statusData.kecleon_shop_min_y + statusData.kecleon_shop_max_y) / 2);

            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_GENERATE_KECLEON_SHOP);
            return;
        }
    }
}

function IsCurrentMissionTypeExact(type, subtype) {
    if (dungeonData.mission_destination.is_destination_floor) {
        if (dungeonData.mission_destination.mission_type === type && dungeonData.mission_destination.mission_subtype === subtype) {
            return true;
        }
    }
    return false;
}

function IsOutlawMonsterHouseFloor() {
    return IsCurrentMissionTypeExact(MissionType.MISSION_ARREST_OUTLAW, MissionSubtypeOutlaw.MISSION_OUTLAW_MONSTER_HOUSE);
}

function FloorHasMissionMonster() {
    if (dungeonData.mission_destination.is_destination_floor) {
        if (
            dungeonData.mission_destination.mission_type === MissionType.MISSION_RESCUE_CLIENT ||
            dungeonData.mission_destination.mission_type === MissionType.MISSION_RESCUE_TARGET ||
            dungeonData.mission_destination.mission_type === MissionType.MISSION_ESCORT_TO_TARGET ||
            dungeonData.mission_destination.mission_type === MissionType.MISSION_DELIVER_ITEM ||
            dungeonData.mission_destination.mission_type === MissionType.MISSION_SEARCH_FOR_TARGET ||
            dungeonData.mission_destination.mission_type === MissionType.MISSION_TAKE_ITEM_FROM_OUTLAW ||
            dungeonData.mission_destination.mission_type === MissionType.MISSION_ARREST_OUTLAW
        ) {
            return true;
        }
    }
    return false;
}

function IsDestinationFloorWithMonster() {
    return FloorHasMissionMonster();
}

function GenerateMonsterHouse(grid, grid_size_x, grid_size_y, monster_house_chance) {
    if (monster_house_chance <= 0) return;
    if (dungeonRand.RandInt(100) >= monster_house_chance) return;
    if (statusData.has_kecleon_shop) return;
    if ((!IsOutlawMonsterHouseFloor() && IsDestinationFloorWithMonster()) || GetFloorType() !== FloorType.FLOOR_TYPE_NORMAL) return;

    let num_valid = 0;

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            if (
                !grid[x][y].is_invalid &&
                !grid[x][y].has_been_merged &&
                grid[x][y].is_connected &&
                grid[x][y].is_room &&
                !grid[x][y].is_kecleon_shop &&
                !grid[x][y].unk4 &&
                !grid[x][y].is_maze_room &&
                !grid[x][y].has_secondary_structure
            ) {
                num_valid++;
            }
        }
    }

    if (num_valid <= 0) return;

    let values = Array(256).fill(false);
    values[0] = true;

    for (let i = 0; i < 64; i++) {
        let a = dungeonRand.RandInt(num_valid);
        let b = dungeonRand.RandInt(num_valid);

        let temp = values[a];
        values[a] = values[b];
        values[b] = temp;
    }

    let counter = 0;

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            if (
                !grid[x][y].is_invalid &&
                !grid[x][y].has_been_merged &&
                grid[x][y].is_connected &&
                grid[x][y].is_room &&
                !grid[x][y].is_kecleon_shop &&
                !grid[x][y].unk4 &&
                !grid[x][y].is_maze_room &&
                !grid[x][y].has_secondary_structure
            ) {
                if (values[counter]) {
                    statusData.has_monster_house = true;
                    grid[x][y].is_monster_house = true;

                    for (let cur_x = grid[x][y].start_x; cur_x < grid[x][y].end_x; cur_x++) {
                        for (let cur_y = grid[x][y].start_y; cur_y < grid[x][y].end_y; cur_y++) {
                            dungeonData.list_tiles[cur_x][cur_y].terrain_flags.f_in_monster_house = true;
                            dungeonGenerationInfo.monster_house_room = dungeonData.list_tiles[cur_x][cur_y].room_index;
                        }
                    }

                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_GENERATE_MONSTER_HOUSE);
                    return;
                }
                counter++;
            }
        }
    }
}

function GenerateExtraHallways(grid, grid_size_x, grid_size_y, num_extra_hallways) {
    let added_extra_hallway = false;

    for (let i = 0; i < num_extra_hallways; i++) {
        const x = dungeonRand.RandInt(grid_size_x);
        const y = dungeonRand.RandInt(grid_size_y);

        if (!grid[x][y].is_room || !grid[x][y].is_connected || grid[x][y].is_invalid || grid[x][y].is_maze_room) continue;

        let cur_x = dungeonRand.RandRange(grid[x][y].start_x, grid[x][y].end_x);
        let cur_y = dungeonRand.RandRange(grid[x][y].start_y, grid[x][y].end_y);
        let direction = dungeonRand.RandInt(4) * 2;

        for (let j = 0; j < 3; j++) {
            if (direction === DirectionId.DIR_DOWN && y >= grid_size_y - 1) direction = DirectionId.DIR_RIGHT;
            if (direction === DirectionId.DIR_RIGHT && x >= grid_size_x - 1) direction = DirectionId.DIR_UP;
            if (direction === DirectionId.DIR_UP && y <= 0) direction = DirectionId.DIR_LEFT;
            if (direction === DirectionId.DIR_LEFT && x <= 0) direction = DirectionId.DIR_DOWN;
        }

        const room_index = dungeonData.list_tiles[cur_x][cur_y].room_index;

        let continue_walk = true;
        while (continue_walk) {
            if (dungeonData.list_tiles[cur_x][cur_y].room_index === room_index) {
                cur_x += Constants.LIST_DIRECTIONS[direction * 4];
                cur_y += Constants.LIST_DIRECTIONS[direction * 4 + 2];
            } else {
                continue_walk = false;
            }
        }

        continue_walk = true;
        while (continue_walk) {
            if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                cur_x += Constants.LIST_DIRECTIONS[direction * 4];
                cur_y += Constants.LIST_DIRECTIONS[direction * 4 + 2];
            } else {
                continue_walk = false;
            }
        }

        if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_SECONDARY) continue;

        let valid = true;
        for (let testX = cur_x - 2; testX < cur_x + 3; testX++) {
            for (let testY = cur_y - 2; testY < cur_y + 3; testY++) {
                if (testX < 0 || testX >= FLOOR_MAX_X || testY < 0 || testY >= FLOOR_MAX_Y) {
                    valid = false;
                    break;
                }
            }
            if (!valid) break;
        }

        if (!valid) continue;

        let check_direction = (direction + 2) % 8;
        let check_x = cur_x + Constants.LIST_DIRECTIONS[check_direction * 4];
        let check_y = cur_y + Constants.LIST_DIRECTIONS[check_direction * 4 + 2];
        if (dungeonData.list_tiles[check_x][check_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) continue;

        check_direction = (direction + 6) % 8;
        check_x = cur_x + Constants.LIST_DIRECTIONS[check_direction * 4];
        check_y = cur_y + Constants.LIST_DIRECTIONS[check_direction * 4 + 2];
        if (dungeonData.list_tiles[check_x][check_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) continue;

        let steps = dungeonRand.RandInt(3) + 3;
        while (true) {
            if (cur_x <= 1 || cur_y <= 1 || cur_x >= 55 || cur_y >= 31) break;
            if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) break;
            if (dungeonData.list_tiles[cur_x][cur_y].terrain_flags.f_impassable_wall) break;

            let will_not_make_square = true;

            if (
                dungeonData.list_tiles[cur_x + 1][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[cur_x + 1][cur_y + 1].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[cur_x][cur_y + 1].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL
            ) {
                will_not_make_square = false;
            }

            if (
                dungeonData.list_tiles[cur_x + 1][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[cur_x + 1][cur_y - 1].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[cur_x][cur_y - 1].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL
            ) {
                will_not_make_square = false;
            }

            if (
                dungeonData.list_tiles[cur_x - 1][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[cur_x - 1][cur_y + 1].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[cur_x][cur_y + 1].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL
            ) {
                will_not_make_square = false;
            }

            if (
                dungeonData.list_tiles[cur_x - 1][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[cur_x - 1][cur_y - 1].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[cur_x][cur_y - 1].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL
            ) {
                will_not_make_square = false;
            }

            if (will_not_make_square) {
                dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
            }

            check_direction = (direction + 2) % 8;
            check_x = cur_x + Constants.LIST_DIRECTIONS[check_direction * 4];
            check_y = cur_y + Constants.LIST_DIRECTIONS[check_direction * 4 + 2];
            if (dungeonData.list_tiles[check_x][check_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) break;

            check_direction = (direction + 6) % 8;
            check_x = cur_x + Constants.LIST_DIRECTIONS[check_direction * 4];
            check_y = cur_y + Constants.LIST_DIRECTIONS[check_direction * 4 + 2];
            if (dungeonData.list_tiles[check_x][check_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) break;

            steps -= 1;
            if (steps === 0) {
                steps = dungeonRand.RandInt(3) + 3;
                const rotate_rand = dungeonRand.RandInt(100);

                if (rotate_rand < 50) direction = (direction + 2) % 8;
                else direction = (direction + 6) % 8;

                if (cur_x >= 32 && statusData.floor_size === FloorSize.FLOOR_SIZE_SMALL && direction === DirectionId.DIR_RIGHT) break;
                if (cur_x >= 48 && statusData.floor_size === FloorSize.FLOOR_SIZE_MEDIUM && direction === DirectionId.DIR_RIGHT) break;
            }

            cur_x += Constants.LIST_DIRECTIONS[direction * 4];
            cur_y += Constants.LIST_DIRECTIONS[direction * 4 + 2];
        }

        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_GENERATE_EXTRA_HALLWAY);
        added_extra_hallway = true;
    }

    if (added_extra_hallway) {
        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_GENERATE_EXTRA_HALLWAYS);
    }
}

function GenerateRoomImperfections(grid, grid_size_x, grid_size_y) {
    let added_room_imperfections = false;

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            if (
                grid[x][y].is_invalid ||
                grid[x][y].has_been_merged ||
                grid[x][y].is_merged ||
                !grid[x][y].is_room ||
                !grid[x][y].is_connected ||
                grid[x][y].has_secondary_structure ||
                grid[x][y].is_maze_room ||
                !grid[x][y].flag_imperfect
            )
                continue;

                if (dungeonRand.RandInt(100) < generationConstants.no_imperfections_chance) continue;

                let added_imperfections_to_this_room = false;
            let length = grid[x][y].end_x - grid[x][y].start_x + (grid[x][y].end_y - grid[x][y].start_y);
            length = Math.max(Math.floor(length / 4), 1);

            for (let counter = 0; counter < length; counter++) {
                for (let i = 0; i < 2; i++) {
                    let starting_corner = dungeonRand.RandInt(4);
                    let pt_x = 0, pt_y = 0, move_x = 0, move_y = 0;

                    if (starting_corner === 0) {
                        pt_x = grid[x][y].start_x;
                        pt_y = grid[x][y].start_y;
                        if (i === 0) { move_x = 0; move_y = 1; }
                        else { move_x = 1; move_y = 0; }
                    } else if (starting_corner === 1) {
                        pt_x = grid[x][y].end_x - 1;
                        pt_y = grid[x][y].start_y;
                        if (i === 0) { move_x = -1; move_y = 0; }
                        else { move_x = 0; move_y = 1; }
                    } else if (starting_corner === 2) {
                        pt_x = grid[x][y].end_x - 1;
                        pt_y = grid[x][y].end_y - 1;
                        if (i === 0) { move_x = 0; move_y = -1; }
                        else { move_x = -1; move_y = 0; }
                    } else if (starting_corner === 3) {
                        pt_x = grid[x][y].start_x;
                        pt_y = grid[x][y].end_y - 1;
                        if (i === 0) { move_x = 1; move_y = 0; }
                        else { move_x = 0; move_y = -1; }
                    }

                    for (let v = 0; v < 10; v++) {
                        if (pt_x < grid[x][y].start_x || pt_x >= grid[x][y].end_x || pt_y < grid[x][y].start_y || pt_y >= grid[x][y].end_y) break;

                        if (dungeonData.list_tiles[pt_x][pt_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                            let direction = DirectionId.DIR_DOWN;
                            while (direction < 8) {
                                const next_x = pt_x + Constants.LIST_DIRECTIONS[direction * 4];
                                const next_y = pt_y + Constants.LIST_DIRECTIONS[direction * 4 + 2];

                                let found = false;
                                for (let offset_x = -1; offset_x <= 1; offset_x++) {
                                    for (let offset_y = -1; offset_y <= 1; offset_y++) {
                                        if (
                                            dungeonData.list_tiles[next_x + offset_x][next_y + offset_y].terrain_flags.terrain_type ===
                                            TerrainType.TERRAIN_NORMAL
                                        ) {
                                            if (dungeonData.list_tiles[next_x + offset_x][next_y + offset_y].room_index === 0xff) {
                                                found = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (found) break;
                                }
                                if (found) break;
                                direction += 1;
                            }

                            if (direction === 8) {
                                let base = starting_corner * 8;
                                direction = 0;

                                while (direction < 8) {
                                    let next_x = pt_x + Constants.LIST_DIRECTIONS[direction * 4];
                                    let next_y = pt_y + Constants.LIST_DIRECTIONS[direction * 4 + 2];

                                    let is_open = (dungeonData.list_tiles[next_x][next_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL);

                                    if (Constants.CORNER_CARDINAL_NEIGHBOR_EXPECT_OPEN[base + direction] !== is_open) break;

                                    direction += 2;
                                }

                                if (direction === 8) {
                                    dungeonData.list_tiles[pt_x][pt_y].terrain_flags.terrain_type = TerrainType.TERRAIN_WALL;
                                    added_room_imperfections = true;
                                    added_imperfections_to_this_room = true;
                                }
                            }
                            break;
                        } else {
                            pt_x += move_x;
                            pt_y += move_y;
                        }
                    }
                }
            }

            if (added_imperfections_to_this_room) {
                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_GENERATE_ROOM_IMPERFECTION);
            }
        }
    }

    if (added_room_imperfections) {
        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_GENERATE_ROOM_IMPERFECTIONS);
    }
}

function SetSpawnFlag5(grid_cell) {
    for (let x = grid_cell.start_x; x < grid_cell.end_x; x++) {
        for (let y = grid_cell.start_y; y < grid_cell.end_y; y++) {
            dungeonData.list_tiles[x][y].spawn_or_visibility_flags.spawn_flags_field_0x5 = true;
        }
    }
}

function IsNextToHallway(x, y) {
    for (let offset_x = -1; offset_x <= 1; offset_x++) {
        if (x + offset_x < 0) continue;
        if (x + offset_x >= FLOOR_MAX_X) break;

        for (let offset_y = -1; offset_y <= 1; offset_y++) {
            if (y + offset_y < 0) continue;
            if (y + offset_y >= FLOOR_MAX_Y) break;
            if (offset_x !== 0 && offset_y !== 0) continue;

            if (
                dungeonData.list_tiles[x + offset_x][y + offset_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[x + offset_x][y + offset_y].room_index === 0xff
            ) {
                return true;
            }
        }
    }
    return false;
}

function GenerateSecondaryStructures(grid, grid_size_x, grid_size_y) {
    let generated_secondary_structure = false;

    for (let y = 0; y < grid_size_y; y++) {
        for (let x = 0; x < grid_size_x; x++) {
            if (
                grid[x][y].is_invalid ||
                grid[x][y].is_monster_house ||
                grid[x][y].is_merged ||
                !grid[x][y].is_room ||
                !grid[x][y].flag_secondary_structure ||
                grid[x][y].flag_imperfect
            )
                continue;

                const structure_type = dungeonRand.RandInt(6);
                const room_size_x = grid[x][y].end_x - grid[x][y].start_x;
                const room_size_y = grid[x][y].end_y - grid[x][y].start_y;
                const middle_x = Math.floor((grid[x][y].end_x + grid[x][y].start_x) / 2);
                const middle_y = Math.floor((grid[x][y].end_y + grid[x][y].start_y) / 2);

                if (structure_type === SecondaryStructureType.SECONDARY_STRUCTURE_MAZE_PLUS_DOT && statusData.secondary_structures_budget > 0) {
                    statusData.secondary_structures_budget -= 1;

                    if (room_size_x % 2 !== 0 && room_size_y % 2 !== 0) {
                        SetSpawnFlag5(grid[x][y]);
                        GenerateMaze(grid[x][y], true);
                    } else {
                        if (room_size_x >= 5 && room_size_y >= 5) {
                            dungeonData.list_tiles[middle_x][middle_y].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x][middle_y - 1].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x - 1][middle_y].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x + 1][middle_y].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x][middle_y + 1].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                        } else {
                            dungeonData.list_tiles[middle_x][middle_y].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                        }
                    }

                    grid[x][y].has_secondary_structure = true;
                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_GENERATE_SECONDARY_STRUCTURE);
                    generated_secondary_structure = true;
                } else if (structure_type === SecondaryStructureType.SECONDARY_STRUCTURE_CHECKERBOARD && statusData.secondary_structures_budget > 0) {
                    if (room_size_x % 2 !== 0 && room_size_y % 2 !== 0) {
                        statusData.secondary_structures_budget -= 1;
                        SetSpawnFlag5(grid[x][y]);

                        for (let i = 0; i < 64; i++) {
                            const rand_x = dungeonRand.RandInt(room_size_x);
                            const rand_y = dungeonRand.RandInt(room_size_y);

                            if ((rand_x + rand_y) % 2 !== 0) {
                                dungeonData.list_tiles[grid[x][y].start_x + rand_x][grid[x][y].start_y + rand_y].terrain_flags.terrain_type =
                                TerrainType.TERRAIN_SECONDARY;
                            }
                        }

                        grid[x][y].has_secondary_structure = true;
                        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_GENERATE_SECONDARY_STRUCTURE);
                        generated_secondary_structure = true;
                    }
                } else if (structure_type === SecondaryStructureType.SECONDARY_STRUCTURE_POOL) {
                    if (room_size_x >= 5 && room_size_y >= 5) {
                        let rand_x1 = dungeonRand.RandRange(grid[x][y].start_x + 2, grid[x][y].end_x - 3);
                        let rand_y1 = dungeonRand.RandRange(grid[x][y].start_y + 2, grid[x][y].end_y - 3);
                        let rand_x2 = dungeonRand.RandRange(grid[x][y].start_x + 2, grid[x][y].end_x - 3);
                        let rand_y2 = dungeonRand.RandRange(grid[x][y].start_y + 2, grid[x][y].end_y - 3);

                        if (statusData.secondary_structures_budget > 0) {
                            statusData.secondary_structures_budget -= 1;
                            SetSpawnFlag5(grid[x][y]);

                            if (rand_x1 > rand_x2) {
                                const temp = rand_x1;
                                rand_x1 = rand_x2;
                                rand_x2 = temp;
                            }

                            if (rand_y1 > rand_y2) {
                                const temp = rand_y2;
                                rand_y1 = rand_y2;
                                rand_y2 = temp;
                            }

                            for (let cur_x = rand_x1; cur_x <= rand_x2; cur_x++) {
                                for (let cur_y = rand_y1; cur_y <= rand_y2; cur_y++) {
                                    dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                                }
                            }

                            grid[x][y].has_secondary_structure = true;
                            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_GENERATE_SECONDARY_STRUCTURE);
                            generated_secondary_structure = true;
                        }
                    }
                } else if (structure_type === SecondaryStructureType.SECONDARY_STRUCTURE_ISLAND) {
                    if (room_size_x >= 6 && room_size_y >= 6) {
                        if (statusData.secondary_structures_budget > 0) {
                            statusData.secondary_structures_budget -= 1;
                            SetSpawnFlag5(grid[x][y]);

                            dungeonData.list_tiles[middle_x - 2][middle_y - 2].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x - 2][middle_y - 2].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x - 1][middle_y - 2].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x - 1][middle_y - 2].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x][middle_y - 2].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x][middle_y - 2].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x + 1][middle_y - 2].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x + 1][middle_y - 2].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x - 2][middle_y - 1].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x - 2][middle_y - 1].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x - 2][middle_y].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x - 2][middle_y].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x - 2][middle_y + 1].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x - 2][middle_y + 1].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x - 1][middle_y + 1].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x - 1][middle_y + 1].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x][middle_y + 1].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x][middle_y + 1].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x + 1][middle_y - 2].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x + 1][middle_y - 2].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x + 1][middle_y - 1].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x + 1][middle_y - 1].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x + 1][middle_y].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x + 1][middle_y].terrain_flags.f_corner_cuttable = true;
                            dungeonData.list_tiles[middle_x + 1][middle_y + 1].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            dungeonData.list_tiles[middle_x + 1][middle_y + 1].terrain_flags.f_corner_cuttable = true;

                            dungeonData.list_tiles[middle_x - 1][middle_y - 1].spawn_or_visibility_flags.f_trap = true;
                            dungeonData.list_tiles[middle_x - 1][middle_y - 1].spawn_or_visibility_flags.f_special_tile = true;
                            dungeonData.list_tiles[middle_x - 1][middle_y - 1].spawn_or_visibility_flags.spawn_flags_field_0x6 = true;

                            dungeonData.list_tiles[middle_x][middle_y - 1].spawn_or_visibility_flags.f_item = true;
                            dungeonData.list_tiles[middle_x][middle_y - 1].spawn_or_visibility_flags.f_special_tile = true;
                            dungeonData.list_tiles[middle_x - 1][middle_y].spawn_or_visibility_flags.f_item = true;
                            dungeonData.list_tiles[middle_x - 1][middle_y].spawn_or_visibility_flags.f_special_tile = true;
                            dungeonData.list_tiles[middle_x][middle_y].spawn_or_visibility_flags.f_item = true;
                            dungeonData.list_tiles[middle_x][middle_y].spawn_or_visibility_flags.f_special_tile = true;

                            grid[x][y].has_secondary_structure = true;
                            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_GENERATE_SECONDARY_STRUCTURE);
                            generated_secondary_structure = true;
                        }
                    }
                } else if (structure_type === SecondaryStructureType.SECONDARY_STRUCTURE_DIVIDER && statusData.secondary_structures_budget > 0) {
                    statusData.secondary_structures_budget -= 1;
                    SetSpawnFlag5(grid[x][y]);

                    let valid = true;

                    if (dungeonRand.RandInt(2) === 0) {
                        for (let i = grid[x][y].start_x; i < grid[x][y].end_x; i++) {
                            if (IsNextToHallway(i, middle_y)) {
                                valid = false;
                                break;
                            }
                        }

                        if (valid) {
                            for (let i = grid[x][y].start_x; i < grid[x][y].end_x; i++) {
                                dungeonData.list_tiles[i][middle_y].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            }

                            for (let cur_x = grid[x][y].start_x; cur_x < grid[x][y].end_x; cur_x++) {
                                for (let cur_y = grid[x][y].start_y; cur_y < grid[x][y].end_y; cur_y++) {
                                    dungeonData.list_tiles[cur_x][cur_y].spawn_or_visibility_flags.spawn_flags_field_0x7 = true;
                                }
                            }

                            grid[x][y].has_secondary_structure = true;
                            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_GENERATE_SECONDARY_STRUCTURE);
                            generated_secondary_structure = true;
                        }
                    } else {
                        for (let i = grid[x][y].start_y; i < grid[x][y].end_y; i++) {
                            if (IsNextToHallway(middle_x, i)) {
                                valid = false;
                                break;
                            }
                        }

                        if (valid) {
                            for (let i = grid[x][y].start_y; i < grid[x][y].end_y; i++) {
                                dungeonData.list_tiles[middle_x][i].terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
                            }

                            for (let cur_x = grid[x][y].start_x; cur_x < grid[x][y].end_x; cur_x++) {
                                for (let cur_y = grid[x][y].start_y; cur_y < grid[x][y].end_y; cur_y++) {
                                    dungeonData.list_tiles[cur_x][cur_y].spawn_or_visibility_flags.spawn_flags_field_0x7 = true;
                                }
                            }

                            grid[x][y].has_secondary_structure = true;
                            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_GENERATE_SECONDARY_STRUCTURE);
                            generated_secondary_structure = true;
                        }
                    }
                }
        }
    }

    if (generated_secondary_structure) {
        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_GENERATE_SECONDARY_STRUCTURES);
    }
}

function GenerateStandardFloor(grid_size_x, grid_size_y, floor_props) {
    const { list_x, list_y } = GetGridPositions(grid_size_x, grid_size_y);

    grid_cell_start_x = list_x;
    grid_cell_start_y = list_y;

    let grid = InitDungeonGrid(grid_size_x, grid_size_y);

    AssignRooms(grid, grid_size_x, grid_size_y, floor_props.room_density);
    CreateRoomsAndAnchors(grid, grid_size_x, grid_size_y, list_x, list_y, floor_props.room_flags);

    const cursor_x = dungeonRand.RandInt(grid_size_x);
    const cursor_y = dungeonRand.RandInt(grid_size_y);

    AssignGridCellConnections(grid, grid_size_x, grid_size_y, cursor_x, cursor_y, floor_props);
    CreateGridCellConnections(grid, grid_size_x, grid_size_y, list_x, list_y, false);

    EnsureConnectedGrid(grid, grid_size_x, grid_size_y, list_x, list_y);

    GenerateMazeRoom(grid, grid_size_x, grid_size_y, floor_props.maze_room_chance);
    GenerateKecleonShop(grid, grid_size_x, grid_size_y, statusData.kecleon_shop_chance);
    GenerateMonsterHouse(grid, grid_size_x, grid_size_y, statusData.monster_house_chance);

    GenerateExtraHallways(grid, grid_size_x, grid_size_y, floor_props.num_extra_hallways);
    GenerateRoomImperfections(grid, grid_size_x, grid_size_y);
    GenerateSecondaryStructures(grid, grid_size_x, grid_size_y);
}

function GenerateOneRoomMonsterHouseFloor() {
    let grid = InitDungeonGrid(1, 1);

    grid[0][0].start_x = 2;
    grid[0][0].end_x = 0x36;
    grid[0][0].start_y = 2;
    grid[0][0].end_y = 0x1e;
    grid[0][0].is_room = true;
    grid[0][0].is_connected = true;
    grid[0][0].is_invalid = false;

    for (let x = grid[0][0].start_x; x < grid[0][0].end_x; x++) {
        for (let y = grid[0][0].start_y; y < grid[0][0].end_y; y++) {
            dungeonData.list_tiles[x][y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
            dungeonData.list_tiles[x][y].room_index = 0;
        }
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_ONE_ROOM_MONSTER_HOUSE_FLOOR);
    GenerateMonsterHouse(grid, 1, 1, 999);
}

function GenerateOuterRingFloor(floor_props) {
    const grid_size_x = 6;
    const grid_size_y = 4;
    const list_x = [0, 5, 0x10, 0x1c, 0x27, 0x33, 0x38];
    const list_y = [2, 7, 0x10, 0x19, 0x1e];

    grid_cell_start_x = list_x;
    grid_cell_start_y = list_y;

    let grid = InitDungeonGrid(grid_size_x, grid_size_y);

    for (let x = 0; x < grid_size_x; x++) {
        grid[x][0].is_room = false;
        grid[x][grid_size_y - 1].is_room = false;
    }

    for (let y = 0; y < grid_size_y; y++) {
        grid[0][y].is_room = false;
        grid[grid_size_x - 1][y].is_room = false;
    }

    for (let x = 1; x < grid_size_x - 1; x++) {
        for (let y = 1; y < grid_size_y - 1; y++) {
            grid[x][y].is_room = true;
        }
    }

    let cur_room_index = 0;

    for (let y = 0; y < grid_size_y; y++) {
        for (let x = 0; x < grid_size_x; x++) {
            if (grid[x][y].is_room) {
                const range_x = list_x[x + 1] - list_x[x] - 3;
                const range_y = list_y[y + 1] - list_y[y] - 3;

                const room_size_x = dungeonRand.RandRange(5, range_x);
                const room_size_y = dungeonRand.RandRange(4, range_y);
                const start_x = dungeonRand.RandInt(range_x - room_size_x) + list_x[x] + 2;
                const start_y = dungeonRand.RandInt(range_y - room_size_y) + list_y[y] + 2;

                grid[x][y].start_x = start_x;
                grid[x][y].start_y = start_y;
                grid[x][y].end_x = start_x + room_size_x;
                grid[x][y].end_y = start_y + room_size_y;
                for (let cur_x = grid[x][y].start_x; cur_x < grid[x][y].end_x; cur_x++) {
                    for (let cur_y = grid[x][y].start_y; cur_y < grid[x][y].end_y; cur_y++) {
                        dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                        dungeonData.list_tiles[cur_x][cur_y].room_index = cur_room_index;
                    }
                }

                cur_room_index += 1;
                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_ROOM);
            } else {
                const start_x = dungeonRand.RandRange(list_x[x] + 1, list_x[x + 1] - 2);
                const start_y = dungeonRand.RandRange(list_y[y] + 1, list_y[y + 1] - 2);

                grid[x][y].start_x = start_x;
                grid[x][y].start_y = start_y;
                grid[x][y].end_x = start_x + 1;
                grid[x][y].end_y = start_y + 1;

                dungeonData.list_tiles[start_x][start_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                dungeonData.list_tiles[start_x][start_y].room_index = 0xff;

                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_ANCHOR);
            }
        }
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_OUTER_RING_FLOOR);

    grid[0][0].connected_to_right = true;
    grid[1][0].connected_to_left = true;
    grid[1][0].connected_to_right = true;
    grid[2][0].connected_to_left = true;
    grid[2][0].connected_to_right = true;
    grid[3][0].connected_to_left = true;
    grid[3][0].connected_to_right = true;
    grid[4][0].connected_to_left = true;
    grid[4][0].connected_to_right = true;
    grid[5][0].connected_to_left = true;
    grid[0][0].connected_to_bottom = true;
    grid[0][1].connected_to_top = true;
    grid[0][1].connected_to_bottom = true;
    grid[0][2].connected_to_top = true;
    grid[0][2].connected_to_bottom = true;
    grid[0][3].connected_to_top = true;
    grid[0][3].connected_to_right = true;
    grid[1][3].connected_to_left = true;
    grid[1][3].connected_to_right = true;
    grid[2][3].connected_to_left = true;
    grid[2][3].connected_to_right = true;
    grid[3][3].connected_to_left = true;
    grid[3][3].connected_to_right = true;
    grid[4][3].connected_to_left = true;
    grid[4][3].connected_to_right = true;
    grid[5][3].connected_to_left = true;
    grid[5][0].connected_to_bottom = true;
    grid[5][1].connected_to_top = true;
    grid[5][1].connected_to_bottom = true;
    grid[5][2].connected_to_top = true;
    grid[5][2].connected_to_bottom = true;
    grid[5][3].connected_to_top = true;

    const cursor_x = dungeonRand.RandInt(grid_size_x);
    const cursor_y = dungeonRand.RandInt(grid_size_y);

    AssignGridCellConnections(grid, grid_size_x, grid_size_y, cursor_x, cursor_y, floor_props);
    CreateGridCellConnections(grid, grid_size_x, grid_size_y, list_x, list_y, false);

    EnsureConnectedGrid(grid, grid_size_x, grid_size_y, list_x, list_y);

    GenerateKecleonShop(grid, grid_size_x, grid_size_y, statusData.kecleon_shop_chance);
    GenerateMonsterHouse(grid, grid_size_x, grid_size_y, statusData.monster_house_chance);

    GenerateExtraHallways(grid, grid_size_x, grid_size_y, floor_props.num_extra_hallways);
    GenerateRoomImperfections(grid, grid_size_x, grid_size_y);
}

function GenerateCrossroadsFloor(floor_props) {
    const grid_size_x = 5;
    const grid_size_y = 4;
    const list_x = [0, 0xb, 0x16, 0x21, 0x2c, 0x38];
    const list_y = [1, 9, 0x10, 0x17, 0x1f];

    grid_cell_start_x = list_x;
    grid_cell_start_y = list_y;

    let grid = InitDungeonGrid(grid_size_x, grid_size_y);

    for (let x = 0; x < grid_size_x; x++) {
        grid[x][0].is_room = true;
        grid[x][grid_size_y - 1].is_room = true;
    }

    for (let y = 0; y < grid_size_y; y++) {
        grid[0][y].is_room = true;
        grid[grid_size_x - 1][y].is_room = true;
    }

    for (let x = 1; x < grid_size_x - 1; x++) {
        for (let y = 1; y < grid_size_y - 1; y++) {
            grid[x][y].is_room = false;
        }
    }

    grid[0][0].is_invalid = true;
    grid[0][grid_size_y - 1].is_invalid = true;
    grid[grid_size_x - 1][0].is_invalid = true;
    grid[grid_size_x - 1][grid_size_y - 1].is_invalid = true;

    let cur_room_index = 0;

    for (let y = 0; y < grid_size_y; y++) {
        for (let x = 0; x < grid_size_x; x++) {
            if (grid[x][y].is_invalid) continue;

            if (grid[x][y].is_room) {
                const range_x = list_x[x + 1] - list_x[x] - 3;
                const range_y = list_y[y + 1] - list_y[y] - 3;

                const room_size_x = dungeonRand.RandRange(5, range_x);
                const room_size_y = dungeonRand.RandRange(4, range_y);
                const start_x = dungeonRand.RandInt(range_x - room_size_x) + list_x[x] + 2;
                const start_y = dungeonRand.RandInt(range_y - room_size_y) + list_y[y] + 2;

                grid[x][y].start_x = start_x;
                grid[x][y].start_y = start_y;
                grid[x][y].end_x = start_x + room_size_x;
                grid[x][y].end_y = start_y + room_size_y;
                for (let cur_x = grid[x][y].start_x; cur_x < grid[x][y].end_x; cur_x++) {
                    for (let cur_y = grid[x][y].start_y; cur_y < grid[x][y].end_y; cur_y++) {
                        dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                        dungeonData.list_tiles[cur_x][cur_y].room_index = cur_room_index;
                    }
                }

                cur_room_index += 1;
                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_ROOM);
            } else {
                const start_x = dungeonRand.RandRange(list_x[x] + 1, list_x[x + 1] - 2);
                const start_y = dungeonRand.RandRange(list_y[y] + 1, list_y[y + 1] - 2);

                grid[x][y].start_x = start_x;
                grid[x][y].start_y = start_y;
                grid[x][y].end_x = start_x + 1;
                grid[x][y].end_y = start_y + 1;

                dungeonData.list_tiles[start_x][start_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                dungeonData.list_tiles[start_x][start_y].room_index = 0xff;

                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_ANCHOR);
            }
        }
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_CROSSROADS_FLOOR);

    for (let x = 1; x < grid_size_x - 1; x++) {
        for (let y = 0; y < grid_size_y - 1; y++) {
            grid[x][y].connected_to_bottom = true;
            grid[x][y + 1].connected_to_top = true;
        }
    }

    for (let x = 0; x < grid_size_x - 1; x++) {
        for (let y = 1; y < grid_size_y - 1; y++) {
            grid[x][y].connected_to_right = true;
            grid[x + 1][y].connected_to_left = true;
        }
    }

    CreateGridCellConnections(grid, grid_size_x, grid_size_y, list_x, list_y, true);
    EnsureConnectedGrid(grid, grid_size_x, grid_size_y, list_x, list_y);
    GenerateKecleonShop(grid, grid_size_x, grid_size_y, statusData.kecleon_shop_chance);
    GenerateMonsterHouse(grid, grid_size_x, grid_size_y, statusData.monster_house_chance);

    GenerateExtraHallways(grid, grid_size_x, grid_size_y, floor_props.num_extra_hallways);
    GenerateRoomImperfections(grid, grid_size_x, grid_size_y);
}

function GenerateTwoRoomsWithMonsterHouseFloor() {
    const grid_size_x = 2;
    const grid_size_y = 1;
    const list_x = [2, 0x1c, 0x36];
    const list_y = [2, 0x1e];

    grid_cell_start_x = list_x;
    grid_cell_start_y = list_y;

    let grid = InitDungeonGrid(grid_size_x, grid_size_y);
    let cur_room_index = 0;
    const y = 0;

    for (let x = 0; x < grid_size_x; x++) {
        const range_x = list_x[x + 1] - list_x[x] - 3;
        const range_y = list_y[y + 1] - list_y[y] - 3;
        const room_size_x = dungeonRand.RandRange(10, range_x);
        const room_size_y = dungeonRand.RandRange(16, range_y);
        const start_x = dungeonRand.RandInt(range_x - room_size_x) + list_x[x] + 1;
        const start_y = dungeonRand.RandInt(range_y - room_size_y) + list_y[y] + 1;

        grid[x][y].start_x = start_x;
        grid[x][y].start_y = start_y;
        grid[x][y].end_x = start_x + room_size_x;
        grid[x][y].end_y = start_y + room_size_y;

        for (let cur_x = grid[x][y].start_x; cur_x < grid[x][y].end_x; cur_x++) {
            for (let cur_y = grid[x][y].start_y; cur_y < grid[x][y].end_y; cur_y++) {
                dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                dungeonData.list_tiles[cur_x][cur_y].room_index = cur_room_index;
            }
        }

        cur_room_index++;
        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_CREATE_ROOM);
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_TWO_ROOMS_WITH_MONSTER_HOUSE_FLOOR);

    grid[0][0].connected_to_right = true;
    grid[1][0].connected_to_left = true;

    CreateGridCellConnections(grid, grid_size_x, grid_size_y, list_x, list_y, false);
    GenerateMonsterHouse(grid, grid_size_x, grid_size_y, 999);
}

function GenerateLineFloor(floor_props) {
    const grid_size_x = 5;
    const grid_size_y = 1;
    const list_x = [0, 0xb, 0x16, 0x21, 0x2c, 0x38];
    const list_y = [4, 0xf];

    grid_cell_start_x = list_x;
    grid_cell_start_y = list_y;

    let grid = InitDungeonGrid(grid_size_x, grid_size_y);

    AssignRooms(grid, grid_size_x, grid_size_y, floor_props.room_density);
    CreateRoomsAndAnchors(grid, grid_size_x, grid_size_y, list_x, list_y, floor_props.room_flags);

    const cursor_x = dungeonRand.RandInt(grid_size_x);
    const cursor_y = dungeonRand.RandInt(grid_size_y);

    AssignGridCellConnections(grid, grid_size_x, grid_size_y, cursor_x, cursor_y, floor_props);
    CreateGridCellConnections(grid, grid_size_x, grid_size_y, list_x, list_y, true);

    EnsureConnectedGrid(grid, grid_size_x, grid_size_y, list_x, list_y);
    GenerateKecleonShop(grid, grid_size_x, grid_size_y, statusData.kecleon_shop_chance);
    GenerateMonsterHouse(grid, grid_size_x, grid_size_y, statusData.monster_house_chance);

    GenerateExtraHallways(grid, grid_size_x, grid_size_y, floor_props.num_extra_hallways);
    GenerateRoomImperfections(grid, grid_size_x, grid_size_y);
}

function GenerateCrossFloor(floor_props) {
    const grid_size_x = 3;
    const grid_size_y = 3;
    const list_x = [0xb, 0x16, 0x21, 0x2c];
    const list_y = [2, 0xb, 0x14, 0x1e];

    grid_cell_start_x = list_x;
    grid_cell_start_y = list_y;

    let grid = InitDungeonGrid(grid_size_x, grid_size_y);

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            grid[x][y].is_room = true;
        }
    }

    grid[0][0].is_invalid = true;
    grid[0][grid_size_y - 1].is_invalid = true;
    grid[grid_size_x - 1][0].is_invalid = true;
    grid[grid_size_x - 1][grid_size_y - 1].is_invalid = true;

    CreateRoomsAndAnchors(grid, grid_size_x, grid_size_y, list_x, list_y, floor_props.room_flags);

    grid[1][0].connected_to_bottom = true;
    grid[1][1].connected_to_top = true;
    grid[1][1].connected_to_bottom = true;
    grid[1][2].connected_to_top = true;
    grid[0][1].connected_to_right = true;
    grid[1][1].connected_to_left = true;
    grid[1][1].connected_to_right = true;
    grid[2][1].connected_to_left = true;

    CreateGridCellConnections(grid, grid_size_x, grid_size_y, list_x, list_y, true);
    EnsureConnectedGrid(grid, grid_size_x, grid_size_y, list_x, list_y);
    GenerateKecleonShop(grid, grid_size_x, grid_size_y, statusData.kecleon_shop_chance);
    GenerateMonsterHouse(grid, grid_size_x, grid_size_y, statusData.monster_house_chance);

    GenerateExtraHallways(grid, grid_size_x, grid_size_y, floor_props.num_extra_hallways);
    GenerateRoomImperfections(grid, grid_size_x, grid_size_y);
}

function MergeRoomsVertically(room_x, room_y1, room_dy, grid) {
    const room_y2 = room_y1 + room_dy;

    const start_x = Math.min(grid[room_x][room_y1].start_x, grid[room_x][room_y2].start_x);
    const end_x = Math.max(grid[room_x][room_y1].end_x, grid[room_x][room_y2].end_x);
    const start_y = grid[room_x][room_y1].start_y;
    const end_y = grid[room_x][room_y2].end_y;

    const room_index = dungeonData.list_tiles[grid[room_x][room_y1].start_x][grid[room_x][room_y1].start_y].room_index;

    for (let x = start_x; x < end_x; x++) {
        for (let y = start_y; y < end_y; y++) {
            dungeonData.list_tiles[x][y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
            dungeonData.list_tiles[x][y].room_index = room_index;
        }
    }

    grid[room_x][room_y1].start_x = start_x;
    grid[room_x][room_y1].start_y = start_y;
    grid[room_x][room_y1].end_x = end_x;
    grid[room_x][room_y1].end_y = end_y;

    grid[room_x][room_y1].is_merged = true;
    grid[room_x][room_y2].is_merged = true;
    grid[room_x][room_y2].is_connected = false;
    grid[room_x][room_y2].has_been_merged = true;

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_MERGE_ROOM_VERTICALLY);
}

function GenerateBeetleFloor(floor_props) {
    const grid_size_x = 3;
    const grid_size_y = 3;
    const list_x = [0x5, 0xf, 0x23, 0x32];
    const list_y = [2, 0xb, 0x14, 0x1e];

    grid_cell_start_x = list_x;
    grid_cell_start_y = list_y;

    let grid = InitDungeonGrid(grid_size_x, grid_size_y);

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            grid[x][y].is_room = true;
        }
    }

    CreateRoomsAndAnchors(grid, grid_size_x, grid_size_y, list_x, list_y, floor_props.room_flags);

    for (let y = 0; y < grid_size_y; y++) {
        grid[0][y].connected_to_right = true;
        grid[1][y].connected_to_left = true;
        grid[1][y].connected_to_right = true;
        grid[2][y].connected_to_left = true;
    }

    CreateGridCellConnections(grid, grid_size_x, grid_size_y, list_x, list_y, true);

    MergeRoomsVertically(1, 0, 1, grid);
    MergeRoomsVertically(1, 0, 2, grid);

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_MERGE_ROOM_VERTICALLY);

    EnsureConnectedGrid(grid, grid_size_x, grid_size_y, list_x, list_y);
    GenerateKecleonShop(grid, grid_size_x, grid_size_y, statusData.kecleon_shop_chance);
    GenerateMonsterHouse(grid, grid_size_x, grid_size_y, statusData.monster_house_chance);

    GenerateExtraHallways(grid, grid_size_x, grid_size_y, floor_props.num_extra_hallways);
    GenerateRoomImperfections(grid, grid_size_x, grid_size_y);
}

function GenerateOuterRoomsFloor(grid_size_x, grid_size_y, floor_props) {
    let { list_x, list_y } = GetGridPositions(grid_size_x, grid_size_y);

    grid_cell_start_x = list_x;
    grid_cell_start_y = list_y;

    let grid = InitDungeonGrid(grid_size_x, grid_size_y);

    for (let x = 0; x < grid_size_x; x++) {
        for (let y = 0; y < grid_size_y; y++) {
            grid[x][y].is_room = true;
        }
    }

    for (let x = 1; x < grid_size_x - 1; x++) {
        for (let y = 1; y < grid_size_y - 1; y++) {
            grid[x][y].is_invalid = true;
        }
    }

    CreateRoomsAndAnchors(grid, grid_size_x, grid_size_y, list_x, list_y, floor_props.room_flags);

    if (advancedGenerationSettings.fix_generate_outer_rooms_floor_error) {
        for (let x = 0; x < grid_size_x; x++) {
            if (x > 0) {
                grid[x][0].connected_to_left = true;
                grid[x][grid_size_y - 1].connected_to_left = true;
            }
            if (x < grid_size_x - 1) {
                grid[x + 1][0].connected_to_right = true;
                grid[x + 1][grid_size_y - 1].connected_to_right = true;
            }
        }

        for (let y = 0; y < grid_size_y; y++) {
            if (y > 0) {
                grid[0][y].connected_to_top = true;
                grid[grid_size_x - 1][y].connected_to_top = true;
            }
            if (y < grid_size_y - 1) {
                grid[0][y + 1].connected_to_bottom = true;
                grid[grid_size_x - 1][y + 1].connected_to_bottom = true;
            }
        }
    } else {
        for (let x = 0; x < grid_size_x; x++) {
            if (x > 0) {
                grid[x][0].connected_to_right = true;
                grid[x][grid_size_y - 1].connected_to_right = true;
            }
            if (x < grid_size_x - 2) {
                grid[x + 1][0].connected_to_left = true;
                grid[x + 1][grid_size_y - 1].connected_to_left = true;
            }
        }

        for (let y = 0; y < grid_size_y; y++) {
            if (y > 0) {
                grid[0][y].connected_to_top = true;
                grid[grid_size_x - 1][y].connected_to_top = true;
            }
            if (y < grid_size_y - 2) {
                grid[0][y].connected_to_bottom = true;
                grid[grid_size_x - 1][y].connected_to_bottom = true;
            }
        }
    }

    CreateGridCellConnections(grid, grid_size_x, grid_size_y, list_x, list_y, false);
    EnsureConnectedGrid(grid, grid_size_x, grid_size_y, list_x, list_y);

    GenerateMazeRoom(grid, grid_size_x, grid_size_y, floor_props.maze_room_chance);
    GenerateKecleonShop(grid, grid_size_x, grid_size_y, statusData.kecleon_shop_chance);
    GenerateMonsterHouse(grid, grid_size_x, grid_size_y, statusData.monster_house_chance);

    GenerateExtraHallways(grid, grid_size_x, grid_size_y, floor_props.num_extra_hallways);
    GenerateRoomImperfections(grid, grid_size_x, grid_size_y);
    GenerateSecondaryStructures(grid, grid_size_x, grid_size_y);
}

function ResetInnerBoundaryTileRows() {
    for (let x = 0; x < FLOOR_MAX_X; x++) {
        dungeonData.list_tiles[x][1] = new Tile();
        if (x === 0 || x === FLOOR_MAX_X - 1) dungeonData.list_tiles[x][1].terrain_flags.f_impassable_wall = true;

        dungeonData.list_tiles[x][0x1e] = new Tile();
        if (x === 0 || x === FLOOR_MAX_X - 1) dungeonData.list_tiles[x][0x1e].terrain_flags.f_impassable_wall = true;
    }
}

function EnsureImpassableTilesAreWalls() {
    for (let x = 0; x < FLOOR_MAX_X; x++) {
        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            if (dungeonData.list_tiles[x][y].terrain_flags.f_impassable_wall) {
                dungeonData.list_tiles[x][y].terrain_flags.terrain_type = TerrainType.TERRAIN_WALL;
            }
        }
    }
}

function FinalizeJunctions() {
    for (let x = 0; x < FLOOR_MAX_X; x++) {
        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            if (dungeonData.list_tiles[x][y].terrain_flags.terrain_type !== TerrainType.TERRAIN_NORMAL) continue;

            if (dungeonData.list_tiles[x][y].room_index === 0xff) {
                if (x > 0 && dungeonData.list_tiles[x - 1][y].room_index !== 0xff) {
                    dungeonData.list_tiles[x - 1][y].terrain_flags.f_natural_junction = true;
                    if (dungeonData.list_tiles[x - 1][y].terrain_flags.terrain_type === TerrainType.TERRAIN_SECONDARY) {
                        dungeonData.list_tiles[x - 1][y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                    }
                } else if (y > 0 && dungeonData.list_tiles[x][y - 1].room_index !== 0xff) {
                    dungeonData.list_tiles[x][y - 1].terrain_flags.f_natural_junction = true;
                    if (dungeonData.list_tiles[x][y - 1].terrain_flags.terrain_type === TerrainType.TERRAIN_SECONDARY) {
                        dungeonData.list_tiles[x][y - 1].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                    }
                } else if (y < FLOOR_MAX_Y - 1 && dungeonData.list_tiles[x][y + 1].room_index !== 0xff) {
                    dungeonData.list_tiles[x][y + 1].terrain_flags.f_natural_junction = true;
                    if (dungeonData.list_tiles[x][y + 1].terrain_flags.terrain_type === TerrainType.TERRAIN_SECONDARY) {
                        dungeonData.list_tiles[x][y + 1].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                    }
                } else if (x < FLOOR_MAX_X - 1 && dungeonData.list_tiles[x + 1][y].room_index !== 0xff) {
                    dungeonData.list_tiles[x + 1][y].terrain_flags.f_natural_junction = true;
                    if (dungeonData.list_tiles[x + 1][y].terrain_flags.terrain_type === TerrainType.TERRAIN_SECONDARY) {
                        dungeonData.list_tiles[x + 1][y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
                    }
                }
            } else if (dungeonData.list_tiles[x][y].room_index === 0xfe) {
                dungeonData.list_tiles[x][y].room_index = 0xff;
            }
        }
    }
}

function SetSecondaryTerrainOnWall(tile) {
    if (tile.terrain_flags.f_impassable_wall || tile.terrain_flags.terrain_type !== TerrainType.TERRAIN_WALL) return;
    tile.terrain_flags.terrain_type = TerrainType.TERRAIN_SECONDARY;
}

function GenerateSecondaryTerrainFormations(test_flag, floor_props) {
    if (!floor_props.room_flags.f_secondary_terrain_generation || !test_flag) return;

    const num_to_gen = [1, 1, 1, 2, 2, 2, 3, 3][dungeonRand.RandInt(8)];

    for (let i = 0; i < num_to_gen; i++) {
        let pt_x, pt_y, dir_x, dir_y, dir_y_upwards;

        if (dungeonRand.RandInt(100) < 50) {
            pt_y = FLOOR_MAX_Y - 1;
            dir_y = -1;
            dir_y_upwards = true;
        } else {
            pt_y = 0;
            dir_y = 1;
            dir_y_upwards = false;
        }

        let steps_until_lake = dungeonRand.RandInt(50) + 10;
        pt_x = dungeonRand.RandRange(2, FLOOR_MAX_X - 2);
        dir_x = 0;

        let done = false;
        while (!done) {
            let generated_river_tiles = false;
            const num_tiles_fill = dungeonRand.RandInt(6) + 2;

            for (let v = 0; v < num_tiles_fill; v++) {
                if (pt_x >= 0 && pt_x < FLOOR_MAX_X) {
                    let tile = (pt_y >= 0 && pt_y < FLOOR_MAX_Y) ? dungeonData.list_tiles[pt_x][pt_y] : DEFAULT_TILE;

                    if (tile.terrain_flags.terrain_type === TerrainType.TERRAIN_SECONDARY) {
                        done = true;
                        if (generated_river_tiles) {
                            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SECONDARY_TERRAIN_RIVER);
                        }
                        break;
                    }

                    if (!PosIsOutOfBounds(pt_x, pt_y)) {
                        SetSecondaryTerrainOnWall(dungeonData.list_tiles[pt_x][pt_y]);
                        generated_river_tiles = true;
                    }
                }

                pt_x += dir_x;
                pt_y += dir_y;

                if (pt_y < 0 || pt_y >= FLOOR_MAX_Y) {
                    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SECONDARY_TERRAIN_RIVER);
                    break;
                }

                steps_until_lake -= 1;
                if (steps_until_lake !== 0) continue;

                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SECONDARY_TERRAIN_RIVER);

                for (let j = 0; j < 64; j++) {
                    const offset_x = dungeonRand.RandInt(7) - 3;
                    const offset_y = dungeonRand.RandInt(7) - 3;
                    const target_x = pt_x + offset_x;
                    const target_y = pt_y + offset_y;

                    if (target_x >= 2 && target_x < FLOOR_MAX_X - 2 && target_y >= 2 && target_y < FLOOR_MAX_Y - 2) {
                        let second_near = false;

                        for (let x = -1; x < 2; x++) {
                            for (let y = -1; y < 2; y++) {
                                if (dungeonData.list_tiles[target_x + x][target_y + y].terrain_flags.terrain_type === TerrainType.TERRAIN_SECONDARY) {
                                    second_near = true;
                                    break;
                                }
                            }
                            if (second_near) break;
                        }

                        if (second_near && !PosIsOutOfBounds(target_x, target_y)) {
                            SetSecondaryTerrainOnWall(dungeonData.list_tiles[target_x][target_y]);
                        }
                    }
                }

                for (let offset_x = -3; offset_x < 4; offset_x++) {
                    for (let offset_y = -3; offset_y < 4; offset_y++) {
                        const target_x = pt_x + offset_x;
                        const target_y = pt_y + offset_y;
                        let num_adjacent = 0;

                        if (target_x >= 2 && target_x < FLOOR_MAX_X - 2 && target_y >= 2 && target_y < FLOOR_MAX_Y - 2) {
                            for (let x = -1; x < 2; x++) {
                                for (let y = -1; y < 2; y++) {
                                    if (x === 0 && y === 0) continue;
                                    if (dungeonData.list_tiles[target_x + x][target_y + y].terrain_flags.terrain_type === TerrainType.TERRAIN_SECONDARY) {
                                        num_adjacent += 1;
                                    }
                                }
                            }

                            if (num_adjacent >= 4 && !PosIsOutOfBounds(target_x, target_y)) {
                                SetSecondaryTerrainOnWall(dungeonData.list_tiles[target_x][target_y]);
                            }
                        }
                    }
                }

                OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SECONDARY_TERRAIN_RIVER_LAKE);
            }

            if (!done) {
                if (dir_x !== 0) {
                    dir_y = dir_y_upwards ? -1 : 1;
                    dir_x = 0;
                } else {
                    dir_x = (dungeonRand.RandInt(100) < 50) ? -1 : 1;
                    dir_y = 0;
                }
            }

            if (pt_y < 0 || pt_y >= FLOOR_MAX_Y) done = true;
        }
    }

    for (let i = 0; i < floor_props.secondary_terrain_density; i++) {
        let attempts = 0;
        let rnd_x = 0, rnd_y = 0;

        while (attempts < 200) {
            rnd_x = dungeonRand.RandInt(FLOOR_MAX_X);
            rnd_y = dungeonRand.RandInt(FLOOR_MAX_Y);
            if (rnd_x >= 1 && rnd_x < FLOOR_MAX_X - 1 && rnd_y >= 1 && rnd_y < FLOOR_MAX_Y - 1) break;
            attempts++;
        }

        if (attempts === 200) continue;

        let table = new Array(10);
        for (let x = 0; x < 10; x++) {
            table[x] = new Array(10);
            for (let y = 0; y < 10; y++) {
                table[x][y] = (x === 0 || y === 0 || x === 9 || y === 9);
            }
        }

        for (let v = 0; v < 80; v++) {
            const x = dungeonRand.RandInt(8) + 1;
            const y = dungeonRand.RandInt(8) + 1;
            if (table[x - 1][y] || table[x + 1][y] || table[x][y - 1] || table[x][y + 1]) {
                table[x][y] = true;
            }
        }

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (!table[x][y]) {
                    const targetX = rnd_x + x - 5;
                    const targetY = rnd_y + y - 5;
                    if (!PosIsOutOfBounds(targetX, targetY)) {
                        SetSecondaryTerrainOnWall(dungeonData.list_tiles[targetX][targetY]);
                    } else {
                        SetSecondaryTerrainOnWall(DEFAULT_TILE);
                    }
                }
            }
        }

        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SECONDARY_TERRAIN_STANDALONE_LAKE);
    }

    for (let x = 0; x < FLOOR_MAX_X; x++) {
        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            if (dungeonData.list_tiles[x][y].terrain_flags.terrain_type !== TerrainType.TERRAIN_SECONDARY) continue;

            if (
                dungeonData.list_tiles[x][y].terrain_flags.f_in_kecleon_shop ||
                dungeonData.list_tiles[x][y].terrain_flags.f_in_monster_house ||
                dungeonData.list_tiles[x][y].terrain_flags.f_unbreakable ||
                dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_stairs
            ) {
                dungeonData.list_tiles[x][y].terrain_flags.terrain_type = TerrainType.TERRAIN_NORMAL;
            } else {
                if (x <= 1 || x >= FLOOR_MAX_X - 1 || y <= 1 || y >= FLOOR_MAX_Y - 1) {
                    dungeonData.list_tiles[x][y].terrain_flags.terrain_type = TerrainType.TERRAIN_WALL;
                }
            }
        }
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_GENERATE_SECONDARY_TERRAIN);
}

function SpawnStairs(x, y, hidden_stairs_type) {
    dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_item = false;
    dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_stairs = true;

    if (hidden_stairs_type === HiddenStairsType.HIDDEN_STAIRS_NONE) {
        dungeonGenerationInfo.stairs_spawn_x = x;
        dungeonGenerationInfo.stairs_spawn_y = y;
        statusData.stairs_room_index = dungeonData.list_tiles[x][y].room_index;
    } else {
        if (statusData.second_spawn) {
            statusData.hidden_stairs_spawn_x = x;
            statusData.hidden_stairs_spawn_y = y;
        } else {
            dungeonGenerationInfo.hidden_stairs_spawn_x = x;
            dungeonGenerationInfo.hidden_stairs_spawn_y = y;
            dungeonGenerationInfo.hidden_stairs_type = hidden_stairs_type;
        }
    }

    if (hidden_stairs_type === HiddenStairsType.HIDDEN_STAIRS_NONE && GetFloorType() === FloorType.FLOOR_TYPE_RESCUE) {
        let room_index = dungeonData.list_tiles[x][y].room_index;
        for (let cur_x = 0; cur_x < FLOOR_MAX_X; cur_x++) {
            for (let cur_y = 0; cur_y < FLOOR_MAX_Y; cur_y++) {
                if (
                    dungeonData.list_tiles[cur_x][cur_y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                    dungeonData.list_tiles[cur_x][cur_y].room_index === room_index
                ) {
                    dungeonData.list_tiles[cur_x][cur_y].terrain_flags.f_in_monster_house = true;
                    dungeonGenerationInfo.monster_house_room = dungeonData.list_tiles[x][y].room_index;
                }
            }
        }
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SPAWN_STAIRS);
}

function ShuffleSpawnPositions(spawn_x, spawn_y) {
    for (let i = 0; i < spawn_x.length * 2; i++) {
        let a = dungeonRand.RandInt(spawn_x.length);
        let b = dungeonRand.RandInt(spawn_x.length);

        let temp_x = spawn_x[a];
        let temp_y = spawn_y[a];
        spawn_x[a] = spawn_x[b];
        spawn_y[a] = spawn_y[b];

        spawn_x[b] = temp_x;
        spawn_y[b] = temp_y;
    }
}

function SpawnNonEnemies(floor_props, is_empty_monster_house) {
    if (dungeonGenerationInfo.stairs_spawn_x === -1 || dungeonGenerationInfo.stairs_spawn_y === -1) {
        let valid_spawns_x = [], valid_spawns_y = [];

        for (let x = 0; x < FLOOR_MAX_X; x++) {
            for (let y = 0; y < FLOOR_MAX_Y; y++) {
                if (
                    dungeonData.list_tiles[x][y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                    dungeonData.list_tiles[x][y].room_index !== 0xff &&
                    !dungeonData.list_tiles[x][y].terrain_flags.f_in_kecleon_shop &&
                    !dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_monster &&
                    !dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_special_tile &&
                    !dungeonData.list_tiles[x][y].terrain_flags.f_natural_junction &&
                    !dungeonData.list_tiles[x][y].terrain_flags.f_unbreakable
                ) {
                    valid_spawns_x.push(x);
                    valid_spawns_y.push(y);
                }
            }
        }

        if (valid_spawns_x.length > 0) {
            const stairs_index = dungeonRand.RandInt(valid_spawns_x.length);
            SpawnStairs(valid_spawns_x[stairs_index], valid_spawns_y[stairs_index], HiddenStairsType.HIDDEN_STAIRS_NONE);

            if (statusData.hidden_stairs_type !== HiddenStairsType.HIDDEN_STAIRS_NONE) {
                valid_spawns_x.splice(stairs_index, 1);
                valid_spawns_y.splice(stairs_index, 1);

                if (dungeonData.floor + 1 < dungeonData.n_floors_plus_one) {
                    dungeonRand.DungeonRngSetSecondary(3);
                    const hidden_index = dungeonRand.RandInt(valid_spawns_x.length);
                    SpawnStairs(valid_spawns_x[hidden_index], valid_spawns_y[hidden_index], statusData.hidden_stairs_type);
                }
            }
        }
    }

    let valid_spawns_x = [], valid_spawns_y = [];

    for (let x = 0; x < FLOOR_MAX_X; x++) {
        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            if (
                dungeonData.list_tiles[x][y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[x][y].room_index !== 0xff &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_in_kecleon_shop &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_in_monster_house &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_natural_junction &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_unbreakable
            ) {
                valid_spawns_x.push(x);
                valid_spawns_y.push(y);
            }
        }
    }

    if (valid_spawns_x.length > 0) {
        let num_items = floor_props.item_density;
        if (num_items !== 0) {
            num_items = Math.max(dungeonRand.RandRange(num_items - 2, num_items + 2), 1);
        }

        if (dungeonData.guaranteed_item_id !== 0) {
            num_items += 1;
        }

        dungeonData.num_items = num_items + 1;

        if (num_items + 1 > 0) {
            ShuffleSpawnPositions(valid_spawns_x, valid_spawns_y);
            let cur_index = dungeonRand.RandInt(valid_spawns_x.length);
            num_items += 1;
            for (let i = 0; i < num_items; i++) {
                const pos_x = valid_spawns_x[cur_index];
                const pos_y = valid_spawns_y[cur_index];

                cur_index++;
                if (cur_index === valid_spawns_x.length) cur_index = 0;

                dungeonData.list_tiles[pos_x][pos_y].spawn_or_visibility_flags.f_item = true;
            }

            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SPAWN_ITEMS);
        }
    }

    valid_spawns_x = [];
    valid_spawns_y = [];

    for (let x = 0; x < FLOOR_MAX_X; x++) {
        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            if (dungeonData.list_tiles[x][y].terrain_flags.terrain_type === TerrainType.TERRAIN_WALL) {
                valid_spawns_x.push(x);
                valid_spawns_y.push(y);
            }
        }
    }

    if (valid_spawns_x.length > 0) {
        let num_items = floor_props.buried_item_density;

        if (num_items !== 0) {
            num_items = dungeonRand.RandRange(num_items - 2, num_items + 2);
        }

        if (num_items > 0) {
            ShuffleSpawnPositions(valid_spawns_x, valid_spawns_y);
            let cur_index = dungeonRand.RandInt(valid_spawns_x.length);
            for (let i = 0; i < num_items; i++) {
                const pos_x = valid_spawns_x[cur_index];
                const pos_y = valid_spawns_y[cur_index];

                cur_index++;
                if (cur_index === valid_spawns_x.length) cur_index = 0;

                dungeonData.list_tiles[pos_x][pos_y].spawn_or_visibility_flags.f_item = true;
            }

            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SPAWN_BURIED_ITEMS);
        }
    }

    valid_spawns_x = [];
    valid_spawns_y = [];

    if (!is_empty_monster_house) {
        for (let x = 0; x < FLOOR_MAX_X; x++) {
            for (let y = 0; y < FLOOR_MAX_Y; y++) {
                if (
                    !dungeonData.list_tiles[x][y].terrain_flags.f_in_kecleon_shop &&
                    dungeonData.list_tiles[x][y].terrain_flags.f_in_monster_house &&
                    !dungeonData.list_tiles[x][y].terrain_flags.f_natural_junction
                ) {
                    valid_spawns_x.push(x);
                    valid_spawns_y.push(y);
                }
            }
        }
    }

    if (valid_spawns_x.length > 0) {
        let num_items = Math.max(6, dungeonRand.RandRange(Math.floor((5 * valid_spawns_x.length) / 10), Math.floor((8 * valid_spawns_x.length) / 10)));

        if (num_items >= generationConstants.max_number_monster_house_item_spawns) {
            num_items = generationConstants.max_number_monster_house_item_spawns;
        }

        ShuffleSpawnPositions(valid_spawns_x, valid_spawns_y);
        let cur_index = dungeonRand.RandInt(valid_spawns_x.length);
        for (let i = 0; i < num_items; i++) {
            const pos_x = valid_spawns_x[cur_index];
            const pos_y = valid_spawns_y[cur_index];

            cur_index++;
            if (cur_index === valid_spawns_x.length) cur_index = 0;

            if (dungeonRand.RandInt(2) === 1) {
                dungeonData.list_tiles[pos_x][pos_y].spawn_or_visibility_flags.f_item = true;
            } else if (dungeonData.nonstory_flag || dungeonData.id >= generationConstants.first_dungeon_id_allow_monster_house_traps) {
                dungeonData.list_tiles[pos_x][pos_y].spawn_or_visibility_flags.f_trap = true;
            }
        }

        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SPAWN_MONSTER_HOUSE_ITEMS_TRAPS);
    }

    valid_spawns_x = [];
    valid_spawns_y = [];

    for (let x = 0; x < FLOOR_MAX_X; x++) {
        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            if (
                dungeonData.list_tiles[x][y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[x][y].room_index !== 0xff &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_in_kecleon_shop &&
                !dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_item &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_natural_junction &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_unbreakable
            ) {
                valid_spawns_x.push(x);
                valid_spawns_y.push(y);
            }
        }
    }

    if (valid_spawns_x.length > 0) {
        let num_traps = dungeonRand.RandRange(Math.floor(floor_props.trap_density / 2), floor_props.trap_density);

        if (num_traps > 0) {
            if (num_traps >= 56) num_traps = 56;

            ShuffleSpawnPositions(valid_spawns_x, valid_spawns_y);
            let cur_index = dungeonRand.RandInt(valid_spawns_x.length);
            for (let i = 0; i < num_traps; i++) {
                const pos_x = valid_spawns_x[cur_index];
                const pos_y = valid_spawns_y[cur_index];

                cur_index++;
                if (cur_index === valid_spawns_x.length) cur_index = 0;

                dungeonData.list_tiles[pos_x][pos_y].spawn_or_visibility_flags.f_trap = true;
            }

            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SPAWN_TRAPS);
        }
    }

    let is_rescue_floor = (GetFloorType() === FloorType.FLOOR_TYPE_RESCUE);

    if (dungeonGenerationInfo.player_spawn_x === -1 || dungeonGenerationInfo.player_spawn_y === -1) {
        let valid_spawns_x = [], valid_spawns_y = [];

        for (let x = 0; x < FLOOR_MAX_X; x++) {
            for (let y = 0; y < FLOOR_MAX_Y; y++) {
                if (
                    dungeonData.list_tiles[x][y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                    dungeonData.list_tiles[x][y].room_index !== 0xff &&
                    !dungeonData.list_tiles[x][y].terrain_flags.f_in_kecleon_shop &&
                    !dungeonData.list_tiles[x][y].terrain_flags.f_natural_junction &&
                    !dungeonData.list_tiles[x][y].terrain_flags.f_unbreakable &&
                    !dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_item &&
                    !dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_monster &&
                    !dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_trap
                ) {
                    if (!is_rescue_floor || !dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_stairs) {
                        valid_spawns_x.push(x);
                        valid_spawns_y.push(y);
                    }
                }
            }
        }

        if (valid_spawns_x.length > 0) {
            const spawn_index = dungeonRand.RandInt(valid_spawns_x.length);
            dungeonGenerationInfo.player_spawn_x = valid_spawns_x[spawn_index];
            dungeonGenerationInfo.player_spawn_y = valid_spawns_y[spawn_index];

            OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SPAWN_PLAYER);
        }
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_SPAWN_NON_ENEMIES);
}

function SpawnEnemies(floor_props, is_empty_monster_house) {
    let valid_spawns_x = [], valid_spawns_y = [];
    let num_enemies;

    if (floor_props.enemy_density < 1) {
        num_enemies = Math.abs(floor_props.enemy_density);
    } else {
        num_enemies = dungeonRand.RandRange(Math.floor(floor_props.enemy_density / 2), floor_props.enemy_density);
        if (num_enemies < 1) num_enemies = 1;
    }

    for (let x = 0; x < FLOOR_MAX_X; x++) {
        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            if (
                dungeonData.list_tiles[x][y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[x][y].room_index !== 0xff &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_in_kecleon_shop &&
                !dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_item &&
                !dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_stairs &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_natural_junction &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_unbreakable
            ) {
                if (dungeonGenerationInfo.player_spawn_x !== x || dungeonGenerationInfo.player_spawn_y !== y) {
                    if (!statusData.no_enemy_spawn || dungeonGenerationInfo.monster_house_room !== dungeonData.list_tiles[x][y].room_index) {
                        valid_spawns_x.push(x);
                        valid_spawns_y.push(y);
                    }
                }
            }
        }
    }

    if (valid_spawns_x.length > 0 && num_enemies + 1 > 0) {
        ShuffleSpawnPositions(valid_spawns_x, valid_spawns_y);
        num_enemies += 1;

        let cur_index = dungeonRand.RandInt(valid_spawns_x.length);

        for (let i = 0; i < num_enemies; i++) {
            const pos_x = valid_spawns_x[cur_index];
            const pos_y = valid_spawns_y[cur_index];

            cur_index++;
            if (cur_index === valid_spawns_x.length) cur_index = 0;

            dungeonData.list_tiles[pos_x][pos_y].spawn_or_visibility_flags.f_monster = true;
        }

        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SPAWN_NON_MONSTER_HOUSE_ENEMIES);
    }

    if (!dungeonGenerationInfo.force_create_monster_house) {
        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_SPAWN_ENEMIES);
        return;
    }

    valid_spawns_x = [];
    valid_spawns_y = [];

    let num_monster_house_spawn = generationConstants.max_number_monster_house_enemy_spawns;

    if (is_empty_monster_house) num_monster_house_spawn = 3;
    if (dungeonGenerationInfo.force_create_monster_house) {
        num_monster_house_spawn = Math.floor((num_monster_house_spawn * 3) / 2);
    }

    for (let x = 0; x < FLOOR_MAX_X; x++) {
        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            if (
                dungeonData.list_tiles[x][y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL &&
                dungeonData.list_tiles[x][y].room_index !== 0xff &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_in_kecleon_shop &&
                !dungeonData.list_tiles[x][y].terrain_flags.f_unbreakable &&
                dungeonData.list_tiles[x][y].terrain_flags.f_in_monster_house
            ) {
                if (dungeonGenerationInfo.player_spawn_x !== x || dungeonGenerationInfo.player_spawn_y !== y) {
                    valid_spawns_x.push(x);
                    valid_spawns_y.push(y);
                }
            }
        }
    }

    if (valid_spawns_x.length > 0) {
        num_enemies = Math.max(1, dungeonRand.RandRange(Math.floor((7 * valid_spawns_x.length) / 10), Math.floor((8 * valid_spawns_x.length) / 10)));

        if (num_enemies >= num_monster_house_spawn) num_enemies = num_monster_house_spawn;

        ShuffleSpawnPositions(valid_spawns_x, valid_spawns_y);
        let cur_index = dungeonRand.RandInt(valid_spawns_x.length);

        for (let i = 0; i < num_enemies; i++) {
            const pos_x = valid_spawns_x[cur_index];
            const pos_y = valid_spawns_y[cur_index];

            cur_index++;
            if (cur_index === valid_spawns_x.length) cur_index = 0;

            dungeonData.list_tiles[pos_x][pos_y].spawn_or_visibility_flags.f_monster = true;
        }

        OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MINOR, MinorGenerationType.GEN_TYPE_SPAWN_MONSTER_HOUSE_EXTRA_ENEMIES);
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_MAJOR, MajorGenerationType.GEN_TYPE_SPAWN_ENEMIES);
}

function ResolveInvalidSpawns() {
    for (let x = 0; x < FLOOR_MAX_X; x++) {
        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            if (dungeonData.list_tiles[x][y].terrain_flags.terrain_type !== TerrainType.TERRAIN_NORMAL) {
                if (dungeonData.list_tiles[x][y].terrain_flags.f_impassable_wall && dungeonData.list_tiles[x][y].terrain_flags.f_unbreakable) {
                    dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_item = false;
                }
                dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_trap = false;
            }

            if (dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_stairs) {
                dungeonData.list_tiles[x][y].terrain_flags.f_stairs = true;
                dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_trap = false;
            }

            if (dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_item) {
                dungeonData.list_tiles[x][y].spawn_or_visibility_flags.f_trap = false;
            }
        }
    }
}

function StairsAlwaysReachable(x_stairs, y_stairs, mark_unreachable) {
    let test = new Array(FLOOR_MAX_X);

    for (let x = 0; x < FLOOR_MAX_X; x++) {
        test[x] = new Array(FLOOR_MAX_Y);

        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            test[x][y] = new StairsReachableFlags();

            if (mark_unreachable) {
                dungeonData.list_tiles[x][y].terrain_flags.f_unreachable_from_stairs = false;
            }

            if (dungeonData.list_tiles[x][y].terrain_flags.terrain_type !== TerrainType.TERRAIN_NORMAL) {
                if (!dungeonData.list_tiles[x][y].terrain_flags.f_corner_cuttable) {
                    test[x][y].f_cannot_corner_cut = true;
                }
            }

            if (dungeonData.list_tiles[x][y].terrain_flags.terrain_type === TerrainType.TERRAIN_SECONDARY) {
                if (!dungeonData.list_tiles[x][y].terrain_flags.f_corner_cuttable) {
                    test[x][y].f_secondary_terrain_cannot_corner_cut = true;
                }
            }
        }
    }

    test[x_stairs][y_stairs].f_starting_point = true;
    test[x_stairs][y_stairs].f_in_visit_queue = true;

    if (dungeonGenerationInfo.stairs_spawn_x !== x_stairs && dungeonGenerationInfo.stairs_spawn_y !== y_stairs) {
        return false;
    }

    statusData.num_tiles_reachable_from_stairs = 0;
    let count = 0;
    let checked = 1;

    while (checked !== 0) {
        count += 1;
        checked = 0;

        for (let x = 0; x < FLOOR_MAX_X; x++) {
            for (let y = 0; y < FLOOR_MAX_Y; y++) {
                if (!test[x][y].f_visited && test[x][y].f_in_visit_queue) {
                    test[x][y].f_in_visit_queue = false;
                    test[x][y].f_visited = true;
                    checked += 1;

                    if (x > 0 && !test[x - 1][y].f_cannot_corner_cut && !test[x - 1][y].f_secondary_terrain_cannot_corner_cut && !test[x - 1][y].f_visited) {
                        test[x - 1][y].f_in_visit_queue = true;
                    }

                    if (y > 0 && !test[x][y - 1].f_cannot_corner_cut && !test[x][y - 1].f_secondary_terrain_cannot_corner_cut && !test[x][y - 1].f_visited) {
                        test[x][y - 1].f_in_visit_queue = true;
                    }

                    if (
                        x < FLOOR_MAX_X - 1 &&
                        !test[x + 1][y].f_cannot_corner_cut &&
                        !test[x + 1][y].f_secondary_terrain_cannot_corner_cut &&
                        !test[x + 1][y].f_visited
                    ) {
                        test[x + 1][y].f_in_visit_queue = true;
                    }

                    if (
                        y < FLOOR_MAX_Y - 1 &&
                        !test[x][y + 1].f_cannot_corner_cut &&
                        !test[x][y + 1].f_secondary_terrain_cannot_corner_cut &&
                        !test[x][y + 1].f_visited
                    ) {
                        test[x][y + 1].f_in_visit_queue = true;
                    }

                    if (
                        x > 0 &&
                        y > 0 &&
                        !test[x - 1][y - 1].f_cannot_corner_cut &&
                        !test[x - 1][y - 1].f_secondary_terrain_cannot_corner_cut &&
                        !test[x - 1][y - 1].f_unknown_field_0x2 &&
                        !test[x - 1][y - 1].f_visited &&
                        !test[x][y - 1].f_cannot_corner_cut &&
                        !test[x - 1][y].f_cannot_corner_cut
                    ) {
                        test[x - 1][y - 1].f_in_visit_queue = true;
                    }

                    if (
                        x < FLOOR_MAX_X - 1 &&
                        y > 0 &&
                        !test[x + 1][y - 1].f_cannot_corner_cut &&
                        !test[x + 1][y - 1].f_secondary_terrain_cannot_corner_cut &&
                        !test[x + 1][y - 1].f_unknown_field_0x2 &&
                        !test[x + 1][y - 1].f_visited &&
                        !test[x][y - 1].f_cannot_corner_cut &&
                        !test[x + 1][y].f_cannot_corner_cut
                    ) {
                        test[x + 1][y - 1].f_in_visit_queue = true;
                    }

                    if (
                        x > 0 &&
                        y < FLOOR_MAX_Y - 1 &&
                        !test[x - 1][y + 1].f_cannot_corner_cut &&
                        !test[x - 1][y + 1].f_secondary_terrain_cannot_corner_cut &&
                        !test[x - 1][y + 1].f_unknown_field_0x2 &&
                        !test[x - 1][y + 1].f_visited &&
                        !test[x][y + 1].f_cannot_corner_cut &&
                        !test[x - 1][y].f_cannot_corner_cut
                    ) {
                        test[x - 1][y + 1].f_in_visit_queue = true;
                    }

                    if (
                        x < FLOOR_MAX_X - 1 &&
                        y < FLOOR_MAX_Y - 1 &&
                        !test[x + 1][y + 1].f_cannot_corner_cut &&
                        !test[x + 1][y + 1].f_secondary_terrain_cannot_corner_cut &&
                        !test[x + 1][y + 1].f_unknown_field_0x2 &&
                        !test[x + 1][y + 1].f_visited &&
                        !test[x][y + 1].f_cannot_corner_cut &&
                        !test[x + 1][y].f_cannot_corner_cut
                    ) {
                        test[x + 1][y + 1].f_in_visit_queue = true;
                    }
                }
            }
        }
    }

    statusData.num_tiles_reachable_from_stairs = count;

    for (let x = 0; x < FLOOR_MAX_X; x++) {
        for (let y = 0; y < FLOOR_MAX_Y; y++) {
            if (
                !test[x][y].f_cannot_corner_cut &&
                !test[x][y].f_secondary_terrain_cannot_corner_cut &&
                !test[x][y].f_unknown_field_0x2 &&
                !test[x][y].f_visited
            ) {
                if (mark_unreachable) {
                    dungeonData.list_tiles[x][y].terrain_flags.f_unreachable_from_stairs = true;
                } else {
                    if (!dungeonData.list_tiles[x][y].terrain_flags.f_unbreakable) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

function GenerateFloor(floor_props) {
    statusData.stairs_room_index = 0xff;
    statusData.floor_size = FloorSize.FLOOR_SIZE_LARGE;
    dungeonGenerationInfo.fixed_room_id = floor_props.fixed_room_id;
    statusData.monster_house_chance = floor_props.monster_house_chance;
    statusData.kecleon_shop_chance = floor_props.kecleon_shop_chance;
    statusData.secondary_structures_budget = floor_props.secondary_structures_budget;
    statusData.hidden_stairs_type = floor_props.hidden_stairs_type;

    let spawn_attempts;
    for (spawn_attempts = 0; spawn_attempts < 10; spawn_attempts++) {
        dungeonGenerationInfo.player_spawn_x = -1;
        dungeonGenerationInfo.player_spawn_y = -1;
        dungeonGenerationInfo.stairs_spawn_x = -1;
        dungeonGenerationInfo.stairs_spawn_y = -1;
        dungeonGenerationInfo.hidden_stairs_spawn_x = -1;
        dungeonGenerationInfo.hidden_stairs_spawn_y = -1;

        let fixed_room = false;
        let secondary_gen = false;

        let gen_attempts;
        for (gen_attempts = 0; gen_attempts < 10; gen_attempts++) {
            if (fixed_room) {
                if (dungeonGenerationInfo.fixed_room_id > 0 && dungeonGenerationInfo.fixed_room_id < 0xa5) break;
                fixed_room = false;
            }

            dungeonGenerationInfo.floor_generation_attempts = gen_attempts;

            if (gen_attempts > 0) {
                statusData.secondary_structures_budget = 0;
            }

            statusData.is_invalid = false;
            statusData.kecleon_shop_middle_x = -1;
            statusData.kecleon_shop_middle_y = -1;

            ResetFloor();

            dungeonGenerationInfo.player_spawn_x = -1;
            dungeonGenerationInfo.player_spawn_y = -1;

            let grid_size_x = 2;
            let grid_size_y = 2;

            let attempts = 32;
            while (attempts > 0) {
                let max_x, max_y;

                if (floor_props.layout === FloorLayout.LAYOUT_LARGE_0x8) {
                    max_x = 5;
                    max_y = 4;
                } else {
                    max_x = 9;
                    max_y = 8;
                }

                grid_size_x = dungeonRand.RandRange(2, max_x);
                grid_size_y = dungeonRand.RandRange(2, max_y);

                if (grid_size_x <= 6 && grid_size_y <= 4) break;
                attempts--;
            }

            if (attempts === 0) {
                grid_size_x = 4;
                grid_size_y = 4;
            }

            if (Math.floor(FLOOR_MAX_X / grid_size_x) < 8) grid_size_x = 1;
            if (Math.floor(FLOOR_MAX_Y / grid_size_y) < 8) grid_size_y = 1;

            statusData.layout = floor_props.layout;

            switch (floor_props.layout) {
                case FloorLayout.LAYOUT_LARGE:
                case FloorLayout.LAYOUT_LARGE_0x8:
                default:
                    GenerateStandardFloor(grid_size_x, grid_size_y, floor_props);
                    secondary_gen = true;
                    break;

                case FloorLayout.LAYOUT_SMALL:
                    grid_size_x = 4;
                    grid_size_y = dungeonRand.RandInt(2) + 2;
                    statusData.floor_size = FloorSize.FLOOR_SIZE_SMALL;
                    GenerateStandardFloor(grid_size_x, grid_size_y, floor_props);
                    secondary_gen = true;
                    break;

                case FloorLayout.LAYOUT_ONE_ROOM_MONSTER_HOUSE:
                    GenerateOneRoomMonsterHouseFloor();
                    dungeonGenerationInfo.force_create_monster_house = true;
                    break;

                case FloorLayout.LAYOUT_OUTER_RING:
                    GenerateOuterRingFloor(floor_props);
                    secondary_gen = true;
                    break;

                case FloorLayout.LAYOUT_CROSSROADS:
                    GenerateCrossroadsFloor(floor_props);
                    secondary_gen = true;
                    break;

                case FloorLayout.LAYOUT_TWO_ROOMS_WITH_MONSTER_HOUSE:
                    GenerateTwoRoomsWithMonsterHouseFloor();
                    dungeonGenerationInfo.force_create_monster_house = true;
                    break;

                case FloorLayout.LAYOUT_LINE:
                    GenerateLineFloor(floor_props);
                    secondary_gen = true;
                    break;

                case FloorLayout.LAYOUT_CROSS:
                    GenerateCrossFloor(floor_props);
                    break;

                case FloorLayout.LAYOUT_BEETLE:
                    GenerateBeetleFloor(floor_props);
                    break;

                case FloorLayout.LAYOUT_OUTER_ROOMS:
                    GenerateOuterRoomsFloor(grid_size_x, grid_size_y, floor_props);
                    secondary_gen = true;
                    break;

                case FloorLayout.LAYOUT_MEDIUM:
                    grid_size_x = 4;
                    grid_size_y = dungeonRand.RandInt(2) + 2;
                    statusData.floor_size = FloorSize.FLOOR_SIZE_MEDIUM;
                    GenerateStandardFloor(grid_size_x, grid_size_y, floor_props);
                    secondary_gen = true;
                    break;
            }

            ResetInnerBoundaryTileRows();
            EnsureImpassableTilesAreWalls();

            if (!statusData.is_invalid) {
                let room = new Array(64).fill(false);
                let room_tiles = 0;

                for (let x = 0; x < FLOOR_MAX_X; x++) {
                    for (let y = 0; y < FLOOR_MAX_Y; y++) {
                        if (dungeonData.list_tiles[x][y].terrain_flags.terrain_type === TerrainType.TERRAIN_NORMAL) {
                            if (dungeonData.list_tiles[x][y].room_index < 0xf0) {
                                room_tiles++;
                                if (dungeonData.list_tiles[x][y].room_index < 0x40) {
                                    room[dungeonData.list_tiles[x][y].room_index] = true;
                                }
                            }
                        }
                    }
                }

                let num_rooms = room.filter(r => r).length;
                if (num_rooms >= 2 && room_tiles >= 20) break;
            }
        }

        if (gen_attempts === 10) {
            statusData.kecleon_shop_middle_x = -1;
            statusData.kecleon_shop_middle_y = -1;
            GenerateOneRoomMonsterHouseFloor();
            dungeonGenerationInfo.force_create_monster_house = true;
        }

        FinalizeJunctions();
        if (secondary_gen) {
            GenerateSecondaryTerrainFormations(true, floor_props);
        }

        let is_empty_monster_house = dungeonRand.RandInt(100) < floor_props.itemless_monster_house_chance;

        SpawnNonEnemies(floor_props, is_empty_monster_house);
        SpawnEnemies(floor_props, is_empty_monster_house);
        ResolveInvalidSpawns();

        if (dungeonGenerationInfo.player_spawn_x !== -1 && dungeonGenerationInfo.player_spawn_y !== -1) {
            if (GetFloorType() === FloorType.FLOOR_TYPE_FIXED) break;

            if (dungeonGenerationInfo.stairs_spawn_x !== -1 && dungeonGenerationInfo.stairs_spawn_y !== -1) {
                if (StairsAlwaysReachable(dungeonGenerationInfo.stairs_spawn_x, dungeonGenerationInfo.stairs_spawn_y, false)) break;
            }
        }

        if (spawn_attempts + 1 === 10) {
            statusData.kecleon_shop_middle_x = -1;
            statusData.kecleon_shop_middle_y = -1;

            ResetFloor();
            GenerateOneRoomMonsterHouseFloor();
            dungeonGenerationInfo.force_create_monster_house = true;

            FinalizeJunctions();
            SpawnNonEnemies(floor_props, false);
            SpawnEnemies(floor_props, false);
            ResolveInvalidSpawns();
        }
    }

    OnCompleteGenerationStep(GenerationStepLevel.GEN_STEP_COMPLETE, MajorGenerationType.GEN_TYPE_GENERATE_FLOOR);
    return dungeonData.list_tiles;
}

function OnCompleteGenerationStep(generation_step_level, generation_type) {
    if (generationCallbackFrequency >= generation_step_level && typeof dungeonGenerationCallback === 'function') {
        dungeonGenerationCallback(generation_step_level, generation_type, dungeonData, dungeonGenerationInfo, statusData, grid_cell_start_x, grid_cell_start_y);
    }
}

export function GenerateDungeon(
    floor_props,
    dungeon_data,
    generation_constants,
    advanced_generation_settings,
    dungeon_generation_callback,
    generation_callback_frequency
) {
    dungeonData = JSON.parse(JSON.stringify(dungeon_data));

    dungeonGenerationInfo = new DungeonGenerationInfo();
    statusData = new FloorGenerationStatus();
    dungeonRand = new DungeonRandom();

    if (typeof generation_constants !== 'undefined') {
        generationConstants = generation_constants;
    } else {
        generationConstants = new GenerationConstants();
    }

    if (typeof advanced_generation_settings !== 'undefined') {
        advancedGenerationSettings = advanced_generation_settings;
    } else {
        advancedGenerationSettings = new AdvancedGenerationSettings();
    }

    if (typeof dungeon_generation_callback !== 'undefined') {
        dungeonGenerationCallback = dungeon_generation_callback;
    }

    if (typeof generation_callback_frequency !== 'undefined') {
        generationCallbackFrequency = generation_callback_frequency;
    } else {
        generationCallbackFrequency = GenerationStepLevel.GEN_STEP_COMPLETE;
    }

    return GenerateFloor(floor_props);
}
