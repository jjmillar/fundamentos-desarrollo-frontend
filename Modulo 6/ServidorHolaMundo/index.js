const http = require("http");
const servidor = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8"});
    res.end(`
        <h1>Hola Mundo!</h1>
        <p>Bienvenidos a nuestro segundo proyecto en Node</p>
    `);
});
const puerto = 3000;
servidor.listen(puerto, () => {
    console.log(`Servidor en funcionamiento. http://localhost:${puerto}`);
});