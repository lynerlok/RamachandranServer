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


protVisu.controller('ChangeTab',['$scope','$rootScope', function($scope,$rootScope){
/*
 * name: ChangeTab;
 * type: AngularJS controller to switch tab in interface;
 * @param : $scope, $rootScope; Visit : https://docs.angularjs.org/guide/scope;
 * @return : nothing;
 */

	$rootScope.tabSwitch = function($event,tabName){
  /*
   * name: tabSwitch;
	 * @param : $event, tabName the name of tab to switch;
	 * @return : nothing;
	 */
	  var i, x, tablinks; // Utility variable
	  x = document.getElementsByClassName("tab"); // Get all the tabs in the bar;

	  for (i = 0; i < x.length; i++) {
	    x[i].style.display = "none"; // Defaults hide tabs.
	  }

	  tablinks = document.getElementsByClassName("tablink"); // Get all the links to the tabs;

	  for (i = 0; i < x.length; i++) {
	    tablinks[i].className = tablinks[i].className.replace(" w3-black", ""); // Remove the color class from all ;
	  }

	  document.getElementById(tabName).style.display = "block"; // Display only the good tab;
	  $event.currentTarget.className += " w3-black"; // On click change color.
	}
}]);

protVisu.controller('wdForm', ['$scope','$rootScope','$http', function($scope,$rootScope,$http){

  $scope.getCsrfWD = function(wd){
/*
 *
 * name: getCsrfWD
 * @param : working directory
 * @return
 * This function allow to create a new working directory on the server with the CSRF protection;
 */

    $http({
      type: "GET",
      url: '/csrf',
    }).then(function(response) {
      var dataToSend = JSON.stringify({ "username" : wd.name, "password" : wd.pass, "csrf" : response.headers('X-CSRF-Token')});
      // ^- Create a JSON string with concatenation of img txt and the Area.images array (see Area);

      $http({ // Post all datas to server;
        method : "POST", // Method accepted by the server is POST;
        url : '/secure/wd', // The URL where the server accept this type of POST;
        data : dataToSend, // Put the data to send here;
        dataType: 'json', // The type of data is JSON;
        contentType: 'application/json; charset=utf-8' // Content-Type for the server and the communication;
      }).then(function(response) {
        alert("new directory successfully created ! You can now log out of this session and reconnet to the new project !");
        window.location.reload();
      }, function(response) {
        alert("Error while creating working directory !!"); // If the upload fail alert user;
      });

    });

  };

  $scope.getCsrfRD = function(rd){
/*
 *
 * name: getCsrfRD
 * @param : working directory
 * @return : nothing
 * This function allow to remove your working directory on the server with the CSRF protection;
 */
    $http({
      type: "GET",
      url: '/csrf',
    }).then(function(response) {
      var dataToSend = JSON.stringify({"csrf" : response.headers('X-CSRF-Token')});
      // ^- Create a JSON string with concatenation of img txt and the Area.images array (see Area);

      $http({ // Post all datas to server;
        method : "POST", // Method accepted by the server is POST;
        url : '/secure/rd', // The URL where the server accept this type of POST;
        data : dataToSend, // Put the data to send here;
        dataType: 'json', // The type of data is JSON;
        contentType: 'application/json; charset=utf-8' // Content-Type for the server and the communication;
      }).then(function(response) {
        alert("Le serveur n'a retourné aucune erreur !");
         window.location.reload();
      }, function(response) {
        alert("Error while deleting working directory !!"); // If RD fail alert user;
      });

    });

  };

}]);

protVisu.controller('pdbForm', ['$scope','$rootScope','$http', function($scope,$rootScope,$http){

  $scope.getCsrfPDB = function(pdb){
/*
 *
 * name: getCsrfPDB
 * @param : working directory
 * @return
 * This function allow to create a new working directory on the server with the CSRF protection;
 */

    $http({
      type: "GET",
      url: '/csrf',
    }).then(function(response) {
      var dataToSend = JSON.stringify({ "code" : pdb.code, "csrf" : response.headers('X-CSRF-Token')});
      // ^- Create a JSON string with concatenation of img txt and the Area.images array (see Area);

      $http({ // Post all datas to server;
        method : "POST", // Method accepted by the server is POST;
        url : '/secure/pdb', // The URL where the server accept this type of POST;
        data : dataToSend, // Put the data to send here;
        dataType: 'json', // The type of data is JSON;
        contentType: 'application/json; charset=utf-8' // Content-Type for the server and the communication;
      }).then(function(response) {
        alert("PDB id send to server !");
        window.location.reload();
      }, function(response) {
        alert("Error while sending pdb id to server !!"); // If the upload fail alert user;
      });

    });

  };

}]);






