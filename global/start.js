function globalStart() {
	require("dotenv").config();
	global.color = require("colorette");

	//starting web server
	const app = require("express")();
	app.listen(3000);
	app.get("/", (req, res) => res.send("OK"));

	global.log = function (str, type = "DEFAULT") {
		if (type === "DEFAULT") {
			console.log(`${new Date().toLocaleTimeString()} > ${str}`);
		} else if (type === "ERROR") {
			console.log(`${color.red(`${new Date().toLocaleTimeString()} > ${str}`)}`);
		}
	};
}

module.exports = { globalStart };
