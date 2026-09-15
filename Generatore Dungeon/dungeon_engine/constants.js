import { SecondaryTerrainType } from './enums.js';

export const LIST_DIRECTIONS = [
    // Down
    0, 0, 1, 1,
// Down-Right
1, 1, 1, 1,
// Right
1, 1, 0, 0,
// Up-Right
1, 1, -1, -1,
// Up
0, 0, -1, -1,
// Up-Left
-1, -1, -1, -1,
// Left
-1, -1, 0, 0,
// Down-Left
-1, -1, 1, 1
];

export const CORNER_CARDINAL_NEIGHBOR_EXPECT_OPEN = [
    // Top-Left Corner
    true, false, true, false, false, false, false, false,
// Top-Right Corner
true, false, false, false, false, false, true, false,
// Bottom-Right Corner
false, false, false, false, true, false, true, false,
// Bottom-Left Corner
false, false, true, false, true, false, false, false
];

export const SECONDARY_TERRAIN_TYPES = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 0,
0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
0, 2, 0, 0, 1, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0,
0, 0
];
