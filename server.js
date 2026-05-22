const http = require('http');
const UUID = 'f09a960a-4f1b-495f-9962-f1a14e5a7791';
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === '/') {
        res.writeHead(200);
        res.end('XHTTP OK\n');
        return;
    }
    if (url === `/${UUID}` || url === '/config') {
        const domain = req.headers.host || 'main-xxx.upsun.app';
        const vlessLink = `vless://${UUID}@${domain}:443?type=xhttp&encryption=none&path=/&host=${domain}&mode=auto&x_padding_bytes=100-1000&security=tls#XHTTP`;
        res.writeHead(200);
        res.end(vlessLink + '\n');
        return;
    }
    res.writeHead(404);
    res.end('Not Found\n');
});
server.listen(PORT, () => console.log(`✅ Port ${PORT}`));
