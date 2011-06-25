var WebGLFramebuffer = function(c2d) {
  this._prepared = false;
  this._attachments = {};
  this._attachments[WEBGL_CONSTANTS.COLOR_ATTACHMENT0 ] = { type: WEBGL_CONSTANTS.NONE };
  this._attachments[WEBGL_CONSTANTS.DEPTH_ATTACHMENT  ] = { type: WEBGL_CONSTANTS.NONE };
  this._attachments[WEBGL_CONSTANTS.STENCIL_ATTACHMENT] = { type: WEBGL_CONSTANTS.NONE };
};

(function() {
  var c = WebGLFramebuffer.prototype;
  c.dispose = function() {
    this._prepared = false;
  };
  
  c.prepare = function() {
    this._prepared = true;
  };
  
  c.isPrepared = function() {
    return this._prepared;
  };
  
  c.detachAll = function(buffer) {
    if (this._attachments[WEBGL_CONSTANTS.COLOR_ATTACHMENT0].object  == buffer) this.renderbuffer(WEBGL_CONSTANTS.COLOR_ATTACHMENT0,  null);
    if (this._attachments[WEBGL_CONSTANTS.DEPTH_ATTACHMENT].object   == buffer) this.renderbuffer(WEBGL_CONSTANTS.DEPTH_ATTACHMENT,   null);
    if (this._attachments[WEBGL_CONSTANTS.STENCIL_ATTACHMENT].object == buffer) this.renderbuffer(WEBGL_CONSTANTS.STENCIL_ATTACHMENT, null);
  };
  
  c.renderbuffer = function(attachment, buffer) {
    switch(attachment) {
      case WEBGL_CONSTANTS.COLOR_ATTACHMENT0:
      case WEBGL_CONSTANTS.DEPTH_ATTACHMENT:
      case WEBGL_CONSTANTS.STENCIL_ATTACHMENT:
        if (buffer) {
          this._attachments[attachment].type   = WEBGL_CONSTANTS.RENDERBUFFER;
          this._attachments[attachment].object = buffer;
        } else {
          this._attachments[attachment].type   = WEBGL_CONSTANTS.NONE;
          this._attachments[attachment].object = null;
        }
        this._attachments[attachment].texture_level        = 0;
        this._attachments[attachment].cubemap_texture_face = WEBGL_CONSTANTS.TEXTURE_CUBE_MAP_POSITIVE_X;
        break;
      default:
        throw WEBGL_CONSTANTS.INVALID_ENUM;
    }
  }
  
  c.getAttachmentParameter = function(attachment, pname) {
    switch(attachment) {
      case WEBGL_CONSTANTS.COLOR_ATTACHMENT0:
      case WEBGL_CONSTANTS.DEPTH_ATTACHMENT:
      case WEBGL_CONSTANTS.STENCIL_ATTACHMENT:
        var a = this._attachments[attachment];
        switch(pname) {
          case WEBGL_CONSTANTS.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE:
            return a.type;
          case WEBGL_CONSTANTS.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME:
            if (a.type == WEBGL_CONSTANTS.NONE) throw WEBGL_CONSTANTS.INVALID_ENUM;
            return a.object;
          case WEBGL_CONSTANTS.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL:
          case WEBGL_CONSTANTS.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE:
          case WEBGL_CONSTANTS.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE:
          default: throw WEBGL_CONSTANTS.INVALID_ENUM;
        }
        break;
      default:
        throw WEBGL_CONSTANTS.INVALID_ENUM;
    };
    return WEBGL_CONSTANTS.NONE;
  };
})();
