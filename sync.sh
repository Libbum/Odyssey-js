#!/bin/bash
# Sync Data to Akasha

path='odyssey/'
while getopts "cs" opt; do
  case $opt in
    s)
      echo "Sending to Sandbox."
      path='odyssey/sandbox/'
      ;;
   c)
     echo "Setting file permissions."
     find dist -type d -exec chmod 750 {} \;
     find dist -type f -exec chmod 640 {} \;
     ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

rsync -v -r --exclude '*.desc' --exclude 'stats' --exclude 'sandbox' --exclude 'veritas' --checksum --delete -e ssh dist/ AkashaO:$path
