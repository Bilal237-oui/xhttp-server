const http = require('http');

// Récupérer et parser la variable DB_CONFIG
let dbConfig = null;
try {
    if (process.env.DB_CONFIG) {
        dbConfig = JSON.parse(process.env.DB_CONFIG);
        console.log('✅ Configuration VLESS chargée :');
        console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`   UUID: ${dbConfig.uuid}`);
        console.log(`   Protocole: ${dbConfig.protocol}`);
        console.log(`   Path: ${dbConfig.path}`);
        console.log(`   Mode: ${dbConfig.mode}`);
        console.log(`   Padding: ${dbConfig.padding}`);
        console.log(`   Sécurité: ${dbConfig.security}`);
    } else {
        console.error('❌ Variable DB_CONFIG non trouvée !');
        process.exit(1);
    }
} catch (e) {
    console.error('❌ Erreur de parsing JSON :', e.message);
    process.exit(1);
}

// Construire l'URL de connexion VLESS
function buildVlessUrl(config) {
    return `vless://${config.uuid}@${config.host}:${config.port}?` +
           `type=${config.protocol}&` +
           `encryption=none&` +
           `path=${encodeURIComponent(config.path)}&` +
           `mode=${config.mode}&` +
           `x_padding_bytes=${config.padding}&` +
           `security=${config.security}`;
}

const vlessUrl = buildVlessUrl(dbConfig);
console.log(`🔗 URL VLESS générée : ${vlessUrl}`);

// Serveur HTTP pour afficher les infos
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
<!DOCTYPE html>
<html>
<head><title>Configuration VLESS</title></head>
<body>
<h1>✅ Serveur Opérationnel</h1>
<p>Mode Multiplexé Actif.</p>
<h2>Configuration VLESS :</h2>
<ul>
    <li><strong>Host :</strong> ${dbConfig.host}</li>
    <li><strong>Port :</strong> ${dbConfig.port}</li>
    <li><strong>UUID :</strong> ${dbConfig.uuid}</li>
    <li><strong>Protocole :</strong> ${dbConfig.protocol}</li>
    <li><strong>Path :</strong> ${dbConfig.path}</li>
    <li><strong>Mode :</strong> ${dbConfig.mode}</li>
    <li><strong>Padding :</strong> ${dbConfig.padding}</li>
</ul>
<h3>📋 Lien complet :</h3>
<code style="word-break:break-all;background:#f0f0f0;padding:10px;display:block;">
${vlessUrl}
</code>
</body>
</html>
        `);
    } else {
        res.writeHead(404);
        res.end('Not Found\n');
    }
});

// Utiliser le PORT fourni par Upsun
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur en écoute sur le port ${PORT}`);
    console.log(`📡 URL du serveur : https://main-bvxea6i-vhgmt4n3y4whs.fr-3.platformsh.site`);
});
