




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


$(function() {
   var $body = $('body'),
      $header = $('#header'),
      $nav = $('#nav'),
      $wrapper = $('#wrapper');
      $menuList = $('#MenuList');
      $navMenu = $('#navMenu');
      $navTitle = $('#navTitle');
   // Fix: Placeholder polyfill.
   $('form').placeholder();
   $navMenu.hide();
   $menuList.css({'visibility': 'hidden', 'opacity': 0});
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
      $navTitle.toggle('fast', function() {
         $navMenu.toggle();
      });
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
            $menuList.animate({
               opacity: 0
            }, 1000, function() {
               $(this).css('visibility', 'hidden');
            });
            break;
         case 'galSelTrip':
            fillMenu('trips');
            $menuList.css('visibility', 'visible').animate({
               opacity: 1
            }, 1000);
            break;
         case 'galSelCountry':
            fillMenu('countries');
            $menuList.css('visibility', 'visible').animate({
               opacity: 1
            }, 1000);
            break;
      }
      return false;
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



   $("#inv").click(function() {
      var isDate = false;
      if (viewing.sortBy[0][0] === "!") {
         $(this).html('<i class="fa fa-chevron-up"></i>');
         viewing.sortBy[0] = viewing.sortBy[0].substr(1);
         if (viewing.sortBy[0] === 'year') {
            isDate = true;
         }
      } else {
         $(this).html('<i class="fa fa-chevron-down"></i>');
         if (viewing.sortBy[0] === 'year') {
            isDate = true;
         }
         viewing.sortBy[0] = "!" + viewing.sortBy[0];
      }
      if (isDate) {
         if (viewing.sortBy[1][0] === "!") {
            viewing.sortBy[1] = viewing.sortBy[1].substr(1);
         } else {
            viewing.sortBy[1] = "!" + viewing.sortBy[1];
         }
      }
      //gallerySwapout(filterSort());
      return false;
   });

  });
})(jQuery);
