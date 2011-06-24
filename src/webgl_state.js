var WebGLState = function(c2d) {
  this.viewport = new Int32Array(4);
  this.scissor_test_enabled = false;
  this.scissor_box = new Int32Array(4);
  this.error = WEBGL_CONSTANTS.NO_ERROR;
  this.bindings = {
    framebuffer: new WebGLFramebuffer(c2d)
  };
  
  this.viewport[0] = this.viewport[1] = 0;
  this.viewport[2] = c2d.canvas.width;
  this.viewport[3] = c2d.canvas.height;
};