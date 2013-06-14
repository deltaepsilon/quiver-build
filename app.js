var conf = require('./config/convict.js'),
	express = require('express'),
	app = express(),
	spawn = require('child_process').spawn;

app.post('/:secret', function (req, res) {
	if (req.params.secret === conf.get('github_secret')) {
		spawn('sh', ['-c', 'echo "$QUIVER_DEVELOPMENT_ROOT/quiver-build/bin/build"'], { stdio: 'inherit' });
		res.send(200);

	} else {
		res.send(403);
	}
});

app.listen(9200);
console.log('Listening on port 9200');

module.exports = app;