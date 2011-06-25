var WebGLCompatibilityLayer = (function() {
  /**
   * new WebGLCompatibilityLayer(context)
   * context (CanvasRenderingContext2D): a 2D rendering context
   **/
  return function(canvas) {
    var c2d = canvas.getContext('2d');
    if (!c2d) throw new Error("Couldn't initialize 2D context!");
    
    var state = new WebGLState(c2d);
    var contextAttributes = new WebGLContextAttributes();
    
    var defaultFramebuffer = state.bindings.framebuffer;

    // "readonly" attributes
    this.canvas = canvas;
    this.drawingBufferWidth = c2d.canvas.width;
    this.drawingBufferHeight = c2d.canvas.height;
    
    // special flag to check for compatibility mode
    this.isCompatibility = true;
    
    for (var konst in WEBGL_CONSTANTS)
      this[konst] = WEBGL_CONSTANTS[konst];
      
    function generateError(which) {
      if (typeof(which) == 'number')
        state.error = which;
      else throw which;
    }
      
    this.getError = function() {
      return state.error;
    };
    
    this.getContextAttributes = function() {
      return contextAttributes;
    };
    
    this.viewport = function(x, y, w, h) {
      state.viewport[0] = x; state.viewport[1] = y;
      state.viewport[2] = w; state.viewport[3] = h;
    };
    
    this.scissor = function(x, y, w, h) {
      state.scissor_box[0] = x; state.scissor_box[1] = y;
      state.scissor_box[2] = w; state.scissor_box[3] = h;
    };
    
    this.createFramebuffer = function() {
      return new WebGLFramebuffer();
    };
    
    this.deleteFramebuffer = function(fb) {
      if (fb === defaultFramebuffer) return;
      if (state.bindings.framebuffer === fb)
        state.bindings.framebuffer = defaultFramebuffer;
      fb.dispose();
    };
    
    this.bindFramebuffer = function(fb) {
      if (fb == null) fb = defaultFramebuffer;
      state.bindings.framebuffer = fb;
      state.bindings.framebuffer.prepare();
    };
    
    this.getFramebufferAttachmentParameter = function(target, attachment, pname) {
      if (state.bindings.framebuffer == defaultFramebuffer) generateError(this.INVALID_OPERATION);
      else
        switch(target) {
          case this.FRAMEBUFFER:
            try { return state.bindings.framebuffer.getAttachmentParameter(attachment, pname) }
            catch(e) { generateError(e); }
          default:
            generateError(this.INVALID_ENUM);
        }
      return 0;
    };
    
    this.getRenderbufferParameter = function(target, pname) {
      switch(target) {
        case this.RENDERBUFFER:
          if (state.bindings.renderbuffer)
            try { return state.bindings.renderbuffer.getParameter(pname); }
            catch(e) { generateError(e); }
          else
            generateError(this.INVALID_OPERATION);
          break;
        default: generateError(this.INVALID_ENUM);
      }
      return 0;
    };
    
    this.isFramebuffer = function(fb) {
      return fb && (fb instanceof WebGLFramebuffer) && fb.isPrepared();
    };
    
    this.isRenderbuffer = function(rb) {
      return rb && (rb instanceof WebGLRenderbuffer) && rb.isPrepared();
    };
    
    this.createRenderbuffer = function() {
      return new WebGLRenderbuffer();
    };
    
    this.bindRenderbuffer = function(target, buffer) {
      switch(target) {
        case this.RENDERBUFFER:
          if (buffer) buffer.prepare();
          state.bindings.renderbuffer = buffer;
          break;
        default: generateError(this.INVALID_ENUM);
      }
    };
    
    this.deleteRenderbuffer = function(buf) {
      if (this.isRenderbuffer(buf)) {
        buf.dispose();
        if (buf === state.bindings.renderbuffer) state.bindings.renderbuffer = null;
      }
    };
    
    this.renderbufferStorage = function(target, internalformat, width, height) {
      switch(target) {
        case this.RENDERBUFFER:
          if (!state.bindings.renderbuffer) generateError(this.INVALID_OPERATION);
          else
            try { return state.bindings.renderbuffer.setStorage(internalformat, width, height); }
            catch(e) { generateError(e); }
          return;
        default:
          generateError(this.INVALID_ENUM);
      }
    };
    
    this.get = function(glEnum) {
      switch(glEnum) {
        case this.VIEWPORT: return state.viewport;
        case this.MAX_VIEWPORT_DIMS: return state.viewport.subarray(2, 4);
        case this.SCISSOR_TEST: return state.scissor_test_enabled;
        case this.SCISSOR_BOX: return state.scissor_box;
        case this.VERSION: return "WebGL 1.0 Compatability Layer v1.0";
        case this.SHADING_LANGUAGE_VERSION: return "WebGL ES 1.0 Compatability Layer v1.0";
        case this.VENDOR: return "http://github.com/sinisterchipmunk/webgl-compat";
        case this.RENDERER: return "WebGL Compatability Layer";
        case this.FRAMEBUFFER_BINDING: return state.bindings.framebuffer;
        case this.RENDERBUFFER_BINDING: return state.bindings.renderbuffer;
        default: throw new Error("Unexpected enum: "+glEnum);
      };
    };
  };
})();
