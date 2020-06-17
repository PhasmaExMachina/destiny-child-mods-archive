import pck_tools
import json
import time
from tkinter.filedialog import *


file = None
if len(sys.argv) > 1:
    file = sys.argv[1]
else:
    Tk().withdraw()
    file = askopenfilename(title="Open file...")

if file:
    file = file.replace("\\", "/")
    pck = pck_tools.unpack_pck(file)
    if pck:
        json_full = {"name": file[file.rfind("/") + 1:], "date": time.strftime("%x"), "files": {}}
        for pck_file in pck.get_files():
            json_full["files"][pck_file.hash] = pck_file.to_json()
        content = json.dumps(json_full, sort_keys=False, indent=4, ensure_ascii=False).encode("utf-8")
        print(pck_tools.save_file(content, file[:file.rfind("/")], file[file.rfind("/") + 1:file.rfind(".")]+".json"))
        #pck_tools.clean_up(file)


input()