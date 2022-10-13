const express = require("express");
const { httpGetAllPlanets } = require("./planets.contoller");

const planetRoutes = express.Router();

planetRoutes.get("/", httpGetAllPlanets);

module.exports = planetRoutes;
