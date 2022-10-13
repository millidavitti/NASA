const launches = new Map();
let latestFlight = 100;
const launch = {
	flightNumber: 100,
	mission: "Kepler-exploration X",
	rocket: "Explorer 151",
	launchDate: new Date("December 27,2030"),
	target: "Kepler-442 b",
	customer: ["ETF", "NASA"],
	upcoming: true,
	success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
	return Array.from(launches.values());
}
function postLaunch(launch) {
	latestFlight++;
	launches.set(
		latestFlight,
		Object.assign(launch, {
			flightNumber: latestFlight,
			customer: ["ZTM", "NASA"],
			upcoming: true,
			success: true,
		}),
	);
}

function abortLaunch(id) {
	const aborted = launches.get(id);
	aborted.upcoming = aborted.success = false;
	console.log(aborted);
	return aborted;
}

function isValidId(id) {
	return launches.has(id);
}
module.exports = {
	getAllLaunches,
	postLaunch,
	abortLaunch,
	isValidId,
};
