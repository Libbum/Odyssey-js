#!/bin/bash

topojson -o ../assets/data/world.json --id-property SU_A3 --properties name --properties country -- countries.json cities.json
