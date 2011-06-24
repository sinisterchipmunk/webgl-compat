describe("WebGLCompatibilityLayer", function() {
  beforeEach(function() {
    _global.CONTEXT = new WebGLCompatibilityLayer(CANVAS);
  });
  
  it("should have 'readonly' attributes", function() {
    expect(CONTEXT.canvas).toEqual(CANVAS);
    expect(CONTEXT.drawingBufferWidth).toEqual(CANVAS.width);
    expect(CONTEXT.drawingBufferHeight).toEqual(CANVAS.height);
  });
  
  it("should return webgl context attributes", function() {
    var attr = CONTEXT.getContextAttributes();

    expect(attr.alpha).toBeTruthy();
    expect(attr.depth).toBeTruthy();
    expect(attr.stencil).toBeFalsy();
    expect(attr.antialias).toBeTruthy();
    expect(attr.premultipliedAlpha).toBeTruthy();
    expect(attr.preserveDrawingBuffer).toBeFalsy();
  });
  
  describe("metadata", function() {
    it("VERSION", function() {
      expect(CONTEXT.get(CONTEXT.VERSION)).toEqual('WebGL 1.0 Compatability Layer v1.0');
    });
    
    it("SHADING_LANGUAGE_VERSION", function() {
      expect(CONTEXT.get(CONTEXT.SHADING_LANGUAGE_VERSION)).toEqual('WebGL ES 1.0 Compatability Layer v1.0');
    });
    
    it("VENDOR", function() {
      expect(CONTEXT.get(CONTEXT.VENDOR)).toEqual('http://github.com/sinisterchipmunk/webgl-compat');
    });
    
    it("RENDERER", function() {
      expect(CONTEXT.get(CONTEXT.RENDERER)).toEqual('WebGL Compatability Layer');
    });
  });
});
