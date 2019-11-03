/*
 * Route.js
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

/* This file contain all route used by the server in ServerExpress.js;
 * For question contact : univ_apolin@protonmail.com or directly on github with issue !
 */

// Dependancies for the project;

var express = require("express");
var fs = require("fs");
var bodyParser = require('body-parser');
var path = require('path');
var {PythonShell} = require('python-shell');

//var helmet = require('helmet');

var router = express.Router(); // Use Router to set route for the server;

//var parser = require('Scripts/parse.js');

// End dependancies;

// Utility path for the server (part 2 see part 1 in ServerExpress.js). Edit at your own risk !

// System path
//    Mandatory path;

//    Scripts path;

var pythonPathNode = __dirname + '/Scripts/ramachandran/bin/python3.5';
var RAM_ScriptPath = __dirname + '/Scripts/ramachandran_biopython.py';
var JSONPath = __dirname + '/../Client/PDB_Datas/';

// Server path;
//    Main path;

var mainPath = '/';
var indexPath = '/index.html';

//    Script path to run script on the server (not system path);

var pdbPath = '/pdb';

module.exports = (function() { // Module creation for the main file of the server;
/*
 * name: module.exports
 * @param : nothing
 * @return : nothing
 * This the core function of the Router;
 *
 */

// **** BEGIN router.use ****

  router.use(function(req, res, next) {
/*
 *
 * name: router.use
 * @param
 * @return
 * All of the traffic throw in this function;
 *
 */
    // See https://www.owasp.org/index.php/OWASP_Secure_Headers_Project ;

    // [DANGER SECTION] EDIT HEADERS at your OWN risks

		res.setHeader('Referrer-Policy', 'no-referrer'); // or same-origin ( send or not send the referrer that is the question );
		res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
		res.setHeader('X-Frame-Options', 'deny');
		res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
		res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubdomains');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
		res.setHeader('Pragma', 'no-cache');
		res.setHeader('Expires', 0);
		res.setHeader('Surrogate-Control', 'no-store');
   // res.setHeader('Feature-Policy', "camera: 'none'; payment: 'none'; microphone: 'none'");// Bad compatibility
		res.setHeader('Content-Security-Policy', "default-src 'self' data: blob:; font-src 'self' use.fontawesome.com ; \
      style-src 'self' use.fontawesome.com www.w3schools.com 'unsafe-inline'; \
      script-src 'self' code.angularjs.org ajax.googleapis.com 'unsafe-inline' 'unsafe-eval';"
    );

    res.setHeader('Public-Key-Pins', 'pin-sha256="qvFAlNcPepF8XPAe+Hj/1sOMoIzPKqAlhl3hsFEH7tg="; \
								pin-sha256="LM/+L4/KK/O1MlrufMk7UXkgrsF9U/4IBwHR7VIIfLc="; \
								pin-sha256="QRG3nNFoIoIiF4677675m9NC8qBlirSJPYIxvG498ZY="; \
								max-age=36500'); // Change pins according your certificate;

    return next();
  });

  //router.use(helmet()); // Or you can use helmet but be careful at the setup; uncomment helmet in the top of the document;

  router.use(express.static(__dirname + '/../Client/')); // See router.use -^  and express.static in the express API

// **** END router.use ****

// **** BEGIN router.get and router.post see Express API

  router.get(mainPath, async function(req, res){ // Route : when GET '/' redirect to index.html;
     res.redirect(indexPath);
  });

  router.post(pdbPath,function(req,res){

      var pdb_code = req.body.code.toLowerCase();
      
      // Set options for python-shell
      var options = {
        mode: 'text',
        pythonPath: pythonPathNode,
        pythonOptions: ['-u'],
        args: [`${pdb_code}`]
      };

      PythonShell.run(RAM_ScriptPath, options, function (err) { // Run the script;
        
        if (err) {
          console.log('An error occurs when execute BioPython :' + err);
          res.sendStatus(500);
          return 0;
        }
        
        try {
          var jsonFile = fs.readFileSync(JSONPath+pdb_code+".json", 'utf8');
          var data = JSON.parse(jsonFile);
        } catch (e) {
          console.log("An error occurs when reading json file :" + e);
          res.sendStatus(500);
          return 0
        }
        
        res.send(data);
        
       });
       
	});
  
  return router;
})();
