const net = require('net');

const server = net.createServer((socket) => {
	client_address = socket.address();
	console.log("%s:%d connected", client_address.address, client_address.port);

	socket.end("you are " + client_address.address + ":" + client_address.port + "\n");
});

server.listen(9999);
