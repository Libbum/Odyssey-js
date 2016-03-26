import os
import sys
from pathlib import *

gallery = Path(Path.home(), Path('web/Odyssey/dist/gallery'))
exts = '.jpg', '.png'
filelist = (x for x in gallery.glob('**/*') if x.is_file() and x.suffix.lower() in exts and not x.stem.startswith('~') and not x.stem.endswith('_small'))

for infile in filelist:
    dotdesc = infile.with_name(infile.stem+'.desc')
    if not dotdesc.exists():
        print("Touched: ", dotdesc.relative_to(gallery), ".")
        open(str(dotdesc), 'a').close()
