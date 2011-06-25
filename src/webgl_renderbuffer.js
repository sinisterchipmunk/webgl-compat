var WebGLRenderbuffer = function() {
  this._state = {};
  this._state[WEBGL_CONSTANTS.RENDERBUFFER_WIDTH] = 0;
  this._state[WEBGL_CONSTANTS.RENDERBUFFER_HEIGHT] = 0;
  this._state[WEBGL_CONSTANTS.RENDERBUFFER_INTERNAL_FORMAT] = WEBGL_CONSTANTS.RGBA4;
  this._state[WEBGL_CONSTANTS.RENDERBUFFER_RED_SIZE] = 0;
  this._state[WEBGL_CONSTANTS.RENDERBUFFER_GREEN_SIZE] = 0;
  this._state[WEBGL_CONSTANTS.RENDERBUFFER_BLUE_SIZE] = 0;
  this._state[WEBGL_CONSTANTS.RENDERBUFFER_ALPHA_SIZE] = 0;
  this._state[WEBGL_CONSTANTS.RENDERBUFFER_DEPTH_SIZE] = 0;
  this._state[WEBGL_CONSTANTS.RENDERBUFFER_STENCIL_SIZE] = 0;
  this._prepared = false;
};

(function() {
  var c = WebGLRenderbuffer.prototype;
  c.dispose = function() {
    this._prepared = false;
  };
  
  c.setStorage = function(internalformat, width, height) {
    switch(internalformat) {
      case WEBGL_CONSTANTS.RGBA4:
      case WEBGL_CONSTANTS.RGB565:
      case WEBGL_CONSTANTS.RGB5_A1:
      case WEBGL_CONSTANTS.DEPTH_COMPONENT16:
      case WEBGL_CONSTANTS.STENCIL_INDEX8:
        break;
      default:
        throw WEBGL_CONSTANTS.INVALID_ENUM;
    }
    if (width  < 0 || width  > WEBGL_CONSTANTS.MAX_RENDERBUFFER_SIZE ||
        height < 0 || height > WEBGL_CONSTANTS.MAX_RENDERBUFFER_SIZE)
      throw WEBGL_CONSTANTS.INVALID_VALUE;
    /* Only format supported by Canvas2D is RGBA; the GL spec says this is
       OK, we can just treat internalformat as a 'suggestion'. */
    if (!this._context) {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
    
      this._context = canvas.getContext('2d');
    } else {
      this._context.canvas.width = width;
      this._context.canvas.height = height;
    }
    this._state[WEBGL_CONSTANTS.RENDERBUFFER_INTERNAL_FORMAT] = WEBGL_CONSTANTS.RGBA4;
    this._state[WEBGL_CONSTANTS.RENDERBUFFER_WIDTH] = width;
    this._state[WEBGL_CONSTANTS.RENDERBUFFER_HEIGHT] = height;
  };
  
  c.prepare = function() {
    this._prepared = true;
  };
  
  c.isPrepared = function() {
    return this._prepared;
  };
  
  c.getParameter = function(pname) {
    switch(pname) {
      case WEBGL_CONSTANTS.RENDERBUFFER_WIDTH:
      case WEBGL_CONSTANTS.RENDERBUFFER_HEIGHT:
      case WEBGL_CONSTANTS.RENDERBUFFER_INTERNAL_FORMAT:
      case WEBGL_CONSTANTS.RENDERBUFFER_RED_SIZE:
      case WEBGL_CONSTANTS.RENDERBUFFER_GREEN_SIZE:
      case WEBGL_CONSTANTS.RENDERBUFFER_BLUE_SIZE:
      case WEBGL_CONSTANTS.RENDERBUFFER_ALPHA_SIZE:
      case WEBGL_CONSTANTS.RENDERBUFFER_DEPTH_SIZE:
      case WEBGL_CONSTANTS.RENDERBUFFER_STENCIL_SIZE:
        return this._state[pname];
      default: throw WEBGL_CONSTANTS.INVALID_ENUM;
    }
  };
})();
