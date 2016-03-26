(function($) {
   skel.breakpoints({
      shortest: '(max-height: 700px)',
      short: '(max-height: 880px)',
      xlarge: '(max-width: 1680px)',
      large: '(max-width: 1280px)',
      medium: '(max-width: 1024px)',
      small: '(max-width: 736px)',
      xsmall: '(max-width: 480px)'
   });

   viewing = { filterKey: '', filterProp: '', sortBy: ['!year', '!month', '!trip', 'filename'] };
   
   function gotoView(coords) {
      var interp = sphereRotate();
      d3.transition().delay(1500).duration(2000)
         .tween("rotate", function() {
            interp.source(proj.rotate()).target(coords).distance();
            var sc = d3.interpolate(proj.scale(), 190); //width / 2 - 10 = 190
            return function(i) {
               proj.rotate(interp(i)).scale(sc(i));
               m.scale(sc(i));
               d3.select("#map").selectAll("path").attr("d", d3.geo.path().projection(proj));
            };
         });
   }

   function sphereRotate() {
      var x0, y0, cy0, sy0, kx0, ky0,
         x1, y1, cy1, sy1, kx1, ky1,
         d, k, d3_radians = Math.PI / 180;

      function interpolate(t) {
         var B = Math.sin(t *= d) * k,
            A = Math.sin(d - t) * k,
            x = A * kx0 + B * kx1,
            y = A * ky0 + B * ky1,
            z = A * sy0 + B * sy1;
         return [Math.atan2(y, x) / d3_radians, Math.atan2(z, Math.sqrt(x * x + y * y)) / d3_radians];
      }

      interpolate.distance = function() {
         if (d === null) k = 1 / Math.sin(d = Math.acos(Math.max(-1, Math.min(1, sy0 * sy1 + cy0 * cy1 * Math.cos(x1 - x0)))));
         return d;
      };

      interpolate.source = function(_) {
         var cx0 = Math.cos(x0 = _[0] * d3_radians),
            sx0 = Math.sin(x0);
         cy0 = Math.cos(y0 = _[1] * d3_radians);
         sy0 = Math.sin(y0);
         kx0 = cy0 * cx0;
         ky0 = cy0 * sx0;
         d = null;
         return interpolate;
      };

      interpolate.target = function(_) {
         var cx1 = Math.cos(x1 = _[0] * d3_radians),
            sx1 = Math.sin(x1);
         cy1 = Math.cos(y1 = _[1] * d3_radians);
         sy1 = Math.sin(y1);
         kx1 = cy1 * cx1;
         ky1 = cy1 * sx1;
         d = null;
         return interpolate;
      };

      return interpolate;
   }

   function tripView(selected, getCoords) {
      var coords;
      if (viewing.filterKey == 'country') {
         d3.selectAll(".iglobe-countries").attr("style", null);
      }
      d3.selectAll(".iglobe-route").each(function(d, i) {
         if (d.properties.name == selected) {
            d3.select(this).attr("visibility", "visible");
            if (getCoords) {
               coords = getRotation(d.geometry.coordinates);
            }
         } else {
            d3.select(this).attr("visibility", "hidden");
         }
      });
      if (getCoords) {
         return coords;
      }
   }

   function getRotation(coords) {
      var lat = 0,
         long = 0,
         len = coords.length - 1;
      do {
         lat += coords[len][0];
         long += coords[len][1];
      } while (len--);
      lat /= coords.length;
      long /= coords.length;
      return [-lat, -long];
   }

   $(function() {
      var $body = $('body'),
         $header = $('#header'),
         $nav = $('#nav'),
         $wrapper = $('#wrapper'),
         $menuList = $('#MenuList'),
         $navMenu = $('#navMenu'),
         $navTitle = $('#navTitle');
      // Fix: Placeholder polyfill.
      $('form').placeholder();
      $navMenu.hide();
      $menuList.css({ 'visibility': 'hidden', 'opacity': 0 });
      // Prioritize "important" elements on medium.
      skel.on('+medium -medium', function() {
         $.prioritize(
            '.important\\28 medium\\29',
            skel.breakpoint('medium').active
         );
      });

      // Title Bar.
      $(
            '<div id="titleBar">' +
            '<a href="#header" class="toggle"></a>' +
            '<span class="title">' + $('#logo').html() + '</span>' +
            '</div>'
         )
         .appendTo($body);

      // Header.
      $header.panel({
         delay: 500,
         hideOnClick: true,
         hideOnSwipe: true,
         resetScroll: true,
         resetForms: true,
         side: 'right',
         target: $body,
         visibleClass: 'header-visible'
      });

      // Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
      if (skel.vars.os == 'wp' && skel.vars.osVersion < 10) $('#titleBar, #header, #wrapper').css('transition', 'none');

      // Menus
      var menu;
      $.getJSON('assets/data/menu.json', function(m) { menu = m; });

      $('#showMenu').click(function() {
         $navTitle.toggle('fast', function() { $navMenu.toggle(); });
      });

      $('#contactButton').click(function() {
         $('#contactModal').modal({ fadeDuration: 500 });
         return false;
      });


      function fillMenu(type) {
         var menuList = document.getElementById('MenuList');
         while (menuList.firstChild) {
            menuList.removeChild(menuList.firstChild);
         }
         var fragment = document.createDocumentFragment();
         menu[type].forEach(function(nfo, index) {
            var opt = document.createElement('option');
            opt.innerHTML = nfo.desc;
            opt.value = nfo.id;
            fragment.appendChild(opt);
         });
         menuList.appendChild(fragment);
      }

      $("input[name='galSelection']").change(function() {
         switch ($(this).attr('id')) {
            case 'galSelAll':
               $menuList.animate({ opacity: 0 }, 1000, function() {
                  $(this).css('visibility', 'hidden');
               });
               break;
            case 'galSelTrip':
               fillMenu('trips');
               $menuList.css('visibility', 'visible').animate({ opacity: 1 }, 1000);
               break;
            case 'galSelCountry':
               fillMenu('countries');
               $menuList.css('visibility', 'visible').animate({ opacity: 1 }, 1000);
               break;
         }
         return false;
      });

      $("#navsub").click(function() {
         var coords,
            selected = $("#MenuList").val();
         if ($("#galSelTrip").is(":checked")) {
            if (selected !== viewing.filterProp) {
               coords = tripView(selected, true);

               viewing.filterKey = 'trip';
               viewing.filterProp = selected;
               viewing.sortBy = ['!filename', '!year', '!month'];
               if (viewing.sortBy[0][0] === "!") {
                  viewing.sortBy = ['!filename', '!year', '!month'];
                  $("#inv").html('<i class="fa fa-chevron-down"></i>');
               } else {
                  viewing.sortBy = ['filename', '!year', '!month'];
                  $("#inv").html('<i class="fa fa-chevron-up"></i>');
               }
               gallerySwapout(filterSort());

               gotoView(coords);
            }
         } else if ($("#galSelCountry").is(":checked")) {
            for (var i = 0; i < countries.length; i++) {
               if (countries[i].id == selected) {
                  if (countries[i].properties.name !== viewing.filterProp) {
                     var centroid = d3.geo.path().projection(function(d) {
                        return d;
                     }).centroid;
                     coords = centroid(countries[i]);

                     tripView(selected, false);
                     d3.select("#" + selected).style("fill", "#962d3e");

                     viewing.filterKey = 'country';
                     viewing.filterProp = countries[i].properties.name.replace(/ /g, '_').replace(/\./g, '');
                     if (viewing.sortBy[0][0] === "!") {
                        viewing.sortBy = ['!year', '!month', 'filename'];
                        $("#inv").html('<i class="fa fa-chevron-down"></i>');
                     } else {
                        viewing.sortBy = ['year', 'month', 'filename'];
                        $("#inv").html('<i class="fa fa-chevron-up"></i>');
                     }

                     gallerySwapout(filterSort());

                     gotoView([-coords[0], -coords[1]]);
                     break;
                  }
               }
            }
         } else {
            tripView('', false);
            if (viewing.sortBy[0][0] === "!") {
               viewing = { filterKey: '', filterProp: '', sortBy: ['!year', '!month', '!trip', 'filename'] };
               $("#inv").html('<i class="fa fa-chevron-down"></i>');
            } else {
               viewing = { filterKey: '', filterProp: '', sortBy: ['year', 'month', '!trip', 'filename'] };
               $("#inv").html('<i class="fa fa-chevron-up"></i>');
            }
            var filtered = photos.sort(dynamicSortMultiple(viewing.sortBy));
            gallerySwapout(filtered);

            gotoView([-40, -30]);
         }
         return false;
      });

      $("#inv").click(function() {
         var isDate = false;
         if (viewing.sortBy[0][0] === "!") {
            $(this).html('<i class="fa fa-chevron-up"></i>');
            viewing.sortBy[0] = viewing.sortBy[0].substr(1);
            if (viewing.sortBy[0] === 'year') { isDate = true; }
         } else {
            $(this).html('<i class="fa fa-chevron-down"></i>');
            if (viewing.sortBy[0] === 'year') { isDate = true; }
            viewing.sortBy[0] = "!" + viewing.sortBy[0];
         }
         if (isDate) {
            if (viewing.sortBy[1][0] === "!") {
               viewing.sortBy[1] = viewing.sortBy[1].substr(1);
            } else {
               viewing.sortBy[1] = "!" + viewing.sortBy[1];
            }
         }
         gallerySwapout(filterSort());
         return false;
      });

      //  Gallery
     $.getJSON('assets/data/manifest.json', function(p) {
        photos = p.sort(dynamicSortMultiple(viewing.sortBy));
        $("#gallery").chromatic(photos);
     });

      //contact
      $("#contactForm").submit(function(e) {
         $.ajax({
            type: "POST",
            url: $(this).attr('action'),
            data: $(this).serialize(), // serializes the form's elements.
            success: function(data) {
               $('#response').animate({ 'opacity': 0 }, 500, function() {
                  $(this).html(data);
               }).animate({ 'opacity': 1 }, 500);
               if (~data.indexOf('Thanks')) {
                  $('#contactForm')[0].reset(); //clear the form if information was sent
               }
            }
         });
         e.preventDefault(); // don't execute the actual form submission.
      });

   });
})(jQuery);
