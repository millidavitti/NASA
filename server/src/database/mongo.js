const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connection.once("open", () => {
	console.log("Connection to mongodb successful");
});
mongoose.connection.on("error", (err) => {
	console.error(err);
});
function connectdb() {
	mongoose.connect(process.env.DCURL);
}
function disconnectdb() {
	mongoose.disconnect();
}

module.exports = { connectdb, disconnectdb };
