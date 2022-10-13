const { getAllPlanets } = require("../../model/planets.model");

function httpGetAllPlanets(_, res) {
	return res.status(200).json(getAllPlanets());
}

module.exports = {
	httpGetAllPlanets,
};
