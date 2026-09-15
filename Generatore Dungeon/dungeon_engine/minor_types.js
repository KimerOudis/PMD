import { TerrainType, MissionType } from './enums.js';

export class RoomFlags {
    f_secondary_terrain_generation = false;
    f_room_imperfections = false;
}

export class TerrainFlags {
    terrain_type = TerrainType.TERRAIN_WALL;
    f_corner_cuttable = false;
    f_natural_junction = false;
    f_impassable_wall = false;
    f_in_kecleon_shop = false;
    f_in_monster_house = false;
    f_unbreakable = false;
    f_stairs = false;
    f_unreachable_from_stairs = false;
}

export class SpawnFlags {
    f_stairs = false;
    f_item = false;
    f_trap = false;
    f_monster = false;
    f_special_tile = false;
}

export class MissionDestinationInfo {
    is_destination_floor = false;
    mission_type = MissionType.MISSION_RESCUE_CLIENT;
    mission_subtype = 0;
}

export class StairsReachableFlags {
    f_cannot_corner_cut = false;
    f_secondary_terrain_cannot_corner_cut = false;
    f_unknown_field_0x2 = false;
    f_starting_point = false;
    f_in_visit_queue = false;
    f_visited = false;
}
