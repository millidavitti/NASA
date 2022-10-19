const axios = require("axios");
const launchesMongo = require("./launches.mongo");
const dbLaunches = require("./launches.mongo");
const dbPlanets = require("./planet.mongo");

const SPACEX_API = "https://api.spacexdata.com/v5/launches/query";

async function populateLaunches() {
	console.log("Downloading launch data...");
	const response = await axios.post(SPACEX_API, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: "rocket",
					select: {
						name: 1,
					},
				},
				{
					path: "payloads",
					select: {
						customers: 1,
					},
				},
			],
		},
	});

	if (response.status !== 200) {
		console.log("Something unexpected happend");
		throw new Error("Launch data download failed");
	}
	const launchDocs = response.data.docs;

	for (const launchDoc of launchDocs) {
		const payloads = launchDoc["payloads"];
		const customers = payloads.flatMap((payload) => payload["customers"]);
		const launch = {
			flightNumber: launchDoc["flight_number"],
			mission: launchDoc["name"],
			rocket: launchDoc["rocket"]["name"],
			launchDate: launchDoc["date_local"],
			upcoming: launchDoc["upcoming"],
			success: launchDoc["success"],
			customers,
		};

		console.log(launch.flightNumber, launch.mission);
		// TODO: Populate launches
		await dbPostLaunch(launch);
	}
}

async function loadLaunchData() {
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: "Falcon 1",
		mission: "FalconSat",
	});

	if (firstLaunch) {
		console.log("Launch data exists already...");
		return;
	} else await populateLaunches();
}

async function scheduleLaunch(launch) {
	const isValidPlanet = await dbPlanets.findOne({
		keplerName: launch.target,
	});
	if (!isValidPlanet) throw new Error("Not a valid planet");

	let latest = await latestFlightNum();
	latest++;
	const newLaunch = Object.assign(launch, {
		flightNumber: latest,
		customers: ["ZTM", "NASA"],
		upcoming: true,
		success: true,
	});
	await dbPostLaunch(newLaunch);
}

async function dbPostLaunch(launch) {
	await dbLaunches.findOneAndUpdate(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{
			upsert: true,
		},
	);
}

async function getAllLaunches(skip, limit) {
	return await dbLaunches.find({}, { _id: 0, __v: 0 }).skip(skip).limit(limit);
}

async function latestFlightNum() {
	const latest = await launchesMongo.findOne().sort("-flightNumber");
	if (!latest) return 100;

	return latest.flightNumber;
}

async function abortLaunch(id) {
	const aborted = await launchesMongo.updateOne(
		{ flightNumber: id },
		{ upcoming: false, success: false },
	);

	return aborted.modifiedCount === 1;
}

async function findLaunch(filter) {
	return await launchesMongo.findOne(filter);
}

async function isValidId(id) {
	return await findLaunch({ flightNumber: id });
}

module.exports = {
	loadLaunchData,
	getAllLaunches,
	scheduleLaunch,
	abortLaunch,
	isValidId,
};
