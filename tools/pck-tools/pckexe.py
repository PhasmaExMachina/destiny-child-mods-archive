import pck_tools
import sys, os.path, shlex

args_pack = ['-p', '--pack']
args_unpack = ['-u', '--unpack']
args_format = ['-m', '--model']

action, format, files = None, 0, []
args = sys.argv
if len(args) == 1:
    print('usage: %s (-p|-u [-m]) PATH1, PATH2, PATH3...' % os.path.basename(__file__))
    print()
    print('     [-p/--pack PATH] to pack a model to pck')
    print('     [-u/--unpack PATH] to unpack a model')
    print('         [-m/--model] to format to live2d model after unpacking')
    print()
    print()
    args = shlex.split(input())
    args.insert(0, __file__)

if len(args) < 3:
    print('usage: %s (-p|-u [-m]) PATH1, PATH2, PATH3...' % os.path.basename(__file__))
    print()
    print('     [-p/--pack PATH] to pack a model to pck')
    print('     [-u/--unpack PATH] to unpack a model')
    print('         [-m/--model] to format to live2d model after unpacking')
    sys.exit(0)

if args[1] in args_pack:
    action = 0
if args[1] in args_unpack:
    action = 1
    if args[2] in args_format:
        format = 1

if action is None:
    print('Pick either (-p/--pack) or (-u/--unpack)')
    sys.exit(0)

files = args[2+format:]
for file in files:
    # try:
    file = file.replace('\\', '/')
    if os.path.isfile(file):
        if action == 0:
            pck = pck_tools.from_header(file)
            pck_path = pck_tools.save_file(pck_tools.pack_pck(pck), pck.path, pck.path[pck.path.rfind("/") + 1:] + ".pck")
            print('Packed to: ' + os.path.basename(pck_path))
        elif action == 1:
            pck_tools.clean_up(file)
            pck = pck_tools.unpack_pck(file)
            if format == 1:
                pck_tools.pck_to_model(pck)
    else:
        print('Skipping non-file: '+file)
    # except Exception as e:
    #     print("Error at: "+file)
    #     print(e)
    #     print(e.args)
