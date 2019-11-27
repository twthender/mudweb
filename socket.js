const net = require('net');

let options = {
    host: 'localhost',
    port: 3001
};

function createSocket(clientSocket) {

    let client = net.connect(options, function() { //'connect' listener
        console.log('client connected');
    });

    client.on('data', function(data) {
        console.log('Message received from server: ' + data.toString());
        clientSocket.onMessageReceivedFromServer(data.toString());
    });

    client.on('end', function() {
        console.log('client disconnected');
    });

    return client
}

module.exports = {
    createSocket: createSocket
};