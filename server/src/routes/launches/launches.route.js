const express = require("express");
const {
	httpGetAllLaunches,
	httpPostLaunch,
	httpAbortLaunch,
} = require("./launches.controller");

const launchesRoutes = express.Router();

launchesRoutes.get("/", httpGetAllLaunches);
launchesRoutes.post("/", httpPostLaunch);
launchesRoutes.delete("/:id", httpAbortLaunch);

module.exports = launchesRoutes;
