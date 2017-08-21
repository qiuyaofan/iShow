
let width, height, left, top;

const set = {
  // [w]
  e(_this, json, arr) {
    _this.width = arr[0];
    return _this;
  },
  // [h]
  s(_this, json, arr) {
    _this.height = arr[0];
    return _this;
  },
  // [w,l]
  w(_this, json, arr) {
    _this.left = arr[1];
    _this.width = arr[0];
    return _this;
  },
  // [h,t]
  n(_this, json, arr) {
    _this.top = arr[1];
    _this.height = arr[0];
    return _this;
  },
  // [w,h,t]
  ne(_this, json, arr) {
    _this.top = arr[2];
    _this.height = arr[1];
    _this.width = arr[0];
    return _this;
  },
  // [w,h]
  se(_this, json, arr) {
    // height = json.y - json.t;
    _this.height = arr[1];
    _this.width = arr[0];
    return _this;
  },
  // [w, h, l]
  sw(_this, json, arr) {
    // width = json.r - json.x;
    // left = json.x - json.screen.left;
    _this.left = arr[2];
    _this.width = arr[0];
    _this.height = arr[1];
    return _this;
  },
  // [ w, h, l, t]
  nw(_this, json, arr) {
    _this.left = arr[2];
    _this.width = arr[0];
    _this.height = arr[1];
    _this.top = arr[3];
    return _this;
  }
};
const get = {
  e(_this, json) {
    width = range(json.x - _this.startPos.l);
    return { width };
  },

  s(_this, json) {
    height = range(json.y - _this.startPos.t);
    return { height };
  },
  w(_this, json) {
    width = range(_this.startPos.r - json.x);
    left = json.x - json.screen.left;
    return {
      width,
      left
    };
  },
  n(_this, json) {
    height = range(_this.startPos.t + _this.startPos.h - json.y);
    top = json.y - json.screen.top;
    return {
      height,
      top
    };
  },

  ne(_this, json) {
    height = range(_this.startPos.h + _this.startPos.pos[1] - json.y);
    width = range(json.x - _this.startPos.l);
    top = json.y - json.screen.top;
    if (compare(height, json.h, width, json.w)) {
      width = json.ratio * height;
    } else {
      height = width / json.ratio;
    }

    return {
      height,
      width,
      top
    };
  },
  se(_this, json) {
    height = range(json.y - _this.startPos.t);
    width = json.ratio * height;
    // width = range(json.x - _this.startPos.l);
    // if (compare(height, json.h, width, json.w)) {
    //   // height = height < 0 ? 0 : height;
    //   width = json.ratio * height;
    //   console.info('sw1', json.ratio, width, height)
    // } else {
    //   // width = width < 0 ? 0 : width;
    //   height = width / json.ratio;
    //   console.info('sw2', json.ratio, width, height)
    // }
    // height = json.y - _this.startPos.t;
    // height = height < 0 ? 0 : height;
    // width = json.ratio * height;
    return {
      height,
      width
    };
  },
  sw(_this, json) {
    // width = range(_this.startPos.r - json.x);
    height = range(json.y - _this.startPos.t);
    width = json.ratio * height;
    left = json.x - json.screen.left;
    // console.info('height,json.h ,height-json.h,width,json.w ,width-json.w', height, json.h, height - json.h, width, json.w, width - json.w)
    // if (compare(height, json.h, width, json.w)) {
    //   width = json.ratio * height;
    // } else {
    //   height = width / json.ratio;
    // }
    return {
      width,
      left,
      height
    };
  },
  nw(_this, json) {
    height = range(_this.startPos.t + _this.startPos.h - json.y);
    width = range(_this.startPos.r - json.x);
    top = json.y - json.screen.top;
    left = json.x - json.screen.left;
    if (compare(height, json.h, width, json.w)) {
      // top = json.y - json.screen.top;
      // const changeTop = top - _this.startPos.t;
      // top = rangeMax(top, json.b);
      // height = range(height);
      width = json.ratio * height;
      // left = changeTop * json.ratio + _this.startPos.l;
      // console.info('nw1', width, height, left, top, json.ratio)
    } else {
      // left = json.x - json.screen.left;
      // const changeLeft = left - _this.startPos.l;
      // left = rangeMax(left, json.r);
      // width = range(width);
      height = width / json.ratio;
      // top = changeLeft / json.ratio + _this.startPos.t;
      // console.info('nw2', width, height, left, top, json.ratio)
    }
    return {
      left,
      width,
      height,
      top
    };
  }
};

const movePos = {
  set: {
    0: set.e,
    4: set.e,
    1: set.s,
    5: set.s,
    2: set.w,
    6: set.w,
    3: set.n,
    7: set.n,
    8: set.ne,
    9: set.se,
    10: set.sw,
    11: set.nw
  },
  get: {
    0: get.e,
    4: get.e,
    1: get.s,
    5: get.s,
    2: get.w,
    6: get.w,
    3: get.n,
    7: get.n,
    8: get.ne,
    9: get.se,
    10: get.sw,
    11: get.nw
  }
};

function range(value) {
  return value - 5 < 0 ? 5 : value;
}

function rangeMax(value, max) {
  return value > max ? max : value;
}

function compare(h1, h2, w1, w2) {
  return (h1 - h2) >= (w1 - w2);
}

export default movePos;