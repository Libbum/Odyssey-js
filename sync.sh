#!/bin/bash
# Sync Data to Akasha

find dist -type d -exec chmod 750 {} \;
find dist -type f -exec chmod 640 {} \;
rsync -v -rz --exclude '*.desc' --checksum --delete -e ssh dist/ AkashaO:odyssey/sandbox/
