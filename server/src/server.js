const http = require("http");
const app = require("./app");
const { loadPlanets } = require("./model/planets.model");
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function listen() {
	await loadPlanets();
	server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

listen();
