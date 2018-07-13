import VueCrop from './VueCrop/index.js'

const install = function(Vue = {}) {
  /* istanbul ignore if */
  if (install.installed) return
  Vue.component(VueCrop.name, VueCrop)
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  install,
  VueCrop
}
