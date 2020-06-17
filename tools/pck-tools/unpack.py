import sys
import pck_tools


ppp = None
if len(sys.argv) > 1:
    ppp = pck_tools.unpack_pck(sys.argv[1])
else:
    from tkinter import Tk
    from tkinter.filedialog import *
    Tk().withdraw()
    path = askopenfilename(title="Open file...")
    pck_tools.clean_up(path)
    ppp = pck_tools.unpack_pck(path)
    pck_tools.pck_to_model(ppp)
input()
