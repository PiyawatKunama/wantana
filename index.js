const https = require("https");
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const TOKEN =
	"4q3VKFP+VtVmHbT3pwi1NMBfS0XM/+mOsl/pjGi8706ZTZnfTzU/xApq8cGDCeTo7NPe8vMz4DNIOuncCHbvMnvOXuvPQ0enwcmmhgUFBP69jDS43cKrNK3zGQZ7aARoy55SOfFttTqsicRpJzrMbAdB04t89/1O/w1cDnyilFU=";

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.get("/", (req, res) => {
	res.sendStatus(200);
});

app.post("/webhook", function (req, res) {
	res.send("https://linewantana.herokuapp.com/webhook");

	// If the user sends a message to your bot, send a reply message
	if (req.body.events[0].type === "message") {
		// Message data, must be stringified
		console.log("jimmy", req.body.events[0].source.userId);
		console.log("jimmy", req.body);

		const dataString = JSON.stringify({
			to: req.body.events[0].source.userId,
			messages: [
				{
					type: "text",
					text: "Hello, world1",
				},
				{
					type: "text",
					text: "Hello, world2",
				},
			],
		});

		// Request header
		const headers = {
			"Content-Type": "application/json",
			Authorization: "Bearer " + TOKEN,
		};

		// Options to pass into the request
		const webhookOptions = {
			hostname: "api.line.me",
			path: "/v2/bot/message/push",
			method: "POST",
			headers: headers,
			body: dataString,
		};

		// Define request
		const request = https.request(webhookOptions, (res) => {
			res.on("data", (d) => {
				console.log(d);
				process.stdout.write(d);
			});
		});

		// Handle error
		request.on("error", (err) => {
			console.error(err);
		});

		// Send data
		request.write(dataString);
		request.end();
	}
});

app.listen(process.env.PORT, () => {
	console.log(`Example app listening at http://localhost:${PORT}`);
});
