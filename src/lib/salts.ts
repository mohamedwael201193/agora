/**
 * Salt persistence for commit-reveal mechanism
 * Stores salts in localStorage so users can reveal their bets later
 */

const STORAGE_KEY = 'agora:salt:v1';

interface SaltMap {
  [key: string]: {
    saltHex: string;
    choice: 'YES' | 'NO';
    timestamp: number;
    commitmentHex: string;
  };
}

/**
 * Generate a unique key for a market
 */
function makeKey(appId: string, chainId: string, marketId: number): string {
  return `${appId}:${chainId}:${marketId}`;
}

/**
 * Save a salt for a specific market
 */
export function saveSalt(
  appId: string,
  chainId: string,
  marketId: number,
  saltHex: string,
  choice: 'YES' | 'NO',
  commitmentHex: string
): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const map: SaltMap = raw ? JSON.parse(raw) : {};
    
    const key = makeKey(appId, chainId, marketId);
    map[key] = {
      saltHex,
      choice,
      timestamp: Date.now(),
      commitmentHex,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    console.log('[salts] Saved salt for market:', { appId, chainId, marketId, choice });
  } catch (error) {
    console.error('[salts] Failed to save salt:', error);
  }
}

/**
 * Load a salt for a specific market
 */
export function loadSalt(
  appId: string,
  chainId: string,
  marketId: number
): { saltHex: string; choice: 'YES' | 'NO'; commitmentHex: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    
    const map: SaltMap = JSON.parse(raw);
    const key = makeKey(appId, chainId, marketId);
    const data = map[key];
    
    if (!data) return null;
    
    console.log('[salts] Loaded salt for market:', { appId, chainId, marketId, choice: data.choice });
    return {
      saltHex: data.saltHex,
      choice: data.choice,
      commitmentHex: data.commitmentHex,
    };
  } catch (error) {
    console.error('[salts] Failed to load salt:', error);
    return null;
  }
}

/**
 * Delete a salt for a specific market
 */
export function deleteSalt(appId: string, chainId: string, marketId: number): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    
    const map: SaltMap = JSON.parse(raw);
    const key = makeKey(appId, chainId, marketId);
    delete map[key];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    console.log('[salts] Deleted salt for market:', { appId, chainId, marketId });
  } catch (error) {
    console.error('[salts] Failed to delete salt:', error);
  }
}

/**
 * Get all stored salts (for debugging/management)
 */
export function getAllSalts(): SaltMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('[salts] Failed to get all salts:', error);
    return {};
  }
}

/**
 * Clear all stored salts
 */
export function clearAllSalts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[salts] Cleared all salts');
  } catch (error) {
    console.error('[salts] Failed to clear salts:', error);
  }
}
