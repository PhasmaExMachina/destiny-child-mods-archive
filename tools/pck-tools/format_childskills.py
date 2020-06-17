import json

keynames, childskills = {}, {}
with open("E:/Android/AndroidProjects/RIP Banana/files/keynames.json", "r", encoding="utf-8") as file:
    keynames = json.loads(file.read())
with open("E:/Android/AndroidProjects/RIP Banana/files/child_skills.json", "r", encoding="utf-8") as file:
    childskills = json.loads(file.read())


new_full = {}
for keyname in keynames:
    uf_matches = []
    #check if already found
    if keyname[:4] in new_full.values():
        continue;
    
    #first search
    for ck in childskills["child_skills"]:
        if "kname" in ck.keys():
            kn_name, kn_title = keynames[keyname]["name"], keynames[keyname]["title"]
            if (kn_title+" "+kn_name).lstrip() == ck["kname"]:
                uf_matches.append([ck["kname"], ck["name"]])
                if "model_id" not in ck.keys():
                    ck["model_id"] = keyname[:4]

    #second search
    if len(uf_matches) == 0:
        for ck in childskills["child_skills"]:
            if "kname" in ck.keys():
                kn_name = keynames[keyname]["name"]
                if kn_name == ck["kname"]:
                    uf_matches.append([ck["kname"], ck["name"]])
                    if "model_id" not in ck.keys():
                        ck["model_id"] = keyname[:4]

    #add if found
    if len(uf_matches) > 0:
        new_full[uf_matches[0][0]] = keyname[:4]

print("~"+str(len(new_full)*2/len(childskills["child_skills"])*100)+"%")

with open("E:/Android/AndroidProjects/RIP Banana/files/child_skills_new.json", "w", encoding="utf-8") as file:
    file.write(json.dumps(childskills, sort_keys=False, indent=4, ensure_ascii=False));
