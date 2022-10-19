const express = require("express");
const launchesRoutes = require("./launches/launches.route");
const planetRoutes = require("./planets/planets.route");

const api = express.Router();

api.use("/planets", planetRoutes);
api.use("/launches", launchesRoutes);

module.exports = api;
