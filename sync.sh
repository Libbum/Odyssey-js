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

rsync -avr --chown=www-data:www-data --checksum --delete -e ssh dist/ AkashaR:$path
