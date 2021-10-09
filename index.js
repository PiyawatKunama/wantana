const https = require("https");
const express = require("express");
const line = require("@line/bot-sdk");
const app = express();
const PORT = process.env.PORT;
const TOKEN =
	"4q3VKFP+VtVmHbT3pwi1NMBfS0XM/+mOsl/pjGi8706ZTZnfTzU/xApq8cGDCeTo7NPe8vMz4DNIOuncCHbvMnvOXuvPQ0enwcmmhgUFBP69jDS43cKrNK3zGQZ7aARoy55SOfFttTqsicRpJzrMbAdB04t89/1O/w1cDnyilFU=";

const client = new line.Client({
	channelAccessToken: "aebf6b699255efc1faece3ee6c1c82ad",
});

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

	console.log("qqq", req.body.events[0]);

	// If the user sends a message to your bot, send a reply message
	if (req.body.events[0].type === "message") {
		// Message data, must be stringified

		const message = {
			type: "text",
			text: "Hello World!",
		};

		client
			.pushMessage("11112221333144415551", message)
			.then(() => {
				console.log("11112221333144415551");
			})
			.catch((err) => {
				console.log(err);
			});

		const dataString = JSON.stringify({
			replyToken: req.body.events[0].replyToken,
			messages: [
				{
					type: "text",
					text: "Hello, user",
				},
				{
					type: "text",
					text: "May I help you?",
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
			path: "/v2/bot/message/reply",
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
