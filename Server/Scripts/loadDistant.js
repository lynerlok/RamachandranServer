/* loadDistant.js

   Copyright 2019 lynerlok <lynerlok@Cahno9>

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
   MA 02110-1301, USA.

*/

/*
* Load/Parse remote PDB File
* 18/10/2019
*/

const PATH = "https://files.rcsb.org/view/";

const getContents = (ev) => {
  let textfield = document.querySelector("#pdb");
  let pdbid = textfield.value;
  let url = `${PATH}${pdbid.toUpperCase()}.pdb`;
  //console.log(pdbid,url);
  fetch(url) // pas de ; car c'est une chaine qui suit
  .then( response => {
    if (response.ok) {
      console.log("Ajout");
      return response.text();
    }
    else {
      console.log("Wait");
    }
  })
  .then( txt => parsePDB(txt))
  .catch( err => console.log(err));
}

let ok = document.querySelector("#ok");
ok.addEventListener("click",getContents);
