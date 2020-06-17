import json
import time
import pck_tools
import json_manipulator
import tkinter.tix as tk
from tkinter.filedialog import *
from tkinter.simpledialog import *


class ActionDialog:
    _current_dialog = None

    def __init__(self, item, on_item_update, on_item_remove):
        # make sure only one dialog at a time
        try:
            ActionDialog._current_dialog.destroy()
        except Exception:
            pass

        # init
        self.item = item
        self.on_item_update = on_item_update
        self.on_item_remove = on_item_remove

        # dialog
        self.dialog = tk.Tk()
        self.dialog.title("Edit")
        self.dialog.resizable(width=False, height=False)

        # labels
        label_frame = tk.Frame(self.dialog, highlightbackground="gray", highlightcolor="gray", highlightthickness=2)
        pad = tk.Frame(label_frame, height=8)
        pad.pack(side=tk.TOP, fill=tk.BOTH, expand=True)

        # text hash
        tk.Label(label_frame, text="hash:", anchor=tk.W, font="helvetica 12 bold") \
            .pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        text_hash = tk.Text(label_frame, width=10, height=1, wrap=tk.WORD)
        text_hash.insert(tk.END, item.entry[:item.entry.find(".")])
        text_hash.bind("<Key>", lambda event: "break" if event.keysym == "Return" else "")
        text_hash.pack(side=tk.TOP, fill=tk.BOTH, expand=True, padx=8)

        # text key
        tk.Label(label_frame, text="key:", anchor=tk.W, font="helvetica 12 bold") \
            .pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        text_key = tk.Text(label_frame, width=80, height=1, wrap=tk.WORD)
        text_key.insert(tk.END, item.key)
        text_key.bind("<Key>", lambda event: "break" if event.keysym == "Return" else "")
        text_key.pack(side=tk.TOP, fill=tk.BOTH, expand=True, padx=8)

        # text value
        tk.Label(label_frame, text="value: ", anchor=tk.W, font="helvetica 12 bold") \
            .pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        text_value = tk.Text(label_frame, width=80, height=5, wrap=tk.WORD)
        text_value.insert(tk.END, item.value)
        text_value.bind("<Key>", lambda event: "break" if event.keysym == "Return" else "")
        text_value.pack(side=tk.TOP, fill=tk.BOTH, expand=True, padx=8)

        pad = tk.Frame(label_frame, height=8)
        pad.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        label_frame.pack(side=tk.TOP, fill=tk.BOTH, expand=True)

        # action buttons
        btn_frame = tk.Frame(self.dialog)
        btn = tk.Button(btn_frame, text="Cancel", command=lambda: self.dialog.destroy())
        btn.pack(side=tk.LEFT, fill=tk.X, expand=True)

        btn = tk.Button(btn_frame, text="Remove", command=lambda: self.action_remove(
                self.item
            )
        )
        btn.pack(side=tk.LEFT, fill=tk.X, expand=True)

        btn = tk.Button(btn_frame, text="Save", command=lambda: self.action_save(
                text_hash.get("1.0", tk.END)[:-1],
                text_key.get("1.0", tk.END)[:-1],
                text_value.get("1.0", tk.END)[:-1]
            )
        )
        btn.pack(side=tk.LEFT, fill=tk.X, expand=True)
        btn_frame.pack(side=tk.BOTTOM, fill=tk.BOTH, expand=True)

        ActionDialog._current_dialog = self.dialog

    def action_remove(self, item):
        self.on_item_remove(item)
        self.dialog.destroy()

    def action_save(self, hash, key, value):
        if self.item.get_parent() == hash and self.item.key == key and self.item.value == value:
            return

        self.on_item_update(self.item, hash, key, value)
        self.dialog.destroy()


class SearchDialog:
    _current_dialog = None

    def __init__(self, adapter):
        # make sure only one dialog at a time
        try:
            SearchDialog._current_dialog.destroy()
        except Exception:
            pass

        # init
        self.adapter = adapter
        self.last_query_params = ["", ""]
        self.last_query = {}
        self.last_query_index = -1

        # dialog
        self.dialog = tk.Tk()
        self.dialog.title("Search")
        self.dialog.resizable(width=False, height=False)
        self.dialog.config(highlightbackground="gray", highlightcolor="gray", highlightthickness=2)
        self.dialog.protocol("WM_DELETE_WINDOW", self.on_close)

        # labels
        label_frame = tk.Frame(self.dialog)

        # text key
        tk.Label(label_frame, text="key:", anchor=tk.W, font="helvetica 12 bold") \
            .pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        text_key = tk.Text(label_frame, width=40, height=1, wrap=tk.WORD)
        text_key.bind("<Key>", lambda event: "break" if event.keysym == "Return" else "")
        text_key.pack(side=tk.TOP, fill=tk.BOTH, expand=True, padx=8)

        # text value
        tk.Label(label_frame, text="value: ", anchor=tk.W, font="helvetica 12 bold") \
            .pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        text_value = tk.Text(label_frame, width=40, height=1, wrap=tk.WORD)
        text_value.bind("<Key>", lambda event: "break" if event.keysym == "Return" else "")
        text_value.pack(side=tk.TOP, fill=tk.BOTH, expand=True, padx=8)

        pad = tk.Frame(label_frame, height=14)
        pad.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        label_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # action buttons
        btn_frame = tk.Frame(self.dialog)
        btn_row1_frame = tk.Frame(btn_frame)
        btn = tk.Button(btn_row1_frame, text="<<<", width=10, command=lambda: self.action_search(
                text_key.get("1.0", tk.END)[:-1],
                text_value.get("1.0", tk.END)[:-1],
                -1
            )
        )
        btn.pack(side=tk.LEFT, fill=tk.X, expand=False, padx=2, pady=2)

        btn = tk.Button(btn_row1_frame, text=">>>", width=10, command=lambda: self.action_search(
                text_key.get("1.0", tk.END)[:-1],
                text_value.get("1.0", tk.END)[:-1],
                +1
            )
        )
        btn.pack(side=tk.LEFT, fill=tk.X, expand=False, padx=2, pady=2)
        btn_row1_frame.pack(side=tk.TOP, fill=tk.X, expand=False)

        btn = tk.Button(btn_frame, text="Count", width=20, command=lambda: self.action_count(
                text_key.get("1.0", tk.END)[:-1],
                text_value.get("1.0", tk.END)[:-1]
            )
        )
        btn.pack(side=tk.TOP, fill=tk.X, expand=False, padx=2, pady=2)

        self.found_label = tk.Label(btn_frame)
        self.found_label.pack(side=tk.TOP, fill=tk.BOTH, expand=True, padx=2, pady=2)
        btn_frame.pack(side=tk.TOP, fill=tk.BOTH, expand=True, padx=2, pady=2)

        SearchDialog._current_dialog = self.dialog

    def query_search(self, q_key, q_value):
        # clear old query
        self.adapter.highlight_search_results(self.last_query, False)
        self.last_query_params = (q_key, q_value)
        self.last_query.clear()
        self.last_query_index = -1

        # create new query
        for group in adapter.main_group.items:
            for item in group.items:
                if q_key.lower() in item.key.lower() and q_value.lower() in item.value.lower():
                    self.last_query[item.entry] = item

    def action_search(self, key, value, direction):
        # ignore if no parameters
        if len(key) == 0 == len(value):
            return

        # query if new parameters
        if self.last_query_params[0] != key or self.last_query_params[1] != value:
            self.query_search(key, value)

        # apply direction
        if 0 <= self.last_query_index + direction < len(self.last_query):
            self.last_query_index += direction
            self.adapter.highlight_search_results(self.last_query, True, index=self.last_query_index)

        # update found label
        self.found_label.config(text="Found: {:d}\nAt: {:d}/{:d}".format(len(self.last_query), self.last_query_index+1, len(self.last_query)))

    def action_count(self, q_key, q_value):
        # ignore if no parameters
        if len(q_key) == 0 == len(q_value):
            return

        self.query_search(q_key, q_value)

        # update found label
        self.found_label.config(text="Found: {:d}".format(len(self.last_query)))
        
        # highlight found items
        self.adapter.highlight_search_results(self.last_query, True)

    def on_close(self):
        self.adapter.highlight_search_results(self.last_query, False)
        self.dialog.destroy()


class ItemAdapter:
    def __init__(self, locale_json, shlist):
        # init
        self.shlist = shlist
        self.hlist = shlist.subwidget("hlist")
        hlist.config(command=self.on_item_picked)

        # init styles
        self.default_style = tk.DisplayStyle(tk.IMAGETEXT, fg="black", refwindow=self.hlist)
        self.changed_style = tk.DisplayStyle(tk.IMAGETEXT, fg="green", selectbackground="gray", refwindow=self.hlist)
        self.resolving_style = tk.DisplayStyle(tk.IMAGETEXT, bg="orange", selectbackground="gray", refwindow=self.hlist)
        self.found_style = tk.DisplayStyle(tk.IMAGETEXT, fg="black", bg="#92FF92", selectbackground="#92FF92", refwindow=self.hlist)
        self.found_single_style = tk.DisplayStyle(tk.IMAGETEXT, bg="#008000", selectbackground="#008000", refwindow=self.hlist)

        # json & lists
        self.locale_json = locale_json
        simplified_json = {}
        for json_file in locale_json["files"]:
            simplified_json[json_file] = locale_json["files"][json_file]["dict"]
        self.fix_json = {}

        # add groups to list
        self.main_group = GroupItem(0, "files", simplified_json, 0)
        self.add_to_list(self.main_group.items)

        # notify list
        self.shlist.autosetmode()
        self.close_groups()

    def add_to_list(self, items, parent=""):
        for item in items:
            self.hlist.add(parent+item.key, text=item.text, style=self.default_style)
            if isinstance(item, GroupItem):
                self.add_to_list(item.items, parent+item.key+".")

    def close_groups(self):
        for group in self.main_group.items:
            self.shlist.close(group.entry)

    # stored data operations
    def get_item(self, entry):
        return self.main_group.get_item(entry)

    def remove_item(self, entry):
        self.main_group.remove_item(entry)

    def add_item(self, item):
        for group in self.main_group.items:
            if group.entry == item.get_parent():
                group.items.append(item)

    def set_item(self, new_item):
        for g in range(len(self.main_group.items)):
            for i in range(len(self.main_group.items[g].items)):
                if self.main_group.items[g].items[i].entry == new_item.entry:
                    self.main_group.items[g].items[i] = new_item

    # big data operations
    def load_and_apply_patch(self):
        # pick and load file
        Tk().withdraw()
        file_path = askopenfilename(title="Open patch file...")
        patch_json = pck_tools.read_json(file_path)

        # get parameters
        patch_add = messagebox.askyesno("Patch Options", "Add new keys?")
        patch_override = messagebox.askyesno("Patch Options", "Override existing values?")
        if not patch_override:
            patch_resolve = messagebox.askyesno("Patch Options", "Resolve conflicts manually?")
        else:
            patch_resolve = False

        # if patch add keys
        if patch_add:
            patch_new_keys = json_manipulator.get_new_keys(self.locale_json, patch_json)
            for hash, patch_file in patch_new_keys["files"].items():
                # make sure parent exists
                try:
                    # create group
                    new_group = GroupItem(len(self.main_group.items), hash, {}, 1, hash)

                    # add group
                    self.hlist.add(new_group.entry, text=new_group.text)
                    self.main_group.items.append(new_group)
                except Exception:
                    pass
                for key, val in patch_file["dict"].items():
                    # create new item
                    new_item = LineItem(len(self.get_item(hash).items), key, val, 2)
                    new_item.entry = hash+"."+key
                    new_item.mark_as_changed()

                    # add new item
                    self.hlist.add(new_item.entry, text=new_item.text, at=new_item.index, style=self.changed_style)
                    self.add_item(new_item)
                self.shlist.open(hash)

        # if patch override
        if patch_override:
            patch_new_values = json_manipulator.get_changed_values(self.locale_json, patch_json)
            for hash, patch_file in patch_new_values["files"].items():
                for key, val in patch_file["dict"].items():
                    # create new item
                    new_item = LineItem(len(self.get_item(hash).items), key, val, 2)
                    new_item.entry = hash+"."+key
                    new_item.mark_as_changed()

                    # update item
                    self.hlist.item_configure(new_item.entry, 0, text=new_item.text)
                    self.set_item(new_item)

                    # update color for changed items
                    self.hlist.item_configure(new_item.entry, 0, style=self.changed_style)
                self.shlist.open(hash)
        # if patch resolve
        elif patch_resolve:
            patch_new_values = json_manipulator.get_changed_values(self.locale_json, patch_json)
            for hash, patch_file in patch_new_values["files"].items():
                for key, val in patch_file["dict"].items():
                    # create new item and get current one
                    new_item = LineItem(len(self.get_item(hash).items), key, val, 2)
                    new_item.entry = hash+"."+key
                    new_item.mark_as_changed()
                    old_item = self.get_item(new_item.entry)

                    # markup current conflict
                    self.hlist.item_configure(old_item.entry, 0, style=self.resolving_style)

                    # close all groups and open current
                    self.close_groups()
                    self.shlist.open(hash)
                    self.hlist.see(old_item.entry)

                    # pick which one
                    resolve_choice = messagebox.askyesno("Update to new value?", old_item.text+"\n=>\n"+new_item.text)
                    if resolve_choice:
                        # update item
                        self.hlist.item_configure(new_item.entry, 0, text=new_item.text)
                        self.set_item(new_item)

                        # update color for changed items
                        self.hlist.item_configure(new_item.entry, 0, style=self.changed_style)
                    else:
                        # update color for default items
                        self.hlist.item_configure(new_item.entry, 0, style=self.default_style)

    def load_and_apply_fix(self):
        # pick and load file
        Tk().withdraw()
        file_path = askopenfilename(title="Open fix file...")
        fix_json = pck_tools.read_json(file_path)

        for hash, items in fix_json.items():
            for key, fix in items.items():
                print(key, fix)
                # check fix can be applied
                item = self.get_item(hash+"."+key)
                if item:
                    # delete if action: 0
                    if fix["action"] == 0:
                        self.on_item_remove(item, confirm=False)
                    # move if action: 1
                    if fix["action"] == 1:
                        self.on_item_update(item, fix["hash"], fix["key"], item.value)

    # filters and queries
    def search_and_find(self):
        SearchDialog(self)

    def highlight_search_results(self, results, highlight, index=-1):
        for i, item in enumerate(results.values()):
            if highlight:
                if i == index:
                    # single search item
                    self.hlist.item_configure(item.entry, 0, style=self.found_single_style)

                    # open item
                    self.shlist.open(item.get_parent())
                    self.hlist.see(item.entry)
                else:
                    # all found results
                    self.hlist.item_configure(item.entry, 0, style=self.found_style)
            else:
                if not item.changed:
                    self.hlist.item_configure(item.entry, 0, style=self.default_style)
                else:
                    self.hlist.item_configure(item.entry, 0, style=self.changed_style)

    # item callbacks
    def on_item_picked(self, entry):
        item = self.get_item(entry)

        if isinstance(item, GroupItem):
            self.hlist.clipboard_clear()
            self.hlist.clipboard_append(entry)
            self.hlist.update()
        elif isinstance(item, LineItem):
            ActionDialog(item, self.on_item_update, self.on_item_remove)

    def on_item_update(self, item, hash, key, value):
        # create new item
        new_item = LineItem(item.index, key, value, item.depth)
        new_item.entry = hash+"."+key
        new_item.mark_as_changed()

        if new_item.entry != item.entry:
            # remove item
            self.hlist.delete_entry(item.entry)
            self.remove_item(item.entry)

            # make sure parent exists
            try:
                # create group
                new_group = GroupItem(len(self.main_group.items), hash, {}, new_item.depth-1, new_item.get_parent())
                new_group.items.append(new_item)

                # add group
                self.hlist.add(new_group.entry, text=new_group.text)
                self.main_group.items.append(new_group)
            except Exception:
                pass

            # add item
            if new_item.get_parent() != item.get_parent():
                new_group = self.get_item(new_item.get_parent())
                if new_group:
                    new_item.index = len(new_group.items)
            self.hlist.add(new_item.entry, text=new_item.text, at=new_item.index)
            self.add_item(new_item)
            self.shlist.open(new_item.get_parent())

            # update fix json
            if hash not in self.fix_json:
                self.fix_json[hash] = {}
            self.fix_json[hash][item.key] = {"action": 1, "hash": hash, "key": key}
        else:
            # update value
            self.hlist.item_configure(new_item.entry, 0, text=new_item.text)
            self.set_item(new_item)

        # update color for changed items
        self.hlist.item_configure(new_item.entry, 0, style=self.changed_style)

        # notify list
        self.shlist.autosetmode()

    def on_item_remove(self, item, confirm=True):
        # confirm dialog
        if confirm:
            remove = messagebox.askokcancel("Confirm Action", "Are you sure you want to remove:\n{}".format(item))
        else:
            remove = True

        if remove:
            # remove item
            self.hlist.delete_entry(item.entry)
            self.remove_item(item.entry)

            # update fix json
            if item.get_parent() not in self.fix_json:
                self.fix_json[item.get_parent()] = {}
            self.fix_json[item.get_parent()][item.key] = {"action": 0}

            # remove group if empty
            if len(self.get_item(item.get_parent()).items) == 0:
                self.remove_item(item.get_parent())

    # json generators
    def generate_full_json(self):
        new_json = {"name": "edited_"+self.locale_json["name"], "date": time.strftime("%x"), "files": {}}
        for hash, file_json in self.locale_json["files"].items():
            new_file_json = {"hash": hash, "line_type": file_json["line_type"], "dict": {}}
            for item in sorted(self.get_item(hash).items, key=lambda item: item.index):
                new_file_json["dict"][item.key] = item.value
            new_json["files"][hash] = new_file_json

        content_text = json.dumps(new_json, sort_keys=False, indent=4, ensure_ascii=False)
        print(content_text)
        file = asksaveasfile(mode="wb", initialfile=new_json["name"], defaultextension=".json")
        if file:
            file.write(content_text.encode("utf-8"))
            file.close()

    def generate_changes_json(self):
        new_json = {"name": "changes_"+self.locale_json["name"], "date": time.strftime("%x"), "files": {}}
        for group in self.main_group.items:
            new_file_json = {"hash": group.entry, "line_type": self.locale_json["files"][group.entry]["line_type"], "dict": {}}
            for item in sorted(group.items, key=lambda item: item.index):
                if item.changed:
                    new_file_json["dict"][item.key] = item.value
            if len(new_file_json["dict"]) > 0:
                new_json["files"][group.entry] = new_file_json

        content_text = json.dumps(new_json, sort_keys=False, indent=4, ensure_ascii=False)
        print(content_text)
        file = asksaveasfile(mode="wb", initialfile=new_json["name"], defaultextension=".json")
        if file:
            file.write(content_text.encode("utf-8"))
            file.close()

    def generate_fix_json(self):
        content_text = json.dumps(self.fix_json, sort_keys=False, indent=4, ensure_ascii=False)
        print(content_text)
        file = asksaveasfile(mode="wb", initialfile="fix_"+self.locale_json["name"], defaultextension=".json")
        if file:
            file.write(content_text.encode("utf-8"))
            file.close()


class GroupItem:
    def __init__(self, index, key, value, depth, entry=""):
        self.index = index
        self.key = key
        self.value = value
        self.depth = depth
        self.entry = entry
        if self.entry.startswith("."):
            self.entry = self.entry[1:]
        self.text = "\"{}\"".format(key)
        self.items = []

        self.split_items()

    def __str__(self):
        return self.text

    def split_items(self):
        for key, val in self.value.items():
            if isinstance(val, dict):
                self.items.append(GroupItem(len(self.items), key, val, self.depth+1, entry=self.entry+"."+key))
            else:
                self.items.append(LineItem(len(self.items), key, val, self.depth+1, entry=self.entry+"."+key))

    def get_item(self, entry):
        for item in self.items:
            if item.entry == entry:
                return item
            elif isinstance(item, GroupItem):
                test_find = item.get_item(entry)
                if test_find:
                    return test_find
        return None

    def remove_item(self, entry):
        for item in self.items:
            if item.entry == entry:
                self.items.remove(item)
            elif isinstance(item, GroupItem):
                item.remove_item(entry)


class LineItem:
    def __init__(self, index, key, value, depth, entry=""):
        self.index = index
        self.key = key
        self.value = value
        self.depth = depth
        self.entry = entry
        self.text = "\"{}\" = \"{}\"".format(key, value)
        self.changed = False

    def __str__(self):
        return self.text

    def get_parent(self):
        if "." in self.entry:
            return self.entry[:self.entry.rfind(".")]
        return None

    def mark_as_changed(self):
        self.changed = True


# locale reading
Tk().withdraw()
file_path = askopenfilename(title="Open json file...")
locale_json = pck_tools.read_json(file_path)


# assoc table
entry_item = {}
user_changes = {}

# frame fun
root = tk.Tk()
root.geometry("640x400")
root.title("Simple Editor")

shlist = tk.Tree(root, borderwidth=0, highlightthickness=0)
shlist.pack(fill=tk.BOTH, expand=True)

hlist = shlist.subwidget("hlist")
hlist.config(columns=1, selectmode=tk.BROWSE)

# list adapter
adapter = ItemAdapter(locale_json, shlist)


menu = tk.Menu(root)
savemenu = tk.Menu(menu, tearoff=0)
savemenu.add_command(label="Save Full", command=adapter.generate_full_json)
savemenu.add_command(label="Save Changes", command=adapter.generate_changes_json)
savemenu.add_command(label="Save As Fix", command=adapter.generate_fix_json)

loadmenu = tk.Menu(menu, tearoff=0)
loadmenu.add_command(label="Load Patch", command=adapter.load_and_apply_patch)
loadmenu.add_command(label="Load Fix", command=adapter.load_and_apply_fix)

searchmenu = tk.Menu(menu, tearoff=0)
searchmenu.add_command(label="Find", command=adapter.search_and_find)

menu.add_cascade(label="Save", menu=savemenu)
menu.add_cascade(label="Load", menu=loadmenu)
menu.add_cascade(label="Search", menu=searchmenu)
root.config(menu=menu)

# mainloop
root.mainloop()
