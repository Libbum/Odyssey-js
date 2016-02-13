Array.prototype.unique = function() {
    var a = [], l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++)
            if (this[i] === this[j]) j = ++i;
      a.push(this[i]);
    }
    return a;
};

Array.prototype.findIndex = function(value){
  for (var i=0; i < this.length; i++) {
    if (this[i].cca3 == value) { return i; }
  }
  return -1;
};

fs = require('fs'),
countriesData = require("./countrylist.json"),
citiesData = require("./cities.json"),
tripData = require("./tripcities.json");

//So cities is probably always giong to need manual attention, so we'll just use it by default.
var cc = [];
citiesData.features.forEach(function(c){
    cc.push(c.properties.country);
});

ccodes = cc.unique().sort();
data = '{ "countries": [ ';
ccodes.forEach(function(i){
    idx = countriesData.findIndex(i);
    if (idx >= 0) {
        data += '"' + countriesData[idx].name.common + '", ';
    } else {
        console.log(i+" not found in country list.");
    }
});
data = data.slice(0,-2) + ' ], "trips": [ ';
tripData.trips.forEach(function(t){
    data += '{ "id": "' + t.name + '", "desc": "' + t.description + '" },';
});
data = data.slice(0,-2) + '} ] }';

fs.writeFile("../assets/data/menu.json", data, function(err) {
    if(err) {
        return console.log(err);
    }
});
