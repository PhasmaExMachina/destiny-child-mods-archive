import json
import time
import sys
import pck_tools
from tkinter.filedialog import *


# returns all keys that are only in `new`
def get_new_keys(old, new):
    found = {"name": "found_new_keys", "date": time.strftime("%x"), "files": {}}
    for hash in new["files"]:
        # new file hash appears
        if hash not in old["files"]:
            found["files"][hash] = new["files"][hash]
        # file hash exists
        else:
            for key in new["files"][hash]["dict"]:
                val = new["files"][hash]["dict"][key]
                # new key
                if key not in old["files"][hash]["dict"]:
                    # create file in found if needed
                    if hash not in found["files"]:
                        found["files"][hash] = {"hash": hash, "line_type": new["files"][hash]["line_type"], "dict": {}}
                    # add new key to found
                    found["files"][hash]["dict"][key] = val
                # key exists
                else:
                    pass

    return found


# returns all values that aren't equal in `old` and `new`
def get_changed_values(old, new, keep_new=True):
    found = {"name": "found_changed_values", "date": time.strftime("%x"), "files": {}}
    for hash in old["files"]:
        # only look for changed values not new ones
        for key in old["files"][hash]["dict"]:
            try:
                # different value
                if old["files"][hash]["dict"][key] != new["files"][hash]["dict"][key]:
                    # create file in found if needed
                    if hash not in found["files"]:
                        found["files"][hash] = {"hash": hash, "line_type": new["files"][hash]["line_type"], "dict": {}}
                    # add value to found
                    if keep_new:
                        found["files"][hash]["dict"][key] = new["files"][hash]["dict"][key]
                    else:
                        found["files"][hash]["dict"][key] = old["files"][hash]["dict"][key]
            except Exception:
                pass
    return found


# returns `new` with all same values from `old` removed
def get_full_difference(old, new):
    for hash in old["files"]:
        for key in old["files"][hash]["dict"]:
            try:
                if old["files"][hash]["dict"][key] == new["files"][hash]["dict"][key]:
                    del new["files"][hash]["dict"][key]
                if len(new["files"][hash]["dict"]) == 0:
                    del new["files"][hash]
            except Exception:
                pass

    return new


# returns `old` with new keys from `new`
def add_new_keys(old, new):
    new_keys = get_new_keys(old, new)
    for hash in new_keys["files"]:
        # new file hash
        if hash not in old["files"]:
            old["files"][hash] = new["files"][hash]
        else:
            for key in new_keys["files"][hash]["dict"]:
                # add new keys
                val = new_keys["files"][hash]["dict"][key]
                old["files"][hash]["dict"][key] = val
    return old


# returns `old` with updated values from `new`
def update_values(old, new):
    changed_values = get_changed_values(old, new)
    for hash in changed_values["files"]:
        for key in changed_values["files"][hash]["dict"]:
            old["files"][hash]["dict"][key] = changed_values["files"][hash]["dict"][key]

    return old


# returns `old` with added and updated with `new`
def add_and_update(old, new):
    old_added = add_new_keys(old, new)
    old_updated = update_values(old_added, new)

    return old_updated


def user_resolver(old, new):
    # resolve changed values
    new_values = get_changed_values(old, new, True)
    old_values = get_changed_values(old, new, False)
    for hash in new_values["files"]:

        for key in new_values["files"][hash]["dict"]:
            # print each changed key
            sys.stdout.write("\033[;1m")
            # print each new hash
            print("[{}]".format(hash.upper()))
            print("\t{}".format(key))
            # reset colors
            sys.stdout.write("\033[0;0m")

            new_val = new_values["files"][hash]["dict"][key]
            old_val = old_values["files"][hash]["dict"][key]

            # print old value in red
            sys.stdout.write("\033[1;31m")
            print("\t\t{}".format(old_val))
            # print new value in green
            sys.stdout.write("\033[0;32m")
            print("\t\t{}".format(new_val))
            # reset colors
            sys.stdout.write("\033[0;0m")

            # change if empty input
            if len(input("\r\t\t")) == 0:
                old["files"][hash]["dict"][key] = new_val
                # print action
                print("\r\tUpdated!~")
            else:
                print("\r\tSkipped!~")

    return old


if __name__ == '__main__':
    print()
    Tk().withdraw()
    old_path = askopenfilename(title="Open first file...")
    new_path = askopenfilename(title="Open second file...")

    old_json = pck_tools.read_json(old_path)
    print("First file: [{} | {}]".format(old_json["name"], old_json["date"]))
    print(old_path)
    print()

    new_json = pck_tools.read_json(new_path)
    print("Second file: [{} | {}]".format(new_json["name"], new_json["date"]))
    print(new_path)
    print()

    print()
    print("Pick action: ")
    print("1) get new keys")
    print("2) get new changed values")
    print("3) get old changed values")
    print("4) get full difference")
    print("5) add only")
    print("6) update only")
    print("7) add and update")
    print("8) resolve update values")
    print()

    action = None
    try:
        action = int(input())
    except Exception:
        exit("Incorrect action picked!")

    content_json = None
    # new keys
    if action == 1:
        content_json = get_new_keys(old_json, new_json)
    # changed values new
    elif action == 2:
        content_json = get_changed_values(old_json, new_json, True)
    # changed values old
    elif action == 3:
        content_json = get_changed_values(old_json, new_json, False)
    # full difference
    elif action == 4:
        content_json = get_full_difference(old_json, new_json)
    # add keys
    elif action == 5:
        content_json = add_new_keys(old_json, new_json)
    # update values
    elif action == 6:
        content_json = update_values(old_json, new_json)
    # add & update content
    elif action == 7:
        content_json = add_and_update(old_json, new_json)
    # add & update with user resolving conflicts
    elif action == 8:
        content_json = user_resolver(old_json, new_json)

    if content_json is not None:
        content_text = json.dumps(content_json, sort_keys=False, indent=4, ensure_ascii=False)
        content_bin = content_text.encode("utf-8")
        print()
        print(content_text)
        print()
        print("Press any key to save file...")
        input()

        file = asksaveasfile(mode="wb", initialfile=content_json["name"], defaultextension=".json")
        if file:
            file.write(content_bin)
            file.close()
