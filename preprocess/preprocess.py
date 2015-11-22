#!/usr/bin/env python
import argparse
import os
import sys
from pathlib import *
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

def get_exif_data(image):
    """
    Returns a dictionary from the exif data of an PIL Image item. Also converts the GPS Tags
    Well, it should work at least, but fucking hell. https://github.com/python-pillow/Pillow/issues/1477
    """
    exif_data = {}
    info = image._getexif()
    if info:
        for tag, value in info.items():
            decoded = TAGS.get(tag, tag)
            if decoded == 'GPSInfo': #Using Pillow 2.9.0 for now due to bug in 3.0.0 on this step.
                gps_data = {}
                for t in value:
                    sub_decoded = GPSTAGS.get(t, t)
                    gps_data[sub_decoded] = value[t]

                exif_data[decoded] = gps_data
            else:
                exif_data[decoded] = value

    return exif_data

def _get_if_exist(data, key):
    if key in data:
        return data[key]

    return None

def _convert_to_degress(value):
    """Helper function to convert the GPS coordinates stored in the EXIF to degress in float format"""
    d0 = value[0][0]
    d1 = value[0][1]
    d = float(d0) / float(d1)

    m0 = value[1][0]
    m1 = value[1][1]
    m = float(m0) / float(m1)

    s0 = value[2][0]
    s1 = value[2][1]
    s = float(s0) / float(s1)

    return d + (m / 60.0) + (s / 3600.0)

def get_lat_lon(exif_data):
    """Returns the latitude and longitude, if available, from the provided exif_data (obtained through get_exif_data above)"""
    lat = None
    lon = None

    if 'GPSInfo' in exif_data:
        gps_info = exif_data['GPSInfo']

        gps_latitude = _get_if_exist(gps_info, 'GPSLatitude')
        gps_latitude_ref = _get_if_exist(gps_info, 'GPSLatitudeRef')
        gps_longitude = _get_if_exist(gps_info, 'GPSLongitude')
        gps_longitude_ref = _get_if_exist(gps_info, 'GPSLongitudeRef')

        if gps_latitude and gps_latitude_ref and gps_longitude and gps_longitude_ref:
            lat = _convert_to_degress(gps_latitude)
            if gps_latitude_ref != 'N':
                lat = 0 - lat

            lon = _convert_to_degress(gps_longitude)
            if gps_longitude_ref != 'E':
                lon = 0 - lon

    return lat, lon

if __name__ == "__main__":
    """
    TODO: Current assumptions: is that there are no files in the outdir.
    Also, the input directory structure is what we want and that we're at the base of this structure.
    This isn't such a bad idea actually.
    Let's assume we have a gallery directory which we fill with stuff, then ultimately _site/gallery will be filled.
    If we DGAF about file names, we can just keep them, append a _small for the thumbnail and be done.
    Ultimately then, we could remove the directory argument and just run this from base.

    REAL TALK:
    Thinking has been wrong. What we need is the base path to be Odyssey/gallery, with stuff I fill in. I think for now, a folder structure of
    year/country/city will be fine. For those not in a city, they can just go in country for example. Particular dates can be pulled from exif.
    Point being, the _site/gallery portion will be handled by hakyll, and we only want to do two things with this script.
    1. Scan the Odyssey/gallery/** folders and identify unprocessed images. If found, process them by making a thumbnail file
    2. Create a manifest of images for inclusion into Chromatic.
    """
    parser = argparse.ArgumentParser(description="Preprocess a directory for inclusion into Odyssey")
    parser.add_argument('-v','--verbose', help="Noisy output", action='store_true', dest='loud', required=False, default=False)
    args = parser.parse_args()

    gallery = Path(Path.home(), Path('web/Odyssey/gallery'))

    exts = '.jpg', '.png'
    maxsize = (500, 500)

    filelist = (x for x in gallery.glob('**/*') if x.is_file() and x.suffix.lower() in exts and not x.stem.startswith('~') and not x.stem.endswith('_small'))
    for infile in filelist:
        thumb = infile.with_name(infile.stem+'_small'+infile.suffix)
        if not thumb.exists():
            im = Image.open(str(infile))
            ratio = im.size[0]/im.size[1]
            if infile.suffix.lower() == '.jpg': #PNGs don't have EXIF.
                exif_data = get_exif_data(im)
            try:
                im.thumbnail(maxsize, Image.ANTIALIAS)
                im.save(str(thumb))
            except IOError:
                print("Small image for", infile.relative_to(gallery), "failed.")
            if args.loud:
                #print("Processing", infile.name)
                print("Processing", infile.relative_to(gallery))
                print("width: %d - height: %d" % im.size) # returns (width, height) tuple
                print("Ratio: ", ratio)
                if infile.suffix.lower() == '.jpg':
                    print(get_lat_lon(exif_data))



#TODO: If files exist in outdir, we can byte compare them with
#import filecmp
#filecmp.cmp('one.jpg', 'two.jpg')
#True
#Actually, it's probably better to compare the directory structure: https://docs.python.org/3/library/filecmp.html
#dircmp has same_files. Nope. Only does shallow comparisons. Need the deep version.

    #infile = 'big.jpg'
    #outfile = 'small.jpg'
