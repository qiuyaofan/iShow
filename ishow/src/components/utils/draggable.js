export default function (element, options) {
  const moveFn = function (event) {
    if (options.drag) {
      options.drag(event)
    }
  }
  const downFn = function (event) {
    if (options.start) {
      options.start(event)
    }
  }
  const upFn = function (event) {
    document.removeEventListener('mousemove', moveFn)
    document.removeEventListener('mouseup', upFn)
    document.onselectstart = null
    document.ondragstart = null

    if (options.end) {
      options.end(event)
    }
  }
  element.addEventListener('mousedown', event => {
    if (options.stop && options.stop(event, element) === false) {
      return false
    }
    document.onselectstart = function () {
      return false
    }
    document.ondragstart = function () {
      return false
    }
    document.addEventListener('mousedown', downFn)
    document.addEventListener('mousemove', moveFn)
    document.addEventListener('mouseup', upFn)
  })
}
// if (isDragging) return
// if(element.querySelector('.element-item').getAttribute('contenteditable')=="true"){
//     return
// }
