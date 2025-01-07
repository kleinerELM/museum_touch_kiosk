#!/usr/bin/env python3

import os, json
import tkinter as tk
from tkinter import filedialog

#remove root windows
root = tk.Tk()
root.withdraw()

path = filedialog.askdirectory(title = "Select directory with large images.")

# remember to fix deepzoom.py before running the script
# https://github.com/openzoom/deepzoom.py
import deepzoom

creator = deepzoom.ImageCreator(
    tile_size=1024,
    tile_overlap=2,
    tile_format="jpg",
    image_quality=0.8,
    resize_filter="bicubic",
)
ids = []
for file in os.listdir( path ):
    filepath = path + os.sep + file
    if os.path.isfile(filepath):
        id = file[:-4]
        ids.append(id)
        print(filepath, "{}/stack.dzi".format(id))
        creator.create(filepath, path + os.sep + "{}/stack.dzi".format(id))

json_str = json.dumps(ids)
print(json_str)

json_file = open(path + os.sep +"files.json", "w")
json_file.write(json_str)
json_file.close()