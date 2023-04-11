const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
// const planetRoutes = require("./routes/planets/planets.route");
// const launchesRoutes = require("./routes/launches/launches.route");
const api = require("./routes/api");

const app = express();
// middleware
http: app.use(
	cors({
		origin: process.env.URL,
	}),
);
app.use(morgan(`combined`));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", api);
app.get("/*", (_, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
