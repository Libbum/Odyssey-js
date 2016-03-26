function deepProperties(arr, property) {
   var res = '',
      details, back;
   switch (property) {
      case 'date': //NOTE: Probably don't use date, use year & month because date is pulled from trip info and not all images are in a trip.
      case 'trip':
      case 'big':
         res = arr[property];
         break;
      case 'country':
         details = /\d{4}\/\d{2}\/(\w+)/;
         back = details.exec(arr.big);
         res = back[1];
         break;
      case 'city':
         details = /\d{4}\/\d{2}\/\w+\/(\w+)/;
         back = details.exec(arr.big);
         res = back[1];
         break;
      case 'filename':
         details = /\d{4}\/\d{2}\/\w+\/\w+\/(\w+)/;
         back = details.exec(arr.big);
         res = back[1];
         break;
      case 'year':
         details = /(\d{4})\/\d{2}\//;
         back = details.exec(arr.big);
         res = back[1];
         break;
      case 'month':
         details = /\d{4}\/(\d{2})\//;
         back = details.exec(arr.big);
         res = back[1];
         break;
   }
   return res;
}

function gallerySwapout(filtered) {
   if (filtered.length > 1) {
      var gallery = $("#gallery");
      gallery.fadeTo(750, 0, function() {
         gallery.empty().chromatic(filtered);
         gallery.fadeTo(750, 1);
      });
   }
}

function filterSort() {
   return photos.filter(function(el) {
      return deepProperties(el, viewing.filterKey) == viewing.filterProp;
   }).sort(dynamicSortMultiple(viewing.sortBy));
}

function dynamicSort(property) {
   var sortOrder = 1;
   if (property[0] === "!") {
      sortOrder = -1;
      property = property.substr(1);
   }
   return function(a, b) {
      var left = deepProperties(a, property),
         right = deepProperties(b, property),
         result = (left < right) ? -1 : (left > right) ? 1 : 0;
      return result * sortOrder;
   };
}

function dynamicSortMultiple(props) {
   return function(obj1, obj2) {
      var i = 0,
         result = 0,
         numberOfProperties = props.length;
      while (result === 0 && i < numberOfProperties) {
         result = dynamicSort(props[i])(obj1, obj2);
         i++;
      }
      return result;
   };
}
