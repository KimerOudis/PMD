import { FloorLayout, DungeonObjectiveType, FloorSize, HiddenStairsType } from './enums.js';
import { RoomFlags, TerrainFlags, SpawnFlags, MissionDestinationInfo } from './minor_types.js';

export class GridCell {
    start_x = 0;
    start_y = 0;
    end_x = 0;
    end_y = 0;
    is_invalid = false;
    has_secondary_structure = false;
    is_room = false;
    is_connected = false;
    is_kecleon_shop = false;
    is_monster_house = false;
    is_maze_room = false;
    has_been_merged = false;
    is_merged = false;
    connected_to_top = false;
    connected_to_bottom = false;
    connected_to_left = false;
    connected_to_right = false;
    should_connect_to_top = false;
    should_connect_to_bottom = false;
    should_connect_to_left = false;
    should_connect_to_right = false;
    flag_imperfect = false;
    flag_secondary_structure = false;
}

export class Tile {
    terrain_flags = new TerrainFlags();
    spawn_or_visibility_flags = new SpawnFlags();
    texture_id = 0;
    room_index = 0xff;
}

export class FloorProperties {
    layout = FloorLayout.LAYOUT_SMALL;
    room_density = 4;
    floor_connectivity = 15;
    enemy_density = 0;
    kecleon_shop_chance = 0;
    monster_house_chance = 0;
    maze_room_chance = 0;
    allow_dead_ends = false;
    secondary_structures_budget = 0;
    room_flags = new RoomFlags();
    item_density = 0;
    trap_density = 0;
    floor_number = 0;
    fixed_room_id = 0;
    num_extra_hallways = 0;
    buried_item_density = 0;
    secondary_terrain_density = 10;
    itemless_monster_house_chance = 0;
    hidden_stairs_type = HiddenStairsType.HIDDEN_STAIRS_NONE;
    hidden_stairs_spawn_chance = 0;
}

export class FloorGenerationStatus {
    second_spawn = false;
    has_monster_house = false;
    stairs_room_index = 0;
    has_kecleon_shop = false;
    floor_size = FloorSize.FLOOR_SIZE_LARGE;
    has_maze = false;
    no_enemy_spawn = false;
    kecleon_shop_chance = 100;
    monster_house_chance = 0;
    num_rooms = 0;
    secondary_structures_budget = 0;
    hidden_stairs_spawn_x = 0;
    hidden_stairs_spawn_y = 0;
    kecleon_shop_middle_x = 0;
    kecleon_shop_middle_y = 0;
    num_tiles_reachable_from_stairs = 0;
    layout = FloorLayout.LAYOUT_LARGE;
    hidden_stairs_type = HiddenStairsType.HIDDEN_STAIRS_NONE;
    kecleon_shop_min_x = 0;
    kecleon_shop_min_y = 0;
    kecleon_shop_max_x = 0;
    kecleon_shop_max_y = 0;
}

export class DungeonGenerationInfo {
    force_create_monster_house = false;
    monster_house_room = -1;
    hidden_stairs_type = HiddenStairsType.HIDDEN_STAIRS_NONE;
    fixed_room_id = 0;
    floor_generation_attempts = 0;
    player_spawn_x = -1;
    player_spawn_y = -1;
    stairs_spawn_x = -1;
    stairs_spawn_y = -1;
    hidden_stairs_spawn_x = -1;
    hidden_stairs_spawn_y = -1;
}

export class Dungeon {
    id = 1;
    floor = 1;
    rescue_floor = 1;
    nonstory_flag = true;
    mission_destination = new MissionDestinationInfo();
    dungeon_objective = DungeonObjectiveType.OBJECTIVE_NORMAL;
    kecleon_shop_min_x = 0;
    kecleon_shop_min_y = 0;
    kecleon_shop_max_x = 0;
    kecleon_shop_max_y = 0;
    num_items = 0;
    guaranteed_item_id = 0;
    n_floors_plus_one = 4;
    list_tiles = [];
    fixed_room_tiles = [];
    active_traps = new Array(64);
}
