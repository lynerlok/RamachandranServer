/*
 * Route.js
 *
 * Copyright (C) 2019 Elisabeth Gueux, Salome Mialon, Quentin Piet, Axel Polin
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
 * Please visit : https://github.com/axel-polin/Papyrus_UI
 *
 */

/* This file contain all route used by the server in ServerExpress.js;
 * Please refer to the manual at https://github.com/axel-polin/Papyrus_UI/wiki for further informations;
 * For question contact : univ_apolin@protonmail.com or directly on github with issue !
 */

// Dependancies for the project;

var express = require("express");
var fs = require("fs");
var bodyParser = require('body-parser');
var uuid = require('uuid/v4');
var path = require('path');
var crypto = require('crypto');
var argon2i = require('argon2-ffi').argon2i;
var crypto = require('crypto');
var del = require('del');
var PapyrusMainFile = require('./PapyrusTable.js');
var {PythonShell} = require('python-shell');

//var helmet = require('helmet');

var router = express.Router(); // Use Router to set route for the server;

var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log("[INFO] Execute convert on image : Out: " + stdout + '\n' + "Error: " + stderr) }

// End dependancies;

// Utility path for the server (part 2 see part 1 in ServerExpress.js). Edit at your own risk !

// System path
//    Mandatory path;

var passwordPath = __dirname + '/passwd.json';
var projectsPath = __dirname + '/projects.json';
var datasPath = __dirname + '/../Client/secure/Datas';
var convertPath = '/usr/bin/convert';

//    Scripts path;

var pythonPathNode = __dirname + '/Scripts/venv/ramachandran/bin/python3.5';
var RAM_ScriptPath = __dirname + '/Scripts/ramachandran_biopython.py';

// Server path;
//    Main path;

var mainPath = '/';
var indexPath = '/index.html';
var loginPath = '/login';

//    Mandatory path;

var interfacePath = '/secure/interface.html';
var logoutPath = '/secure/logout';

//    Optionnal path;

var createProjectPath = '/secure/wd';
var removeProjectPath = '/secure/rd';

//    Script path to run script on the server (not system path);

var RAM_Path = '/secure/ram';

// Read the user/password file and the projects file;

var jsonFile = fs.readFileSync(passwordPath, 'utf8');
var creds = JSON.parse(jsonFile);

var jsonFile = fs.readFileSync(projectsPath, 'utf8');
var projects = JSON.parse(jsonFile);

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
		res.setHeader('Content-Security-Policy', "default-src 'self' data:; font-src 'self' use.fontawesome.com ; style-src 'self' use.fontawesome.com www.w3schools.com 'unsafe-inline'; script-src 'self' code.angularjs.org ajax.googleapis.com 'unsafe-inline'");

    res.setHeader('Public-Key-Pins', 'pin-sha256="qvFAlNcPepF8XPAe+Hj/1sOMoIzPKqAlhl3hsFEH7tg="; \
								pin-sha256="LM/+L4/KK/O1MlrufMk7UXkgrsF9U/4IBwHR7VIIfLc="; \
								pin-sha256="QRG3nNFoIoIiF4677675m9NC8qBlirSJPYIxvG498ZY="; \
								max-age=36500'); // Change pins according your certificate;

    if (req.session.isAuthenticated === "Success") res.setHeader('X-CSRF-Token', req.session.csrfToken); // CSRF protection don't REMOVE !
// CSRF protection is set only for logged users but you should set for non-logged user too;

    return next();
  });

  //router.use(helmet()); // Or you can use helmet but be careful at the setup; uncomment helmet in the top of the document;

  router.use('/secure', function (req, res, next) { // For all request on /secure/* ...
/*
 *
 * name: router.use
 * @param
 * @return
 * All of the traffic throw in this function;
 *
 */
    if (req.session.isAuthenticated === "Success"){ // ... if the user is authenticated ...
        return next(); // ... continue
    } else {
      res.status(403).send('Hmm sorry access denied !'); // ... else send 403 access denied
    };

  });

  router.use(express.static(__dirname + '/../Client/')); // See router.use -^  and express.static in the express API

// **** END router.use ****

// **** BEGIN router.get and router.post see Express API

  router.get(interfacePath, function(req, res){ // Route : when GET interface.html redirect to the page if user is login or '/' otherwise;
    if(req.session.isAuthenticated === "Success"){
      res.redirect(interfacePath);
    } else {
      console.log("Access Denied !");
      res.redirect(mainPath);
    }
  });

  router.get(mainPath, function(req, res){ // Route : when GET '/' redirect to index.html;
    res.redirect(indexPath);
  });

  router.get('/csrf',function(res,res){ // A simple route to get the header for the CSRF protection;
    return res.sendStatus(200); // Simply return 200 Ok (and a header);
  });

  router.get(logoutPath, function(req, res){ // Route : when GET '/logout' redirect to '/';
    var user = req.session.user;
	   req.session.destroy(function(){ // On logout remove session file server side;
	      console.log("[INFO] : "+user+" logged out."); // Log in server the logout;
	   });
	   res.redirect(mainPath); // Redirect to '/';
	});

  router.post(loginPath,async function(req,res){ // Route : first route check credentials;
    if(req.session.isAuthenticated !== "Success"){ // If the user is login;

      if(!req.body) return res.sendStatus(400); // If the user send no parameters send 400 ERROR;

      // PARAMS
      var user=req.body.username;
      var pwd=req.body.password;

      if (creds.users.includes(user)) { // If the username / project name is present in creds continue
        var index = creds.users.indexOf(user);
        try {
          if (await argon2i.verify(creds.passwords[index],pwd)) { // Check if password match with the password in the server JSON;
            // SET PARAMS in req.session

            req.session.isAuthenticated = "Success";
            req.session.user = user;
            // Make CSRF protection token;
            var secret = crypto.randomBytes(32);
            var salt = crypto.randomBytes(32);
            req.session.csrfToken = await argon2i.hash(secret, salt);
            // END CSRF TOKEN GENERATION;


            console.log("INFO : User log in :"+user);
            res.redirect(interfacePath);
          } else {
            res.sendStatus(400);
          }
        } catch (err) {
          console.log("ERROR while verifying hash password : "+err);
        }
      }
      else {return res.sendStatus(400)}

    }
    else {return res.send("Vous êtes déjà identifié").status(200)}

	});

  router.post(RAM_Path,function(req,res){ // Route : when POST treshold (body contains img ref) make some action and send 200 OK;
    if(req.session.isAuthenticated === "Success"){ // If the user is login;

      var img = req.body.img; // The body contain the image path.

      if (!req.body.csrf) return res.sendStatus(400);
      var csrf = req.body.csrf;
      if (csrf !== req.session.csrfToken) return res.sendStatus(400);
      
/* // COMPLETER ICI !!!
      // Set options for python-shell
      var options = {
        mode: 'text',
        pythonPath: pythonPathNode,
        pythonOptions: ['-u'],
      //  args: [`-i ${imgToScript}`, `-o ${datasPath}`] // Make input and output
      };

      PythonShell.run(RAM_ScriptPath, options, function (err, results) { // Run the script;
        if (err) throw 'An error occurs on treshold execution :' + err;


        res.sendStatus(200);
      });
*/
    }
    else {
        console.log('WARNING [TRESHOLD] : Access Denied ('+req.session.user+')');
        res.redirect(mainPath);
    }
	});

	router.post(createProjectPath,async function(req,res){ // Route : for the project creation;
		if(req.session.isAuthenticated === "Success"){

      if (!req.body.csrf) return res.sendStatus(400); // CSRF protection verification
      var csrf = req.body.csrf; // Is actually the good user who make the request or very bas crasher ?;
      if (csrf !== req.session.csrfToken) return res.sendStatus(400); // If it's a very bad crasher return 400 ERROR;

      // GET params;
      var user=req.body.username;
      var pwd=req.body.password;

      var index = creds.users.indexOf(user); // Check if a project exists with the same name;
      if (index === -1){ // If the name doesn't exist hash the password;
        var salt = crypto.randomBytes(32); // Generate a salt with crypto library;
        try {
          var hashPass = await argon2i.hash(pwd, salt);
        } catch(err) {
          console.log("Error while hashing password : "+err);
        }
        creds.users.push(user); // Push user and password in respective array;
        creds.passwords.push(hashPass);

        projects.names.push(user);

        // Write files to save configuration;

        fs.writeFile(passwordPath,JSON.stringify(creds), (err) => {
          if (err) throw err;
          console.log('INFO [USER CREATED] : Passwords Files Updated !');
        });

        fs.writeFile(projectsPath,JSON.stringify(projects), (err) => {
          if (err) throw err;
          console.log('INFO [USER CREATED]');
        });
        res.redirect(mainPath);
      }
      else {
        res.redirect(interfacePath);
        console.log("WARNING : A user try to register more than one time : "+user);
      }
    }
    else {return res.sendStatus(400)}
	});

  router.post(removeProjectPath, function(req, res){ // Route : when POST rd make some action and redirect to logout;
    if(req.session.isAuthenticated === "Success" && req.session.user !== "main"){ // If the user is log in and the user is not main (main is for creation);

      if (!req.body.csrf) return res.sendStatus(400);
      var csrf = req.body.csrf;
      if (csrf !== req.session.csrfToken) return res.sendStatus(400);

      var index = creds.users.indexOf(req.session.user); // Search the user in user array;
      if (index !== -1) creds.users.splice(index, 1); // Remove user from user array...
      if (index !== -1) creds.passwords.splice(index, 1); // ... and his password from password array;

      var index = projects.names.indexOf(req.session.user);
      if (index !== -1) projects.names.splice(index, 1); // Remove project name from projects array...

      fs.writeFile(passwordPath,JSON.stringify(creds), (err) => { // Save password file in case of server crash;
        if (err) throw err;
        console.log('INFO [USER REMOVED]: Passwords Files Updated !'); // Log info for server;
      });

      fs.writeFile(projectsPath,JSON.stringify(projects), (err) => { // Save projects file in case of server crash;
          if (err) throw err;
          console.log('INFO [USER REMOVED] : ImageRef updated !'); // Log info for server;
        });

      res.redirect(logoutPath); // Redirect on logout;
    }
    else {
      res.redirect(interfacePath); // If the user is not log in or is main, do a redirection attempt on interface;
      console.log("WARNING : A user try to delete an other user with no permissions : "+req.session.user); // Log the incident in server
    }
	});

  return router;
})();
