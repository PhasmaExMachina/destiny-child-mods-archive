import pck_tools
import json


def translation_json(kr_file, en_file, keep_old=False):
    to_exclude = ["PERIOD_QUEST", "PIECE_QUEST", "EVENT_ATTENDANCE", "EVENT_RUMBLE"]
    pck_kr = pck_tools.unpack_pck(kr_file, "kr")
    pck_en = pck_tools.unpack_pck(en_file, "en")

    json_full = {"name": pck_kr.head, "files": []}
    for kr in pck_kr.get_files():
        en = pck_en.get_file(hash=kr.hash)
        if not en:
            continue

        dict_kr = kr.to_dict()
        dict_en = en.to_dict()
        dict_fl = pck_tools.merge_dict(dict_kr, dict_en)

        json_file = {"hash": kr.hash, "line_type": kr.line_type, "dict": []}
        for key in dict_fl:
            if max([key.find(item) for item in to_exclude]) == -1:
                json_entry = {"key": key, "new_value": dict_fl[key]}
                if keep_old:
                    old_value = None
                    if key in dict_kr:
                        old_value = dict_kr[key]
                    json_entry["old_value"] = old_value
                json_file["dict"].append(json_entry)
        json_full["files"].append(json_file)

    return json_full

def child_json(pck_file, id):
    pass

def save_json(json_full, file):
    content = json.dumps(json_full, sort_keys=True, indent=4).encode("utf-8")
    return pck_tools.save_file(content, file[:file.rfind("/")], file[file.rfind("/")+1:])

def read_json(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file.read())


path_kr = "E:/Android/AndroidProjects/RIP Banana/files/locale_kr.pck"
path_en = "E:/Android/AndroidProjects/RIP Banana/files/locale_en_old.pck"
path_json = "E:/Android/AndroidProjects/RIP Banana/files/locale.json"