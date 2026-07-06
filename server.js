const http = require('http');

// Récupérer et parser la variable DB_CONFIG
let dbConfig = null;
try {
    if (process.env.DB_CONFIG) {
        dbConfig = JSON.parse(process.env.DB_CONFIG);
        console.log(`Configuration DB chargée : host=${dbConfig.host}, port=${dbConfig.port}`);
    } else {
        console.log('Variable DB_CONFIG non trouvée, utilisation des valeurs par défaut');
        dbConfig = { host: 'localhost', port: 3306 };
    }
} catch (e) {
    console.error('Erreur de parsing DB_CONFIG :', e.message);
    dbConfig = { host: 'localhost', port: 3306 };
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        // Ajoute les infos DB dans la réponse (optionnel)
        res.end(`Serveur Opérationnel\nMode Multiplexé Actif.\nDB Config: ${dbConfig.host}:${dbConfig.port}\n`);
    } else {
        res.writeHead(404);
        res.end('Not Found\n');
    }
});

// ⚠️ IMPORTANT: utiliser process.env.PORT pour le port du serveur
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
    console.log(`DB configurée sur ${dbConfig.host}:${dbConfig.port}`);
});
