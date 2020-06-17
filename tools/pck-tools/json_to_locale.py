import pck_tools
import pck_struct
import json
from tkinter.filedialog import *

file = None
if len(sys.argv) > 1:
    file = sys.argv[1]
else:
    Tk().withdraw()
    file = askopenfilename(title="Open file...")

if file:
    file = file.replace("\\", "/")
    folder = file[:file.rfind(".")]

    jsonFiles = pck_tools.read_json(file)
    pck = pck_struct.Pck(folder, "50434B00CDCCCC3E", len(jsonFiles["files"]), "new en")
    for i, jsonFile in enumerate(jsonFiles["files"]):
        jsonFile = jsonFiles["files"][jsonFile]
        print(jsonFile["hash"])

        newfile = pck_tools.form_dict(jsonFile["dict"], jsonFile["line_type"], jsonFile["hash"])
        newfile_path = pck_tools.save_file(newfile, folder, "{:08d}".format(i))
        pck.add_file(newfile_path, jsonFile["hash"], 00, 00)

    print("packing locale!!!")
    pck_path = pck_tools.save_file(pck_tools.pack_pck(pck), folder[:folder.rfind("/")], file[file.rfind("/")+1:].replace(".json", "")+"_new.pck")
    print(pck_path)
