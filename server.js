// Štartovací súbor pre cPanel "Setup Node.js App" (Phusion Passenger) na Polar55.
// Passenger nastaví process.env.PORT automaticky.
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`E-TAXI Košice web beží na porte ${port}`);
  });
});
