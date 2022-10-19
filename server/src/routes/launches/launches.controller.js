const {
	getAllLaunches,
	scheduleLaunch,
	isValidId,
	abortLaunch,
} = require("../../model/launches.model");
const { getPagination } = require("../../utils/query");

async function httpGetAllLaunches(req, res) {
	const { skip, limit } = getPagination(req.query);
	return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpPostLaunch(req, res) {
	const launch = req.body;
	console.log(launch.launchDate);
	if (!launch.launchDate || !launch.mission || !launch.target || !launch.rocket)
		return res.status(400).json({ error: "Missing required field!" });
	const stamp = new Date(launch.launchDate);
	console.log(isNaN(stamp));
	if (isNaN(stamp)) return res.status(400).json({ error: "Invalid date" });
	await scheduleLaunch(launch);
	return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
	const { id } = req.params;
	const exists = await isValidId(+id);
	if (!exists) {
		return res.status(404).json({ error: "Launch not found" });
	}
	if (!abortLaunch(+id)) return res.status(400).json({ aborted: false });
	return res.status(200).json({ aborted: true });
}
module.exports = {
	httpGetAllLaunches,
	httpPostLaunch,
	httpAbortLaunch,
};
