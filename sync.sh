#!/bin/bash
# Sync Data to Akasha

find dist -name *.js -exec chmod 644 {} \;
find dist -name *.css -exec chmod 644 {} \;
find dist -name *.htc -exec chmod 644 {} \;
rsync -v -rz --checksum --delete -e ssh dist/ AkashaO:odyssey/sandbox/
