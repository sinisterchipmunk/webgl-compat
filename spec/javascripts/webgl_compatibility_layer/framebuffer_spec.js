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
  
  describe("attaching a renderbuffer", function() {
    var framebuffer, renderbuffer;
    
    beforeEach(function() {
      framebuffer = CONTEXT.createFramebuffer();
      CONTEXT.bindFramebuffer(framebuffer);
      renderbuffer = CONTEXT.createRenderbuffer();
      CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, renderbuffer);
      CONTEXT.renderbufferStorage(CONTEXT.RENDERBUFFER, CONTEXT.RGBA4, 300, 300);
    });
    
    it("should generate INVALID_OPERATION while default framebuffer is bound", function() {
      CONTEXT.bindFramebuffer(null);
      CONTEXT.framebufferRenderbuffer(CONTEXT.FRAMEBUFFER, CONTEXT.COLOR_ATTACHMENT0, CONTEXT.RENDERBUFFER, renderbuffer);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });
    
    it("should generate INVALID_OPERATION if renderbuffer is neither 0 nor a valid renderbuffer name", function() {
      renderbuffer.dispose(); // makes it fail #isRenderbuffer()
      CONTEXT.framebufferRenderbuffer(CONTEXT.FRAMEBUFFER, CONTEXT.COLOR_ATTACHMENT0, CONTEXT.RENDERBUFFER, renderbuffer);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_OPERATION);
    });
    
    it("should generate INVALID_ENUM when target != FRAMEBUFFER", function() {
      CONTEXT.framebufferRenderbuffer(CONTEXT.TEXTURE_2D, CONTEXT.COLOR_ATTACHMENT0, CONTEXT.RENDERBUFFER, renderbuffer);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
    
    it("should generate INVALID_ENUM when renderbuffertarget != RENDERBUFFER && renderbuffer != 0", function() {
      CONTEXT.framebufferRenderbuffer(CONTEXT.FRAMEBUFFER, CONTEXT.COLOR_ATTACHMENT0, CONTEXT.GL_TEXTURE_2D, renderbuffer);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
    
    it("should generate INVALID_ENUM when attachment is not acceptable", function() {
      CONTEXT.framebufferRenderbuffer(CONTEXT.FRAMEBUFFER, CONTEXT.GL_TEXTURE_2D, CONTEXT.RENDERBUFFER, renderbuffer);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });
    
    describe("properly", function() {
      describe("and then detaching it", function() {
        beforeEach(function() {
          CONTEXT.framebufferRenderbuffer(CONTEXT.FRAMEBUFFER, CONTEXT.COLOR_ATTACHMENT0, CONTEXT.RENDERBUFFER, renderbuffer);
          CONTEXT.framebufferRenderbuffer(CONTEXT.FRAMEBUFFER, CONTEXT.COLOR_ATTACHMENT0, CONTEXT.RENDERBUFFER, null);
        });
        
        it("should reset to default values", function() {
          expect(CONTEXT.getFramebufferAttachmentParameter(CONTEXT.FRAMEBUFFER, CONTEXT.COLOR_ATTACHMENT0, CONTEXT.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE)).toEqual(CONTEXT.NONE);
        });
      });
      
      var attachmentTypes = {COLOR_ATTACHMENT0:WEBGL_CONSTANTS.COLOR_ATTACHMENT0,
                             DEPTH_ATTACHMENT:WEBGL_CONSTANTS.DEPTH_ATTACHMENT,
                             STENCIL_ATTACHMENT:WEBGL_CONSTANTS.STENCIL_ATTACHMENT};
      for (var typeName in attachmentTypes) {
        describe("to "+typeName, function() {
          var type = attachmentTypes[typeName];
          beforeEach(function() {
            CONTEXT.framebufferRenderbuffer(CONTEXT.FRAMEBUFFER, type, CONTEXT.RENDERBUFFER, renderbuffer);
          });

          it("should set name", function() {
            var v = CONTEXT.getFramebufferAttachmentParameter(CONTEXT.FRAMEBUFFER, type, CONTEXT.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
            expect(v).toBe(renderbuffer);
          });

          it("should set type to RENDERBUFFER", function() {
            var v = CONTEXT.getFramebufferAttachmentParameter(CONTEXT.FRAMEBUFFER, type, CONTEXT.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE);
            expect(v).toEqual(CONTEXT.RENDERBUFFER);
          });
        });
      }
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
    
    it("should generate INVALID_ENUM if attached object is RENDERBUFFER and pname is not OBJECT_TYPE or OBJECT_NAME", function() {
      var buf = CONTEXT.createRenderbuffer();
      CONTEXT.bindRenderbuffer(CONTEXT.RENDERBUFFER, buf);
      CONTEXT.renderbufferStorage(CONTEXT.RENDERBUFFER, CONTEXT.RGBA4, 300, 300);
      CONTEXT.framebufferRenderbuffer(CONTEXT.FRAMEBUFFER, CONTEXT.DEPTH_ATTACHMENT, CONTEXT.RENDERBUFFER, buf);
      
      expect(CONTEXT.getFramebufferAttachmentParameter(CONTEXT.FRAMEBUFFER, CONTEXT.DEPTH_ATTACHMENT, CONTEXT.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE)).toEqual(0);
      expect(CONTEXT.getError()).toEqual(CONTEXT.INVALID_ENUM);
    });

    it("should generate INVALID_ENUM if attached object is TEXTURE and pname is not OBJECT_TYPE, OBJECT_NAME, TEXTURE_LEVEL, TEXTURE_CUBE_MAP_FACE", function() {
      throw("pending texture attachment support");
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