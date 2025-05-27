const http = require('http');
const url = require('url');

let list = {};  // Use an object, not array

const server = http.createServer((req, res) => {
  if(req.method ==='POST'){
    body = '';
    req.on('data', (chunks) => {
      body += chunks.toString();
    });
    req.on('end', () => {
      let data = JSON.parse(body);
      let username = data.username;
      let message = data.message;
      list[username] = message;
      console.log(list)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "ok", received: data }));
      
    });
  } else if (req.method === 'PUT') {
    const parsedurl = url.parse(req.url, true);
    const query = parsedurl.query;
    const username = query.username;
    const message = query.message || 'null';

    if (username in list) {  // Use 'in' operator to check key existence
      list[username] = message;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(list));
      console.log(list);
    } else {
      console.error("Username not found");
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Username not found\n');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found\n');
  }
});

const port = 3000;
const host = 'localhost';

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
