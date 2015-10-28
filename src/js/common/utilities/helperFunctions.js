
NR.module("HelperFunctions", function (HelperFunctions, App, Backbone, Marionette, $, _) {
  HelperFunctions.replaceAllStrings = function(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
      return mapObj[matched];
    });
  };
  HelperFunctions.sumArray = function(array) {
    return _.reduce(array, function(previous, current){ return previous + parseInt(current, 10); }, 0);
  };
  HelperFunctions.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  var _chartColors = [
    "#D39441",
    "#FFD39B",
    "#763FA6",
    "#B790DA",
    "#00D3B6",
    "#55DDCB",
    "#FFFBA2",
    "#FFF977"
  ];
  HelperFunctions.generateColors = function (length) {
    var colors = _chartColors.slice();
    var randomColors = [];
    var randomNumberInArray = 0;
    for (var i = 0; i < length; i++) {
      randomNumberInArray = Math.floor(Math.random() * colors.length);
      randomColors.push(colors.splice(randomNumberInArray, 1)[0]);
    }
    return randomColors;
  };
});
