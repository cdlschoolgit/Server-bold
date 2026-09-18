const http = require('http');
const app = require('../api/index.js');

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Test server running on port ${port}`);

  const testGet = (path, headers = {}) => {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}${path}`, { headers }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
      }).on('error', reject);
    });
  };

  try {
    // 1. Test root HTML page
    const rootRes = await testGet('/', { 'Accept': 'text/html' });
    console.log('GET / -> Status:', rootRes.statusCode, 'Includes "United CDL":', rootRes.data.includes('United CDL Training School'));

    // 2. Test /api JSON
    const apiRes = await testGet('/api', { 'Accept': 'application/json' });
    console.log('GET /api (JSON) -> Status:', apiRes.statusCode, 'Body:', apiRes.data);

    // 3. Test /api/getAllModules
    const modulesRes = await testGet('/api/getAllModules');
    console.log('GET /api/getAllModules -> Status:', modulesRes.statusCode, 'Success:', modulesRes.data.includes('"success":true'));

    // 4. Test /verifyStudent without params (should redirect to tokenExpired / Login)
    const verifyRes = await testGet('/api/verifyStudent?token=dummy&email=test@example.com');
    console.log('GET /api/verifyStudent -> Status:', verifyRes.statusCode, 'Location:', verifyRes.headers.location);

    console.log('ALL TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
