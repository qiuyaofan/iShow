import Vue from 'vue'
const bus = new Vue();

export default bus;

// bus.update-json event
/*
**item-click main-show（点击元素编辑）
**button2-menu-show button2-editor（右键显示编辑选项弹层）
**animate-change animate-single（触发当前改变动画播放）
**change-tab modules.vue（设置模版tab：编辑状态）
**bg-editor-toggle main-show.vue bg-editor.vue
*/


// animate 部分调试总结：this.stopEndCallback是否被animate-change改变为true,是否有顺序关系，比如$on本来会比watch慢执行