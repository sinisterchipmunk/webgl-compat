describe("WebGLCompatibilityLayer", function() {
  beforeEach(function() {
    _global.CONTEXT = new WebGLCompatibilityLayer(CANVAS);
  });
  
  it("should have no errors by default", function() {
    expect(CONTEXT.getError()).toEqual(CONTEXT.NO_ERROR);
  });
  
  it("should return max viewport dimensions", function() {
    expect(CONTEXT.get(CONTEXT.MAX_VIEWPORT_DIMS)).toEqualVector(CANVAS.width, CANVAS.height);
    CONTEXT.viewport(5, 5, 100, 100);
    expect(CONTEXT.get(CONTEXT.MAX_VIEWPORT_DIMS)).toEqualVector(100, 100);
  });
  
  it("should set default viewport to canvas size", function() {
    expect(CONTEXT.get(CONTEXT.VIEWPORT)).toEqualVector(0, 0, CANVAS.width, CANVAS.height);
  });
  
  it("should set and get viewport appropriately", function() {
    CONTEXT.viewport(5, 5, 100, 100);
    expect(CONTEXT.get(CONTEXT.VIEWPORT)).toEqualVector(5, 5, 100, 100);
  });
  
  it("should set default scissor test enabled state", function() {
    expect(CONTEXT.get(CONTEXT.SCISSOR_TEST)).toBeFalsy();
  });

  it("should set and get scissor box appropriately", function() {
    CONTEXT.scissor(5, 5, 100, 100);
    expect(CONTEXT.get(CONTEXT.SCISSOR_BOX)).toEqualVector(5, 5, 100, 100);
  });

  it("should set default scissor box size", function() {
    CONTEXT.scissor(0, 0, CANVAS.width, CANVAS.height);
  });
});
