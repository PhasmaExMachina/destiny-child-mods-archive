import json
import pck_tools
from tkinter.filedialog import *


def savefile(content):
    file = asksaveasfile(mode="wb", initialfile="addition", defaultextension=".json")
    if file:
        file.write(content)
        file.close()


Tk().withdraw()
base_path = askopenfilename(title="Open base file...")
new_path = askopenfilename(title="Open new file...")

base_json = pck_tools.read_json(base_path)
new_json = pck_tools.read_json(new_path)

for hash in new_json["files"]:
    for key in new_json["files"][hash]["dict"]:
        if hash in base_json["files"]:
            base_json["files"][hash]["dict"][key] = new_json["files"][hash]["dict"][key]
        else:
            base_json["files"][hash] = new_json["files"][hash]


savefile(json.dumps(base_json, sort_keys=False, indent=4, ensure_ascii=False).encode("utf-8"))
