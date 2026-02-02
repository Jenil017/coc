// Clash of Clans API Type Definitions

export interface Clan {
  tag: string;
  name: string;
  type: string;
  description?: string;
  location?: {
    id: number;
    name: string;
    isCountry: boolean;
    countryCode?: string;
  };
  badgeUrls: {
    small: string;
    medium: string;
    large: string;
  };
  clanLevel: number;
  clanPoints: number;
  clanBuilderBasePoints?: number;
  clanCapitalPoints?: number;
  requiredTrophies: number;
  requiredTownhallLevel?: number;
  requiredBuilderBaseTrophies?: number;
  warFrequency: string;
  warWinStreak: number;
  warWins: number;
  warTies: number;
  warLosses: number;
  isWarLogPublic: boolean;
  warLeague?: {
    id: number;
    name: string;
  };
  members: number;
  memberList?: ClanMember[];
  labels?: ClanLabel[];
  chatLanguage?: {
    id: number;
    name: string;
    languageCode: string;
  };
}

export interface ClanMember {
  tag: string;
  name: string;
  role: 'leader' | 'coLeader' | 'admin' | 'member';
  expLevel: number;
  league?: League;
  trophies: number;
  builderBaseTrophies?: number;
  versusTrophies?: number;
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  playerHouse?: PlayerHouse;
  townHallLevel?: number;
  warStars?: number;
}

export interface League {
  id: number;
  name: string;
  iconUrls?: {
    small: string;
    tiny: string;
    medium: string;
  };
}

export interface PlayerHouse {
  elements: {
    type: string;
    id: number;
  }[];
}

export interface ClanLabel {
  id: number;
  name: string;
  iconUrls: {
    small: string;
    medium: string;
  };
}

export interface Player {
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  attackWins: number;
  defenseWins: number;
  builderHallLevel?: number;
  builderBaseTrophies?: number;
  bestBuilderBaseTrophies?: number;
  versusBattleWins?: number;
  role?: string;
  warPreference?: 'in' | 'out';
  donations: number;
  donationsReceived: number;
  clan?: {
    tag: string;
    name: string;
    clanLevel: number;
    badgeUrls: {
      small: string;
      medium: string;
      large: string;
    };
  };
  league?: League;
  builderBaseLeague?: League;
  achievements: Achievement[];
  troops: Troop[];
  spells: Spell[];
  heroes: Hero[];
  heroEquipment?: HeroEquipment[];
  labels: PlayerLabel[];
  townHallLevel: number;
  townHallWeaponLevel?: number;
  clanCapitalContributions?: number;
  playerHouse?: PlayerHouse;
}

export interface Achievement {
  name: string;
  stars: number;
  value: number;
  target: number;
  info: string;
  completionInfo?: string;
  village: 'home' | 'builderBase' | 'clanCapital';
}

export interface Troop {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase' | 'clanCapital';
  superTroopIsActive?: boolean;
}

export interface Spell {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase' | 'clanCapital';
}

export interface Hero {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase' | 'clanCapital';
  equipment?: HeroEquipment[];
}

export interface HeroEquipment {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase' | 'clanCapital';
}

export interface PlayerLabel {
  id: number;
  name: string;
  iconUrls: {
    small: string;
    medium: string;
  };
}

export interface CurrentWar {
  state: 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
  teamSize: number;
  attacksPerMember?: number;
  battleModifier?: string;
  preparationStartTime?: string;
  startTime?: string;
  endTime?: string;
  clan: WarClan;
  opponent: WarClan;
}

export interface WarClan {
  tag: string;
  name: string;
  badgeUrls: {
    small: string;
    medium: string;
    large: string;
  };
  clanLevel: number;
  attacks: number;
  stars: number;
  destructionPercentage: number;
  members?: WarMember[];
}

export interface WarMember {
  tag: string;
  name: string;
  townhallLevel: number;
  mapPosition: number;
  opponentAttacks?: number;
  bestOpponentAttack?: WarAttack;
  attacks?: WarAttack[];
}

export interface WarAttack {
  attackerTag: string;
  defenderTag: string;
  stars: number;
  destructionPercentage: number;
  order: number;
  duration: number;
}

export interface WarLog {
  items: WarLogEntry[];
  paging?: {
    cursors?: {
      after?: string;
      before?: string;
    };
  };
}

export interface WarLogEntry {
  result?: 'win' | 'lose' | 'tie';
  endTime: string;
  teamSize: number;
  attacksPerMember?: number;
  battleModifier?: string;
  clan: WarLogClan;
  opponent: WarLogClan;
}

export interface WarLogClan {
  tag: string;
  name: string;
  badgeUrls: {
    small: string;
    medium: string;
    large: string;
  };
  clanLevel: number;
  stars: number;
  destructionPercentage: number;
}

export interface ClanWarLeagueGroup {
  state: 'notInWar' | 'preparation' | 'inWar' | 'ended';
  season: string;
  clans: CWLClan[];
  rounds: CWLRound[];
}

export interface CWLClan {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: {
    small: string;
    medium: string;
    large: string;
  };
  members: CWLMember[];
}

export interface CWLMember {
  tag: string;
  name: string;
  townhallLevel: number;
  mapPosition: number;
}

export interface CWLRound {
  warTags: string[];
}

export interface CapitalRaidSeason {
  attackLog: CapitalRaidAttackLogEntry[];
  defenseLog: CapitalRaidDefenseLogEntry[];
  state: string;
  startTime: string;
  endTime: string;
  capitalTotalLoot: number;
  raidsCompleted: number;
  totalAttacks: number;
  enemyDistrictsDestroyed: number;
  offensiveReward: number;
  defensiveReward: number;
  members?: CapitalRaidMember[];
}

export interface CapitalRaidAttackLogEntry {
  defender: {
    tag: string;
    name: string;
    level: number;
    badgeUrls: {
      small: string;
      medium: string;
      large: string;
    };
  };
  attackCount: number;
  districtCount: number;
  districtsDestroyed: number;
  districts: CapitalDistrict[];
}

export interface CapitalRaidDefenseLogEntry {
  attacker: {
    tag: string;
    name: string;
    level: number;
    badgeUrls: {
      small: string;
      medium: string;
      large: string;
    };
  };
  attackCount: number;
  districtCount: number;
  districtsDestroyed: number;
  districts: CapitalDistrict[];
}

export interface CapitalDistrict {
  id: number;
  name: string;
  districtHallLevel: number;
  destructionPercent: number;
  attackCount: number;
  totalLooted: number;
}

export interface CapitalRaidMember {
  tag: string;
  name: string;
  attacks: number;
  attackLimit: number;
  bonusAttackLimit: number;
  capitalResourcesLooted: number;
}

export interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

export type SortOption = 'trophies' | 'townHall' | 'donations' | 'warStars' | 'activity';
export type RoleFilter = 'all' | 'leader' | 'coLeader' | 'admin' | 'member';
export type THFilter = 'all' | '16' | '15' | '14' | '13' | '12' | '11' | '10' | '9' | '8' | '7' | '6' | '5';
