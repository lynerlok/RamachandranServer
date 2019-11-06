/*
 * Crtl.js
 *
 * Copyright (C) 2019 Axel Polin, Eden Darnige, Yann Prévot.
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

    const MakePlot = (dataJson,code) => {

      var layout = {
        xaxis: {
          range: [ -180, 180]
        },
        yaxis: {
          range: [-180, 180]
        },
        title:'Ramachandran plot for '+code
      };

      var treshold = 180*0.1;

      var xHeliceA = [];
      var yHeliceA = [];
      var tagHeliceA = [];

      var xHeliceGauche = [];
      var yHeliceGauche = [];
      var tagHeliceGauche = [];

      var xFeuilletB = [];
      var yFeuilletB = [];
      var tagFeuilletB = [];

      var xUnknown = [];
      var yUnknown = [];
      var tagUnknown = [];

      const pushList = (listX,listY,listTag,x,y,key) => {
        listX.push(x);
        listY.push(y);
        listTag.push(key);
      }

      for (var key in dataJson){

        var x = dataJson[key][0];
        var y = dataJson[key][1];

        if (x<=0 && y<=0){
          y<(180-treshold) ? pushList(xHeliceA,yHeliceA,tagHeliceA,x,y,key) : pushList(xUnknown,yUnknown,tagUnknown,x,y,key)
        }

        if (x<=0 && y>0){
          y>(-180+treshold) ? pushList(xFeuilletB,yFeuilletB,tagFeuilletB,x,y,key) : pushList(xUnknown,yUnknown,tagUnknown,x,y,key)
        }

        if (x>0 && y>0){
          y<(180-treshold) ? pushList(xHeliceGauche,yHeliceGauche,tagHeliceGauche,x,y,key) : pushList(xUnknown,yUnknown,tagUnknown,x,y,key)
        }

        if (x>0 && y<=0){
          pushList(xUnknown,yUnknown,tagUnknown,x,y,key)
        }
      }

      var heliceA = {
        x: xHeliceA,
        y: yHeliceA,
        mode: 'markers',
        type: 'scatter',
        name: 'Hélice alpha',
        text: tagHeliceA,
        marker: { size: 5 }
      };

      var feuilletB = {
        x: xFeuilletB,
        y: yFeuilletB,
        mode: 'markers',
        type: 'scatter',
        name: 'Feuillet Beta',
        text: tagFeuilletB,
        marker: { size: 5 }
      };

      var heliceGauche = {
        x: xHeliceGauche,
        y: yHeliceGauche,
        mode: 'markers',
        type: 'scatter',
        name: 'Hélice gauche',
        text: tagHeliceGauche,
        marker: { size: 5 }
      };

      var unknown = {
        x: xUnknown,
        y: yUnknown,
        mode: 'markers',
        type: 'scatter',
        name: 'Unknown',
        text: tagUnknown,
        marker: { size: 5 }
      };

      var data = [ heliceA, feuilletB, heliceGauche, unknown ];


      Plotly.newPlot('displayPlot', data, layout);
    }

    var dataToSend = JSON.stringify({ "code" : pdb.code});
    // ^- Create a JSON string with concatenation of img txt and the Area.images array (see Area);

    document.getElementById("waitTxt").innerHTML = "Sending request to the server please wait...";

    $http({ // Post all datas to server;
      method : "POST", // Method accepted by the server is POST;
      url : '/pdb', // The URL where the server accept this type of POST;
      data : dataToSend, // Put the data to send here;
      dataType: 'json', // The type of data is JSON;
      contentType: 'application/json; charset=utf-8' // Content-Type for the server and the communication;
    }).then(function(response) {

      var text = document.getElementById("waitTxt").innerHTML ;
      document.getElementById("waitTxt").innerHTML = text + "<br/>" + "Server respond 200 OK ! " + "<br/>" + "Creating rama plot...";

      MakePlot(response.data,pdb.code);

      text = document.getElementById("waitTxt").innerHTML;
      document.getElementById("waitTxt").innerHTML  = text + "<br/>" + "Done !"

      setTimeout(function () {document.getElementById("waitTxt").innerHTML = ''}, 3500)

    }, function(response) {
      var text = document.getElementById("waitTxt").innerHTML ;
      document.getElementById("waitTxt").innerHTML = text + "<br/>" + "Server error !" + "<br/>" + "Creating rama plot aborted";
      setTimeout(function () {document.getElementById("waitTxt").innerHTML = ''}, 3500)
    });

  };

}]);




