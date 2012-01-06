//set main namespace
goog.provide('gobbs');

goog.require('goog.json');
goog.require('lime.Director');
goog.require('gobbs.Game');


//get requirements


//goog.require('lime.animation.Spawn');
//goog.require('lime.animation.FadeTo');
//goog.require('lime.animation.ScaleTo');

// goog.require('gobbs.Player');
// goog.require('gobbs.Line');
// goog.require('gobbs.Board');
// goog.require('gobbs.Stack');
// goog.require('gobbs.Piece');


// entrypoint
gobbs.start = function() {
  var director = new lime.Director(document.body, 1024, 768);
  var game = new gobbs.Game();
  director.replaceScene(game);
};

gobbs.objArray = function(arr) {
  var a = new Array();
  for (var i=0; i<arr.length; i++) {
    if (goog.isArray(arr[i])) {
      a.push(gobbs.objArray(arr[i]));
    } else {
      a.push(arr[i].toObj());
    }
  }
  return a;
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('gobbs.start', gobbs.start);
