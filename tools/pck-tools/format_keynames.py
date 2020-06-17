import json

out = {}
with open("E:/Android/AndroidProjects/RIP Banana/files/locale/00000009", "r", encoding="utf-8-sig", errors="replace") as file:
    fstr = file.read()
    for line in fstr.split("\n"):
        if len(line) == 0:
            continue
        if line[0] == "c":
            index = -1
            for i in range(len(line)):
                if line[i].isspace():
                    index = i
                    break
            if index == -1:
                raise Exception("wrong line format")


            key = line[:index].rstrip()
            value = line[index:].lstrip()


            index = -1
            for i in range(len(value)):
                if value[i].encode("utf-8") == b'\t':
                    index = i
                    break
            if index == -1:
                raise Exception("wrong line format")

            oldval = value
            value = value[:index].rstrip()


            out[key] = {}
            out[key]["title"] = value[:value.find("_")]
            out[key]["name"] = value[value.find("_")+1:]
with open("E:/Android/AndroidProjects/RIP Banana/files/keynames.json", "w", encoding="utf-8") as file:
    file.write(json.dumps(out, sort_keys=False, indent=4, ensure_ascii=False));
    
