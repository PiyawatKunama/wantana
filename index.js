const https = require("https");
const line = require("@line/bot-sdk");
const express = require("express");
const app = express();
const PORT = 3000;

const config = {
	channelAccessToken:
		"4q3VKFP+VtVmHbT3pwi1NMBfS0XM/+mOsl/pjGi8706ZTZnfTzU/xApq8cGDCeTo7NPe8vMz4DNIOuncCHbvMnvOXuvPQ0enwcmmhgUFBP69jDS43cKrNK3zGQZ7aARoy55SOfFttTqsicRpJzrMbAdB04t89/1O/w1cDnyilFU=",
	channelSecret: "aebf6b699255efc1faece3ee6c1c82ad",
};

const client = new line.Client(config);

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.get("/", (req, res) => {
	res.sendStatus(200);
});

app.post("/webhook", line.middleware(config), (req, res) => {
	Promise.all(req.body.events.map(handleEvent))
		.then((result) => res.json(result))
		.catch((err) => {
			console.error(err);
			res.status(500).end();
		});
});

function handleEvent(event) {
	if (event.type !== "message" || event.message.type !== "text") {
		// ignore non-text-message event
		return Promise.resolve(null);
	}

	// create a echoing text message
	const echo = { type: "text", text: event.message.text };

	// use reply API
	return client.replyMessage(event.replyToken, echo);
}

// app.post("/webhook", function (req, res) {
// 	res.send("https://linewantana.herokuapp.com/webhook");

// 	console.log(req);
// 	// If the user sends a message to your bot, send a reply message
// 	if (req.body.events[0].type === "message") {
// 		// Message data, must be stringified
// 		const dataString = JSON.stringify({
// 			replyToken: req.body.events[0].replyToken,
// 			messages: [
// 				{
// 					type: "text",
// 					text: "Hello, user",
// 				},
// 				{
// 					type: "text",
// 					text: "May I help you?",
// 				},
// 			],
// 		});

// 		// Request header
// 		const headers = {
// 			"Content-Type": "application/json",
// 			Authorization: "Bearer " + TOKEN,
// 		};

// 		// Options to pass into the request
// 		const webhookOptions = {
// 			hostname: "api.line.me",
// 			path: "/v2/bot/message/reply",
// 			method: "POST",
// 			headers: headers,
// 			body: dataString,
// 		};

// 		// Define request
// 		const request = https.request(webhookOptions, (res) => {
// 			res.on("data", (d) => {
// 				process.stdout.write(d);
// 			});
// 		});

// 		// Handle error
// 		request.on("error", (err) => {
// 			console.error(err);
// 		});

// 		// Send data
// 		request.write(dataString);
// 		request.end();
// 	}
// });

app.listen(PORT, () => {
	console.log(`Example app listening at http://localhost:${PORT}`);
});
