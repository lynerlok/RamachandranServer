/* parse_pdb.js

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
* Load/Parse Local PDB File
* 18/10/2019
*/

/*

COLUMNS       DATA  TYPE     FIELD             DEFINITION
------------------------------------------------------------------------------------
 1 -  6       Record name    "HEADER"
11 - 50       String(40)     classification    Classifies the molecule(s).
51 - 59       Date           depDate           Deposition date. This is the date the
                                               coordinates  were received at the PDB.
63 - 66       IDcode         idCode            This identifier is unique within the PDB.

*/

// Function
const cutHEADER = (accu, line) => {
    let cuts = [
        {start:11,end:50,field: 'classification',type: 'string'},
        {start:51,end:59,field: 'depDate',type: 'date'},
        {start:63,end:66,field: 'idCode',type: 'idcode'}
    ];
    let obj = cuts.reduce( (acc, cut) => {

        let token = line.substring(cut.start-1,cut.end).trim();
        acc[cut.field] = token;
        return acc;
    },accu) ;
    return obj;
};

/*
COLUMNS        DATA  TYPE    FIELD        DEFINITION
-------------------------------------------------------------------------------------
 1 -  6        Record name   "ATOM  "
 7 - 11        Integer       serial       Atom  serial number.
13 - 16        Atom          name         Atom name.
17             Character     altLoc       Alternate location indicator.
18 - 20        Residue name  resName      Residue name.
22             Character     chainID      Chain identifier.
23 - 26        Integer       resSeq       Residue sequence number.
27             AChar         iCode        Code for insertion of residues.
31 - 38        Real(8.3)     x            Orthogonal coordinates for X in Angstroms.
39 - 46        Real(8.3)     y            Orthogonal coordinates for Y in Angstroms.
47 - 54        Real(8.3)     z            Orthogonal coordinates for Z in Angstroms.
55 - 60        Real(6.2)     occupancy    Occupancy.
61 - 66        Real(6.2)     tempFactor   Temperature  factor.
77 - 78        LString(2)    element      Element symbol, right-justified.
79 - 80        LString(2)    charge       Charge  on the atom.
*/

const cutATOM = (accu,line) => {
    let cutsatom = [
        {
            start : 7,
            end : 11,
            field : 'serial',
            type : 'float'
        },
        {
            start : 13,
            end : 16,
            field : 'name',
            type : 'name'
        },
        {
            start : 17,
            end : 17,
            field : 'altLoc',
            type : 'altLoc'
        },
        {
            start : 18,
            end : 20,
            field : 'resName',
            type : 'resName'
        },
        {
            start : 22,
            end : 22,
            field : 'chainID',
            type : 'chainID'
        },
        {
            start : 23,
            end : 26,
            field : 'resSeq',
            type : 'float'
        },
        {
            start : 27,
            end : 27,
            field : 'iCode',
            type : 'iCode'
        },
        {
            start : 31,
            end : 38,
            field : 'x',
            type : 'float'
        },
        {
            start : 39,
            end : 46,
            field : 'y',
            type : 'float'
        },
        {
            start : 47,
            end : 54,
            field : 'z',
            type : 'float'
        },
        {
            start : 55,
            end : 60,
            field : 'occupancy',
            type : 'float'
        },
        {
            start : 61,
            end : 66,
            field : 'tempFactor',
            type : 'float'
        },
        {
            start : 77,
            end : 78,
            field : 'Element',
            type : 'Element'
        },
        {
            start : 79,
            end : 80,
            field : 'charge',
            type : 'charge'
        }
    ];
    let obj = cutsatom.reduce( (acc,cut) => {
      let token = line.substring(cut.start-1,cut.end);
      acc[cut.field] = (cut.type ==="float") ? parseFloat(token) : token;
      return acc;
    },
    {});
    console.log("tokens2",obj);
};

const parseLine = (accu, line, i) => {
    let key = line.substring(0,6).trim(); // trim remove spaces
    //console.log(key);
    if ( key === 'HEADER') {
        return cutHEADER(accu,line);
    }

    if(key === 'ATOM') {
        return cutATOM(accu,line);
    }
};

modules.exports = {

parsePDB : (text) => {
    let lines = text.split('\n');
    let s3D = lines.reduce(parseLine,
        {
            header : {},
            atom : []
        })
    return s3D;
}

};
