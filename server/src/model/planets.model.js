const { parse } = require("csv-parse");
const { createReadStream } = require("fs");
const path = require("path");
const planets = [];
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
			.on("data", (chunk) => {
				if (isHabitable(chunk)) planets.push(chunk);
			})
			.on("error", (err) => {
				console.log(err);
				reject(err);
			})
			.on("end", () => {
				console.log("Done streaming!");
				resolve();
			});
	});
}

function getAllPlanets() {
	return planets;
}

module.exports = { getAllPlanets, loadPlanets };
