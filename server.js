const http = require('http');

// === CONFIGURATION DEPUIS LES VARIABLES D'ENVIRONNEMENT ===
const VPS_HOST = process.env.VPS_HOST || '188.213.28.174';
const VPS_PORT = parseInt(process.env.VPS_PORT) || 80;
const UUID = process.env.UUID || 'f09a960a-4f1b-495f-9962-f1a14e5a7791';
const VPS_IP = process.env.VPS_IP || VPS_HOST;
const PORT = process.env.PORT || 8080;

// === PARAMÈTRES WEBSOCKET ===
const WS_PATH = '/';
const WS_HOST = process.env.WS_HOST || 'ultrategateworld.benbilal237free.xyz';
const SNI = process.env.SNI || 'main-bvxea6i-drgozoylycqca.fr-3.platformsh.site';
const ALPN = ['h2', 'http/1.1', 'h3'];
const FP = 'chrome';

const DOMAIN = process.env.DOMAIN || 'main-bvxea6i-drgozoylycqca.fr-3.platformsh.site';

// === PARAMÈTRES XMUX ===
const XMUX_SETTINGS = {
    maxConcurrency: "16-32",
    maxConnections: 0,
    cMaxReuseTimes: "1-5",
    hMaxRequestTimes: "600-900",
    hMaxReusableSecs: "1800-3000",
    hKeepAlivePeriod: 0
};

console.log('==========================================');
console.log('🚀 Bridge VLESS WebSocket - Upsun → VPS');
console.log(`📡 VPS cible: ${VPS_HOST}:${VPS_PORT}`);
console.log(`🔑 UUID: ${UUID}`);
console.log(`🌐 Domaine Upsun: ${DOMAIN}`);
console.log(`📦 XMUX: Activé`);
console.log('==========================================');

const server = http.createServer((req, res) => {
    const url = req.url;
    const domain = req.headers.host || DOMAIN;

    // === ROUTE PRINCIPALE ===
    if (url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Serveur Opérationnel\nMode Multiplexé Actif.\n');
        console.log(`📄 Page d'accueil affichée`);
        return;
    }

    // === ROUTE /CONFIG (lien VLESS WebSocket) ===
    if (url === '/config' || url === `/${UUID}` || url === `/${VPS_IP}`) {
        // Construction du lien VLESS avec WebSocket
        const vlessLink = `vless://${UUID}@${VPS_HOST}:${VPS_PORT}?encryption=none&type=ws&path=${encodeURIComponent(WS_PATH)}&host=${WS_HOST}&fp=${FP}&alpn=${ALPN.join('%2C')}&sni=${SNI}&flow=xtls-rprx-vision#VLESS-WS-Upsun`;
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(vlessLink + '\n');
        console.log(`🔗 Lien VLESS WS généré (${url})`);
        return;
    }

    // === PROXY WEBSOCKET VERS LE VPS ===
    const options = {
        hostname: VPS_HOST,
        port: VPS_PORT,
        path: url,
        method: req.method,
        headers: {
            ...req.headers,
            'host': WS_HOST,
            'user-agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'accept-encoding': 'gzip, deflate',
            'connection': 'keep-alive',
            'upgrade': 'websocket'
        },
        rejectUnauthorized: false
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
        console.log(`✅ Proxy: ${req.method} ${url} → ${proxyRes.statusCode}`);
    });

    proxyReq.on('error', (err) => {
        console.error(`❌ Erreur proxy VPS: ${err.message}`);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end(`Bad Gateway: Cannot reach VPS ${VPS_HOST}:${VPS_PORT}\n`);
    });

    req.pipe(proxyReq);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Bridge VLESS WS actif sur le port ${PORT}`);
    console.log(`🔗 LIENS VLESS DISPONIBLES :`);
    console.log(`   https://${DOMAIN}/config`);
    console.log(`   https://${DOMAIN}/${UUID}`);
    console.log(`   https://${DOMAIN}/${VPS_IP}`);
    console.log('');
});

server.on('error', (err) => {
    console.error(`❌ Erreur serveur: ${err.message}`);
});

process.on('SIGTERM', () => {
    console.log('🛑 Arrêt du serveur...');
    server.close(() => process.exit(0));
});
