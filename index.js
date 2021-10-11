import https from "https";
import express from "express";

import fetch from "node-fetch";

if (!globalThis.fetch) {
	globalThis.fetch = fetch;
}

const app = express();
const PORT = process.env.PORT || 3800;

const TOKEN =
	"4q3VKFP+VtVmHbT3pwi1NMBfS0XM/+mOsl/pjGi8706ZTZnfTzU/xApq8cGDCeTo7NPe8vMz4DNIOuncCHbvMnvOXuvPQ0enwcmmhgUFBP69jDS43cKrNK3zGQZ7aARoy55SOfFttTqsicRpJzrMbAdB04t89/1O/w1cDnyilFU=";

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.get("/", function (req, res) {
	res.sendFile("test.html", { root: __dirname });
});

app.post("/test", (req, res) => {
	res.send("https://linewantana.herokuapp.com/webhook");

	var lineText = req.body.lineText;

	const dataString = JSON.stringify({
		to: "Uddbbff589bee8cd87625b741ffb0becc",
		messages: [
			{
				type: "text",
				text: `${lineText}`,
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
});

app.post("/webhook", function (req, res) {
	res.send("https://linewantana.herokuapp.com/webhook");

	if (req.body.events[0].type === "message") {
		// Message data, must be stringified
		const userId = req.body.events[0].source.userId;
		var text = req.body.events[0].message.text;
		var registerText = text.substring(0, 10);
		var lineId = text.substring(10, text.length);

		if (registerText === "@register:") {
			console.log(lineId);

			const myHeaders = {
				"Content-Type": "application/json",
			};

			var graphql = JSON.stringify({
				query: "mutation($lineId:String!,$lineUserId:String!){\n  storeLineUserId(updateCustomerInput:{\n    id:1\n    lineId:$lineId\n    lineUserId:$lineUserId\n  }){\n    id\n  }\n}",
				variables: { lineId: lineId, lineUserId: userId },
			});
			var requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: graphql,
				redirect: "follow",
			};

			fetch("/graphql", requestOptions)
				.then((response) => response.text())
				.then((result) => console.log(result))
				.catch((error) => console.log("error", error));

			const dataString = JSON.stringify({
				to: req.body.events[0].source.userId,
				messages: [
					{
						type: "text",
						text: "ลงทะเบียนสำเร็จ",
					},
				],
			});

			// Request header
			const headersLine = {
				"Content-Type": "application/json",
				Authorization: "Bearer " + TOKEN,
			};

			// Options to pass into the request
			const webhookOptions = {
				hostname: "api.line.me",
				path: "/v2/bot/message/push",
				method: "POST",
				headers: headersLine,
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
	}
});

app.listen(PORT, () => {
	console.log(`Example app listening at http://localhost:${PORT}`);
});
