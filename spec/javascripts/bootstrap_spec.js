describe("WebGL-Compat", function() {
  it("should return a context", function() {
    expect(CANVAS.getWebGLCompatibleContext()).not.toBeUndefined();
  });
  
  it("should try webgl first", function() {
    // if this is undefined then the test browser legitimately doesn't support WGL and this is a bad test.
    if (typeof(WebGLRenderingContext) != 'undefined')
      expect(CANVAS.getWebGLCompatibleContext()).toBeInstanceOf(WebGLRenderingContext);
  });
  
  it("should fall back to compatibility layer", function() {
    // mock getContext so nothing but 2d works
    var original = CANVAS.getContext;
    CANVAS.getContext = function(which) {
      if (which == "2d") return original.apply(this, arguments);
      else return null;
    };
    
    expect(CANVAS.getWebGLCompatibleContext().isCompatibility).toBeTruthy();
  });
});
