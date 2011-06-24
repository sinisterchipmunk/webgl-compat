(function() {
  var _global;
  if (typeof(global) != 'undefined') _global = global;
  else _global = window;
  
  /* ex: defineCompatibilityTypes({Int32Array: 'Array', Float32Array: ['WebGLFloatArray', 'Array']}) */
  function defineCompatibilityTypes(types) {
    for (var primary in types) {
      if (_global[primary]) continue;
      var compatibles = types[primary];
      if (typeof(compatibles) == 'string') {
        if (_global[compatibles]) {
          _global[primary] = _global[compatibles];
          continue;
        }
      }
      else {
        var done = false;
        for (var i = 0; i < compatibles.length; i++) {
          if (_global[compatibles[i]]) {
            _global[primary] = _global[compatibles[i]];
            done = true;
            break;
          }
        }
        if (done) continue;
      }
      throw new Error("No compatible type for: "+primary);
    }
  }
  
  defineCompatibilityTypes({
    Int32Array: 'Array'
  });
})();
