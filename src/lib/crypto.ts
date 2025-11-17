/**
 * Cryptographic utilities for Agora commit-reveal mechanism
 * Uses blake3 hashing to match the Rust contract implementation
 */

import { blake3 } from 'hash-wasm';

/**
 * Convert hex string to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return out;
}

/**
 * Convert Uint8Array to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a commitment hash for the commit-reveal mechanism
 * 
 * Format matches contract: blake3(format!("{:?}:{}", choice, salt_hex))
 * - choice: "Yes" or "No" (Rust Debug format)
 * - salt_hex: arbitrary-length random salt in hex
 * 
 * @param choice - YES or NO
 * @param saltHex - Random salt in hex format
 * @returns Commitment hash in hex format (64 characters)
 */
export async function makeCommitmentHex(choice: 'YES' | 'NO', saltHex: string): Promise<string> {
  // Match Rust Debug format: Yes or No (not uppercase)
  const choiceStr = choice === 'YES' ? 'Yes' : 'No';
  const preimage = `${choiceStr}:${saltHex}`;
  
  console.log('[crypto] Generating commitment:', { choice, saltHex, preimage });
  
  const hash = await blake3(preimage);
  console.log('[crypto] Generated commitment hash:', hash);
  
  return hash;
}

/**
 * Generate a secure random salt in hex format
 * 
 * @param bytes - Number of random bytes (default 32)
 * @returns Random salt in hex format
 */
export function randomSaltHex(bytes = 32): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return bytesToHex(buf);
}

/**
 * Verify a commitment against a revealed choice and salt
 * Used for client-side validation before submitting reveal
 * 
 * @param commitment - Original commitment hash
 * @param choice - Revealed choice
 * @param saltHex - Revealed salt
 * @returns true if commitment matches
 */
export async function verifyCommitment(
  commitment: string,
  choice: 'YES' | 'NO',
  saltHex: string
): Promise<boolean> {
  const recomputed = await makeCommitmentHex(choice, saltHex);
  return recomputed === commitment;
}
