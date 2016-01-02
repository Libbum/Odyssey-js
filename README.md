# Odyssey
Photoblog of my adventures. Will be essentially static with some pre-processing of images to generate information which the javascript will need.

Using [chromatic.js](https://github.com/crispymtn/chromatic.js) as the gallery back end, may hack on it a bit.

Maps and other interactivity are using [D3.js](http://d3js.org/), mostly built specifically for this site, but cobbled together from various internet sources.

## TODO

* [x] Identify Layout.
* [x] Fill cities data.
* [x] Generate 'trips'.
* [x] Integrate map with main site.
* [x] Map colorscheme to site colorscheme (mostly, still testing).
* [ ] Drop useless css.
* [x] Fix Globe scale on css resize of header.
* [ ] When globe is max size, menu overflows atm. Need to address this depending on what ends up being there.
* [ ] Category capability. So far, ideas are sort by trip, date, country and have a tile map "explore".
* [ ] Add country highlights to globe.
* [ ] Sass needs a min-width I think. There's a problem with chromatic when we scale too small.
* [ ] Build backend.
* [x] File processing.
* [x] Manifest for gallery.
* [x] Interactive map (wip).
* [ ] Update to latest rc of Pillow - the exif bug is fixed. Test outputs.
* [ ] Edit photos to actually fill the gallery.
