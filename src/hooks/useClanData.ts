import { useState, useEffect, useCallback } from 'react';
import {
  getClanInfo,
  getClanMembers,
  getCurrentWar,
  getWarLog,
  getCWLGroup,
  getCapitalRaidSeasons,
  getPlayerInfo,
  getBatchPlayerInfo,
} from '@/api/cocClient';
import {
  getCachedClanInfo,
  setCachedClanInfo,
  getCachedMembers,
  setCachedMembers,
  getCachedCurrentWar,
  setCachedCurrentWar,
  getCachedWarLog,
  setCachedWarLog,
  getCachedCWL,
  setCachedCWL,
  getCachedCapitalRaid,
  setCachedCapitalRaid,
  getCachedPlayer,
  setCachedPlayer,
  getPlayerWarStars,
  updateWarStarsCache,
} from '@/utils/cacheManager';
import type {
  Clan,
  ClanMember,
  Player,
  CurrentWar,
  WarLog,
  ClanWarLeagueGroup,
  CapitalRaidSeason,
} from '@/types/coc';

interface UseDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Clan Info Hook
export const useClanInfo = (): UseDataReturn<Clan> => {
  const [data, setData] = useState<Clan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedClanInfo();
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await getClanInfo();
      setData(response);
      setCachedClanInfo(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clan info');
      console.error('[useClanInfo] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Clan Members Hook
export const useClanMembers = (): UseDataReturn<ClanMember[]> => {
  const [data, setData] = useState<ClanMember[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedMembers();
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await getClanMembers();
      setData(response);
      setCachedMembers(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clan members');
      console.error('[useClanMembers] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Current War Hook
export const useWarData = (): UseDataReturn<CurrentWar> => {
  const [data, setData] = useState<CurrentWar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedCurrentWar();
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await getCurrentWar();
      setData(response);
      setCachedCurrentWar(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch war data');
      console.error('[useWarData] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// War Log Hook
export const useWarLog = (): UseDataReturn<WarLog> => {
  const [data, setData] = useState<WarLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedWarLog();
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await getWarLog();
      setData(response);
      setCachedWarLog(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch war log');
      console.error('[useWarLog] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// CWL Hook
export const useCWLData = (): UseDataReturn<ClanWarLeagueGroup | null> => {
  const [data, setData] = useState<ClanWarLeagueGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedCWL();
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await getCWLGroup();
      setData(response);
      if (response) {
        setCachedCWL(response);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch CWL data');
      console.error('[useCWLData] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Capital Raid Hook
export const useCapitalRaidData = (): UseDataReturn<CapitalRaidSeason[]> => {
  const [data, setData] = useState<CapitalRaidSeason[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedCapitalRaid();
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await getCapitalRaidSeasons();
      setData(response);
      setCachedCapitalRaid(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch capital raid data');
      console.error('[useCapitalRaidData] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Player Info Hook
export const usePlayerInfo = (playerTag: string): UseDataReturn<Player> => {
  const [data, setData] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!playerTag) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedPlayer(playerTag);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await getPlayerInfo(playerTag);
      setData(response);
      setCachedPlayer(playerTag, response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch player info');
      console.error('[usePlayerInfo] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [playerTag]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// War Stars Batch Fetch Hook
interface UseWarStarsReturn {
  warStarsMap: Record<string, number>;
  loading: boolean;
  fetchWarStars: (members: ClanMember[]) => Promise<void>;
}

export const useWarStars = (): UseWarStarsReturn => {
  const [warStarsMap, setWarStarsMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const fetchWarStars = useCallback(async (members: ClanMember[]) => {
    if (!members || members.length === 0) return;

    setLoading(true);
    
    try {
      // Check which members need war stars fetched
      const membersNeedingFetch = members.filter(member => {
        const cached = getPlayerWarStars(member.tag);
        return cached === null;
      });

      if (membersNeedingFetch.length === 0) {
        // All war stars are cached
        const cachedMap: Record<string, number> = {};
        members.forEach(member => {
          const stars = getPlayerWarStars(member.tag);
          if (stars !== null) {
            cachedMap[member.tag] = stars;
          }
        });
        setWarStarsMap(cachedMap);
        setLoading(false);
        return;
      }

      // Fetch in batches of 5 with 500ms delay
      const batchSize = 5;
      const updates: { tag: string; warStars: number }[] = [];

      for (let i = 0; i < membersNeedingFetch.length; i += batchSize) {
        const batch = membersNeedingFetch.slice(i, i + batchSize);
        const tags = batch.map(m => m.tag);

        try {
          const players = await getBatchPlayerInfo(tags);
          players.forEach(player => {
            if (player) {
              updates.push({ tag: player.tag, warStars: player.warStars });
            }
          });
        } catch (error) {
          console.error('[useWarStars] Batch fetch error:', error);
        }

        // Delay between batches (except for the last one)
        if (i + batchSize < membersNeedingFetch.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Update cache
      updateWarStarsCache(updates);

      // Build complete map
      const completeMap: Record<string, number> = {};
      members.forEach(member => {
        const stars = getPlayerWarStars(member.tag);
        if (stars !== null) {
          completeMap[member.tag] = stars;
        }
      });

      setWarStarsMap(completeMap);
    } catch (error) {
      console.error('[useWarStars] Error fetching war stars:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { warStarsMap, loading, fetchWarStars };
};

export default {
  useClanInfo,
  useClanMembers,
  useWarData,
  useWarLog,
  useCWLData,
  useCapitalRaidData,
  usePlayerInfo,
  useWarStars,
};
