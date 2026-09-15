const LCG_MULTIPLIER = 0x5d588b65;
const ADD_T1 = 0x269ec3;

export class DungeonRandom {
    use_secondary = false;
    seq_num_primary = 0;
    preseed = 0;
    last_value_primary = 0;
    idx_secondary = 0;
    seeds_t1 = Array(5);

    RandInt(n) {
        return Math.floor(Math.random() * n);
    }

    RandRange(x, y) {
        if (x < y) {
            return Math.floor(Math.random() * (y - x)) + x;
        } else {
            return Math.floor(Math.random() * (x - y)) + y;
        }
    }

    DungeonRngSetSecondary(secondary_index) {
        this.use_secondary = true;
        this.idx_secondary = secondary_index;
    }
}
