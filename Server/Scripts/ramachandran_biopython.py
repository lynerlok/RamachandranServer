# Please see accompanying webpage:
# 
# http://www.warwick.ac.uk/go/peter_cock/python/ramachandran/calculate/
#
# This code relies on Thomas Hamelryck's Bio.PDB module in BioPython:
#
# http://www.biopython.org
#

import math
import sys
import Bio.PDB
import requests
import csv
import json

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

pdb_code = sys.argv[1]

Bio.PDB.PDBList().retrieve_pdb_file(pdb_code, obsolete=False, pdir="../Client/PDB_Datas/ENT/", file_format="pdb", overwrite=False)

filename = 'pdb'+pdb_code+'.ent'

structure = Bio.PDB.PDBParser().get_structure(pdb_code, "../Client/PDB_Datas/ENT/%s" % filename)

output_file = open("../Client/PDB_Datas/TSV/%s.tsv" % pdb_code,"w")
for model in structure :
    for chain in model :
        print("Chain %s" % str(chain.id))
        polypeptides = Bio.PDB.CaPPBuilder().build_peptides(chain)
        for poly_index, poly in enumerate(polypeptides) :
            phi_psi = poly.get_phi_psi_list()
            for res_index, residue in enumerate(poly) :
                phi, psi = phi_psi[res_index]
                if phi and psi :
                    #Don't write output when missing an angle
                    output_file.write("%s:Chain%s:%s%i\t%f\t%f\t%s\n" \
                        % (pdb_code, str(chain.id), residue.resname,
                           residue.id[1], degrees(phi), degrees(psi),
                           ramachandran_type(residue, poly[res_index+1])))
output_file.close()

with open("../Client/PDB_Datas/TSV/%s.tsv" % pdb_code,r) as file:
  reader = csv.DictReader(file, delimiter="\t")
  data = list(reader)
return json.dumps(data)
    
print("Done")
