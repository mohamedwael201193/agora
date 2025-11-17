import cors from 'cors';
import express from 'express';
import { getChainFromPool, getPoolStatus } from './chainService.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', chainPool: getPoolStatus() });
});

app.post('/api/chains/create', (req, res) => {
    try {
        res.json({ success: true, chainId: getChainFromPool() });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3001, () => {
    console.log('\n🚀 AGORA Backend: http://localhost:3001');
    const s = getPoolStatus();
    console.log(`📊 Chains: ${s.available}/${s.total} available\n`);
});
