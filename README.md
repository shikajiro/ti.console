ti.console
==========

titanium rialtime log server.

include 
[socket.io-titanium.js](https://github.com/nowelium/socket.io-titanium)

server install
---------------
node.js
* cd ti.console
* npm install
* node ti.console
* access http://localhost:8080

client install
---------------
* your Titanium project dir to include "Resources/lib/".
* server address change your server ipaddress from console.js " var ADDRESS = 'youraddress:3000'"
* require('lib/console');
>
var console = require('lib/console');
console.info('message');
<
* deveg level is trace,debug,info,warn,and error.
