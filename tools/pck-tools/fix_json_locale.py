import pck_tools
import json
import time
from tkinter.filedialog import *


Tk().withdraw()
json_path = askopenfilename(title="Open json file...")
fix_path = askopenfilename(title="Open fix file...")

locale_json = pck_tools.read_json(json_path)
fix_json = pck_tools.read_json(fix_path)

for hash in fix_json:
    hash_fix_json = fix_json[hash]
    for key in hash_fix_json:
        key_fix_json = hash_fix_json[key]
        try:
            # action: 0, delete
            if key_fix_json["action"] == 0:
                del locale_json["files"][hash]["dict"][key]
            # action: 1, rename key & move
            elif key_fix_json["action"] == 1:
                val = locale_json["files"][hash]["dict"][key]
                del locale_json["files"][hash]["dict"][key]
                locale_json["files"][key_fix_json["hash"]]["dict"][key_fix_json["key"]] = val
        except Exception:
            pass


file = asksaveasfile(mode="wb", initialfile="fixed_"+locale_json["name"], defaultextension=".json")
if file:
    file.write(json.dumps(locale_json, sort_keys=False, indent=4, ensure_ascii=False).encode("utf-8"))
    file.close()
