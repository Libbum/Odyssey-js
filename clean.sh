#!/bin/bash

rm -f dist/assets/data/manifest.json
find dist/gallery -name '*_small*' -exec rm {} \;
