Name: Destiny Child PCK Manager (PCK)
Author: whocares8128
Version: 1.0.1


Requirements:
.NET Framework 3.5+


Description:
This is a command-line tool, designed to extract and rebuild PCK files, for Destiny Child.


Installation:
Simply extract the contents to a location of your choice.


Usage:
------------
 Extraction
------------
Drag'n'drop a PCK file (or files, or folder(s) with PCK files inside) onto PCK.exe.  It will create a folder with the name of the PCK file at the source location.  Inside each file will appear in order with a type derived from its content, with a "_header" file to keep track of the file IDs and flag information.

You can also drop PCK files onto the included Live2D.bat.  This will extract the files with names based on the character's JSON file (if included, otherwise it behaves the same as normal).  The character's JSON file will be called "MOC.[CharacterID].json"; drop this file onto the Live2D Viewer to load it with all included physics/animations/etc.  These files with friendly names *should* still be in the same order as the would be otherwise; assuming that being the case, you can rebuild PCK files from this state.


------------
 Rebuilding
------------
Drag'n'drop a folder (or folders) onto PCK.exe or an applicable batch file.  It will create a file named <source folder name> + ".pck." + [Tags].  Where the Tags is a concatenation of descriptors about the new PCK file.
	new		Always present.  Indicates that the PCK file has been repacked.
	Compressed	Indicates that all non-texture elements were forcibly compressed.
	Unencrypted	Indicates that no encryption was used.  This allows for universal compatibility across all versions of the game.

Note: Any existing file with that name will be OVERWRITTEN!

--------------
 Command Line
--------------
Of course, you can run the tool from the command line or call it via other means.  Simply run the program without any arguments to get relevant information for calling the program.

One advanced use would be to compress PCKs with plain text in them (e.g. the english translations).  Assuming the current directory has PCK.exe, you can run the following one line:
	PCK /C <path to locale.pck> <same path without the ".pck">
to both extract and repack (using the repacking option to force compression) the PCK into "locale.pck.new".  Even though the "locale" folder may not exist when the command is executed, it will be created by the preceding argument before it's evaluated.  Alternatively, an equivalent command would be:
	PCK /R /C <path to locale.pck>