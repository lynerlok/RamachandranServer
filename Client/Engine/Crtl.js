/*
 * Crtl.js
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

/* This file contain angularJs controllers. It is a specification of AngularJS.
 * More informations at : https://docs.angularjs.org/guide/controller;
 */

protVisu.controller('pdbForm', ['$scope','$rootScope','$http', function($scope,$rootScope,$http){

  $scope.sendPDB = function(pdb){
/*
 *
 * name: getCsrfPDB
 * @param : working directory
 * @return
 * This function allow to create a new working directory on the server with the CSRF protection;
 */

    var dataToSend = JSON.stringify({ "code" : pdb.code});
    // ^- Create a JSON string with concatenation of img txt and the Area.images array (see Area);

    $http({ // Post all datas to server;
      method : "POST", // Method accepted by the server is POST;
      url : '/pdb', // The URL where the server accept this type of POST;
      data : dataToSend, // Put the data to send here;
      dataType: 'json', // The type of data is JSON;
      contentType: 'application/json; charset=utf-8' // Content-Type for the server and the communication;
    }).then(function(response) {
      
        $http({
          method : "GET",
          url : "PDB_Datas/"+$pdb_code+".json"
          }).then(function(response) {
            var jsonFile = JSON.parse(response.data);
            console.log(jsonFile);
            }, function(response) {
              alert(response.statusText);
              });
              
      alert("PDB id send to server !");
      window.location.reload();
    }, function(response) {
      alert("Error while sending pdb id to server !!"); // If the upload fail alert user;
    });

  };

}]);

protVisu.controller('manageTSV', ['$scope','$rootScope','$http', function($scope,$rootScope,$http){
/*
 * name: RepeatPapyrus;
 * type: AngularJS controller;
 * @param : $scope, $rootScope; Visit : https://docs.angularjs.org/guide/scope;
 * @return : nothing;
 */
 
  var jsonFile;

	$rootScope.getJsonRam = function(pdb_code) {
	 
  
    
	};
  
}]);




