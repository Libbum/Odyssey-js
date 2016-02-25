#!/bin/bash
# Sync Data to Akasha

rsync -v -rz --checksum --exclude-from '.exclude-list.rsync' --delete -e ssh . AkashaO:odyssey/sandbox/

