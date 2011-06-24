HTMLCanvasElement.prototype.getWebGLCompatibleContext = function() {
  if (this.getContext) {
    return this.getContext('webgl') || this.getContext('experimental-webgl') || new WebGLCompatibilityLayer(this);
  } else {
    throw new TypeError("Canvas does not respond to getContext() -- no drawing can be performed!");
  }
};
