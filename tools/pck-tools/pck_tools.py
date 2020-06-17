from struct import *
import binascii
import os
import shutil
import json
import locale

import pck_crypt
import pck_struct
import yappy


# fix for different system locales
try:
    locale.setlocale(locale.LC_ALL, 'English_United States.1252')
except:
    pass

def print_hex(binary):
    print(' '.join(["{:02X}".format(x) for x in binary]))

def save_file(content, dir, name):
    if not os.path.isdir(dir):
        os.mkdir(dir)
    with open(os.path.join(dir, name), "wb") as file:
        file.write(content)
    return os.path.join(dir, name).replace("\\", "/")

def read_json(path):
    with open(path, "r", encoding="utf-8", errors="replace") as content:
        return json.load(content)


def unpack_pck(path, lang=None):
    with open(path, "rb") as file:
        file.seek(0, 0)
        head = binascii.hexlify(file.read(8)).decode("utf-8")
        count = unpack('i', file.read(4))[0]
        pck = pck_struct.Pck(path, head, count, lang)

        print("Found {:d} files | {}".format(count, head.upper()))
        for i in range(count):
            hash = binascii.hexlify(file.read(8)).decode("utf-8")
            flag = unpack('b', file.read(1))[0]
            offset = unpack('i', file.read(4))[0]
            size_p = unpack('i', file.read(4))[0]
            size = unpack('i', file.read(4))[0]
            noidea = unpack('i', file.read(4))[0]

            # save header position
            start = file.tell()
            file.seek(offset)

            # read to byte array
            file_bytes = file.read(size_p)

            # perform necessary operations
            if flag == 1:
                file_bytes = yappy.yappy_uncompress(file_bytes, size)
            elif flag == 2:
                old_size = len(file_bytes)
                file_bytes = pck_crypt.decrypt(file_bytes)
            elif flag == 3:
                file_bytes = yappy.yappy_uncompress(pck_crypt.decrypt(file_bytes), size)
            file_path = save_file(file_bytes, path[:path.rfind(".")], "{:08d}".format(i))

            if len(file_bytes) > 0:
                ext = file_bytes[0] & 0xFF

            print("File {:2d}/{:d}: [{:016X} | {:6d} bytes or {:6d}] {} {:02d} {}".format(i+1, count, offset, size, size_p, hash.upper(), flag, noidea))
            pck.add_file(file_path, hash, flag, ext)

            # restore header position
            file.seek(start, 0)
        print()
        pck.write_header()

        return pck

def pack_pck(pck):
    packed = b""

    # make header
    offset = 8 + 4 + pck.count*(8 + 1 + 4 + 4 + 8)
    packed += binascii.unhexlify(pck.head)
    packed += pack('i', pck.count)
    for file in pck.get_files():
        packed += binascii.unhexlify(file.hash)
        packed += pack('b', 00)
        packed += pack('i', offset)
        file_size = os.path.getsize(file.path)
        packed += pack('i', file_size)
        packed += pack('q', file_size)
        offset += file_size

    # add files
    for file in pck.get_files():
        packed += file.read_bin()

    return packed

def merge_pck(kr_file, en_file, fl_file):
    kr_pck = unpack_pck(kr_file, "kr")
    en_pck = unpack_pck(en_file, "en")
    fl_pck = pck_struct.Pck(fl_file, kr_pck.head, kr_pck.count, "fl")

    for kr in kr_pck.get_files():
        # korean files
        kr_dict = kr.to_dict()

        # english files
        en = en_pck.get_file(hash=kr.hash)
        if en:
            en_dict = en.to_dict()
            fl_dict = merge_dict(kr_dict, en_dict)
            content = form_dict(fl_dict, kr.line_type, kr.hash)
            save_file(content, fl_file[:fl_file.rfind(".")], kr.path[kr.path.rfind("/")+1:])
        else:
            shutil.copy(kr.path, fl_file[:fl_file.rfind(".")])

        # final files
        fl_path = os.path.join(fl_file[:fl_file.rfind(".")], kr.path[kr.path.rfind("/")+1:]).replace("\\", "/")
        fl_pck.add_file(fl_path, kr.hash, 00, kr.ext)

    return fl_pck

def pck_to_model(pck):
    # get model.json file
    model_json = None
    for pck_file in pck.get_files():
        if pck_file.get_ext_string() == "json":
            # test each json file
            test_json = read_json(pck_file.path)
            if test_json:
                if "version" in test_json and "model" in test_json and "textures" in test_json:
                    model_json = test_json
                    new_path = os.path.join(os.path.dirname(pck_file.path), "model.json")
                    os.rename(pck_file.path, new_path)
                    pck.get_file(hash=pck_file.hash).path = new_path
                    pck.get_file(hash=pck_file.hash).ext = 1
                    break

    # get & rename dat file
    try:
        pck_file_dat = next(pck_file for pck_file in pck.get_files() if pck_file.get_ext_string() == "dat")
        if pck_file_dat:
            new_path = os.path.join(os.path.dirname(pck_file_dat.path), model_json["model"])
            os.rename(pck_file_dat.path, new_path)
            pck.get_file(hash=pck_file_dat.hash).path = new_path
    except Exception as e:
        print(str(e))

    # get & rename png files
    try:
        pck_files_png = list(pck_file for pck_file in pck.get_files() if pck_file.get_ext_string() == "png")
        for index, texture_json in enumerate(model_json["textures"]):
            new_path = os.path.join(os.path.dirname(pck_file.path), texture_json)
            os.rename(pck_files_png[index].path, new_path)
            pck.get_file(hash=pck_files_png[index].hash).path = new_path
    except Exception as e:
        print(str(e))


    # get & rename mtn files
    try:
        pck_files_mtn = list(pck_file for pck_file in pck.get_files() if pck_file.get_ext_string() == "mtn")
        for index, motion_json in enumerate(motion_json[0] for motion_json in model_json["motions"].values()):
            new_path = os.path.join(os.path.dirname(pck_file.path), motion_json["file"])
            os.rename(pck_files_mtn[index].path, new_path)
            pck.get_file(hash=pck_files_mtn[index].hash).path = new_path
    except Exception as e:
        print(str(e))

    # get & rename expression files
    try:
        pck_files_exp = list(pck_file for pck_file in pck.get_files() if pck_file.get_ext_string() == "json")
        for index, expression_json in enumerate(model_json["expressions"]):
            new_path = os.path.join(os.path.dirname(pck_file.path), expression_json["file"])
            os.rename(pck_files_exp[index].path, new_path)
            pck.get_file(hash=pck_files_exp[index].hash).path = new_path
    except Exception as e:
        pass

    # TEMP
    for pck_file in pck.get_files():
        print(pck_file.path, pck_file.ext, pck_file.get_ext_string())

    # update _header
    pck.write_header()


def from_header(path):
    folder = path[:path.rfind("/")]
    with open(path, "r") as file:
        _header = json.load(file)
        pck = pck_struct.Pck(folder, "50434B00CDCCCC3E", len(_header), None)
        for key in _header:
            pck.add_file(folder+"/"+key, _header[key], 00, 00)
            print(pck.get_file(hash=_header[key]))
        return pck


def form_dict(dict, line_type, comment):
    content = b"\xef\xbb\xbf"+b"\x2f\x2f"+comment.encode("utf-8")+b"\x0d\x0a"
    for key, value in dict.items():
        new_line = None
        if line_type == pck_struct.PckFile.SPACE:
            new_line = key.encode("utf-8")+b"\x09"+value.encode("utf-8")
        elif line_type == pck_struct.PckFile.EQUALS:
            new_line = "{} = \"{}\"".format(key, value).encode("utf-8")
        if new_line:
            content += new_line+b"\x0d\x0a"
    return content

def merge_dict(base, add):
    merge = base.copy()
    for key in merge:
        if key in add:
            merge[key] = add[key]
    for key in add:
        if key not in merge:
            merge[key] = add[key]
    return merge


def clean_up(*args):
    for arg in args:
        shutil.rmtree(arg[:arg.rfind(".")], True)
