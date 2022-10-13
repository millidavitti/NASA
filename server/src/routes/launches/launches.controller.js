const {
	getAllLaunches,
	postLaunch,
	isValidId,
	abortLaunch,
} = require("../../model/launches.model");

function httpGetAllLaunches(req, res) {
	return res.status(200).json(getAllLaunches());
}

function httpPostLaunch(req, res) {
	const launch = req.body;
	launch.launchDate = new Date(launch.launchDate);
	if (!launch.launchDate)
		return res.status(400).json({ error: "wrong date format" });
	else if (!launch.mission) {
		return res.status(400).json({ error: "Provide a mission" });
	} else if (!launch.rocket)
		return res.status(400).json({ error: "Provide a transit rocket" });
	else if (!launch.target)
		return res.status(400).json({ error: "Provide a destination" });
	postLaunch(launch);
	return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
	const { id } = req.params;
	if (!isValidId(+id)) {
		return res.status(404).json({ error: "Launch not found" });
	}

	return res.status(200).json(abortLaunch(+id));
}
module.exports = {
	httpGetAllLaunches,
	httpPostLaunch,
	httpAbortLaunch,
};
