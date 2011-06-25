describe("Renderbuffer", function() {
  var buf;
  
  beforeEach(function() {
    _global.CONTEXT = new WebGLCompatibilityLayer(CANVAS);
  });
  
  it("should create a renderbuffer", function() {
    expect(CONTEXT.createRenderbuffer()).toBeInstanceOf(WebGLRenderbuffer);
  });
  
  describe("assigning storage", function() {
    beforeEach(function() {
      buf = CONTEXT.createRenderbuffer();
      CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, buf);
    });
    
    it("should generate INVALID_OPERATION if no buffer is bound", function() {
      CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, null);
      CONTEXT.renderbufferStorage(CONTEXT.RENDERBUFFER, CONTEXT.RGBA4, 300, 300);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });
    
    it("should generate INVALID_ENUM if target != RENDERBUFFER", function() {
      CONTEXT.renderbufferStorage(CONTEXT.TEXTURE_2D, CONTEXT.RGBA4, 300, 300);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
    
    it("should generate INVALID_ENUM if internalformat is not acceptable", function() {
      CONTEXT.renderbufferStorage(CONTEXT.RENDERBUFFER, CONTEXT.TEXTURE_2D, 300, 300);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
    
    it("should generate INVALID_VALUE if width < 0, width > MAX_RENDERBUFFER_SIZE, height < 0, height > MAX_RENDERBUFFER_SIZE", function() {
      CONTEXT.renderbufferStorage(CONTEXT.RENDERBUFFER, CONTEXT.RGBA4, -1, 300);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_VALUE);

      CONTEXT.renderbufferStorage(CONTEXT.RENDERBUFFER, CONTEXT.RGBA4, CONTEXT.MAX_RENDERBUFFER_SIZE+1, 300);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_VALUE);

      CONTEXT.renderbufferStorage(CONTEXT.RENDERBUFFER, CONTEXT.RGBA4, 300, -1);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_VALUE);

      CONTEXT.renderbufferStorage(CONTEXT.RENDERBUFFER, CONTEXT.RGBA4, 300, CONTEXT.MAX_RENDERBUFFER_SIZE+1);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_VALUE);
    });
    
    describe("properly", function() {
      // the GL spec allows the impl to create an actual format different from the one
      // requested. We'll have to take advantage of this fact for Canvas2D, which operates
      // in RGBA format *only*. Problem: how to test success? Seems awfully brittle to
      // check for RGBA format, but we can't check for any other requested format either.
      // Instead, for now we'll request RGBA explicitly and verify that that's the result.

      beforeEach(function() {
        CONTEXT.renderbufferStorage(CONTEXT.RENDERBUFFER, CONTEXT.RGBA4, 300, 300);
      });
    
      it("should produce requested format", function() {
        expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_INTERNAL_FORMAT)).toEqual(CONTEXT.RGBA4);
      });
    
      it("should produce requested width", function() {
        expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_WIDTH)).toEqual(300);
      });
    
      it("should produce requested height", function() {
        expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_HEIGHT)).toEqual(300);
      });
    });
  });
  
  describe("deletion", function() {
    beforeEach(function() { buf = CONTEXT.createRenderbuffer(); });
    
    it("should ignore non-framebuffers", function() {
      expect(function() { CONTEXT.deleteRenderbuffer(null); }).not.toThrow();
      expect(CONTEXT.getError()).toEqual(CONTEXT.NO_ERROR);
    });
    
    it("that is attached to the currently bound framebuffer", function() {
      // if the deleted renderbuffer object is
      // attached to the currently bound framebuffer object, it is 
      // automatically detached.  However, attachments to any other framebuffer objects are the
      // responsibility of the application.
      
      throw("pending attachment support");
    });

    describe("that is currently bound", function() {
      beforeEach(function() { CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, buf); });
      
      it("should unbind it", function() {
        CONTEXT.deleteRenderbuffer(buf);
        expect(CONTEXT.get(CONTEXT.RENDERBUFFER_BINDING)).toBeNull();
      });
    });
  });
  
  describe("checking if object is a renderbuffer", function() {
    beforeEach(function() { buf = CONTEXT.createRenderbuffer(); });
    
    it("null", function() {
      expect(CONTEXT.isRenderbuffer(null)).toBeFalsy();
    });
    
    it("generic object", function() {
      expect(CONTEXT.isRenderbuffer({})).toBeFalsy();
    });
    
    it("before binding", function() {
      expect(CONTEXT.isRenderbuffer(buf)).toBeFalsy();
    });
    
    it("after binding", function() {
      CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, buf);
      expect(CONTEXT.isRenderbuffer(buf)).toBeTruthy();
    });
    
    it("after disposal", function() {
      CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, buf);
      CONTEXT.deleteRenderbuffer(buf);
      expect(CONTEXT.isRenderbuffer(buf)).toBeFalsy();
    });
  });
  
  describe("querying after binding", function() {
    beforeEach(function() { buf = CONTEXT.createRenderbuffer(); CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, buf); });
    
    it("invalid target", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.TEXTURE_2D, CONTEXT.RENDERBUFFER_WIDTH)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
    
    it("invalid pname", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.TEXTURE_2D)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
    
    it("RENDERBUFFER_WIDTH", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_WIDTH)).toEqual(0);
    });

    it("RENDERBUFFER_HEIGHT", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_HEIGHT)).toEqual(0);
    });

    it("RENDERBUFFER_INTERNAL_FORMAT", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_INTERNAL_FORMAT)).toEqual(CONTEXT.RGBA4);
    });

    it("RENDERBUFFER_RED_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_RED_SIZE)).toEqual(0);
    });

    it("RENDERBUFFER_GREEN_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_GREEN_SIZE)).toEqual(0);
    });

    it("RENDERBUFFER_BLUE_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_BLUE_SIZE)).toEqual(0);
    });

    it("RENDERBUFFER_ALPHA_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_ALPHA_SIZE)).toEqual(0);
    });

    it("RENDERBUFFER_DEPTH_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_DEPTH_SIZE)).toEqual(0);
    });

    it("RENDERBUFFER_STENCIL_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_STENCIL_SIZE)).toEqual(0);
    });
  });
  
  describe("querying without binding", function() {
    it("invalid target", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.TEXTURE_2D, CONTEXT.RENDERBUFFER_WIDTH)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
    
    it("invalid pname", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.TEXTURE_2D)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });
    
    it("RENDERBUFFER_WIDTH", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_WIDTH)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });

    it("RENDERBUFFER_HEIGHT", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_HEIGHT)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });

    it("RENDERBUFFER_INTERNAL_FORMAT", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_INTERNAL_FORMAT)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });

    it("RENDERBUFFER_RED_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_RED_SIZE)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });

    it("RENDERBUFFER_GREEN_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_GREEN_SIZE)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });

    it("RENDERBUFFER_BLUE_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_BLUE_SIZE)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });

    it("RENDERBUFFER_ALPHA_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_ALPHA_SIZE)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });

    it("RENDERBUFFER_DEPTH_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_DEPTH_SIZE)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });

    it("RENDERBUFFER_STENCIL_SIZE", function() {
      expect(CONTEXT.getRenderbufferParameter(CONTEXT.RENDERBUFFER, CONTEXT.RENDERBUFFER_STENCIL_SIZE)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });
  });
  
  describe("binding a renderbuffer", function() {
    beforeEach(function() { buf = CONTEXT.createRenderbuffer(); });
    
    it("should return the renderbuffer", function() {
      CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, buf);
      expect(CONTEXT.get(CONTEXT.RENDERBUFFER_BINDING)).toBe(buf);
    });
    
    it("should unbind renderbuffer with null argument", function() {
      CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, buf);
      CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, null);
      expect(CONTEXT.get(CONTEXT.RENDERBUFFER_BINDING)).toBe(null);
    });
    
    it("should generate INVALID_ENUM if target is not RENDERBUFFER", function() {
      CONTEXT.bindRenderbuffer(CONTEXT.TEXTURE_2D, buf);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
  });
});
