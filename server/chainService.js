/**
 * Linera Chain Management Service
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const CHAIN_POOL_FILE = '/tmp/agora-chain-pool.json';

export function initializeChainPool(count = 10) {
    const chains = [];

    // Get the default chain to use as parent
    const walletOutput = execSync('linera wallet show 2>&1', { encoding: 'utf-8', env: process.env });
    const parentMatch = walletOutput.match(/\b[a-f0-9]{64}\b/);

    if (!parentMatch) {
        throw new Error('No default chain found in wallet');
    }

    const parentChain = parentMatch[0];
    console.log(`Using parent chain: ${parentChain.substring(0, 8)}...\n`);

    for (let i = 0; i < count; i++) {
        const output = execSync(`linera open-chain --from ${parentChain} 2>&1`, {
            encoding: 'utf-8',
            env: process.env
        });

        // Extract the NEW chain ID (should be different from parent)
        const matches = output.match(/\b[a-f0-9]{64}\b/g);

        if (matches && matches.length > 0) {
            // The new chain ID is usually in the output
            const newChain = matches[matches.length - 1]; // Last match is usually the new chain

            if (newChain !== parentChain && !chains.find(c => c.chainId === newChain)) {
                chains.push({ chainId: newChain, used: false });
                console.log(`✅ Chain ${i + 1}/${count}: ${newChain.substring(0, 8)}...`);
            } else {
                console.log(`⚠️  Chain ${i + 1}/${count}: Same as parent, trying again...`);
                i--; // Retry
            }
        }
    }

    writeFileSync(CHAIN_POOL_FILE, JSON.stringify({ chains, created: new Date().toISOString() }, null, 2));
    console.log(`\n✅ Created pool of ${chains.length} unique chains`);
    return chains;
} export function getChainFromPool() {
    if (!existsSync(CHAIN_POOL_FILE)) throw new Error('Chain pool not initialized');

    const poolData = JSON.parse(readFileSync(CHAIN_POOL_FILE, 'utf-8'));
    const available = poolData.chains.find(c => !c.used);

    if (!available) throw new Error('No available chains');

    available.used = true;
    available.usedAt = new Date().toISOString();
    writeFileSync(CHAIN_POOL_FILE, JSON.stringify(poolData, null, 2));

    console.log(`✅ Allocated: ${available.chainId.substring(0, 8)}...`);
    return available.chainId;
}

export function getPoolStatus() {
    if (!existsSync(CHAIN_POOL_FILE)) return { total: 0, used: 0, available: 0 };

    const poolData = JSON.parse(readFileSync(CHAIN_POOL_FILE, 'utf-8'));
    const used = poolData.chains.filter(c => c.used).length;

    return { total: poolData.chains.length, used, available: poolData.chains.length - used };
}
