import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
  Clan,
  ClanMember,
  Player,
  CurrentWar,
  WarLog,
  ClanWarLeagueGroup,
  CapitalRaidSeason,
} from '@/types/coc';

// Clash of Clans API Configuration
// Using Vite proxy to avoid CORS issues
const BASE_URL = '/api/coc';

// IMPORTANT: API token is now handled by the Vite proxy server
// This keeps the token secure and avoids CORS issues
// The token is defined in vite.config.ts

// Clan tag for the dashboard (URL-encoded)
const CLAN_TAG = '%232GQLU8YLP';

// Create axios instance with default config
const cocClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor for logging
cocClient.interceptors.request.use(
  (config) => {
    console.log(`[CoC API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[CoC API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
cocClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      const url = error.config?.url || '';

      // Suppress 404 errors for CWL endpoint - clan simply not in CWL
      const isCWL404 = status === 404 && url.includes('/currentwar/leaguegroup');

      if (!isCWL404) {
        console.error(`[CoC API] Error ${status}:`, data);

        if (status === 403) {
          console.error('[CoC API] Authentication failed. Please check your API token.');
        } else if (status === 404) {
          console.error('[CoC API] Resource not found.');
        } else if (status === 429) {
          console.error('[CoC API] Rate limit exceeded. Please wait before making more requests.');
        } else if (status === 503) {
          console.error('[CoC API] Service temporarily unavailable.');
        }
      }
    } else if (error.request) {
      console.error('[CoC API] No response received:', error.request);
    } else {
      console.error('[CoC API] Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Clan API functions
export const getClanInfo = async (): Promise<Clan> => {
  const response = await cocClient.get<Clan>(`/clans/${CLAN_TAG}`);
  return response.data;
};

export const getClanMembers = async (): Promise<ClanMember[]> => {
  const response = await cocClient.get<{ items: ClanMember[] }>(`/clans/${CLAN_TAG}/members`);
  return response.data.items;
};

// War API functions
export const getCurrentWar = async (): Promise<CurrentWar> => {
  const response = await cocClient.get<CurrentWar>(`/clans/${CLAN_TAG}/currentwar`);
  return response.data;
};

export const getWarLog = async (limit: number = 50): Promise<WarLog> => {
  const response = await cocClient.get<WarLog>(`/clans/${CLAN_TAG}/warlog?limit=${limit}`);
  return response.data;
};

// CWL API functions
export const getCWLGroup = async (): Promise<ClanWarLeagueGroup | null> => {
  try {
    const response = await cocClient.get<ClanWarLeagueGroup>(`/clans/${CLAN_TAG}/currentwar/leaguegroup`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Clan is not in CWL
      return null;
    }
    throw error;
  }
};

// Capital Raid API functions
export const getCapitalRaidSeasons = async (limit: number = 10): Promise<CapitalRaidSeason[]> => {
  try {
    const response = await cocClient.get<{ items: CapitalRaidSeason[] }>(`/clans/${CLAN_TAG}/capitalraidseasons?limit=${limit}`);
    return response.data.items;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

// Player API functions
export const getPlayerInfo = async (playerTag: string): Promise<Player> => {
  // Ensure player tag is URL-encoded
  const encodedTag = playerTag.startsWith('#') ? `%23${playerTag.slice(1)}` : playerTag;
  const response = await cocClient.get<Player>(`/players/${encodedTag}`);
  return response.data;
};

// Batch fetch player info (for war stars)
export const getBatchPlayerInfo = async (playerTags: string[]): Promise<Player[]> => {
  const promises = playerTags.map(tag =>
    getPlayerInfo(tag).catch(error => {
      console.error(`[CoC API] Failed to fetch player ${tag}:`, error);
      return null;
    })
  );

  const results = await Promise.all(promises);
  return results.filter((player): player is Player => player !== null);
};

// Helper function to format clan tag
export const formatTag = (tag: string): string => {
  return tag.startsWith('#') ? tag : `#${tag}`;
};

// Helper function to encode tag for API
export const encodeTag = (tag: string): string => {
  return tag.startsWith('#') ? `%23${tag.slice(1)}` : tag;
};

// Export the client for direct use if needed
export default cocClient;
