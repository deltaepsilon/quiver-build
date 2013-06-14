var conf = require('./../config/convict.js'),
	app = require('./../githook.js'),
	request = require('supertest'),
	chai = require('chai'),
	assert = chai.Assert;

suite('App.js... make it work', function () {
	suiteSetup(function (done) {
		done();
	});

	suiteTeardown(function (done) {
		done();
	});

	test('Bad requests get a 404', function (done) {
		request(app).get('/').expect(404, done);
	});

	test('Bad secret gets a 403', function (done) {
		request(app).post('/hello-world').send({payload: 'this is a payload'}).expect(403, done);
	});

	test('Good request gets a 200', function (done) {
		request(app).post('/' + conf.get('github_secret')).send({payload: 'more payload'}).expect(200, done);
	});
});
