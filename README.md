# Odyssey
A Photoblog of my adventures.

Uses a heavily modified [chromatic.js](https://github.com/crispymtn/chromatic.js) gallery, with maps and other interactivity powered by [D3.js](http://d3js.org/). Python scripts build the manifest of files which are needed in the gallery array and descriptor files for captions; menus and trip/city information have [Node.js](https://nodejs.org) build scripts.

All of this essentially becomes a static site generator that simply rsyncs to my VPS.

The starting point I used as a base came from Read Only by html5up.net | @n33co, released under CCA 3.0. Almost none of that exists now apart from a chunk of the sass and a very small amount of javascript. The rest of the code I've put under MIT. If you'd like to use my images please get in contact. I won't charge anything; but I'd like to know where and how you're planning to use them.

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
* [x] Lint the js files, they're a mess.
* [x] Fill descriptions, think of a nice way to automate that.
* [ ] Consider a push-new-to-fb option.
* [x] Mouseover locale values and world highlight / track
* [x] Maybe a URI method to initiate a selected country or trip
