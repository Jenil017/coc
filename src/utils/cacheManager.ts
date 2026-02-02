import type { CacheEntry, Clan, ClanMember, Player, CurrentWar, WarLog, ClanWarLeagueGroup, CapitalRaidSeason } from '@/types/coc';

// Cache keys
const CACHE_KEYS = {
  CLAN_INFO: 'coc_cache_clan_info',
  MEMBERS: 'coc_cache_members',
  CURRENT_WAR: 'coc_cache_current_war',
  WAR_LOG: 'coc_cache_war_log',
  CWL: 'coc_cache_cwl',
  CAPITAL_RAID: 'coc_cache_capital_raid',
  PLAYER: (tag: string) => `coc_cache_player_${tag}`,
  WAR_STARS: 'coc_cache_war_stars',
} as const;

// Cache TTL in milliseconds
const CACHE_TTL = {
  CLAN_INFO: 5 * 60 * 1000, // 5 minutes
  MEMBERS: 5 * 60 * 1000, // 5 minutes
  CURRENT_WAR: 2 * 60 * 1000, // 2 minutes (war changes frequently)
  WAR_LOG: 10 * 60 * 1000, // 10 minutes
  CWL: 5 * 60 * 1000, // 5 minutes
  CAPITAL_RAID: 30 * 60 * 1000, // 30 minutes
  PLAYER: 30 * 60 * 1000, // 30 minutes
  WAR_STARS: 60 * 60 * 1000, // 1 hour
} as const;

// Generic function to get cached data
const getCachedData = <T>(key: string, ttl: number): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    
    if (now - entry.timestamp > ttl) {
      // Cache expired
      localStorage.removeItem(key);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    console.error('[Cache] Error reading cache:', error);
    return null;
  }
};

// Generic function to set cached data
const setCachedData = <T>(key: string, data: T): void => {
  try {
    const entry: CacheEntry<T> = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error('[Cache] Error writing cache:', error);
  }
};

// Clear specific cache
const clearCache = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('[Cache] Error clearing cache:', error);
  }
};

// Clear all CoC cache
const clearAllCache = (): void => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('coc_cache_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('[Cache] Error clearing all cache:', error);
  }
};

// Clan info cache
export const getCachedClanInfo = (): Clan | null => {
  return getCachedData<Clan>(CACHE_KEYS.CLAN_INFO, CACHE_TTL.CLAN_INFO);
};

export const setCachedClanInfo = (data: Clan): void => {
  setCachedData(CACHE_KEYS.CLAN_INFO, data);
};

// Members cache
export const getCachedMembers = (): ClanMember[] | null => {
  return getCachedData<ClanMember[]>(CACHE_KEYS.MEMBERS, CACHE_TTL.MEMBERS);
};

export const setCachedMembers = (data: ClanMember[]): void => {
  setCachedData(CACHE_KEYS.MEMBERS, data);
};

// Current war cache
export const getCachedCurrentWar = (): CurrentWar | null => {
  return getCachedData<CurrentWar>(CACHE_KEYS.CURRENT_WAR, CACHE_TTL.CURRENT_WAR);
};

export const setCachedCurrentWar = (data: CurrentWar): void => {
  setCachedData(CACHE_KEYS.CURRENT_WAR, data);
};

// War log cache
export const getCachedWarLog = (): WarLog | null => {
  return getCachedData<WarLog>(CACHE_KEYS.WAR_LOG, CACHE_TTL.WAR_LOG);
};

export const setCachedWarLog = (data: WarLog): void => {
  setCachedData(CACHE_KEYS.WAR_LOG, data);
};

// CWL cache
export const getCachedCWL = (): ClanWarLeagueGroup | null => {
  return getCachedData<ClanWarLeagueGroup>(CACHE_KEYS.CWL, CACHE_TTL.CWL);
};

export const setCachedCWL = (data: ClanWarLeagueGroup): void => {
  setCachedData(CACHE_KEYS.CWL, data);
};

// Capital raid cache
export const getCachedCapitalRaid = (): CapitalRaidSeason[] | null => {
  return getCachedData<CapitalRaidSeason[]>(CACHE_KEYS.CAPITAL_RAID, CACHE_TTL.CAPITAL_RAID);
};

export const setCachedCapitalRaid = (data: CapitalRaidSeason[]): void => {
  setCachedData(CACHE_KEYS.CAPITAL_RAID, data);
};

// Player cache
export const getCachedPlayer = (tag: string): Player | null => {
  return getCachedData<Player>(CACHE_KEYS.PLAYER(tag), CACHE_TTL.PLAYER);
};

export const setCachedPlayer = (tag: string, data: Player): void => {
  setCachedData(CACHE_KEYS.PLAYER(tag), data);
};

// War stars cache (stores mapping of player tag to war stars)
interface WarStarsMap {
  [tag: string]: number;
}

export const getCachedWarStars = (): WarStarsMap | null => {
  return getCachedData<WarStarsMap>(CACHE_KEYS.WAR_STARS, CACHE_TTL.WAR_STARS);
};

export const setCachedWarStars = (data: WarStarsMap): void => {
  setCachedData(CACHE_KEYS.WAR_STARS, data);
};

// Update war stars for specific players (batch update)
export const updateWarStarsCache = (updates: { tag: string; warStars: number }[]): void => {
  const current = getCachedWarStars() || {};
  
  updates.forEach(({ tag, warStars }) => {
    current[tag] = warStars;
  });
  
  setCachedWarStars(current);
};

// Get war stars for a specific player
export const getPlayerWarStars = (tag: string): number | null => {
  const cache = getCachedWarStars();
  return cache?.[tag] ?? null;
};

// Check if cache is valid (not expired)
export const isCacheValid = (key: string, ttl: number): boolean => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return false;

    const entry: CacheEntry<unknown> = JSON.parse(cached);
    const now = Date.now();
    
    return now - entry.timestamp <= ttl;
  } catch {
    return false;
  }
};

// Get cache timestamp
export const getCacheTimestamp = (key: string): number | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<unknown> = JSON.parse(cached);
    return entry.timestamp;
  } catch {
    return null;
  }
};

// Export cache utilities
export const cacheManager = {
  getCachedData,
  setCachedData,
  clearCache,
  clearAllCache,
  isCacheValid,
  getCacheTimestamp,
  CACHE_KEYS,
  CACHE_TTL,
};

export default cacheManager;
