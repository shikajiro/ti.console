ti.console
==========

titanium realtime log server.

included  
[socket.io-titanium.js](https://github.com/nowelium/socket.io-titanium)

server install
---------------
* dependent node.js mongoDB
* package install
> $ cd ti.console/server/  
> $ npm install
* start ti.console
> $ mongod  
> $ node ti.console
* access http://localhost:8080

client install
---------------
* this client directory contents move into your Titanium project directory "Resources/lib/".
* Please change the server address of your own 'var ADDRESS' that is described in console.js.
* require('lib/console');
> var console = require('lib/console');  
> console.info('message');
* debug level is trace,debug,info,warn,and error.

support
---------------
Questions, please contact [@shikajiro](http://www.twitter.com/shikajiro) .