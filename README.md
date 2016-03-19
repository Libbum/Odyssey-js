# Odyssey
A Photoblog of my adventures.

Uses a modified [chromatic.js](https://github.com/crispymtn/chromatic.js) gallery, with maps and other interactivity powered [D3.js](http://d3js.org/). A Python script builds the manifest of files needed in the gallery array; menus and trip/city information have [Node.js](https://nodejs.org) build scripts.

All of this essentially becomes a static site generator that simply rsyncs to my VPS.

## TODO

* [x] Identify Layout.
* [x] Fill cities data.
* [x] Generate 'trips'.
* [x] Integrate map with main site.
* [x] Map colorscheme to site colorscheme (mostly, still testing).
* [x] Drop useless css.
* [x] Fix Globe scale on css resize of header.
* [x] When globe is max size, menu overflows atm. Need to address this depending on what ends up being there.
* [x] Category capability. 
* [ ] Tile map "explore" category.
* [x] Add country highlights to globe.
* [x] Sass needs a min-width I think. There's a problem with chromatic when we scale too small.
* [x] Build backend.
* [x] File processing.
* [x] Manifest for gallery.
* [x] Interactive map (wip).
* [x] Update to latest rc of Pillow - the exif bug is fixed. Test outputs.
* [x] Edit photos to actually fill the gallery.
* [ ] Fix mobile fuckery.
* [ ] Lint the js files, they're a mess.
* [ ] Fill descriptions, think of a nice way to automate that.
* [ ] Consider a push-new-to-fb option.
