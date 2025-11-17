/**
 * Linera Wallet Types and Interfaces
 * Manages wallet data for both local and Conway testnet networks
 */

export interface LineraWallet {
  chainId: string;
  publicKey: string;
  privateKey: string; // In production, this should be encrypted
  balance: string;
  network: 'local' | 'conway';
  owner?: string; // Owner address
  timestamp: number; // When wallet was created/claimed
}

export interface WalletStorage {
  save(wallet: LineraWallet): Promise<void>;
  load(): Promise<LineraWallet | null>;
  clear(): Promise<void>;
  exists(): Promise<boolean>;
}

/**
 * IndexedDB-based wallet storage for browser persistence
 * More secure than localStorage for private key storage
 */
export class IndexedDBWalletStorage implements WalletStorage {
  private readonly DB_NAME = 'agora-wallet';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'wallet';

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };
    });
  }

  async save(wallet: LineraWallet): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(wallet, 'current');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async load(): Promise<LineraWallet | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get('current');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async clear(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete('current');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async exists(): Promise<boolean> {
    const wallet = await this.load();
    return wallet !== null;
  }
}

/**
 * Wallet export/import utilities for backup/recovery
 */
export interface WalletExport {
  version: string;
  wallet: LineraWallet;
  exportedAt: string;
}

export function exportWallet(wallet: LineraWallet): string {
  const exportData: WalletExport = {
    version: '1.0.0',
    wallet,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(exportData, null, 2);
}

export function importWallet(jsonString: string): LineraWallet {
  try {
    const exportData: WalletExport = JSON.parse(jsonString);
    
    // Validate export data structure
    if (!exportData.wallet || !exportData.wallet.chainId || !exportData.wallet.privateKey) {
      throw new Error('Invalid wallet export format');
    }

    return exportData.wallet;
  } catch (error) {
    throw new Error(`Failed to import wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Download wallet as JSON file for backup
 */
export function downloadWalletBackup(wallet: LineraWallet): void {
  const exportString = exportWallet(wallet);
  const blob = new Blob([exportString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agora-wallet-${wallet.network}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Truncate chain ID or address for display
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format balance for display (convert from smallest unit)
 */
export function formatBalance(balance: string): string {
  const numBalance = parseFloat(balance);
  if (isNaN(numBalance)) return '0';
  
  // Assuming 6 decimal places (adjust based on Linera token decimals)
  const formatted = (numBalance / 1_000_000).toFixed(2);
  return formatted;
}
