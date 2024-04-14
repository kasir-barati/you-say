const http = require('http');

const options = {
  host: 'localhost',
  port: '3001',
  timeout: 2000,
  path: 'api/healthcheck',
};

const request = http.request(options, (res) => {
  console.info(`STATUS: ${res.statusCode}`);

  if (res.statusCode === 200) {
    process.exit(0);
  }

  process.exit(1);
});

request.on('error', function () {
  console.error('ERROR');

  process.exit(1);
});

request.end();
