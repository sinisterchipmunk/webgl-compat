describe("Framebuffer", function() {
  beforeEach(function() {
    _global.CONTEXT = new WebGLCompatibilityLayer(CANVAS);
  });
  
  it("should have a default", function() {
    expect(CONTEXT.get(CONTEXT.FRAMEBUFFER_BINDING)).toBeInstanceOf(WebGLFramebuffer);
  });
  
  describe("creating a framebuffer", function() {
    it("should return a framebuffer", function() {
      expect(CONTEXT.createFramebuffer()).toBeInstanceOf(WebGLFramebuffer);
    });
  });
  
  describe("querying a framebuffer", function() {
    it("should not be a framebuffer until bound", function() {
      var framebuffer = CONTEXT.createFramebuffer();
      expect(CONTEXT.isFramebuffer(framebuffer)).toBeFalsy();
      CONTEXT.bindFramebuffer(framebuffer);
      expect(CONTEXT.isFramebuffer(framebuffer)).toBeTruthy();
    });
    
    it("should not be a framebuffer after destroyed", function() {
      var framebuffer = CONTEXT.createFramebuffer();
      CONTEXT.bindFramebuffer(framebuffer);
      CONTEXT.deleteFramebuffer(framebuffer);
      expect(CONTEXT.isFramebuffer(framebuffer)).toBeFalsy();
    });
  });
  
  describe("binding a framebuffer", function() {
    it("should bind default framebuffer if argument is null", function() {
      var defaultFramebuffer = CONTEXT.get(CONTEXT.FRAMEBUFFER_BINDING);
      var framebuffer = CONTEXT.createFramebuffer();
      CONTEXT.bindFramebuffer(framebuffer);
      CONTEXT.bindFramebuffer(null);
      expect(CONTEXT.get(CONTEXT.FRAMEBUFFER_BINDING)).toBe(defaultFramebuffer);
    });
    
    it("should replace the current fb binding", function() {
      var framebuffer = CONTEXT.createFramebuffer();
      CONTEXT.bindFramebuffer(framebuffer);
      expect(CONTEXT.get(CONTEXT.FRAMEBUFFER_BINDING)).toBe(framebuffer);
    });
    
    describe("immediately after creation", function() {
      var buffer;
      beforeEach(function() { buffer = CONTEXT.createFramebuffer(); CONTEXT.bindFramebuffer(buffer); });
      
      it("should bind NONE to COLOR_ATTACHMENT0, DEPTH_ATTACHMENT and STENCIL_ATTACHMENT", function() {
        expect(CONTEXT.getFramebufferAttachmentParameter(CONTEXT.FRAMEBUFFER, CONTEXT.COLOR_ATTACHMENT0 , CONTEXT.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE)).toEqual(CONTEXT.NONE);
        expect(CONTEXT.getFramebufferAttachmentParameter(CONTEXT.FRAMEBUFFER, CONTEXT.DEPTH_ATTACHMENT  , CONTEXT.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE)).toEqual(CONTEXT.NONE);
        expect(CONTEXT.getFramebufferAttachmentParameter(CONTEXT.FRAMEBUFFER, CONTEXT.STENCIL_ATTACHMENT, CONTEXT.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE)).toEqual(CONTEXT.NONE);
      });
    });
  });
  
  describe("querying framebuffer attachments", function() {
    beforeEach(function() { CONTEXT.bindFramebuffer(CONTEXT.createFramebuffer()); });
    
    it("should generate INVALID_ENUM if target is not FRAMEBUFFER", function() {
      CONTEXT.getFramebufferAttachmentParameter(CONTEXT.TEXTURE_2D, CONTEXT.COLOR_ATTACHMENT0 , CONTEXT.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });

    it("should generate INVALID_ENUM if attachment is not one of COLOR_ATTACHMENT0, STENCIL_BUFFER, DEPTH_BUFFER", function() {
      CONTEXT.getFramebufferAttachmentParameter(CONTEXT.FRAMEBUFFER, CONTEXT.TEXTURE_2D, CONTEXT.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
    
    it("should generate INVALID_ENUM if there is no attached object at the named attachment point and pname is not FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", function() {
      CONTEXT.getFramebufferAttachmentParameter(CONTEXT.FRAMEBUFFER, CONTEXT.COLOR_ATTACHMENT0, CONTEXT.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
    
    it("should generate INVALID_OPERATION if default framebuffer is bound", function() {
      CONTEXT.bindFramebuffer(null);
      CONTEXT.getFramebufferAttachmentParameter(CONTEXT.FRAMEBUFFER, CONTEXT.COLOR_ATTACHMENT0, CONTEXT.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });
  });
  
  describe("deleting a framebuffer", function() {
    it("should dispose it", function() {
      var framebuffer = CONTEXT.createFramebuffer();
      spyOn(framebuffer, 'dispose');
      CONTEXT.deleteFramebuffer(framebuffer);
      expect(framebuffer.dispose).toHaveBeenCalled();
    });

    it("should bind the default framebuffer", function() {
      var defaultFramebuffer = CONTEXT.get(CONTEXT.FRAMEBUFFER_BINDING);
      var framebuffer = CONTEXT.createFramebuffer();
      CONTEXT.bindFramebuffer(framebuffer);
      CONTEXT.deleteFramebuffer(framebuffer);
      expect(CONTEXT.get(CONTEXT.FRAMEBUFFER_BINDING)).toBe(defaultFramebuffer);
    });
    
    it("should not change the framebuffer binding if the deleted buffer is not bound", function() {
      var unchanged = CONTEXT.createFramebuffer();
      var framebuffer = CONTEXT.createFramebuffer();
      CONTEXT.bindFramebuffer(unchanged);
      CONTEXT.deleteFramebuffer(framebuffer);
      expect(CONTEXT.get(CONTEXT.FRAMEBUFFER_BINDING)).toBe(unchanged);
    });
    
    it("should silently ignore deleting the default framebuffer", function() {
      var framebuffer = CONTEXT.get(CONTEXT.FRAMEBUFFER_BINDING);
      spyOn(framebuffer, 'dispose');
      CONTEXT.deleteFramebuffer(framebuffer);
      expect(framebuffer.dispose).not.toHaveBeenCalled();
    });
  });
});