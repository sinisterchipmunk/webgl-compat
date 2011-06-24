describe("SpecHelpers", function() {
  describe("#toEqualVector", function() {
    var buf;
    
    describe("<Array, Array>", function() {
      beforeEach(function() { buf = [0, 1, 2, 3]; });
      
      it("differing length", function() { expect(buf).not.toEqualVector([0,1,2]); });
      it("differing elements", function() { expect(buf).not.toEqualVector([1,2,0,3]); });
      it("equal", function() { expect(buf).toEqualVector([0,1,2,3]); });
    });

    describe("<Int32Array, Array>", function() {
      beforeEach(function() { buf = new Int32Array(4); for (var i = 0; i < 4; i++) buf[i] = i; });
      
      it("differing length", function() { expect(buf).not.toEqualVector([0,1,2]); });
      it("differing elements", function() { expect(buf).not.toEqualVector([1,2,0,3]); });
      it("equal", function() { expect(buf).toEqualVector([0,1,2,3]); });
    });

    describe("<Array, Int32Array>", function() {
      beforeEach(function() { buf = new Int32Array(4); for (var i = 0; i < 4; i++) buf[i] = i; });
      
      it("differing length", function() { expect([0,1,2]).not.toEqualVector(buf); });
      it("differing elements", function() { expect([1,2,0,3]).not.toEqualVector(buf); });
      it("equal", function() { expect([0,1,2,3]).toEqualVector(buf); });
    });
  });
});