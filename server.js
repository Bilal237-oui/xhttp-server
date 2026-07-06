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

// ⭐ L'IP STATIQUE de votre VPS
const VPS_IP = '188.213.28.174';

// Construire l'URL de connexion VLESS avec IP
function buildVlessUrl(config, useIP = true) {
    const target = useIP ? VPS_IP : config.host;
    return `vless://${config.uuid}@${target}:${config.port}?` +
           `type=${config.protocol}&` +
           `encryption=none&` +
           `path=${encodeURIComponent(config.path)}&` +
           `mode=${config.mode}&` +
           `x_padding_bytes=${config.padding}&` +
           `security=${config.security}`;
}

// Serveur HTTP pour afficher les infos
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        const vlessUrlIP = buildVlessUrl(dbConfig, true);
        const vlessUrlHost = buildVlessUrl(dbConfig, false);
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>Configuration VLESS</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #2ecc71; }
        .info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .url-box { 
            background: #2d3436; 
            color: #dfe6e9; 
            padding: 15px; 
            border-radius: 5px; 
            word-break: break-all; 
            font-family: monospace;
            font-size: 14px;
        }
        .label { font-weight: bold; color: #2d3436; }
        .ip-badge { 
            background: #e74c3c; 
            color: white; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 16px;
            font-weight: bold;
        }
        .host-badge {
            background: #3498db;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: bold;
        }
        hr { border: 1px solid #eee; margin: 20px 0; }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #2ecc71;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 5px 0;
        }
        .btn:hover { background: #27ae60; }
    </style>
</head>
<body>
    <h1>✅ Serveur Opérationnel</h1>
    <p>Mode Multiplexé Actif.</p>
    <hr>
    <h2>Configuration VLESS :</h2>
    <div class="info">
        <p><span class="label">Hostname :</span> ${dbConfig.host}</p>
        <p><span class="label">📌 IP VPS :</span> <span class="ip-badge">${VPS_IP}</span></p>
        <p><span class="label">Port :</span> ${dbConfig.port}</p>
        <p><span class="label">UUID :</span> <code>${dbConfig.uuid}</code></p>
        <p><span class="label">Protocole :</span> ${dbConfig.protocol}</p>
        <p><span class="label">Path :</span> ${dbConfig.path || '/'}</p>
        <p><span class="label">Mode :</span> ${dbConfig.mode}</p>
        <p><span class="label">Padding :</span> ${dbConfig.padding}</p>
        <p><span class="label">Sécurité :</span> ${dbConfig.security}</p>
    </div>
    
    <hr>
    
    <h2>🔗 Liens de connexion :</h2>
    
    <h3>🌐 Avec IP (Recommandé) :</h3>
    <div class="url-box">${vlessUrlIP}</div>
    <br>
    <a href="${vlessUrlIP}" class="btn" target="_blank">📋 Copier le lien</a>
    
    <hr>
    
    <h3>🏷️ Avec Hostname :</h3>
    <div class="url-box">${vlessUrlHost}</div>
    
    <hr>
    <p style="font-size: 12px; color: #7f8c8d;">
        ⚡ Le lien avec l'IP statique ${VPS_IP} est plus rapide car il évite la résolution DNS.<br>
        📱 Copiez le lien et importez-le dans votre client VLESS (Xray, v2rayNG, etc.)
    </p>
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
    console.log(`🌐 IP VPS : ${VPS_IP}`);
    console.log(`🔗 Lien VLESS généré : ${buildVlessUrl(dbConfig, true)}`);
});
