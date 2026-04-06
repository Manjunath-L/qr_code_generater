import http from 'http';

const options = {
  hostname: '0.0.0.0',
  port: 5000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response completed');
    if (data.length < 500) {
      console.log(`BODY: ${data}`);
    } else {
      console.log(`BODY: (first 500 chars) ${data.substring(0, 500)}...`);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();