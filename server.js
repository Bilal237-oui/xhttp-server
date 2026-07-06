const http = require('http');

// ⭐ L'IP STATIQUE de votre VPS
const VPS_IP = '188.213.28.174';

// ⭐ Configuration par défaut (utilisée si DB_CONFIG est absente)
const DEFAULT_CONFIG = {
    host: 'moust-x.benbilal237free.xyz',
    port: 80,
    uuid: '1ce34710-da69-43d3-b28d-1f3d5e2b6385',
    protocol: 'xhttp',
    path: '/',
    mode: 'auto',
    padding: '100-1000',
    security: 'none'
};

// Récupérer et parser la variable DB_CONFIG (si elle existe)
let dbConfig = null;
try {
    if (process.env.DB_CONFIG) {
        dbConfig = JSON.parse(process.env.DB_CONFIG);
        console.log('✅ Configuration VLESS chargée depuis DB_CONFIG');
    } else {
        console.log('ℹ️  Variable DB_CONFIG non trouvée, utilisation de la configuration par défaut');
        dbConfig = DEFAULT_CONFIG;
    }
    
    console.log('📋 Configuration utilisée :');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   UUID: ${dbConfig.uuid}`);
    console.log(`   Protocole: ${dbConfig.protocol}`);
    console.log(`   Path: ${dbConfig.path}`);
    console.log(`   Mode: ${dbConfig.mode}`);
    console.log(`   Padding: ${dbConfig.padding}`);
    console.log(`   Sécurité: ${dbConfig.security}`);
    
} catch (e) {
    console.error('❌ Erreur de parsing JSON, utilisation de la config par défaut');
    dbConfig = DEFAULT_CONFIG;
}

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

// Générer une page HTML (réutilisable)
function generateHtmlPage(vlessUrlIP, vlessUrlHost, showDefaultBadge = false) {
    return `
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
        .url-box a {
            color: #2ecc71;
            text-decoration: none;
        }
        .url-box a:hover {
            text-decoration: underline;
            color: #27ae60;
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
        .default-badge {
            background: #f39c12;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
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
            border: none;
            cursor: pointer;
            font-size: 14px;
        }
        .btn:hover { background: #27ae60; }
        .btn-copy {
            background: #3498db;
        }
        .btn-copy:hover { background: #2980b9; }
        .btn-group {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin: 10px 0;
        }
        .success-msg {
            color: #2ecc71;
            font-weight: bold;
            display: none;
            margin-left: 10px;
        }
        .note {
            font-size: 12px;
            color: #7f8c8d;
            margin-top: 10px;
        }
        .ip-link {
            display: inline-block;
            background: #e74c3c;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: bold;
            margin: 5px 0;
        }
        .ip-link:hover {
            background: #c0392b;
        }
    </style>
</head>
<body>
    <h1>✅ Serveur Opérationnel</h1>
    <p>Mode Multiplexé Actif.</p>
    ${showDefaultBadge ? '<p><span class="default-badge">⚙️ Configuration par défaut</span></p>' : ''}
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
    <div class="url-box">
        <a href="${vlessUrlIP}" target="_blank">${vlessUrlIP}</a>
    </div>
    <div class="btn-group">
        <a href="${vlessUrlIP}" class="btn" target="_blank">🔗 Ouvrir le lien</a>
        <button class="btn btn-copy" onclick="copyToClipboard('${vlessUrlIP}')">📋 Copier</button>
        <span id="copyMsg" class="success-msg">✅ Copié !</span>
    </div>
    
    <hr>
    
    <h3>🏷️ Avec Hostname :</h3>
    <div class="url-box">
        <a href="${vlessUrlHost}" target="_blank">${vlessUrlHost}</a>
    </div>
    <div class="btn-group">
        <a href="${vlessUrlHost}" class="btn" target="_blank">🔗 Ouvrir le lien</a>
        <button class="btn btn-copy" onclick="copyToClipboard('${vlessUrlHost}')">📋 Copier</button>
        <span id="copyMsgHost" class="success-msg">✅ Copié !</span>
    </div>
    
    <hr>
    
    <h2>🌍 Accès direct par IP :</h2>
    <p>Utilisez ce lien direct pour accéder à la configuration :</p>
    <a href="/${VPS_IP}" class="ip-link">🔗 /${VPS_IP}</a>
    
    <hr>
    <div class="note">
        ⚡ Le lien avec l'IP statique ${VPS_IP} est plus rapide car il évite la résolution DNS.<br>
        📱 Copiez le lien et importez-le dans votre client VLESS (Xray, v2rayNG, etc.)<br>
        💡 Si le lien ne s'ouvre pas automatiquement, copiez-le et collez-le dans votre client VLESS.<br>
        🖥️ Accédez à cette page via : <code>/${VPS_IP}</code>
    </div>

    <script>
        function copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    showSuccess('copyMsg');
                }).catch(() => {
                    fallbackCopy(text);
                });
            } else {
                fallbackCopy(text);
            }
        }

        function fallbackCopy(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showSuccess('copyMsg');
            } catch (err) {
                alert('Impossible de copier. Copiez manuellement le lien.');
            }
            document.body.removeChild(textarea);
        }

        function showSuccess(id) {
            const msg = document.getElementById(id);
            msg.style.display = 'inline';
            setTimeout(() => {
                msg.style.display = 'none';
            }, 3000);
        }
    </script>
</body>
</html>
    `;
}

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
    const url = req.url;
    
    // ⭐ NOUVEAU : Gérer la route /188.213.28.174
    if (url === `/${VPS_IP}`) {
        const vlessUrlIP = buildVlessUrl(dbConfig, true);
        const vlessUrlHost = buildVlessUrl(dbConfig, false);
        const showDefaultBadge = !process.env.DB_CONFIG;
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(generateHtmlPage(vlessUrlIP, vlessUrlHost, showDefaultBadge));
        return;
    }
    
    // Route racine (/)
    if (url === '/') {
        const vlessUrlIP = buildVlessUrl(dbConfig, true);
        const vlessUrlHost = buildVlessUrl(dbConfig, false);
        const showDefaultBadge = !process.env.DB_CONFIG;
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(generateHtmlPage(vlessUrlIP, vlessUrlHost, showDefaultBadge));
        return;
    }
    
    // Route pour les liens VLESS (redirection)
    if (url.startsWith('/vless/')) {
        const vlessUrlIP = buildVlessUrl(dbConfig, true);
        res.writeHead(302, { 'Location': vlessUrlIP });
        res.end();
        return;
    }
    
    // Toute autre route → 404
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - Page non trouvée\n');
});

// Utiliser le PORT fourni par Upsun
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur en écoute sur le port ${PORT}`);
    console.log(`📡 URL du serveur : https://main-bvxea6i-vhgmt4n3y4whs.fr-3.platformsh.site`);
    console.log(`🌐 IP VPS : ${VPS_IP}`);
    console.log(`📋 Configuration source : ${process.env.DB_CONFIG ? 'DB_CONFIG' : 'DÉFAUT'}`);
    console.log(`🔗 Lien VLESS généré : ${buildVlessUrl(dbConfig, true)}`);
    console.log(`🖥️ Accès direct : /${VPS_IP}`);
});
