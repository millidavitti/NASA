const { parse } = require("csv-parse");
const { createReadStream } = require("fs");
const path = require("path");
const planets = require("./planet.mongo");
function isHabitable(planet) {
	return (
		planet["koi_disposition"] === "CONFIRMED" &&
		planet["koi_insol"] > 0.36 &&
		planet["koi_insol"] < 1.11 &&
		planet["koi_prad"] < 1.6
	);
}
function loadPlanets() {
	return new Promise((resolve, reject) => {
		createReadStream(
			path.join(__dirname, "..", "..", "data", "kepler_data.csv"),
		)
			.pipe(
				parse({
					comment: "#",
					columns: true,
				}),
			)
			.on("data", (data) => {
				if (isHabitable(data)) postPlanet(data);
			})
			.on("error", (err) => {
				console.log(err);
				reject(err);
			})
			.on("end", async () => {
				const count = (await getAllPlanets()).length;
				console.log("Done streaming!");
				console.log("Found", count);
				resolve();
			});
	});
}

async function getAllPlanets() {
	return await planets.find({});
}

async function postPlanet(planet) {
	try {
		await planets.updateOne(
			{
				keplerName: planet.kepler_name,
			},
			{
				keplerName: planet.kepler_name,
			},
			{ upsert: true },
		);
	} catch (error) {
		console.error(`Could not update database: ${error}`);
	}
}

module.exports = { getAllPlanets, loadPlanets };
