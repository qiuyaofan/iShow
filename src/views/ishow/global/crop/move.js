const movePos = {
  0: e,
  4: e,
  1: s,
  5: s,
  2: w,
  6: w,
  3: n,
  7: n,
  8: ne,
  9: se,
  10: sw,
  11: nw
};
let width, height, left, top;

function e(_this, json) {
  _this.width = range(json.x - json.l);
  if (_this.cropJson.r) {
    _this.height = _this.width / _this.cropJson.r;
  }
  return _this;
}

function s(_this, json) {
  height = json.y - json.t;
  _this.height = range(height);
  if (_this.cropJson.r) {
    _this.width = _this.height * _this.cropJson.r;
  }
  return _this;
}
function w(_this, json) {
  width = json.r - json.x;
  left = json.x - json.screen.left;
  _this.left = rangeMax(left, json.r);
  _this.width = range(width);
  if (_this.cropJson.r) {
    _this.height = _this.width / _this.cropJson.r;
  }
  return _this;
}
function n(_this, json) {
  height = json.b - json.y;
  top = json.y - json.screen.top;
  _this.top = rangeMax(top, json.b);
  _this.height = range(height);
  if (_this.cropJson.r) {
    _this.width = _this.height * _this.cropJson.r;
  }
  return _this;
}

function ne(_this, json) {
  height = json.b - json.y;
  top = json.y - json.screen.top;
  _this.top = rangeMax(top, json.b);
  _this.height = range(height);
  _this.width = json.ratio * _this.height;
  return _this;
}
function se(_this, json) {
  height = json.y - json.t;
  _this.height = height < 0 ? 0 : height;
  _this.width = json.ratio * _this.height;
  return _this;
}
function sw(_this, json) {
  width = json.r - json.x;
  left = json.x - json.screen.left;
  _this.left = rangeMax(left, json.r);
  _this.width = range(width);
  _this.height = _this.width / json.ratio;
  return _this;
}
function nw(_this, json) {
  height = json.b - json.y;
  width = json.r - json.x;
  if (height - json.h > width - json.w) {
    top = json.y - json.screen.top;
    const changeTop = top - _this.top;
    _this.top = rangeMax(top, json.b);
    _this.height = range(height);
    _this.width = json.ratio * _this.height;
    _this.left = changeTop * json.ratio + _this.left;
  } else {
    left = json.x - json.screen.left;
    const changeLeft = left - _this.left;
    _this.left = rangeMax(left, json.r);
    _this.width = range(width);
    _this.height = _this.width / json.ratio;
    _this.top = changeLeft * json.ratio + _this.top;
  }
  return _this;
}

function range(value) {
  return value < 0 ? 0 : value;
}

function rangeMax(value, max) {
  return value > max ? max : value;
}

export default movePos;