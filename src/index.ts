import express = require('express');
import NodeCache = require('node-cache');


const app = express();

const sleep = async (durationInMs: number) => new Promise((resolve) => setTimeout(resolve, durationInMs));

async function fetchData() {
    await sleep(3000);
    return [{ id: 1 }, { id: 2 }, { id: 3 }]
}

const cache = new NodeCache({
    stdTTL: 3 * 60,
    checkperiod: 3
});

app.get('/api/data', async (_, res) => {
    if (!cache.has('data')) {
        const data = await fetchData();
        cache.set('data', data);
    }
    res.send(cache.get('data'));
});

app.get('/api/cache/stats', async (_, res) => {
    res.send(cache.stats);
});

app.delete('/api/cache', async (_, res) => {
    console.info('Cleaning cache...');
    const n = cache.del(cache.keys());
    console.info(`${n} cache entries were removed`);
    res.sendStatus(204);
});



app.listen(8080, () => console.log('Server started on port 8080'));