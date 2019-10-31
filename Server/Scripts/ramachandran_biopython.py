#
# ramachandran_biopython.py
#
# Copyright (C) 2019 Axel Polin
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
# MA 02110-1301, USA.
#
# Please visit : https://github.com/lynerlok/RamchandranServer
#
#
#
# For question contact : univ_apolin@protonmail.com or directly on github with issue !
#
# This file is a modification of the script here :
#
# Please see accompanying webpage:
# 
# http://www.warwick.ac.uk/go/peter_cock/python/ramachandran/calculate/
#
# This code relies on Thomas Hamelryck's Bio.PDB module in BioPython:
#
# http://www.biopython.org
#

def degrees(rad_angle) :
    """Converts any angle in radians to degrees.

    If the input is None, the it returns None.
    For numerical input, the output is mapped to [-180,180]
    """
    if rad_angle is None :
        return None
    angle = rad_angle * 180 / math.pi
    while angle > 180 :
        angle = angle - 360
    while angle < -180 :
        angle = angle + 360
    return angle

def ramachandran_type(residue, next_residue) :
    """Expects Bio.PDB residues, returns ramachandran 'type'

    If this is the last residue in a polypeptide, use None
    for next_residue.

    Return value is a string: "General", "Glycine", "Proline"
    or "Pre-Pro".
    """
    if residue.resname.upper()=="GLY" :
        return "Glycine"
    elif residue.resname.upper()=="PRO" :
        return "Proline"
    elif next_residue is not None \
    and next_residue.resname.upper()=="PRO" :
        #exlcudes those that are Pro or Gly
        return "Pre-Pro"
    else :
        return "General"    

def getStructure(workingDir, filename, pdbCode) :
  
  RamList = []
  
  try :
    structure = Bio.PDB.PDBParser().get_structure(pdbCode, workingDir+"ENT/%s" % filename)
  except : 
    return [0]

  for model in structure :
      for chain in model :
        #  print("Chain %s" % str(chain.id))
          polypeptides = Bio.PDB.CaPPBuilder().build_peptides(chain)
          for poly_index, poly in enumerate(polypeptides) :
              phi_psi = poly.get_phi_psi_list()
              for res_index, residue in enumerate(poly) :
                  phi, psi = phi_psi[res_index]
                  if phi and psi :
                      #Don't write output when missing an angle
                      RamList.append("\"%s_Chain%s_%s%i\" : [%f, %f, \"%s\"]" \
                      % (pdbCode, str(chain.id), residue.resname,residue.id[1], degrees(phi), degrees(psi),ramachandran_type(residue, poly[res_index+1]))
                      )

  return RamList


def main(args):
  
  WD = "../Client/PDB_Datas/"
  pdbCode = args[1]
  RamList = []
  
  try : 
    Bio.PDB.PDBList().retrieve_pdb_file(pdbCode, obsolete=False, pdir=WD+"ENT/", file_format="pdb", overwrite=False)
  except :
    return 0
    
  filename = 'pdb'+pdbCode+'.ent'

  RamList = getStructure(WD,filename,pdbCode);
  
  if (RamList[0] == 0 ) :
    return 0
  
  LenRamList = len(RamList)-1;

  output_file = open(WD+"%s.json" % pdbCode,"w")

  output_file.write("{")

  for i in range(LenRamList+1) :
    if ( i < LenRamList ) :
      output_file.write("%s ," % RamList[i]);
    else :
      output_file.write("%s" % RamList[i]);

  output_file.write("}")

  output_file.close()
      
  print("Done")

  return 0

if __name__ == '__main__':
  import math
  import sys
  import Bio.PDB
  import requests
  import csv
  import json
  sys.exit(main(sys.argv))
