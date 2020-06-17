import json
import time
import pck_tools
from tkinter.filedialog import *


# locale reading
Tk().withdraw()
korean_path = askopenfilename(title="Open korean json file...")
korean_json = pck_tools.read_json(korean_path)

global_path = askopenfilename(title="Open global json file...")
global_json = pck_tools.read_json(global_path)

kr_hash, gb_hash = "f80a001a49cfda65", "f80a001a49cfda65"
korean_skills = korean_json["files"][kr_hash]["dict"]
global_skills = global_json["files"][gb_hash]["dict"]

patch_skills = {"name": "patched_skills", "date": time.strftime("%x"), "files": {
    kr_hash: korean_json["files"][kr_hash]
}}
patch_skills_dict = {}


for key, value in korean_skills.items():
    if key in global_skills:
        patch_value = ""
        global_value = global_skills[key]
        for index, global_part in enumerate(global_value.split("\t")):
            if index == 1:
                patch_value += value.split("\t")[1]
            else:
                patch_value += global_part
            patch_value += "\t"
        patch_value = patch_value[:-1]
        patch_skills_dict[key] = patch_value
patch_skills["files"][kr_hash]["dict"] = patch_skills_dict

content_text = json.dumps(patch_skills, sort_keys=False, indent=4, ensure_ascii=False)
print(content_text)
file = asksaveasfile(mode="wb", initialfile=patch_skills["name"], defaultextension=".json")
if file:
    file.write(content_text.encode("utf-8"))
    file.close()

