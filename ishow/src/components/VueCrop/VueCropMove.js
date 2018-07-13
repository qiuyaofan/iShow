// 12种形态，四条边，边的中点，边的四个角
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
}
let width, height, result, ratio

function getMaxSize (json, startJson, dire, type) {
  if (type === 'w') {
    switch (dire) {
      case 'e':
      case 's':
      case 'n':
      case 'ne':
      case 'se':
        return json.screen.right - json.l
      case 'w':
      case 'nw':
      case 'sw':
        return startJson.r - json.screen.left
    }
  } else if (type === 'h') {
    switch (dire) {
      case 'n':
      case 'nw':
      case 'ne':
        return startJson.b - json.screen.top
      case 's':
      case 'w':
      case 'e':
      case 'sw':
      case 'se':
        return json.screen.bottom - startJson.t
    }
  }
}
// 判断是否有ratio,返回修改后的尺寸
function setRatioSize (type, json, startJson, ratio, width, height) {
  if (ratio) {
    if (width / ratio >= height) {
      var maxHeight = getMaxSize(json, startJson, type, 'h')
      height = width / ratio
      if (height > maxHeight) {
        height = maxHeight
        width = height * ratio
      }
    } else {
      var maxWidth = getMaxSize(json, startJson, type, 'w')
      width = height * ratio
      if (width > maxWidth) {
        width = maxWidth
        height = width / ratio
      }
    }
  }
  return {
    width: width,
    height: height
  }
}
function e (_this, json, startJson) {
  ratio = _this.cropJson.r
  width = range(getWidth(json, startJson, 'e'), getMaxSize(json, startJson, 'e', 'w'))
  if (ratio) {
    height = range(width / ratio, getMaxSize(json, startJson, 'e', 'h'))
    result = setRatioSize('e', json, startJson, ratio, width, height)
    setSize(_this, result)
  } else {
    _this.width = width
  }
  return _this
}

function s (_this, json, startJson) {
  ratio = _this.cropJson.r
  height = range(getHeight(json, startJson, 's'), getMaxSize(json, startJson, 's', 'h'))
  if (ratio) {
    width = range(height * ratio, getMaxSize(json, startJson, 's', 'w'))
    result = setRatioSize('s', json, startJson, ratio, width, height)
    setSize(_this, result)
  } else {
    _this.height = height
  }

  return _this
}
function w (_this, json, startJson) {
  ratio = _this.cropJson.r
  width = range(getWidth(json, startJson, 'w'), getMaxSize(json, startJson, 'w', 'w'))
  if (ratio) {
    height = range(width / ratio, getMaxSize(json, startJson, 'w', 'h'))
    result = setRatioSize('w', json, startJson, ratio, width, height)
    setSize(_this, result)
    _this.left = getLeft(_this, json, startJson)
  } else {
    _this.width = width
    _this.left = rangeMax(json.x - json.screen.left, startJson.r)
  }
  return _this
}
function n (_this, json, startJson) {
  ratio = _this.cropJson.r
  height = range(getHeight(json, startJson, 'n'), getMaxSize(json, startJson, 'n', 'h'))
  if (ratio) {
    width = range(height * ratio, getMaxSize(json, startJson, 'n', 'w'))
    result = setRatioSize('n', json, startJson, ratio, width, height)
    setSize(_this, result)
    _this.top = getTop(_this, json, startJson)
  } else {
    _this.height = height
    _this.top = rangeMax(json.y - json.screen.top, startJson.b)
  }
  return _this
}

function ne (_this, json, startJson) {
  height = range(getHeight(json, startJson, 'n'), getMaxSize(json, startJson, 'ne', 'h'))
  width = range(getWidth(json, startJson, 'e'), getMaxSize(json, startJson, 'ne', 'w'))
  result = setRatioSize('ne', json, startJson, _this.cropJson.r, width, height)
  setSize(_this, result)
  _this.top = getTop(_this, json, startJson)
  return _this
}
function se (_this, json, startJson) {
  height = range(getHeight(json, startJson, 's'), getMaxSize(json, startJson, 'se', 'h'))
  width = range(getWidth(json, startJson, 'e'), getMaxSize(json, startJson, 'se', 'w'))
  result = setRatioSize('se', json, startJson, _this.cropJson.r, width, height)
  setSize(_this, result)
  return _this
}
function sw (_this, json, startJson) {
  width = range(getWidth(json, startJson, 'w'), getMaxSize(json, startJson, 'sw', 'w'))
  height = range(getHeight(json, startJson, 's'), getMaxSize(json, startJson, 'sw', 'h'))
  result = setRatioSize('sw', json, startJson, _this.cropJson.r, width, height)
  setSize(_this, result)
  _this.left = getLeft(_this, json, startJson)
  return _this
}
function nw (_this, json, startJson) {
  width = range(getWidth(json, startJson, 'w'), getMaxSize(json, startJson, 'nw', 'w'))
  height = range(getHeight(json, startJson, 'n'), getMaxSize(json, startJson, 'nw', 'h'))
  result = setRatioSize('nw', json, startJson, _this.cropJson.r, width, height)
  setSize(_this, result)
  _this.left = getLeft(_this, json, startJson)
  _this.top = getTop(_this, json, startJson)
  return _this
}

// 匹配范围
function range (value, max) {
  value = value > max ? max : value
  return value < 20 ? 20 : value
}
// 最大值
function rangeMax (value, max) {
  return value > max ? max : value
}
// top
function getTop (_this, json, startJson) {
  return rangeMax(startJson.b - _this.height - json.screen.top, startJson.b)
}
// left
function getLeft (_this, json, startJson) {
  return rangeMax(startJson.r - _this.width - json.screen.left, startJson.r)
}
// height
function getHeight (json, startJson, type) {
  return type === 'n' ? startJson.b - json.y : json.y - startJson.t
}
// height
function getWidth (json, startJson, type) {
  return type === 'w' ? startJson.r - json.x : json.x - startJson.l
}
// setSize
function setSize (_this, result) {
  _this.width = result.width
  _this.height = result.height
}

export default movePos
