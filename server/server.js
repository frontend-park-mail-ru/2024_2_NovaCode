'use strict';

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();

const publicDirs = ['dist', 'src', 'public', 'node_modules'];
publicDirs.forEach((dir) => {
	app.use(express.static(path.join(__dirname, '..', dir)));
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app
	.listen(PORT, () => {
		console.log(`server is running and listening on port ${PORT}`);
	})
	.on('error', (err) => {
		console.error(`failed to start server: ${err.message}`);
	});
