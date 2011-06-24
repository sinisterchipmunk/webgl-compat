var WebGLFramebuffer = function(c2d) {
  this._prepared = false;
  this._attachments = {};
  this._attachments[WEBGL_CONSTANTS.COLOR_ATTACHMENT0 ] = WEBGL_CONSTANTS.NONE;
  this._attachments[WEBGL_CONSTANTS.DEPTH_ATTACHMENT  ] = WEBGL_CONSTANTS.NONE;
  this._attachments[WEBGL_CONSTANTS.STENCIL_ATTACHMENT] = WEBGL_CONSTANTS.NONE;
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
  
  c.getAttachmentParameter = function(attachment, pname) {
    switch(attachment) {
      case WEBGL_CONSTANTS.COLOR_ATTACHMENT0:
      case WEBGL_CONSTANTS.DEPTH_ATTACHMENT:
      case WEBGL_CONSTANTS.STENCIL_ATTACHMENT:
        if (this._attachments[attachment] == WEBGL_CONSTANTS.NONE) {
          if (pname == WEBGL_CONSTANTS.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE) return WEBGL_CONSTANTS.NONE;
          throw WEBGL_CONSTANTS.INVALID_ENUM;
        }
        break;
      default:
        throw WEBGL_CONSTANTS.INVALID_ENUM;
    };
    return WEBGL_CONSTANTS.NONE;
  };
})();
