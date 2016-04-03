self.addEventListener("message", function(e) {
   importScripts("underscore-parts.js");
   var _cache;
   _cache = {};

   partition = linearPartition(e.data.weights, e.data.rows);
   index = 0;
   photos = e.data.photos;
   console.log(photos);

   photo_views = e.data.photo_views;
   _.each(partition, (function(_this) {
      return function(row) {
         var row_buffer, summed_ars;
         row_buffer = [];
         _.each(row, function(p, i) {
            return row_buffer.push(_this.photos[index + i]);
         });
         summed_ars = _.reduce(row_buffer, (function(sum, p) {
            return sum += p.aspect_ratio;
         }), 0);
         summed_width = 0;
         _.each(row_buffer, function(p, i) {
            var height, width;
            width = i === row_buffer.length - 1 ? viewport_width - summed_width : parseInt(viewport_width / summed_ars * p.aspect_ratio);
            height = parseInt(viewport_width / summed_ars);
            _this.photo_views[index + i].resize(width, height);
            return summed_width += width;
         });
         return index += row.length;
      };
   })(this));
   console.log(photos);

   self.postMessage("Done");

   function linearPartition(seq, k) {
      var ans, i, j, key, l, m, n, q, r, ref, ref1, ref2, ref3, s, solution, table, x, y;
      key = seq.join() + k;
      if (_cache[key]) {
         return _cache[key];
      }
      n = seq.length;
      if (k <= 0) {
         return [];
      }
      if (k > n) {
         return seq.map(function(x) {
            return [x];
         });
      }
      table = (function() {
         var l, ref, results;
         results = [];
         for (y = l = 0, ref = n; 0 <= ref ? l < ref : l > ref; y = 0 <= ref ? ++l : --l) {
            results.push((function() {
               var q, ref1, results1;
               results1 = [];
               for (x = q = 0, ref1 = k; 0 <= ref1 ? q < ref1 : q > ref1; x = 0 <= ref1 ? ++q : --q) {
                  results1.push(0);
               }
               return results1;
            })());
         }
         return results;
      })();
      solution = (function() {
         var l, ref, results;
         results = [];
         for (y = l = 0, ref = n - 1; 0 <= ref ? l < ref : l > ref; y = 0 <= ref ? ++l : --l) {
            results.push((function() {
               var q, ref1, results1;
               results1 = [];
               for (x = q = 0, ref1 = k - 1; 0 <= ref1 ? q < ref1 : q > ref1; x = 0 <= ref1 ? ++q : --q) {
                  results1.push(0);
               }
               return results1;
            })());
         }
         return results;
      })();
      for (i = l = 0, ref = n; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
         table[i][0] = seq[i] + (i ? table[i - 1][0] : 0);
      }
      for (j = q = 0, ref1 = k; 0 <= ref1 ? q < ref1 : q > ref1; j = 0 <= ref1 ? ++q : --q) {
         table[0][j] = seq[0];
      }
      for (i = r = 1, ref2 = n; 1 <= ref2 ? r < ref2 : r > ref2; i = 1 <= ref2 ? ++r : --r) {
         for (j = s = 1, ref3 = k; 1 <= ref3 ? s < ref3 : s > ref3; j = 1 <= ref3 ? ++s : --s) {
            m = _.min((function() {
               var ref4, results, t;
               results = [];
               for (x = t = 0, ref4 = i; 0 <= ref4 ? t < ref4 : t > ref4; x = 0 <= ref4 ? ++t : --t) {
                  results.push([_.max([table[x][j - 1], table[i][0] - table[x][0]]), x]);
               }
               return results;
            })(), function(o) {
               return o[0];
            });
            table[i][j] = m[0];
            solution[i - 1][j - 1] = m[1];
         }
      }
      n = n - 1;
      k = k - 2;
      ans = [];
      while (k >= 0) {
         ans = [
            (function() {
               var ref4, ref5, results, t;
               results = [];
               for (i = t = ref4 = solution[n - 1][k] + 1, ref5 = n + 1; ref4 <= ref5 ? t < ref5 : t > ref5; i = ref4 <= ref5 ? ++t : --t) {
                  results.push(seq[i]);
               }
               return results;
            })()
         ].concat(ans);
         n = solution[n - 1][k];
         k = k - 1;
      }
      return _cache[key] = [
         (function() {
            var ref4, results, t;
            results = [];
            for (i = t = 0, ref4 = n + 1; 0 <= ref4 ? t < ref4 : t > ref4; i = 0 <= ref4 ? ++t : --t) {
               results.push(seq[i]);
            }
            return results;
         })()
      ].concat(ans);
   };
});
