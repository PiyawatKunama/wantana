database
	.query(
		`CREATE TABLE User(
		userId VARCHAR(200) NOT NULL PRIMARY KEY,
		lineId VARCHAR(200) NOT NULL 
	)`
	)
	.then((res) => {
		console.log(res);
	})
	.catch((err) => {
		console.log(err);
	});

database
	.query(
		`SELECT * FROM User
	`
	)
	.then((res) => {
		console.log(res);
	})
	.catch((err) => {
		console.log(err);
	})
	.finally(() => {
		database.close();
	});
