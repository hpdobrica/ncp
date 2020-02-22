const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  const id = req.url.replace(/[^a-z0-9+]+/gi, '');
  console.log(id);
  if(id === '') {
    res.writeHead(200);
    res.end(`
    Welcome to NCP (short for netcat copy). 
    You can use this tool to export any data from command into a temporary web page.

    usage:

    ls -lah | nc p.dobrica.sh 1337

    `);
    return;

  }
  fs.readFile(`${__dirname}/content/${id}`, (err,data) => {
    if (err) {
      res.writeHead(404);
      res.end('invalid ncp id');
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
})


module.exports = server;
