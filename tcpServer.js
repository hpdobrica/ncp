const net = require('net');
const Connection = require('./Connection');

const server = net.createServer((s) => { 
    let connection = new Connection(s);

    console.log('client connected');

    s.on('data', connection.handleIncomingData.bind(connection));

    s.on('end', () => {
        connection = null;
        console.log('client disconnected');
    });

    s.on('error', (err) => {
        console.log('error', err);
    })

});

module.exports = server;