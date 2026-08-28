const datiCSV = `
,[Name],[Type],[Category],[Power],[PP],Conditions,Other Effects,[Targets],[LEVEL]
,Leech Life,Bug,Physical,1,20,,User heals for half the damage taken by the target,Foe in front,★
,Bite,Dark,Physical,2,20,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★
,Dual Chop,Dragon,Physical,1,20,,Move hits twice. The second attack can be targeted at an adjacent foe. Attack Modifier is halved for each hit.,Foe(s) in front,★
,Dragon Tail,Dragon,Physical,2,20,,"Target is pushed 2 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe in front,★
,Spark,Electric,Physical,2,20,Paralysed,,Foe in front,★
,Spirit Break,Fairy,Physical,2,20,Sp.Atk Down 2,,Foe in front,★
,Mach Punch,Fighting,Physical,1,20,,Has Priority,Foe in front,★
,Flame Charge,Fire,Physical,1,20,,"Roll a d6 after damage has been dealt. On a 5-6, Spe Up 2.",Foe in front,★
,Peck,Flying,Physical,2,20,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★
,Dual Wingbeat,Flying,Physical,1,20,,Move hits twice. The second attack can be targeted at an adjacent foe. Attack Modifier is halved for each hit.,Foe(s) in front,★
,Lick,Ghost,Physical,2,20,Paralysed,,Foe in front,★
,Leafage,Grass,Physical,1,20,,Has Priority.,Foe in front,★
,Bulldoze,Ground,Physical,2,20,Spe Down 2,,Foe in front,★
,Ice Shard,Ice,Physical,1,20,,Has Priority,Foe in front,★
,Wrap,Normal,Physical,1,20,Trapped,"If the target is successfully Trapped, the User is also Restrained.",Foe in front,★
,Tackle,Normal,Physical,2,20,,"Pushes the target up to 2 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe in front,★
,Quick Attack,Normal,Physical,1,20,,Has Priority,Foe in front,★
,Poison Sting,Poison,Physical,2,20,Poisoned,,Foe in front,★
,Heart Stamp,Psychic,Physical,2,20,Flinch,,Foe in front,★
,Rock Tomb,Rock,Physical,2,20,Spe Down 2,,Foe in front,★
,Bullet Punch,Steel,Physical,1,20,,Has Priority,Foe in front,★
,Razor Shell,Water,Physical,2,20,Def Down 2,,Foe in front,★
,,,,,,,,,
,String Shot,Bug,Physical Status,0,15,Spe Down 2,,Foe up to 2-tiles ahead,★
,Taunt,Dark,Physical Status,0,15,Taunted,Uses Influence vs Intutition. The target cannot use Status Moves for three turns.,Foe up to 2-tiles ahead,★
,Roost,Flying,Physical Status,1,15,,Heal for number rolled. User loses Flying type and/or Levitate status for 1 round.,Self,★
,Mirror Move,Flying,Physical Status,0,15,,User uses the same move as the target's last used move this turn.,Self,★
,Ingrain,Grass,Physical Status,2,15,,Heal for number rolled. User is Restrained until the end of their next turn.,Self,★
,Mud Sport,Ground,Physical Status,0,15,,Electric type moves do half damage for 5 turns.,Room,★
,Spikes,Ground,Physical Status,1,15,,The user places spikes on 3 tiles in 2-tile radius that damages if the Pokemon enters the same Tile. Spikes can be stacked up to 3 times. Flying Pokemon and those that Levitate are unaffected.,Special,★
,Assist,Normal,Physical Status,---,15,,The user performs the same Move as an Ally that is up to 2 tiles away's last move.,Self,★
,Block,Normal,Physical Status,0,15,Restrained,,Foe in front,★
,Disable,Normal,Physical Status,0,15,,The target cannot use the last move they used again for 3 rounds.,Foe in front,★
,Defence Curl,Normal,Physical Status,0,15,Def Up 2,Rollout and Ice Ball have their Move Power increased by 1 if used next turn.,Self,★
,Howl,Normal,Physical Status,0,15,Atk Up 2,,Self,★
,Leer,Normal,Physical Status,0,15,Def Down 2,,Foe in front,★
,Growl,Normal,Physical Status,0,15,Atk Down 2,,Foes in Room,★
,Stealth Rock,Rock,Physical Status,1,15,,The user places rocks on 3 tiles in a 2-tile radius that damages if the Pokemon occupies the same tile. Can deal supereffective/not very effective damage.,Special,★
,Automatize,Steel,Physical Status,0,15,Spe Up 2,,Self,★
,Withdraw,Water,Physical Status,0,15,Def Up 2,,Self,★
,,,,,,,,,
,Struggle Bug,Bug,Special,1,20,Sp.Atk Down 2,,Foe up to 2 tiles ahead,★
,Snarl,Dark,Special,1,20,Sp.Atk Down 2,,Foe up to 2 tiles ahead,★
,Twister,Dragon,Special,1,20,Flinch,,Foe up to 2 tiles ahead,★
,Thunder Shock,Electric,Special,1,20,Paralysed,,Foe up to 2 tiles ahead,★
,Draining Kiss,Fairy,Special,1,20,,User heals for half the damage taken by the target,Foe up to 2 tiles ahead,★
,Vacuum Wave,Fighting,Special,1,20,,Has Priority,Foe up to 2 tiles ahead,★
,Ember,Fire,Special,1,20,Burned,,Foe up to 2 tiles ahead,★
,Gust,Flying,Special,1,20,Confused,,Foe up to 2 tiles ahead,★
,Astonish,Ghost,Special,1,20,Flinch,,Foe up to 2 tiles ahead,★
,Absorb,Grass,Special,1,20,,User heals for half the damage taken by the target,Foe up to 2 tiles ahead,★
,Mud-Slap,Ground,Special,1,20,Blinded,,Foe up to 2 tiles ahead,★
,Powder Snow,Ice,Special,1,20,Frozen,,Foe up to 2 tiles ahead,★
,Round,Normal,Special,1,20,,"If another ally has used Round, increase move power by 1",Foe up to 2 tiles ahead,★
,Acid,Poison,Special,1,20,Poisoned,,Foe up to 2 tiles ahead,★
,Confusion,Psychic,Special,1,20,Confused,Uses Decieve vs Intuition,Foe up to 2 tiles ahead,★
,Power Gem,Rock,Special,1,20,Spe Down 2,,Foe up to 2 tiles ahead,★
,Mirror Shot,Steel,Special,1,20,Blinded,,Foe up to 2 tiles ahead,★
,Bubble,Water,Special,1,20,Spe Down 2,,Foe up to 2 tiles ahead,★
,,,,,,,,,
,Embargo,Dark,Special Status,0,15,,Prevents Item Use for 3 rounds.,Foes in front,★
,Torment,Dark,Special Status,0,15,Taunted,The target must use a different move each turn. Uses Influence vs Intuition,Foe up to 2 tiles ahead,★
,Thunder Wave,Electric,Special Status,0,15,Paralysed,,Foe in front,★
,Charge,Electric,Special Status,0,15,Sp. Def Up 2,Next Electric move has its Move Power increased by 1.,Self,★
,Baby-Doll Eyes,Fairy,Special Status,0,15,Atk Down 2,Has Priority. Uses Influence vs Intutition,Foe up to 2 tiles ahead,★
,Sweet Kiss,Fairy,Special Status,0,15,Confused,Uses Decieve vs Awareness,Foe in front,★
,Will-O-Wisp,Fire,Special Status,0,15,Burned,,Foe in front,★
,Grudge,Ghost,Special Status,0,15,,User gains the Grudge condition. The next Pokemon to attack them loses all PP of the last move they used.,Self,★
,Leech Seed,Grass,Special Status,0,15,,"Target takes 1d6 damage at the end of their turn, and you heal for the amount rolled.",Foe in front,★
,Mist,Ice,Special Status,0,15,,The user and its allies cannot have stats lowered for 5 turns.,Allies in Room,★
,Roar,Normal,Special Status,0,15,,Pushes target up to your Influence modifier in tiles. Target takes 1d6 damage if they collide with a Pokemon or wall.,Foe in front,★
,Supersonic,Normal,Special Status,0,15,Confused,,Foe in front,★
,Yawn,Normal,Special Status,0,15,Yawning,,Foe in front,★
,Smokescreen,Normal,Special Status,0,15,Blinded,,Foe in front,★
,Poison Powder,Poison,Special Status,0,15,Poisoned,,Foe in front,★
,Teleport,Psychic,Special Status,0,15,,"User teleports anywhere in the room, or returns to an adjacent Tile of an Ally if they are far off from their Team.",Self,★
,Hypnosis,Psychic,Special Status,0,15,Asleep,,Foe in front,★
,Water Sport,Water,Special Status,0,15,,Fire type moves deal half damage for 5 turns.,Room,★
,,,,,,,,,
,,,,,,,,,
,[Name],[Type],[Category],[Power],[PP],Conditions,Other Effects,[Targets],[LEVEL]
,Pounce,Bug,Physical,2,20,Spe Down 2,,Foe up to 2 tiles ahead,★★
,Bug Bite,Bug,Physical,2,20,,Eats targets held Berry,Foe in front,★★
,U-Turn,Bug,Physical,3,20,,User switches place with an ally within 2 tiles.,Foe in front,★★
,Pursuit,Dark,Physical,2,20,,"When this Move is used as an Opportunity Strike, its damage is doubled instead of halved.",Foe in front,★★
,Sucker Punch,Dark,Physical,2,20,,Has Priority.,Foe in front,★★
,Beat Up,Dark,Physical,1,15,,Move power increases by 1 for every ally within a 1-tile range of the target.,Foe in front,★★
,Knock Off,Dark,Physical,2,20,,Removes opponent's held item.,Foe in front,★★
,Night Slash,Dark,Physical,2,20,,Scores a Critical Hit on a 5-6.,Foe in front,★★
,Dragon Claw,Dragon,Physical,2,20,,Scores a Critical Hit on a 5-6.,Foe in front,★★
,Thunder Fang,Electric,Physical,3,20,Paralyzed,,Foe in front,★★
,Volt Switch,Electric,Physical,2,20,,User switches place with a nearby ally.,Foe in front,★★
,Play Rough,Fairy,Physical,3,20,Atk Down 2,,Foe in front,★★
,Low Kick,Fighting,Physical,---,20,,"Power varies based on size. Power is 1d6 to Tiny, 2d6 to Small and Medium, 3d6 to Large, and 4d6 to Huge",Foe in front,★★
,Rock Smash,Fighting,Physical,2,20,Def Down 2,Breaks Walls,Foe in front,★★
,Power-Up Punch,Fighting,Physical,2,15,,"Roll a d6 after damage has been dealt. On a 5-6, Atk Up 2.",Foe in front,★★
,Rolling Kick,Fighting,Physical,3,20,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★
,Fire Fang,Fire,Physical,3,20,Burned,,Foe in front,★★
,Fire Lash,Fire,Physical,2,15,,Pulls the target one tile toward the user.,Foe up to 2 tiles ahead,★★
,Air Cutter,Flying,Physical,2,20,,Scores a Critical Hit on a 5-6.,Foe in front,★★
,Shadow Sneak,Ghost,Physical,2,20,,Has Priority,Foe in front,★★
,Razor Leaf,Grass,Physical,2,20,,Scores a Critical Hit on a 5-6.,Foe in front,★★
,Needle Arm,Grass,Physical,3,20,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★
,Vine Whip,Grass,Physical,2,20,,Pulls the target one tile toward the user.,Foe up to 2 tiles ahead,★★
,Stomping Tantrum,Ground,Physical,1,15,,Increase move power by 1 if the user did not score a Critical Hit on their previous Move.,Foes within 1-tile range,★★
,Ice Fang,Ice,Physical,3,20,Frozen,,Foe in front,★★
,Avalanche,Ice,Physical,2,15,,Increase move power by 1 if the user went last.,Foes within 1-tile range,★★
,Pay Day,Normal,Physical,3,15,,"If target is defeated, and has been hit by this move atleast once, they drop 50-100 Poke.",Foe in front,★★
,Headbutt,Normal,Physical,3,20,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★
,Rapid Spin,Normal,Physical,1,15,Spe Up 2,Removes traps and hazards in the room.,Foes within 1-tile range,★★
,Dizzy Punch,Normal,Physical,3,20,Confused,,Foe in front,★★
,Poison Fang,Poison,Physical,3,15,Badly Poisoned,,Foe in front,★★
,Psyshield Bash,Psychic,Physical,2,10,,"Roll a d6 after damage has been dealt. On a 5-6, Def Up 2.",Foe in front,★★
,Rock Throw,Rock,Physical,3,15,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★
,Smack Down,Rock,Physical,3,15,,Target does not gain any benefit from Flying or Levitate for 1 round.,Foe in front,★★
,Salt Cure,Rock,Physical,2,10,,Deals 1d6 every turn. The target can make a Physical Status Check at the end of each of its turns to end the condition.,Foe in front,★★
,Magnet Bomb,Steel,Physical,2,15,Restrained,,Foe in front,★★
,Metal Claw,Steel,Physical,2,15,,"Roll a d6 after damage has been dealt. On a 5-6, Atk Up 2.",Foe in front,★★
,Clamp,Water,Physical,1,15,Trapped,,Foe in front,★★
,Flip Turn,Water,Physical,3,20,,User switches place with an ally within 2 tiles.,Foe in front,★★
,Aqua Cutter,Water,Physical,2,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★
,Aqua Jet,Water,Physical,2,20,,Has Priority,Foe up to 2 tiles ahead,★★
,,,,,,,,,
,Defend Order,Bug,Physical Status,0,10,Def Up 2. Sp.Def Up 2.,,Self,★★
,Sticky Web,Bug,Physical Status,0,15,Spe Down 2,The user places a Sticky Web that slows if the Pokemon enters the same Tile. Webs can be stacked up to 3 times. Flying Pokemon and those that Levitate are unaffected.,Room,★★
,Switcheroo,Dark,Physical Status,0,15,,You replace your current Held Item with the Foe's. Uses Sneak vs Awareness,Foe up to 2 tiles ahead,★★
,Hone Claws,Dark,Physical Status,0,15,Atk Up 2,The user's next Physical Move increases its range by 1 tile.,Self,★★
,Torment,Dark,Physical Status,0,15,,Target cannot use the same Move twice in a row. Uses Influence vs Intuition,Foe up to 2 tiles ahead,★★
,Dragon Dance,Dragon,Physical Status,0,15,Atk Up 2. Spe Up 2.,,Self,★★
,Charm,Fairy,Physical Status,0,15,Atk Down 4,Uses Influence vs Intuition,Foe up to 2 tiles ahead,★★
,Bulk Up,Fighting,Physical Status,0,15,Atk Up 2. Def Up 2.,User's size increases by one stage.,Self,★★
,Feather Dance,Flying,Physical Status,0,15,Atk Down 4,,Foe up to 2 tiles ahead,★★
,Roost,Flying,Physical Status,2,15,,"User heals for the amount rolled, but is unable to be Flying or Levitating for 1 round.",Self,★★
,Curse,Ghost,Physical Status,1,15,,"If User is Non-Ghost Type, Spe Down 2, Atk Up 2, Def Up 2. If User is Ghost Type, lose 1d6 health, but the target takes 1d6 health per turn.",Self/Foe up to 2-tiles ahead,★★
,Cotton Guard,Grass,Physical Status,0,15,Def Up 4,,Self,★★
,Synthesis,Grass,Physical Status,2,15,,User heals for the amount rolled. Healing increases by 2d6 in Harsh Sunlight. Loses 1d6 healing in other Weather.,Self,★★
,Sand Attack,Ground,Physical Status,0,15,Blinded,,Foes in a 1-tile range,★★
,Swords Dance,Normal,Physical Status,0,15,Atk Up 4,,Self,★★
,Helping Hand,Normal,Physical Status,0,15,,The target's next move gains 2d6 damage,Ally in front,★★
,Foresight,Normal,Physical Status,0,15,,Target can be hit by Normal and Fighting Moves. Target no longer benefits from Illusions or Invisibility. Uses Intuition vs Deceive.,Foe up to 2-tiles ahead,★★
,Double Team,Normal,Physical Status,0,15,,"User makes an illusory double. Whenever attacked, roll a 1d6. If 1-3, User is hit. If 4-6, illusory double is hit and disappears.",Self,★★
,Screech,Normal,Physical Status,0,15,Def Down 4,,Foe up to 2-tiles ahead,★★
,Growth,Normal,Physical Status,0,15,Atk Up 2. Sp.Atk Up 2.,User's size increases by one stage.,Self,★★
,Minimize,Normal,Physical Status,0,15,Def Up 2. Sp. Def Up 2.,User's size decreases by one stage.,Self,★★
,Toxic Spikes,Poison,Physical Status,0,15,,"The user places 3 spikes in a 2-tile radius that Poison if the Pokemon enters the same tile. Can be stacked, causing Badly Poisoned. Flying Pokemon and those that Levitate are unaffected.",Room,★★
,Coil,Poison,Physical Status,0,15,Atk Up 2. Def Up 2.,User's size decreases by one stage.,Self,★★
,Barrier,Psychic,Physical Status,0,15,Def Up 4,,Self,★★
,Rest,Psychic,Physical Status,0,15,Asleep,"User falls Asleep, and regains full HP at the start of their next turn.",Self,★★
,Agility,Psychic,Physical Status,0,15,Spe Up 4,,Self,★★
,Tar Shot,Rock,Physical Status,0,15,Spe Down 2,Target takes 1d6 extra damage from Fire moves until the start of your next round.,Foe up to 2-tiles ahead,★★
,Rock Polish,Rock,Physical Status,0,15,Spe Up 4,,Self,★★
,Iron Defence,Steel,Physical Status,0,15,Def Up 4,,Self,★★
,Shift Gear,Steel,Physical Status,0,15,Atk Up 2. Spe Up 2.,,Self,★★
,,,,,,,,,
,Signal Beam,Bug,Special,2,15,Confused,,Foe up to 4 tiles ahead,★★
,Infestation,Bug,Special,2,15,Trapped,,Foe up to 4tiles ahead,★★
,Dark Pulse,Dark,Special,2,15,,"Roll a d6 after damage has been dealt. On a 6, the target(s) is Flinched.",Foes in a 1-tile range,★★
,Dragon Breath,Dragon,Special,2,15,Paralysed,,Foe up to 4 tiles ahead,★★
,Electroweb,Electric,Special,2,15,Spe Down 2,,Foe up to 4 tiles ahead,★★
,Electro Ball,Electric,Special,2,15,,Move power increases by 1 if faster than the target.,Foe up to 4 tiles ahead,★★
,Charge Beam,Electric,Special,1,15,,"Roll a d6 after damage has been dealt. On a 5-6, Sp.Atk Up 2.",Foe up to 4 tiles ahead,★★
,Overdrive,Electric,Special,1,15,Frightened,,Foes in a 1-tile range,★★
,Disarming Voice,Fairy,Special,1,15,,,Foes in a 1-tile range,★★
,Dazzling Gleam,Fairy,Special,2,15,Blinded,,Foe up to 4 tiles ahead,★★
,Aura Sphere,Fighting,Special,2,15,,Scores a Critical Hit on a 5-6.,Foe up to 4 tiles ahead,★★
,Fire Spin,Fire,Special,2,15,Trapped,,Foe up to 4 tiles ahead,★★
,Flame Burst,Fire,Special,2,15,,"*If there is a Pokemon adjacent to the target, it also takes damage equal to half the damage rolled.",Foe up to 4 tiles ahead*,★★
,Incinerate,Fire,Special,2,15,,Burns up the target's held Berry,Foe up to 4 tiles ahead*,★★
,Air Slash,Flying,Special,2,15,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe up to 4 tiles ahead,★★
,Hex,Ghost,Special,1,15,,Increase move power by 1 if the target has a Status Condition.,Foe up to 4 tiles ahead,★★
,Mega Drain,Grass,Special,2,15,,User heals for half the damage taken by the target.,Foe up to 4 tiles ahead,★★
,Mud Shot,Ground,Special,2,15,Spe Down 2,,Foe up to 4 tiles ahead,★★
,Icy Wind,Ice,Special,2,15,Spe Down 2,,Foe up to 4 tiles ahead,★★
,Uproar,Normal,Special,1,15,,All Pokemon in the Room cannot fall Asleep for 5 turns.,Foes in a 1-tile range,★★
,Sonicboom,Normal,Special,1,15,,"Target is pushed 2 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe up to 4 tiles ahead,★★
,Echoed Voice,Normal,Special,1,15,,Increase move power by 1 if used in the previous turn.,Foes in a 1-tile range,★★
,Tri Attack,Normal,Special,2,15,,"Roll a d6 to determine Status Condition. On a 1-2, Burn. On a 3-4, Paralyzed. On a 5-6, Frozen.",Foe up to 4 tiles ahead,★★
,Acid Bomb,Poison,Special,2,20,Sp.Def Down 2,,Foe up to 4 tiles ahead,★★
,Sludge,Poison,Special,2,15,Poisoned,,Foe up to 4 tiles ahead,★★
,Venoshock,Poison,Special,2,15,,Move power increases by 1 if the target is Poisoned,Foe up to 4 tiles ahead,★★
,Psybeam,Psychic,Special,2,15,Confused,,Foe up to 4 tiles ahead,★★
,Ancient Power,Rock,Special,2,15,,"Roll a d6 after damage has been dealt. On a 6, Atk Up 2, Sp.Atk Up 2, Def Up 2, Sp.Def Up 2, Spe Up 2.",Foe up to 4 tiles ahead,★★
,Flash Cannon,Steel,Special,2,15,Blinded,,Foe up to 4 tiles ahead,★★
,Whirlpool,Water,Special,2,15,Trapped,,Foe up to 4 tiles ahead*,★★
,Octazooka,Water,Special,2,15,Blinded,,Foe up to 4 tiles ahead*,★★
,Water Pulse,Water,Special,2,15,Confused,,Foe up to 4 tiles ahead,★★
,,,,,,,,,
,Nasty Plot,Dark,Special Status,0,15,Sp.Atk Up 4,,Self,★★
,Snatch,Dark,Special Status,0,15,,"Has Priority. Whenever a Pokemon in the Room heals or changes their Stats this turn, you steal it for yourself.",Self,★★
,Magnet Rise,Electric,Special Status,0,15,,User gains Levitate for 5 turns,Self,★★
,Aromatic Mist,Fairy,Special Status,0,15,Sp.Def Up 2,,Ally up to 2 tiles ahead,★★
,Floral Healing,Fairy,Special Status,2,15,,Heals the target for the amount rolled.,Self or Ally up to 2 tiles ahead,★★
,Defog,Flying,Special Status,0,15,,"Clears the room of all Hazards and Traps, and Screens",Room,★★
,Confuse Ray,Ghost,Special Status,0,15,Confused,Uses Decieve vs Awareness,Foe up to 2 tiles ahead,★★
,Spite,Ghost,Special Status,0,15,,Target loses the PP of the last move they used,Foe in front,★★
,Stun Spore,Grass,Special Status,0,15,Paralysed,,Foes in a 1-tile range,★★
,Worry Seed,Grass,Special Status,0,15,,Target's Ability is changed to Insomnia.,Foe up to 2 tiles ahead,★★
,Rototiller,Ground,Special Status,0,15,Atk Up 2. Sp.Atk Up 2.,Only Grass Type Pokemon can recieve this benefit.,Room,★★
,Haze,Ice,Special Status,0,15,,All stat changes are reset.,Room,★★
,Confide,Normal,Special Status,0,15,Sp Atk Down 4,Uses Influence vs Intuition.,Foe up to 2 tiles ahead,★★
,Attract,Normal,Special Status,0,15,Infatuated,Uses Influence vs Intuition.,Foe up to 2 tiles ahead,★★
,Mean Look,Normal,Special Status,0,15,Frightened,Uses Influence vs Intuition.,Foe up to 2-tiles ahead,★★
,Encore,Normal,Special Status,0,15,,Target must use the same move again.,Foe up to 2 tiles ahead,★★
,Toxic,Poison,Special Status,0,15,Badly Poisoned,,Foe in front,★★
,Trick,Psychic,Special Status,0,15,,You replace your current Held Item with the Foe's.Uses Sneak vs Awareness,Foe up to 2 tiles ahead,★★
,Ally Switch,Psychic,Special Status,0,15,,"User, or an Ally of their choice, swaps places with an Ally.",Room,★★
,Cosmic Power,Psychic,Special Status,0,15,Def Up 2. Sp.Def Up 2.,,Self,★★
,Skill Swap,Psychic,Special Status,0,15,,Target swaps Ability with the User.,Foe up to 2 tiles ahead,★★
,Magic Coat,Psychic,Special Status,0,15,,User gains Magic Coat Status for 4 turns.,Self,★★
,Metal Sound,Steel,Special Status,0,15,Sp.Def Down 4,,Foe up to 2 tiles ahead,★★
,Aqua Veil,Water,Special Status,1,15,,"User heals for the amount rolled when used, and at the start of each subsequent turn for 4 rounds.",Self,★★
,,,,,,,,,
,,,,,,,,,
,[Name],[Type],[Category],[Power],[PP],Conditions,Other Effects,[Targets],[LEVEL]
,Pin Missile,Bug,Physical,1,15,,Roll a d6. This move attacks that many times. Reroll 6's.,Foe in front,★★★
,Fell Stinger,Bug,Physical,2,15,,"If Foe is KO'd by this move, Atk Up 2.",Foe in front,★★★
,Fury Cutter,Bug,Physical,1,15,,Move power increases by 1 when used in succession. This effect stacks to a maximum of Move Power 5. The move power is reset after a battle ends.,Foe in front,★★★
,X-Scissor,Bug,Physical,4,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Steamroller,Bug,Physical,2,15,,"Move power increases by 1 if the target is smaller than you. Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★★
,Assurance,Dark,Physical,3,15,,Move power increases by 1 if damaged this turn.,Foe in front,★★★
,Crunch,Dark,Physical,3,15,Def Down 2,,Foe in front,★★★
,Throat Chop,Dark,Physical,3,15,Silenced,,Foe in front,★★★
,Jaw Lock,Dark,Physical,2,15,Trapped,"If the target is successfully Trapped, the User is also Restrained.",Foe in front,★★★
,Foul Play,Dark,Physical,3,15,,Move power increases by 1 if the target has increased their Attack.,Foe in front,★★★
,Kowtow Cleave,Dark,Physical,3,15,,Uses Deceive vs Intuition.,Foe in front,★★★
,Wicked Blow,Dark,Physical,3,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Scale Shot,Dragon,Physical,1,15,,Roll a d6. This move attacks that many times. Reroll 6's.,Foe in front,★★★
,Dragon Darts,Dragon,Physical,2,15,,Hits twice. The second Dragon Dart can be aimed at a separate target.,Foe up to 2 tiles ahead,★★★
,Breaking Swipe,Dragon,Physical,2,15,Atk Down 2,,Foes in a 1-tile range,★★★
,Thunder Punch,Electric,Physical,3,15,Paralyzed,,Foe in front,★★★
,Wild Charge,Electric,Physical,4,15,Paralyzed,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★
,Alluring Voice,Fairy,Physical,2,15,Infatuated,,Foes in a 1-tile range,★★★
,Lumina Crash,Fairy,Physical,3,15,Sp.Atk Down 2,,Foe in front,★★★
,Cross Chop,Fighting,Physical,3,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Circle Throw,Fighting,Physical,3,15,,"Target is pushed 4 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe in front,★★★
,Submission,Fighting,Physical,4,15,,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★
,Reversal,Fighting,Physical,2,15,,Move power increases by 1 if the User is below 50% HP. Move power increases by 2 if the User is below 10% HP.,Foe in front,★★★
,Force Palm,Fighting,Physical,3,15,Paralyzed,,Foe in front,★★★
,Drain Punch,Fighting,Physical,3,15,,User heals for half the damage taken by the target,Foe in front,★★★
,Arm Thrust,Fighting,Physical,1,15,,Roll a d6. This move attacks that many times. Reroll 6's.,Foe in front,★★★
,Brick Break,Fighting,Physical,3,15,,Breaks Screens,Foe in front,★★★
,Wake-Up Slap,Fighting,Physical,3,15,,Move power increases by 1 if the target is Asleep.,Foe in front,★★★
,Sky Uppercut,Fighting,Physical,3,15,,"Can hit Foes using Fly, Bounce or Sky Drop.",Foe in front,★★★
,Blaze Kick,Fire,Physical,3,15,,"Target is pushed 4 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe in front,★★★
,Fire Punch,Fire,Physical,3,15,Burned,,Foe in front,★★★
,Heat Crash,Fire,Physical,3,15,,Move power increases by 1 if the target is two size categories smaller than you.,Foe in front,★★★
,Bitter Blade,Fire,Physical,3,,,User heals for half the damage taken by the target,Foe in front,★★★
,Acrobatics,Flying,Physical,3,15,,Increase move power by 1 if the user is not holding an item.,Foe in front,★★★
,Drill Peck,Flying,Physical,3,15,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★★
,Fly (HM Only),Flying,Physical,3,15,,"User becomes Invulnerable for 1 turn, and then damages the target on the 2nd turn. Can be used to Fly outside of the Dungeon.",Foe up to 6 tiles ahead,★★★
,Sky Drop,Flying,Physical,3,15,,"User and target become Invulnerable for 1 turn, and then damages the target on the 2nd turn.",Foe in front,★★★
,Phantom Force,Ghost,Physical,3,15,,"User becomes Invulnerable for 1 turn, and then damages the target on the 2nd turn.",Foe up to 6 tiles ahead,★★★
,Shadow Claw,Ghost,Physical,3,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Shadow Punch,Ghost,Physical,2,15,,Has Priority.,Foe up to 2 tiles ahead,★★★
,Spirit Shackle,Ghost,Physical,3,15,Restrained,,Foe in front,★★★
,Leaf Blade,Grass,Physical,3,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Bullet Seed,Grass,Physical,1,15,,Roll a d6. This move attacks that many times. Reroll 6's.,Foe up to 2 tiles ahead,★★★
,Horn Leech,Grass,Physical,3,15,,User heals for half the damage taken by the target,Foe in front,★★★
,Dig,Ground,Physical,3,15,,"User becomes Invulnerable for 1 turn, and then damages the target on the 2nd turn. Can be used to escape the Dungeon.",Foe up to 6 tiles ahead,★★★
,Bonemerang,Ground,Physical,2,15,,Hits twice. The second Bonemerang can be aimed at a seperate target.,Foe up to 2 tiles ahead,★★★
,Drill Run,Ground,Physical,3,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Magnitude,Ground,Physical,---,15,,"Roll 1d6. On a 1-2, Move power is 2. On a 3-4, Move Power is 3. On a 5-6, Move Power is 4.",Room,★★★
,High Horsepower,Ground,Physical,3,15,,"Roll a d6 after damage has been dealt. On a 5-6, Spe Up 2",Foe in front,★★★
,Ice Ball,Ice,Physical,1,15,,"Roll in a direction until you hit a wall, hitting any target in the path. This move must be used for 4 turns consecutively. Move power increases by 1 for each use until it ends. Rollout ends if you do not hit a Pokemon.",All targets in path,★★★
,Ice Punch,Ice,Physical,3,15,Frozen,,Foe in front,★★★
,Icicle Crash,Ice,Physical,3,15,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★★
,Icicle Spear,Ice,Physical,1,15,,Roll a d6. This move attacks that many times. Reroll 6's.,Foe in front,★★★
,Fury Swipes,Normal,Physical,1,15,,Roll a d6. This move attacks that many times. Reroll 6's.,Foe in front,★★★
,Cut (HM Only),Normal,Physical,3,15,,Can Cut down trees in a Dungeon.,Foe in front,★★★
,Strength (HM Only),Normal,Physical,3,15,,"Target is pushed 4 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage. Having Strength auto-succeeds Strength checks.",Foe in front,★★★
,Slash,Normal,Physical,3,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Chip Away,Normal,Physical,3,15,,Ignores stat changes in the target's Defence,Foe in front,★★★
,Take Down,Normal,Physical,4,15,,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★
,Mega Punch,Normal,Physical,3,15,,"Target is pushed 4 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe in front,★★★
,Body Slam,Normal,Physical,3,15,Paralyzed,,Foe in front,★★★
,Flail,Normal,Physical,2,15,,Move power increases by 1 if the User is below 50% HP. Move power increases by 2 if the User is below 10% HP.,Foe in front,★★★
,Hyper Fang,Normal,Physical,3,15,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★★
,Cross Poison,Poison,Physical,3,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Poison Tail,Poison,Physical,3,15,,"Target is pushed 4 tiles away. If they collide with a wall or a Pokemon, they are Poisoned.",Foe in front,★★★
,Psychic Noise,Psychic,Physical,2,15,Silenced,,Foes in a 1-tile range,★★★
,Psycho Cut,Psychic,Physical,3,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Zen Headbutt,Psychic,Physical,3,15,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★★
,Psychic Fangs,Psychic,Physical,3,15,,Destroys Light Screen and Reflect if standing in the screen or attacking a foe standing in the screen.,Foe in front,★★★
,Rock Slide,Rock,Physical,2,15,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foes in a 1-tile range,★★★
,Stone Edge,Rock,Physical,3,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Rock Blast,Rock,Physical,1,15,,Roll a d6. This move attacks that many times. Reroll 6's.,Foe in front,★★★
,Rollout,Rock,Physical,1,15,,"Roll in a direction until you hit a wall, hitting any target in the path. This move must be used for 4 turns consecutively. Move power increases by 1 for each use until it ends. Rollout ends if you do not hit a Pokemon.",All targets in path,★★★
,Anchor Shot,Steel,Physical,3,15,Restrained,,Foe in front,★★★
,Meteor Mash,Steel,Physical,3,15,,"Roll a d6 after damage has been dealt. On a 5-6, Atk Up 2",Foe in front,★★★
,Iron Tail,Steel,Physical,3,15,,"Target is pushed 4 tiles away. If they collide with a wall or a Pokemon, Def Down 2",Foe in front,★★★
,Gyro Ball,Steel,Physical,3,15,,Increase move power by 1 if the target is faster.,Foe in front,★★★
,Heavy Slam,Steel,Physical,3,15,,Move power increases by 1 if the target is smaller than you.,Foe in front,★★★
,Dive (HM Only),Water,Physical,3,15,,"User becomes Invulnerable for 1 turn, and then damages the target on the 2nd turn. Can be used to Dive outside the Dungeon.",Foe up to 6 tiles ahead,★★★
,Waterfall (HM Only),Water,Physical,3,15,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★★
,Fishious Rend,Water,Physical,3,15,,Move power increases by 1 if damaged this turn.,Foe in front,★★★
,Surging Strikes,Water,Physical,1,15,,Roll a d6. This move attacks that many times. Reroll 6's.,Foe in front,★★★
,Liquidation,Water,Physical,3,15,Def Down 2,,Foe in front,★★★
,Crabhammer,Water,Physical,3,15,,Scores a Critical Hit on a 5-6.,Foe in front,★★★
,Aqua Step,Water,Physical,3,15,,"Roll a d6 after damage has been dealt. On a 5-6, Spe Up 2",Foe in front,★★★
,Aqua Tail,Water,Physical,3,15,,"Target is pushed 4 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe in front,★★★
,,,,,,,,,
,Heal Order,Bug,Physical Status,3,10,,User heals for the amount rolled.,Self or Ally up to 2 tiles away,★★★
,Parting Shot,Dark,Physical Status,0,10,"Atk Down 2, Sp. Atk Down 2",User also switches place with an Ally up to 4 tiles away,Foe in front,★★★
,Clangorous Soul,Dragon,Physical Status,3,5,All Stats Up 2,Deals damage to User based on the number rolled.,Self,★★★
,Eerie Impulse,Electric,Physical Status,0,10,Sp. Atk Down 6,,Foe up to 2 tiles away,★★★
,Coaching,Fighting,Physical Status,0,10,"Atk Up 2, Def Up 2",,Ally up to 2 tiles way,★★★
,Detect,Fighting,Physical Status,0,5,,"User is Invulnerable this turn. If used in succession, roll a d6. On a 1-4, the move fails to activate. Using a third time in succession, or using a similar move in succession always fails. Has Priority.",Self,★★★
,Quick Guard,Fighting,Physical Status,0,10,,The user protects itself and its allies from priority moves this turn.,Self and Allies up to 2 tiles away,★★★
,Octolock,Fighting,Physical Status,0,10,Restrained,"User is also Restrained. At the beginning of each turn the target takes whilst Restrained, Def Down 2, Sp. Def Down 2.",Foe in front,★★★
,Cotton Spore,Grass,Physical Status,0,15,Spe Down 4,,Foes in a 1-tile range,★★★
,Spore,Grass,Physical Status,0,10,Asleep,,Foes in a 1-tile range,★★★
,Strength Sap,Grass,Physical Status,0,10,Atk Down 2,User is healed equal to the target's Attack Modifier. This is appilied before stats are lowered.,Foe in front,★★★
,Shore Up,Ground,Physical Status,3,10,,User heals for the amount rolled. Healing increases by 2d6 in Sandstorm.,Self,★★★
,Teeter Dance,Normal,Physical Status,0,10,Confused,,Foes in a 1-tile range,★★★
,Belly Drum,Normal,Physical Status,4,10,Atk Up 6,User takes the number rolled in damage.,Self,★★★
,Camouflage,Normal,Physical Status,0,10,Invisible,,Self,★★★
,Noble Roar,Normal,Physical Status,0,15,"Atk Down 2, Sp. Atk Down 2",Pushes target up to your Influence modifier in tiles. Target takes 1d6 damage if they collide with a Pokemon or wall.,Foe in front,★★★
,Protect,Normal,Physical Status,0,5,,"User is Invulnerable this turn. If used in succession, roll a d6. On a 1-4, the move fails to activate. Using a third time in succession, or using a similar move in succession always fails. Has Priority.",Self,★★★
,Recycle,Normal,Physical Status,0,10,,User recovers their used held item.,Self,★★★
,Shell Smash,Normal,Physical Status,0,5,"Def Down 4, Sp.Def Down 4","Atk Up 4, Sp.Atk Up 4, Spe Up 4",Self,★★★
,Slack Off,Normal,Physical Status,4,10,,User heals for the amount rolled.,Self,★★★
,Stockpile,Normal,Physical Status,2,10,"Def Up 2, Sp. Def Up 2",Generates 1 Stockpile.,Self,★★★
,Substitute,Normal,Physical Status,4,5,,"User takes the damage rolled, becomes Invulnerable, and creates a Substitute. The Substitute has 1/2 maximum HP of the User, and disappears when it has no HP.",Self,★★★
,Swallow,Normal,Physical Status,---,10,,"User expends their Stockpile, and heals 2d6 for each Stockpile they have.",Self,★★★
,Tidy Up,Normal,Physical Status,0,10,,"Clears the room of Spikes, Stealth Rock, Sticky Web, Toxic Spikes, and Substitute. User gains Atk Up 2, Spe Up 2.",Room,★★★
,Whirlwind,Normal,Physical Status,0,10,,Pushes target up to your Influence modifier in tiles. Target takes 1d6 damage if they collide with a Pokemon or wall.,Foes in Room,★★★
,Reflect,Psychic,Physical Status,0,10,,Conjure a Reflect Screen in front of you that is 5 tiles long and 1 tile wide for 5 turns. Physical Moves from foes that pass through this barrier deal half damage.,Special,★★★
,Sandstorm,Rock,Physical Status,0,10,,The weather becomes a Sandstorm.,Current Floor,★★★
,Wide Guard,Rock,Physical Status,0,10,,The user protects itself and its allies from moves that affect more than 1 target this turn. Has Priority.,Self and Allies up to 2 tiles away,★★★
,,,,,,,,,
,Bug Buzz,Bug,Special,3,15,Sp. Def Down 2,,Foe up to 4 tiles ahead,★★★
,Pollen Puff,Bug,Special,2,15,,Can be targeted at an ally to heal them instead of dealing damage.,Ally or Foe up to 4 tiles ahead,★★★
,Night Daze,Dark,Special,2,15,Blinded,,Foes in a 1-tile range,★★★
,Dragon Pulse,Dragon,Special,2,15,,Scores a Critical Hit on a 5-6.,Foes in a 1-tile range,★★★
,Thunderbolt,Electric,Special,3,15,Paralyzed,,Foe up to 4 tiles ahead,★★★
,Parabolic Charge,Electric,Special,2,15,,User heals for half the damage taken by the target.,Foe up to 4 tiles ahead,★★★
,Moonblast,Fairy,Special,2,15,Sp. Atk Down 2,,Foe up to 4 tiles ahead,★★★
,Strange Steam,Fairy,Special,2,15,Confused,,Foe up to 4 tiles ahead,★★★
,Sacred Sword,Fighting,Special,2,15,,Damage calculated using the user's Special Attack and the target's Defense.,Foes in a 1-tile range,★★★
,Flamethrower,Fire,Special,3,15,Burned,,Foe up to 4 tiles ahead,★★★
,Torch Song,Fire,Special,2,15,,"Roll a d6 after damage has been dealt. On a 5-6, Sp.Atk Up 2.",Foe up to 4 tiles ahead,★★★
,Magma Storm,Fire,Special,2,15,Trapped,,Foe up to 4 tiles ahead,★★★
,Hurricane,Flying,Special,2,15,Confused,,Foes in a 1-tile range,★★★
,Bitter Malice,Ghost,Special,3,15,Frozen,,Foe up to 4 tiles ahead,★★★
,Shadow Ball,Ghost,Special,3,15,Sp. Def Down 2,,Foe up to 4 tiles ahead,★★★
,Energy Ball,Grass,Special,3,15,Sp. Def Down 2,,Foe up to 4 tiles ahead,★★★
,Leaf Tornado,Grass,Special,2,15,Trapped,,Foe up to 4 tiles ahead,★★★
,Mega Drain,Grass,Special,2,15,,User heals for half the damage taken by the target,Foe up to 4 tiles ahead,★★★
,Trailblaze,Grass,Special,2,15,,"Roll a d6 after damage has been dealt. On a 5-6, Spe Up 2.",Foe up to 4 tiles ahead,★★★
,Grass Knot,Grass,Special,2,15,,Move power increases by 1 if the target is larger in size. Move power decreases by 1 if the target is smaller in size.,Foe up to 4 tiles ahead,★★★
,Scorching Sands,Ground,Special,3,15,Burned,,Foe up to 4 tiles ahead,★★★
,Mud Bomb,Ground,Special,3,15,Blinded,,Foe up to 4 tiles ahead,★★★
,Glaciate,Ice,Special,2,15,Spe Down 2,,Foes in a 1-tile range,★★★
,Ice Beam,Ice,Special,3,15,Frozen,,Foe up to 4 tiles ahead,★★★
,Frost Breath,Ice,Special,2,15,,Scores a Critical Hit on a 5-6.,Foe up to 4 tiles ahead,★★★
,Revelation Dance,Normal,Special,2,15,,"Always matches the user's primary Type. Target is pushed 4 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe up to 4 tiles ahead,
,Spike Cannon,Normal,Special,1,15,,Roll a d6. This move attacks that many times. Reroll 6's.,Foe up to 4 tiles ahead,★★★
,Hyper Voice,Normal,Special,2,15,Frightened,Targets are silenced for this round.,Foes in a 1-tile range,★★★
,Razor Wind,Normal,Special,2,15,,"Charges on the first turn, Restraining the User. Attacks on the second turn.",Foes in Room,★★★
,Snore,Normal,Special,3,15,,"User must be Asleep. Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foes in a 1-tile range,★★★
,Spit Up,Normal,Special,---,10,,"User expends their Stockpile, and Move Power increase by 2 for each Stockpile they have.",Foe up to 4 tiles ahead,★★★
,Terrain Pulse,Normal,Special,2,10,,Move Power increases by 1 if there is Terrain in effect. Type changes based on the Terrain.,Foes in a 1-tile range,★★★
,Weather Ball,Normal,Special,2,15,,"Move power increases by 1 in Weather, and damage type changes based on Weather. Fire-type during Harsh Sunlight, Water-type during Rain, Ice-type during Snow, Rock-type during Sandstorm.",Foe up to 4 tiles ahead,★★★
,Sludge Bomb,Poison,Special,3,15,Poisoned,,Foe up to 4 tiles ahead,★★★
,Dream Eater,Psychic,Special,3,15,,Target must be Asleep. Restores HP to the user equal to ½ the damage inflicted.,Foe up to 4 tiles ahead,★★★
,Psychic,Psychic,Special,3,15,Sp. Def Down 2,,Foe up to 4 tiles ahead,★★★
,Psyshock,Psychic,Special,3,15,,Damage calculated using the user's Special Attack and the target's Defense.,Foes in a 1-tile range,★★★
,Flash Cannon,Steel,Special,3,15,Blinded,,Foe up to 4 tiles ahead,★★★
,Brine,Water,Special,2,15,,Move power increases by 1 if the target is below 50% HP.,Foe up to 4 tiles ahead,★★★
,Scald,Water,Special,3,15,Burned,,Foe up to 4 tiles ahead,★★★
,Water Shuriken,Water,Special,1,15,,Roll a d6. This move attacks that many times. Reroll 6's.,Foe up to 4 tiles ahead,★★★
,,,,,,,,,
,Rage Powder,Bug,Special Status,0,15,Taunted,Uses Influence vs Intutition.,Foes in a 1-tile range,★★★
,Powder,Bug,Special Status,0,15,,"Primes the target to explode for 1 round. If the target takes Fire damage, the target and any Pokemon in a 1-tile radius takes 2d6 Fire damage.",Foe up to 4 tiles ahead,★★★
,Quiver Dance,Bug,Special Status,0,5,"Sp.Atk Up 2, Sp.Def Up 2, Spe Up 2",,Self,★★★
,Quash,Dark,Special Status,0,15,,The target moves last.,Foe up to 4 tiles ahead,★★★
,Electric Terrain,Electric,Special Status,0,15,,Electric-Type Moves have their Move Power increased by 1. Pokémon on the ground no longer fall Asleep.,Room,★★★
,Misty Terrain,Fairy,Special Status,0,15,,This protects Pokémon on the ground from status conditions and halves damage from Dragon-type moves for five turns.,Room,★★★
,Moonlight,Fairy,Special Status,3,15,,User heals for the amount rolled. Loses 1d6 healing in Weather.,Self,★★★
,Sunny Day,Fire,Special Status,0,15,,The weather becomes Harsh Sunlight,Current Floor,★★★
,Tailwind,Flying,Special Status,0,15,Spe Up 2,Lasts for 5 rounds.,Self & Allies in room,★★★
,Destiny Bond,Ghost,Special Status,0,15,,"After using this move, if the user faints, the Pokémon that landed the knockout hit also faints. If used in succession, roll a d6. On a 1-4, the move fails to activate. Using a third time in succession always fails.",Foe up to 2 tiles ahead,★★★
,Grassy Terrain,Grass,Special Status,0,15,,"Alliies heal 1d6 at the start of their turn, and Grass type-moves increase in Move Power by 1.",Allies in Room,★★★
,Snowscape,Ice,Special Status,0,15,,The weather becomes a Snowstorm.,Current Floor,★★★
,Wish,Normal,Special Status,6,15,,User heals for the amount rolled at the end of their 2nd turn from when this move is used.,Self,★★★
,Baton Pass,Normal,Special Status,0,15,,"The user switches places with an Ally, and passes along any stat changes and Wish.",Ally up to 6 tiles ahead,★★★
,Flash,Normal,Special Status,0,10,Blinded,,Room,★★★
,Heal Bell,Normal,Special Status,0,10,,User and Allies have their Status Condition healed.,Self & Allies in Room,★★★
,Lucky Chant,Normal,Special Status,0,15,,Foe Pokémon cannot land Critical Hits for five turns.,Room,★★★
,Gastro Acid,Poison,Special Status,0,10,,The target has its Ability nullified.,Foe up to 2 tiles ahead,★★★
,Purify,Poison,Special Status,0,15,,"Target has their Status Condition healed. If a Status Conditon is healed, the target also heals 2d6.",Self or Ally up to 4 tiles ahead,★★★
,Venom Drench,Poison,Special Status,0,15,"Atk Down 2, Sp. Atk Down 2, Spe Down 2",Target must be Poisoned,Foe up to 2 tiles ahead,★★★
,Trick Room,Psychic,Special Status,0,15,,Initiative order is reversed.,Room,★★★
,Gravity,Psychic,Special Status,0,15,,Flying-type or Levitating Pokémon can be hit by Ground-type moves. Moves that cause the User to fly can't be used. Fall damage increases by 2d6.,Room,★★★
,Heal Pulse,Psychic,Special Status,4,10,,Target is healed by the amount rolled.,Self or Ally up to 4 tiles away,★★★
,Light Screen,Psychic,Special Status,0,10,,Conjure a Light Screen in front of you that is 5 tiles long and 1 tile wide for 5 turns. Special Moves from foes that pass through this barrier deal half damage.,Special,★★★
,Power Trick,Psychic,Special Status,0,15,,User's Attack and Defence stats swap.,Self,★★★
,Psychic Terrain,Psychic,Special Status,0,15,,Psychic-Type Moves have their Move Power increased by 1. Priority Moves fail.,Room,★★★
,Life Dew,Water,Special Status,1,15,,User and Allies heal for the amount rolled at the end of their turns. This effect lasts for 5 rounds. It cannot be stacked.,Self and Allies in room,★★★
,Rain Dance,Water,Special Status,0,15,,The weather becomes Rain.,Current Floor,★★★
,,,,,,,,,
,,,,,,,,,
,[Name],[Type],[Category],[Power],[PP],Conditions,Other Effects,[Targets],[LEVEL]
,Megahorn,Bug,Physical,4,10,,"Target is pushed 6 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe in front,★★★★
,Brutal Swing,Dark,Physical,3,10,,,Foes in a 1-tile range,★★★★
,Ceaseless Edge,Dark,Physical,4,10,,"After damage is dealt, choose 3 tiles within 1-tile range of the target. Spikes are scattered at the chosen location(s).",Foe in front,★★★★
,Darkest Lariat,Dark,Physical,4,10,,Ignores changes to the target's Defence.,Foe in front,★★★★
,Outrage,Dragon,Physical,2,10,,"Roll a d6. On a 1-2, the target is hit 1 time. On a 3-4, the target is hit 2 times. On a 5-6, the target is hit 3 times. User is Confused for 1 turn afterwards.",Foe in front,★★★★
,Dragon Rush,Dragon,Physical,3,10,Frightened,"If the User attacks from 2-tiles away, they move 1 tile toward the target.",Foe up to 2-tiles away,★★★★
,Volt Tackle,Electric,Physical,5,10,,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★★
,Plasma Fists,Electric,Physical,4,10,,"For the remainder of this round, all Normal-type Moves become Electric-Type.",Foe in front,★★★★
,Hi Jump Kick,Fighting,Physical,5,10,,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★★
,Close Combat,Fighting,Physical,5,10,,"After damage is dealt, User Def Down 2, Sp.Def Down 2",Foe in front,★★★★
,Hammer Arm,Fighting,Physical,5,10,Spe Down 2,,Foe in front,★★★★
,Dynamic Punch,Fighting,Physical,4,10,Confused,,Foe in front,★★★★
,Flare Blitz,Fire,Physical,5,10,,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★★
,Sacred Fire,Fire,Physical,4,10,Burned,,Foe in front,★★★★
,Raging Fury,Fire,Physical,2,10,,"Roll a d6. On a 1-2, the target is hit 1 time. On a 3-4, the target is hit 2 times. On a 5-6, the target is hit 3 times. User is Confused for 1 turn afterwards.",Foe in front,★★★★
,Brave Bird,Flying,Physical,5,10,,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★★
,Power Whip,Grass,Physical,3,10,,Target is pulled up to 3 tiles to the User.,Foe up to 4 tiles ahead,★★★★
,Wood Hammer,Grass,Physical,5,10,,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★★
,Solar Blade,Grass,Physical,5,10,,"Charges on the first turn, Restraining the User for 1 round, attacks on the second. Attacks on the first turn in Harsh Sunlight.",Foe in front,★★★★
,Headlong Rush,Ground,Physical,3,10,Def Down 2,"If the User attacks from 2-tiles away, they move 1 tile toward the target.",Foe up to 2-tiles away,★★★★
,Earthquake,Ground,Physical,3,10,,,Room,★★★★
,Ice Hammer,Ice,Physical,4,10,Spe Down 2,,Foe in front,★★★★
,Glacial Lance,Ice,Physical,4,10,,"Target is pushed 6 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe in front,★★★★
,Skull Bash,Normal,Physical,5,10,,"Charges on the first turn, Restraining the User for 1 round, and gives the User Def Up 2. Attacks on the second turn.",Foe in front,★★★★
,Double-Edge,Normal,Physical,5,10,,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★★
,Mega Kick,Normal,Physical,4,10,,"Target is pushed 6 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe in front,★★★★
,Thrash,Normal,Physical,2,10,,"Roll a d6. On a 1-2, the target is hit 1 time. On a 3-4, the target is hit 2 times. On a 5-6, the target is hit 3 times. User is Confused for 1 turn afterwards.",Foe in front,★★★★
,Hyper Drill,Normal,Physical,4,10,,Can hit Invulnerable targets.,Foe in front,★★★★
,Self-Destruct,Normal,Physical,6,10,,User is KO'd after using this Move.,Foes in a 1-tile range,★★★★
,Gunk Shot,Normal,Physical,4,10,Poisoned,,Foe in front,★★★★
,Psyblade,Psychic,Physical,3,10,,Increase Move Power by 1 if in Electric Terrain,Foes in a 1-tile range,★★★★
,Mighty Cleave,Rock,Physical,3,10,,,Foes in a 1-tile range,★★★★
,Stone Axe,Rock,Physical,3,10,,"After damage is dealt, choose 3 tiles within 1-tile range of the target. Stealth Rocks are scattered at the chosen location(s).",Foe in front,★★★★
,Metal Burst,Steel,Physical,---,10,,Always goes last. The user deals damage equal to half of all damage they have taken this round.,Foes in a 1-tile range,★★★★
,Iron Head,Steel,Physical,4,10,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe in front,★★★★
,Steel Roller,Steel,Physical,4,10,,Fails if there is no Terrain. Removes Terrain affecting the Room.,Foes in a 1-tile range,★★★★
,Jet Punch,Water,Physical,3,10,,Has Priority.,Foe up to 2-tiles away,★★★★
,Wave Crash,Water,Physical,5,10,,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★★
,,,,,,,,,
,Silk Trap,Bug,Physical Status,0,5,,"User is Invulnerable this turn. If attacked this turn, the Foe gets Spe Down 2. If used in succession, roll a d6. On a 1-4, the move fails to activate. Using a third time in succession, or using a similar move in succession always fails. Has Priority.",Self,★★★★
,Obstruct,Dark,Physical Status,0,5,,"User is Invulnerable this turn. If attacked this turn, the Foe gets Def Down 2. If used in succession, roll a d6. On a 1-4, the move fails to activate. Using a third time in succession, or using a similar move in succession always fails. Has Priority.",Self,★★★★
,Burning Bulwark,Fire,Physical Status,0,5,,"User is Invulnerable this turn. If attacked this turn, the Foe is Burned. If used in succession, roll a d6. On a 1-4, the move fails to activate. Using a third time in succession, or using a similar move in succession always fails. Has Priority.",Self,★★★★
,Spiky Shield,Grass,Physical Status,0,5,,"User is Invulnerable this turn. If attacked this turn, the Foe takes 1d6 damage. If used in succession, roll a d6. On a 1-4, the move fails to activate. Using a third time in succession, or using a similar move in succession always fails. Has Priority.",Self,★★★★
,Baneful Bunker,Poison,Physical Status,0,5,,"User is Invulnerable this turn. If attacked this turn, the Foe is Poisoned. If used in succession, roll a d6. On a 1-4, the move fails to activate. Using a third time in succession, or using a similar move in succession always fails. Has Priority.",Self,★★★★
,King's Shield,Steel,Physical Status,0,5,,"User is Invulnerable this turn. If attacked this turn, the Foe gets Atk Down 2. If used in succession, roll a d6. On a 1-4, the move fails to activate. Using a third time in succession, or using a similar move in succession always fails. Has Priority.",Self,★★★★
,,,,,,,,,
,Draco Meteor,Dragon,Special,5,10,,"After damage has been dealt, User's Sp.Atk Down 4",Foe up to 6 tiles away,★★★★
,Zap Cannon,Electric,Special,4,10,Paralyzed,,Foe up to 6 tiles away,★★★★
,Thunder,Electric,Special,3,10,Paralyzed,Choose a location within 6 tiles. This move deals damage to Foes in a 1-tile range of that location. Move power increases by 1 in Rain.,Special,★★★★
,Wildbolt Storm,Electric,Special,3,10,Trapped,,Foe up to 6 tiles away,★★★★
,Springtide Storm,Fairy,Special,3,10,Trapped,,Foe up to 6 tiles away,★★★★
,Fleur Cannon,Fairy,Special,5,10,,"After damage has been dealt, User's Sp.Atk Down 4",Foe up to 6 tiles away,★★★★
,Focus Blast,Fighting,Special,4,10,Sp. Def Down 2,,Foe up to 6 tiles away,★★★★
,Infernal Parade,Fire,Special,3,15,Burned,Move power increases by 1 if the target has a Status Condition.,Foe up to 4 tiles ahead,★★★★
,Overheat,Fire,Special,5,10,,"After damage has been dealt, User's Sp.Atk Down 4",Foes up to 1-tile away,★★★★
,Fire Blast,Fire,Special,3,10,Burned,Choose a location within 6 tiles. This move deals damage to Foes in a 1-tile range of that location.,Special,★★★★
,Bleakwind Storm,Flying,Special,3,10,Trapped,,Foe up to 6 tiles away,★★★★
,Astral Barrage,Ghost,Special,4,10,Frightened,,Foe up to 6 tiles away,★★★★
,Giga Drain,Grass,Special,4,10,,User heals for half the damage taken by the target,Foe up to 6 tiles away,★★★★
,Solar Beam,Grass,Special,5,10,,"Charges on the first turn, Restraining the User for 1 round. Attacks on the second turn. Attacks on the first turn in Harsh Sunlight.",Foe up to 6 tiles away,★★★★
,Petal Dance,Grass,Special,5,10,,"Roll a d6. On a 1-2, the target is hit 1 time. On a 3-4, the target is hit 2 times. On a 5-6, the target is hit 3 times. User is Confused for 1 turn afterwards.",Foe in front,★★★★
,Leaf Storm,Grass,Special,5,10,,"After damage has been dealt, User's Sp.Atk Down 4",Foe up to 6 tiles away,★★★★
,Earth Power,Ground,Special,3,10,,,Room,★★★★
,Sandsear Storm,Ground,Special,3,10,Trapped,,Foe up to 6 tiles away,★★★★
,Freeze-Dry,Ice,Special,3,10,,Move power increases by 1 if the target is Water-type,Foe up to 6 tiles away,★★★★
,Boomburst,Normal,Special,4,10,,"Target is pushed 6 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe up to 6 tiles away,★★★★
,Belch,Poison,Special,5,10,,User must eat a held Berry to use this move.,Foe up to 6 tiles away,★★★★
,Psystrike,Psychic,Special,4,10,,Damage calculated using the user's Special Attack and the target's Defense.,Foe up to 6 tiles away,★★★★
,Luster Purge,Psychic,Special,3,10,Blinded,,Foes up to 1-tile away,★★★★
,Mist Ball,Psychic,Special,4,10,Blinded,,Foe up to 6 tiles away,★★★★
,Future Sight,Psychic,Special,5,10,,The target takes the damage of this move at the end of their 2nd turn from when this move is used. Cannot score a Critical Hit.,Foe up to 6 tiles away,★★★★
,Psycho Boost,Psychic,Special,5,10,,"After damage has been dealt, User's Sp.Atk Down 4",Foe up to 6 tiles away,★★★★
,Meteor Beam,Rock,Special,5,10,,"Charges on the first turn, Restraining the User for 1 round and gives User Sp.Atk Up 2. Attacks on the second turn.",Foe up to 6 tiles away,★★★★
,Steel Beam,Steel,Special,5,10,,Deals half the damage dealt back to the User as Recoil.,Foe up to 6 tiles away,★★★★
,Hydro Pump,Water,Special,4,10,,"Target is pushed 6 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe up to 6 tiles away,★★★★
,,,,,,,,,
,,,,,,,,,
,[Name],[Type],[Category],[Power],[PP],Conditions,Other Effects,[Targets],[LEVEL]
,Hyperspace Fury,Dark,Physical,6,5,Def Down 2,Ignores Invulnerability,Foes in a 1-tile range,★★★★★
,Glaive Rush,Dragon,Physical,6,5,,"User moves 6 tiles ahead, taking any Foe in their path with them. Any Foe hit in the charge takes the damage rolled. User takes double damage from Moves afterwards for 1 round.",All targets in path,★★★★★
,Bolt Strike,Electric,Physical,6,5,Paralyzed,"Choose a location within 6 tiles. This move deals damage to Foes in a 1-tile range of that location, and moves the User to that location, or an unoccupied space within 1-tile afterwards.",Special,★★★★★
,Fusion Bolt,Electric,Physical,5,5,Paralyzed,Move Power increases by 1 if Fusion Flare has been used this turn.,Foe in front,★★★★★
,Focus Punch,Fighting,Physical,7,5,,Always goes last. This move fails if User is hit before using the move.,Foe in front,★★★★★
,V-Create,Fire,Physical,7,5,,"After damage has been dealt, User's Def Down 4, Sp. Def Down 4, Spe Down 4",Foe in front,★★★★★
,Sky Attack,Flying,Physical,5,5,,"Charges on the first turn, Restraining the User for 1 round. Attacks on the second turn. Scores a Critical Hit on a 5-6. Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foe up to 6 tiles ahead,★★★★★
,Dragon Ascent,Flying,Physical,7,5,,"After damage has been dealt, User's Def Down 4, Sp. Def Down 4.",Foe in front,★★★★★
,Shadow Force,Ghost,Physical,7,5,,"User becomes Invulnerable for 1 turn, and then damages the target on the 2nd turn. Can hit Invulnerable targets. Moves the User to an unoccupied space within 1-tile of the target afterwards.",Foe up to 6 tiles ahead,★★★★★
,Petal Bliizard,Grass,Physical,4,5,Blinded,,Foes in Room,★★★★★
,Precipice Blades,Ground,Physical,6,5,,"Roll a d6 after damage has been dealt. On a 6, the target is Flinched.",Foes in a 1-tile range,★★★★★
,Thousand Waves,Ground,Physical,4,5,Restrained,,Foes in Room,★★★★★
,Fissure,Ground,Physical,---,5,,"Roll a d6. On a 6, the target is KO'd.",Foe up to 6 tiles ahead,★★★★★
,Freeze Shock,Ice,Physical,7,5,Paralyzed,"Charges on the first turn, Restraining the User for 1 round, and gives User Atk Up 2. Attacks on the second turn.",Foe in front,★★★★★
,Giga Impact,Normal,Physical,7,5,,User cannot use a Move for 1 round after this Move.,Foe in front,★★★★★
,Explosion,Normal,Physical,8,5,,User is KO'd after using this Move.,Foes in a 2-tile range,★★★★★
,Last Resort,Normal,Physical,7,5,,This move can only be used if there is no remaining PP on any other Move.,Foe in front,★★★★★
,Rock Wrecker,Rock,Physical,7,5,,User cannot use a Move for 1 round after this Move.,Foe in front,★★★★★
,Head Smash,Rock,Physical,7,5,,Deals half the damage dealt back to the User as Recoil.,Foe in front,★★★★★
,Gigaton Hammer,Steel,Physical,7,5,,This move can't be used twice in a row.,Foe in front,★★★★★
,Behemoth Bash,Steel,Physical,6,5,Def Up 2,Move power increases by 1 if the target is bigger.,Foe in front,★★★★★
,Behemoth Blade,Steel,Physical,6,5,Atk Up 2,Move power increases by 1 if the target is bigger.,Foe in front,★★★★★
,,,,,,,,,
,Silver Wind,Bug,Special,4,5,,"Roll a d6 after damage has been dealt. On a 6, Atk Up 2, Sp.Atk Up 2, Def Up 2, Sp.Def Up 2, Spe Up 2.",Foes in Room,★★★★★
,Dark Void,Dark,Special,0,5,Asleep,,Foes in Room,★★★★★
,Dragon Energy,Dragon,Special,7,5,,Move power reduces by 1 for each 10% of Health missing.,Foes in a 2-tile range.,★★★★★
,Roar of Time,Dragon,Special,4,5,Restrained,,Foes in Room,★★★★★
,Spacial Rend,Dragon,Special,3,5,,Scores a Critical Hit on a 5-6. Target is teleported to the User's choice of location in the Room.,Foes in Room,★★★★★
,Core Enforcer,Dragon,Special,6,5,,"If the target has already used a move or used an Item in the same turn, suppresses the target's Ability while it remains in battle.",Foe up to 10 tiles ahead,★★★★★
,Eternabeam,Dragon,Special,7,5,,User cannot use a Move for 1 round after this Move.,Foe up to 10 tiles ahead,★★★★★
,Dynamax Cannon,Dragon,Special,6,5,,Move power increases by 1 if the target is bigger.,Foe up to 10 tiles ahead,★★★★★
,Discharge,Electric,Special,4,5,Paralyzed,,Foes in Room,★★★★★
,Electroshot,Electric,Special,7,5,,"Charges on the first turn, Restraining the User for 1 round and gives User Sp.Atk Up 2. Attacks on the second turn. Hits on the first turn in Rain.",Foe up to 10 tiles ahead,★★★★★
,Light of Ruin,Fairy,Special,7,5,,Deals half the damage dealt back to the User as Recoil.,Foe up to 10 tiles ahead,★★★★★
,Misty Explosion,Fairy,Special,7,,,User is KO'd after using this Move.,Foes in Room,★★★★★
,Blast Burn,Fire,Special,7,5,,User cannot use a Move for 1 round after this Move.,Foe up to 10 tiles ahead,★★★★★
,Eruption,Fire,Special,7,5,,Move power reduces by 1 for each 10% of Health missing.,Foes in a 2-tile range.,★★★★★
,Mind Blown,Fire,Special,8,5,,Choose a location within 4 tiles. This move deals damage to Foes in a 1-tile range of that location. Deals half the damage dealt back to the User as Recoil.,Special,★★★★★
,Fusion Flare,Fire,Special,5,5,Burned,Move Power increases by 1 if Fusion Flare has been used this turn.,Foe up to 10 tiles ahead,★★★★★
,Blue Flare,Fire,Special,6,5,Burned,Choose a location within 6 tiles. This move deals damage to Foes in a 1-tile range of that location.,Special,★★★★★
,Heat Wave,Fire,Special,4,5,Burned,,Foes in Room,★★★★★
,Aeroblast,Flying,Special,5,5,,"Scores a Critical Hit on a 5-6. Target is pushed 10 tiles away. If they collide with a wall or a Pokemon, they take 1d6 damage.",Foe up to 10 tiles ahead,★★★★★
,Oblivion Wing,Flying,Special,5,5,,User heals for half the damage taken by the target.,Foe up to 10 tiles ahead,★★★★★
,Ominous Wind,Ghost,Special,4,5,,"Roll a d6 after damage has been dealt. On a 6, Atk Up 2, Sp.Atk Up 2, Def Up 2, Sp.Def Up 2, Spe Up 2.",Foes in Room,★★★★★
,Frenzy Plant,Grass,Special,7,5,,User cannot use a Move for 1 round after this Move.,Foe up to 10 tiles ahead,★★★★★
,Chloroblast,Grass,Special,7,5,,Deals half the damage dealt back to the User as Recoil.,Foe up to 10 tiles ahead,★★★★★
,Blizzard,Ice,Special,4,5,Frozen,Move Power increases by 1 in a Snowstorm.,Foes in Room,★★★★★
,Ice Burn,Ice,Special,7,5,Burned,"Charges on the first turn, Restraining the User for 1 round, and gives User Sp. Atk Up 2. Attacks on the second turn.",Foe up to 10 tiles ahead,★★★★★
,Hyper Beam,Normal,Special,7,5,,User cannot use a Move for 1 round after this Move.,Foe up to 10 tiles ahead,★★★★★
,Sludge Wave,Poison,Special,4,5,Poisoned,,Foes in Room,★★★★★
,Prismatic Laser,Psychic,Special,7,5,,User cannot use a Move for 1 round after this Move.,Foe up to 10 tiles ahead,★★★★★
,Photon Geyser,Psychic,Special,5,5,,This move inflicts damage using the Attack or Sp. Atk stat—whichever is higher for the user.,Foe up to 10 tiles ahead,★★★★★
,Doom Desire,Steel,Special,7,5,,The target takes the damage of this move at the end of their 2nd turn from when this move is used. Cannot score a Critical Hit. Ignores Invulnerability.,Foe up to 10 tiles ahead,★★★★★
,Hydro Cannon,Water,Special,7,5,,User cannot use a Move for 1 round after this Move.,Foe up to 10 tiles ahead,★★★★★
,Origin Pulse,Water,Special,6,5,Confused,,Foes in a 2-tile range.,★★★★★
,Water Spout,Water,Special,7,5,,Move power reduces by 1 for each 10% of Health missing.,Foe up to 10 tiles ahead,★★★★★

`;
