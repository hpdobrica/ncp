
const tcpServer = require('./tcpServer');
const fileServer = require('./fileServer');
const fs = require('fs');
const path = require('path');

const TCP_PORT = process.env.TCP_PORT || 1337;
const FILE_PORT = process.env.FILE_PORT || 8080;


tcpServer.listen(TCP_PORT, () => {
  console.log(`tcp server bound to ${TCP_PORT}`);
});

fileServer.listen(FILE_PORT,() => {
    console.log(`file server bound to ${FILE_PORT}`);
});


[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  // @ts-ignore
  process.on(eventType, () => {
    const basePath = './content';
    const files = fs.readdirSync(basePath);

    files.forEach((file) => {
      fs.unlinkSync(path.join(basePath, file));
    });
    process.exit(0);
  })
});