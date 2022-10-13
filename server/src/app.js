const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const planetRoutes = require("./routes/planets/planets.route");
const launchesRoutes = require("./routes/launches/launches.route");

const app = express();

// middleware
app.use(
	cors({
		origin: "http://localhost:3000",
	}),
);
app.use(morgan(`combined`));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use('/planets',planetRoutes);
app.use("/launches", launchesRoutes);

app.get("/*", (_, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
