const server = require('../src/server');
const request = require('supertest')(server);
const getCookies = require('./getCookies');
const { beforeEachLog, afterEachLog } = require('./logs');

let cookies = null;

describe('test template', () => {

  beforeEach(() => {
    beforeEachLog();
  });

  afterEach(function () {
    afterEachLog(this.currentTest.state);
  });

  before(async () => {
    cookies = await getCookies(request);
  });

  it('can do logged request', done => {
    request
      .get('/me')
      .set('Cookie', cookies)
      .expect(200, done);
  });
});