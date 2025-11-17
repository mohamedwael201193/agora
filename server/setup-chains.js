#!/usr/bin/env node

/**
 * Initialize chain pool for AGORA markets
 * Run this BEFORE starting linera service
 */

import { initializeChainPool } from './chainService.js';

const count = parseInt(process.argv[2]) || 10;

console.log('🔧 AGORA Chain Pool Setup');
console.log('==========================\n');

try {
    initializeChainPool(count);
    console.log('\n✅ Setup complete! Now start linera service and the backend.\n');
    process.exit(0);
} catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
}
