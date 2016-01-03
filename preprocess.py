#!/usr/bin/env python
import argparse
import json
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
    Processes all files in ~/web/Odyssey/gallery. Does not require any structure, but suggesting
    year/country/city currently. Images not in a city can just go in country for example.
    Particular dates can be pulled from exif if jpg and the data exists, pngs are the only images processed for now.
    The following occurs when running this script:
    1. Scan the Odyssey/gallery/** folders and identify unprocessed images.
       If found, process them by making a thumbnail file with _small appended to the filename.
    2. Create a manifest of images for inclusion into Chromatic.
       For now this is a json format file with big, small and ratio attributes.

    TODO: Manifest is appending, but I'm not sure if all the bugs are gone yet.
    TODO: Include smart processing of exif, for obtaining GPS info, dates etc to build smart categories.
          Exif is currently pulled, GPS routines are written, this just needs to be added to the manifest really.
    """
    parser = argparse.ArgumentParser(description="Preprocess a directory for inclusion into Odyssey")
    parser.add_argument('-v','--verbose', help="Noisy output", action='store_true', dest='loud', required=False, default=False)
    args = parser.parse_args()

    gallery = Path(Path.home(), Path('web/Odyssey/gallery'))
    manifest = Path(Path.home(), Path('web/Odyssey/assets/data/manifest.json'))

    exts = '.jpg', '.png'
    maxsize = (500, 500)
    filelist = (x for x in gallery.glob('**/*') if x.is_file() and x.suffix.lower() in exts and not x.stem.startswith('~') and not x.stem.endswith('_small'))

    with manifest.open(mode='a+') as manifestFile:
        #We need to append to the manifest.json file, so read the data there first.
        manifestFile.seek(0)
        firstChar = manifestFile.read(1) #See if the file is empty coming from a+
        manifestFile.seek(0)
        if not firstChar:
            manifest = []
        else:
            manifest = json.loads(manifestFile.read())
            manifestFile.seek(0)
        manifestFile.truncate()
        #Now process the images
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
                manifest.append({'small': str(thumb.relative_to(gallery.parent).as_posix()), 'big': str(infile.relative_to(gallery.parent).as_posix()), 'aspect_ratio': ratio})
                if args.loud:
                    print("Processing", infile.relative_to(gallery))
                    print("width: %d - height: %d" % im.size) # returns (width, height) tuple
                    print("Ratio: ", ratio)
                    if infile.suffix.lower() == '.jpg':
                        print(get_lat_lon(exif_data))
        if args.loud:
            print(json.dumps(manifest, sort_keys=True, indent=4)) #Pretty
        #Write out the manifest
        manifestFile.write(json.dumps(manifest, sort_keys=False, separators=(',', ':'))) #Compact
