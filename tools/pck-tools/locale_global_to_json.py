import pck_tools
import json
import time
from tkinter.filedialog import *


conversion_table = pck_tools.read_json("global_to_korean.json")
if conversion_table is None:
    exit("Conversion table not found!")


file = None
if len(sys.argv) > 1:
    file = sys.argv[1]
else:
    Tk().withdraw()
    file = askopenfilename(title="Open global file...")

if file:
    file = file.replace("\\", "/")
    pck = pck_tools.unpack_pck(file)
    if pck:
        json_full = {"name": "global_converted", "date": time.strftime("%x"), "files": {}}
        for global_hash in conversion_table:
            korean_hash = conversion_table[global_hash]

            global_pck_file = pck.get_file(hash=global_hash)
            if global_pck_file:
                global_pck_file.hash = korean_hash
                json_full["files"][global_pck_file.hash] = global_pck_file.to_json()
        content = json.dumps(json_full, sort_keys=False, indent=4, ensure_ascii=False).encode("utf-8")
        print(file[:file.rfind("/")])
        print(pck_tools.save_file(content, file[:file.rfind("/")], file[file.rfind("/") + 1:file.rfind(".")]+".json"))
else:
    exit("Picked file not found!")
