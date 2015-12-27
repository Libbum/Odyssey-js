#!/bin/bash

node cityToCoords.js
topojson -o ../assets/data/world.json --id-property SU_A3 --properties name,localname,country -- countries.json cities.json trips.json
