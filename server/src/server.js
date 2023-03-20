const http = require("http");

require("dotenv").config();

const app = require("./app");
const { connectdb } = require("./database/mongo");
const { loadPlanets } = require("./model/planets.model");
const { loadLaunchData } = require("./model/launches.model");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
000;

async function listen() {
	connectdb();
	await loadPlanets();
	await loadLaunchData();
	server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

listen();
