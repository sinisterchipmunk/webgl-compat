var _global;
if (typeof(global) != 'undefined') _global = global;
else _global = window;
if (!_global) alert("Where is global?");

beforeEach(function() {
  _global.CANVAS = document.createElement('canvas');
  CANVAS.width = 400;
  CANVAS.height = 300;
});

beforeEach(function() {
  this.addMatchers({
    toBeInstanceOf: function(klass) {
      return this.actual instanceof klass;
    },
    
    toEqualVector: function(vec) {
      var v = vec;
      if (arguments.length > 1 || typeof(vec) == 'number') v = arguments;
      if (v.length != this.actual.length) return false;
      for (var i = 0; i < v.length; i++)
        if (v[i] != this.actual[i]) return false;
      return true;
    }
  })
});
