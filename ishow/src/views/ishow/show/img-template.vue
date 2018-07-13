<template>
    <div class="ishow-elementWrapper dragged" v-bind:class="{ active:isActive }" v-bind:id="showId" v-bind:ctype="type" @click.stop :style="{
          top: cursorTop + 'px',
          left: cursorLeft + 'px',
          width: elWidth + 'px',
          height: elHeight + 'px',
          transform:'rotate('+rotate+'deg)',
          zIndex:zIndex
        }">
        <div v-bind:style="[textJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem" @click.stop="selectElement">
                    <img :src="content" alt="" class="ishow-elementItem_img ishow-elementItem_drap" :style="{
                    width: elWidth + 'px',
                    height: elHeight + 'px'
                  }">
                </div>
            </div>
        </div>
        <dragSize :el-width="elWidth" :el-height="elHeight" :cursor-top="cursorTop" :cursor-left="cursorLeft" v-show="isActive">
        </dragSize>
    </div>
</template>
<script>
// @input="changeText"
// v-html="content"
import bus from 'views/ishow/global/bus';
import draggable from 'views/ishow/js/draggable';
import dragSize from 'views/ishow/global/dragSize.vue';
// 兼容禁止点击移动元素
let isDragging = false;
const initWidth = 175;
export default {
  data() {
    return {
      json: {},
      showId: 0,
      textJson: '',
      cursorTop: 0,
      cursorLeft: 0,
      modifyData: {},
      content: this.childJson.content,
      elWidth: this.childJson.width,
      elHeight: this.childJson.height,
      zIndex: this.childJson.zIndex,
      isActive: false,
      lastRange: '',
      caretPos: 0,
      boxShadow: '',
      rotate: 0,
      dragstart: ''
    }
  },
  props: ['childJson', 'showJson', 'type'],
  components: {
    dragSize
  },
  created() {
    // 设置showId
    bus.$on('remove-selected', () => {
      this.isActive = false;
    });
    // 设置showId
    bus.$on('drap-size-update', (w, h, t, l) => {
      this.elWidth = w;
      this.elHeight = h;
      this.cursorTop = t;
      this.cursorLeft = l;
      this.triggerApp();
    });
  },
  watch: {
    childJson: {
      handler() {
        this.initJson();
      },
      deep: true
    }
  },

  methods: {
    // 初始化
    initJson() {
      this.json = JSON.parse(JSON.stringify(this.childJson));
      this.showId = this.json.id;
      this.modifyJson();
      this.textJson = this.json.text;
      this.cursorTop = this.json.position.top;
      this.cursorLeft = this.json.position.left;
      this.rotate = this.textJson.rotate;
      this.zIndex = this.json.zIndex;
            // 设置宽高
      if (this.elWidth === 'auto') {
        this.elWidth = initWidth;
        this.triggerApp();
      }
      if (this.elHeight === 'auto') {
        const rect = this.$el.querySelector('.ishow-elementItem_drap').getBoundingClientRect();
        this.elHeight = rect.height * this.elWidth / rect.width;
        this.triggerApp();
      }
    },
    // 修正样式值
    modifyJson() {
      this.modifyData.opacity = this.json.text.opacity * 0.01;
      this.modifyData.boxShadow = this.handleShadowDire();
      for (const val in this.json.text) {
        if (val === 'fontSize' || val === 'padding' || val === 'borderWidth' || val === 'borderRadius') {
          this.modifyData[val] = this.json.text[val] + 'px';
        }
      }
    },
    // 处理阴影方向值
    handleShadowDire() {
      const width = this.json.text.shadowWidth;
      if (!width) {
        return 'none';
      }
      const arr = [
        [1, -1],
        [-1, -1],
        [-1, 1],
        [1, 1]
      ];
      const result = [];
      const dire = this.json.text.shadowDire;

      const arrVal = [
        [0, width],
        [width, 0],
        [0, -width],
        [-width, 0]
      ];
      const angle = 90 / width;
      let index = Math.floor(dire / 90);
      const count = Math.floor(dire % 90 / angle);
      if (index === 4) {
        index = 0;
      }
      result[0] = arrVal[index][0] + arr[index][0] * count;
      result[1] = arrVal[index][1] + arr[index][1] * count;
      return this.json.text.shadowColor + ' ' + result[0] + 'px ' + result[1] + 'px ' + this.json.text.shadowRadius + 'px';
    },
    // 选择元素
    selectElement() {
      // 触发设置showid
      bus.$emit('set-elementId', this.showId);
      bus.$emit('item-click', this.showId);
      // 移除其他元素active
      bus.$emit('remove-selected');
      bus.$emit('change-tab', 'second');
      this.isActive = true;
    },
    // 拖拽更新位置
    handleDrag(event) {
      // 获取外层screen位置信息
      const screen = document.getElementsByClassName('screen')[0].getBoundingClientRect();
      const rect = this.$el.getBoundingClientRect();
      let left = event.clientX - this.dragstart.clientX + rect.left - screen.left;
      let top = event.clientY - this.dragstart.clientY + rect.top - screen.top;
      // let left = event.clientX - screen.left - rect.width*.5;
      // let top = event.clientY - screen.top - rect.height*.5;
      const width = screen.width - rect.width;
      const height = screen.height - rect.height;
      left = Math.max(0, left);
      left = Math.min(left, width);
      top = Math.max(0, top);
      top = Math.min(top, height);
      this.cursorLeft = left;
      this.cursorTop = top;
      this.dragstart = event;
    },
        // 修改json，触发更新json父元素方法
    triggerApp() {
            // console.info(this.showJson)
      this.json.position.top = this.cursorTop;
      this.json.position.left = this.cursorLeft;
      this.json.text.rotate = this.rotate;
      this.json.content = this.content;
      this.json.width = this.elWidth;
      this.json.height = this.elHeight;
      let data = this.parseJson(this.showJson);
      data = this.converJson(data);
      data[this.showId] = this.json;
      bus.$emit('update-json', data);
    },
    // 转换showJson to renderJson
    converJson(data) {
      const result = {};
      for (let i = 0; i < data.length; i++) {
        result[data[i].id] = data[i];
      }
      return result;
    },
    // 深拷贝
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    }

  },
  mounted() {
    this.initJson();
    draggable(this.$el, {
      start: event => {
        this.dragstart = event;
      },
      drag: event => {
        this.handleDrag(event);
        isDragging = true;
      },
      end: event => {
        if (isDragging) {
          this.handleDrag(event);
          this.triggerApp();
          isDragging = false;
        }
        this.dragstart = '';
      }
    });
  }
};
</script>
