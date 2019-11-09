/*
 * ServerExpress.js
 *
 * Copyright (C) 2019 Axel Polin
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * Please visit : https://github.com/lynerlok/RamchandranServer
 *
 */

/* This file contain the core for NodeJS server. 
 * It uses some package : 
 * ** Express to facilitate development.
 * ** FS to manipulate filesystem.
 * ** HTTPS to create HTTPS connection with client.
 * ** body-parser to parse body on POST request.
 */
 
var express = require("express");
var fs = require("fs");

var https = require('https');
var http = require('http');

var bodyParser = require('body-parser');
var crypto = require('crypto');

var router = require(__dirname + '/Route.js');
var app = express();

var portHTTPS = 8443;

var secret = crypto.randomBytes(32);

console.log("Running Server...");

console.log("Setting options...");

var serverCredentials = {
  key: fs.readFileSync('Certs/key.pem'),
  cert: fs.readFileSync('Certs/cert.pem')
};

console.log("Associate options to the Node app...");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.disable('x-powered-by'); // Disable x-powered-by header to avoid fingerprinting (but not totaly);
app.use(router);

console.log("Create HTTPS server...");

//Listen on both 127.0.0.1 and external ip adress.
// Node only accept real IP address and not resolve name (like localhost) in native configuration !
// So loacalhost and 127.0.0.1 is different for node but not for the OS !
// You don't listen on localhost and 127.0.0.1 in the same time !

https.createServer(serverCredentials, app).listen(portHTTPS,"127.0.0.1"); // or localhost
//https.createServer(serverCredentials, app).listen(portHTTPS,"<IPADDR>"); // Choose your IP ADDR !

http.createServer(app).listen(8080);

console.log("Done !");
