<template>
    <div class="ishow-elementWrapper dragged" v-bind:id="showId" v-bind:ctype="type" @click.stop :style="{
          top: cursorTop + 'px',
          left: cursorLeft + 'px',
          width: elWidth + 'px',
          height: elHeight + 'px',
          transform:'rotate('+rotate+'deg)'
        }">
        <div v-bind:style="[textJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem">
                    <img :src="content" alt="" class="ishow-elementItem_img ishow-elementItem_drap" :style="{
                    width: elWidth + 'px',
                    height: elHeight + 'px'
                  }">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// @input="changeText"
// v-html="content"
import bus from 'views/ishow/global/bus';
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
      lastRange: '',
      caretPos: 0,
      boxShadow: '',
      rotate: 0,
      dragstart: ''
    }
  },
  props: ['childJson', 'showJson', 'type'],
  created() {
    // 设置showId
    bus.$on('drap-size-update', (w, h, t, l) => {
      this.elWidth = w;
      this.elHeight = h;
      this.cursorTop = t;
      this.cursorLeft = l;
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
        // 设置宽高
        // if(this.elWidth==='auto'){
        //   this.elWidth=initWidth;
        // }
        // if(this.elHeight==='auto'){
        //     let rect=this.$el.querySelector('.ishow-elementItem_img').getBoundingClientRect();
        //     this.elHeight=rect.height*this.elWidth/rect.width;
        // }
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
  }
};
</script>
