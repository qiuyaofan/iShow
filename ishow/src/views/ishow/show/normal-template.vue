<template>
    <div class="ishow-elementWrapper dragged" v-bind:class="{ active:isActive , 'ishow-elementWrapper--auto':isAuto}" v-bind:id="id" v-bind:ctype="type" @click.stop :style="{
            top: cursorTop + 'px',
            left: cursorLeft + 'px',
            width: elWidth + 'px',
            height: elHeight + 'px',
            zIndex:zIndex,
            transform:'rotate('+rotate+'deg)',
        }">
        <!-- 普通文本 -->
        <div v-if="type===1" v-bind:style="[textJson,animateJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_text ishow-elementItem_drap" @click.stop="selectElement()" @contextmenu.prevent="rightClick($event)" v-html="content" v-show="!typewriter.isActive" :style="{
                  minHeight: resizeH
                }">
                </div>
                <div class="ishow-elementItem ishow-elementItem_text" @click.stop="selectElement()" @contextmenu.prevent="rightClick($event)" v-html="typewriter.content" v-show="typewriter.isActive"></div>
            </div>
        </div>
        <!-- 图片 -->
        <div v-if="type===2" v-bind:style="[textJson,animateJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem" @click.stop="selectElement()" @contextmenu.prevent="rightClick($event)">
                    <img :src="content" alt="" class="ishow-elementItem_img ishow-elementItem_drap" :style="{
                    width: elWidth + 'px',
                    height: elHeight + 'px'
                  }">
                </div>
            </div>
        </div>
        <!-- 输入框 -->
        <div v-if="type===3" v-bind:style="[textJson,animateJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_drap" @click.stop="selectElement()" @contextmenu.prevent="rightClick($event)">
                    <textarea :name="json.form.name" :placeholder="json.form.cname" class="ishow-elementItem_textarea" :style="{
                    width: elWidth + 'px',
                    height: elHeight + 'px'
                  }">
                    </textarea>
                </div>
            </div>
        </div>
        <!-- 单选 -->
        <div v-if="type===4" v-bind:style="[textJson,animateJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_drap ishow-elementItem_radio tl" @click.stop="selectElement()" @contextmenu.prevent="rightClick($event)">
                    <div class="ishow-elementItem_title" v-html="json.form.cname" :style="{'background-color':json.text.themeColor}"></div>
                    <el-radio-group v-model="radio1" :class="{vertical:json.form.dire==='v'}">
                        <el-radio v-for="radioItem in json.form.options" :label="radioItem.id" :key="radioItem.id">{{radioItem}}</el-radio>
                    </el-radio-group>
                </div>
            </div>
        </div>
        <!-- 多选 -->
        <div v-if="type===5" v-bind:style="[textJson,animateJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_drap ishow-elementItem_checkbox tl" @click.stop="selectElement()" @contextmenu.prevent="rightClick($event)">
                    <div class="ishow-elementItem_title" v-html="json.form.cname" :style="{'background-color':json.text.themeColor}"></div>
                    <el-checkbox-group v-model="checkbox1" :class="{vertical:json.form.dire==='v'}">
                        <el-checkbox v-for="radioItem2 in json.form.options" :label="radioItem2.id" :key="radioItem2.id">{{radioItem2}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
        <!-- 下拉框 -->
        <div v-if="type===6" v-bind:style="[textJson,animateJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_drap ishow-elementItem_select tl" @click.stop="selectElement()" @contextmenu.prevent="rightClick($event)">
                    <el-select :value="json.form.options[json.form.selectedVal]" :style="{'font-size':json.text.fontSize+'px'}">
                        <el-option v-for="(selectItem,selectIndex) in json.form.options" :key="selectIndex" :label="selectItem" :value="selectIndex">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <!-- 按钮 -->
        <div v-if="type===7" v-bind:style="[textJson,animateJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_drap ishow-elementItem_button tc" @click.stop="selectElement()" @contextmenu.prevent="rightClick($event)">
                    <a class="ishow-elementItem_button_a" :href="json.form.link" :style="{
                    width: elWidth + 'px',
                    height: elHeight + 'px',
                    'line-height':elHeight + 'px',
                    color:json.text.color
                  }">{{json.form.name}}</a>
                </div>
            </div>
        </div>
        <dragSize :cursor-top="cursorTop" :cursor-left="cursorLeft" v-show="isActive" :rotate="childJson.text.rotate">
        </dragSize>
    </div>
</template>
<script>
// @input="changeText"
// v-html="content"
import bus from 'views/ishow/js/bus';
import draggable from 'views/ishow/js/draggable';
import dragSize from 'views/ishow/global/dragSize/dragSize.vue';
const specialName = ['typewriter'];
// 兼容禁止点击移动元素
let isDragging = false;
export default {
  data() {
    return {
      json: this.parseJson(this.childJson),
      id: 0,
      textJson: '',
      animateJson: '',
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
      animateIndex: 0,
      stopEndCallback: false,
      radio1: '',
      checkbox1: '',
      startPos: [0, 0],
      animateAll: true,
      typewriter: {
        isActive: false,
        content: '',
        timer: null
      },
      isAuto: false,
      resizeH: 'inherit',
      imgSize: {},
      updateImg: false
    }
  },
  props: ['childJson', 'showJson', 'type', 'showId'],
  components: {
    dragSize
  },
  created() {
    if (this.childJson.type === 2) {
      bus.$on('navbar-pic-update', data => {
        if (this.showId === this.id) {
          this.updateImg = true;
          this.getImgSize(data.content);
        }
      });
    }
    // 设置showId
    bus.$on('remove-selected', () => {
      this.isActive = false;
    });
    // 动画修改播放效果
    bus.$on('animate-change', _index => {
      if (this.id === this.showId) {
        this.playAnimate(_index);
      }
    });
    // 动画修改播放效果
    // bus.$on('animate-init', function() {
    //     if (this.id === this.showId) {
    //         this.animateIndex = 0;
    //     }
    // }.bind(this));

    // 预览动画修播放效果
    bus.$on('animate-preview', () => {
      if (this.id === this.showId) {
        this.playAnimate(false);
      }
    });

    // 设置showId
    bus.$on('drap-size-update', (w, h, t, l) => {
      if (this.isActive) {
        this.elWidth = w;
        this.elHeight = h;
        this.cursorTop = t;
        this.cursorLeft = l;
        this.triggerApp();
      }
    });
    // 首次加载播放全部动画
    this.playAnimate(false);
    // 新建选择元素，兼容还没生成元素的时间差
    setTimeout(() => {
      this.selectElement();
    }, 0);

    this.getImgSize(this.json.content);
  },
  watch: {
    childJson: {
      handler(val, oldVal) {
        if (!this.jsonEq(val, oldVal)) {
          this.initJson();
        }
      },
      deep: true
    }
  },

  methods: {
    // drapUpdate(w, h, t, l) {
    //     if (this.isActive) {
    //         this.elWidth = w;
    //         this.elHeight = h;
    //         this.cursorTop = t;
    //         this.cursorLeft = l;
    //         this.triggerApp();
    //     }
    // },
    // 动画改变
    animateChange(index) {
      if (this.id === this.showId) {
        this.playAnimate(index);
      }
    },
    // 调整大小
    resize(isResize) {
      this.isAuto = isResize && this.type === 1;
      if (this.isAuto) {
        this.resizeH = this.elHeight + 'px';
      } else {
        this.elHeight = this.$el.offsetHeight;
        this.resizeH = 'inherit';
        this.triggerApp();
      }
    },
    // 获取原始图片宽高
    getImgSize(src) {
      const img = new Image();
      img.src = src;
      this.imgSize = {
        w: img.width,
        h: img.height,
        r: img.width / img.height,
        src
      };
      return this.imgSize;
    },
    // 播放动画
    playAnimate(index) {
      if (this.json.animate && this.json.animate.length) {
        if (index !== false) {
          // change
          this.animateAll = false;
          if (this.isSpecialAnimate(this.json.animate[index]) === false) {
            this.animateJson = this.addS(this.json.animate[index]);
          }
        } else {
          // preview
          this.animateAll = true;
          this.animateJson = this.renderAnimate();
        }
      }
    },
    // 添加单位s
    addS(json) {
      const data = this.parseJson(json);
      data.animationDuration = data.animationDuration + 's';
      data.animationDelay = data.animationDelay + 's';
      return data;
    },
    // 渲染全部动画
    renderAnimate() {
      const animate = this.parseJson(this.json.animate);
      const result = {
        '-webkit-animation-timing-function': 'ease'
      };
      const delay = [],
        duration = [],
        name = [],
        mode = [];
      let delayTime;
      if (animate && animate.length) {
        for (let i = 0; i < animate.length; i++) {
          // 不是特殊动画
          if (this.isSpecialAnimate(animate[i]) === false) {
            name.push(animate[i].animationName);
            duration.push(animate[i].animationDuration + 's');
            // iterationCount.push(animate[i].animationIterationCount || 1);
              // 0%是否是opacity:0
            if (animate[i].isOut === true || i === 1) {
              mode.push('forwards');
            } else {
              mode.push('both');
            }

              // 判断延迟是否需要加前面的值
            if (i === 0) {
              delayTime = animate[i].animationDelay + 's';
            } else {
              delayTime = animate[i - 1].animationDelay + animate[i].animationDelay + animate[i - 1].animationDuration + 's';
            }
            delay.push(delayTime);
          }
        }
        result.animationName = name.join(',');
        result.animationDuration = duration.join(',');
        result.animationFillMode = mode.join(',');
        result.animationDelay = delay.join(',');
        // result.animationIterationCount = iterationCount.join(',');
        return result;
      }
      return '';
    },
    // 判断是否是特殊动画，是：播放
    isSpecialAnimate(animate) {
      for (let i = 0; i < specialName.length; i++) {
        const type = specialName[i];
        const name = animate.animationName.split('j-');
        const data = this[type];
            // 判断是否是选中的特殊动画
        data.isActive = name.length >= 2 && name[1] === type;
        if (data.isActive) {
          clearInterval(data.timer);
          this.runSpecialAnimate(data, animate, name);
          return true;
        }
      }
      return false;
    },
    // 播放动画
    runSpecialAnimate(data, animate) {
      if (animate.animationName === 'j-typewriter') {
        const arr = this.content.split('<br>');
        const brIndex = [];
        const duration = animate.animationDuration || 0.1;
        data.content = '';
            // 提取换行的位置
        for (let k = 0, len = arr.length; k < len; k++) {
          const index = k === 0 ? arr[k].length - 1 : brIndex[k - 1] + arr[k].length;
          brIndex.push(index);
        }
            // 延时
        setTimeout(() => {
          const content = arr.join('').split('');
          const len = arr.join('').length;
          let i = 0;
          let j = 0;
          // 定时循环
          data.timer = setInterval(() => {
            data.content += content[i];
            if (i === brIndex[j]) {
              data.content += '<br>';
              j++;
            }
            i++;
            if (i >= len) {
              clearInterval(data.timer);
              data.isActive = false;
            }
          }, duration * 1000);
        }, animate.animationDelay * 1000);
      }
    },
    // json是否相等
    jsonEq(val1, val2) {
      return JSON.stringify(val1) === JSON.stringify(val2);
    },
    // 初始化
    initJson() {
      this.json = JSON.parse(JSON.stringify(this.childJson));
      this.id = this.json.id;
      this.modifyJson();
      this.textJson = this.json.text;
      this.content = this.json.content;
      this.cursorTop = this.json.position.top;
      this.cursorLeft = this.json.position.left;
      this.zIndex = this.json.zIndex;
      this.rotate = this.textJson.rotate;
      this.elWidth = this.json.width;
        // 编辑图片兼容宽高不变形
      if (this.updateImg === true) {
        this.elHeight = this.json.height = 'auto';
      } else {
        this.elHeight = this.json.height;
      }

        // 设置宽高
      this.changeWH();
    },
    changeWH() {
      const rect = this.$el.getBoundingClientRect();
      if (this.elWidth === 'auto') {
        this.elWidth = rect.width + 2;
        this.triggerApp();
      }

      if (this.elHeight === 'auto') {
            // rect.height * this.elWidth / rect.width
        this.elHeight = this.type === 2 ? this.elWidth / this.imgSize.r : rect.height;
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
    // 处理animate 时间单位
    // modifyAnimate() {
    //     if (this.json.animate && this.json.animate.length) {
    //         let index = this.animateIndex;
    //         this.modifyData.animationDuration = this.json.animate[index].animationDuration + 's';
    //         this.modifyData.animationDelay = this.json.animate[index].animationDelay + 's';
    //     }
    // },
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
    createEle(id) {
      if (id === this.id) {
        this.selectElement();
      }
    },
    // 选择元素
    selectElement() {
      // 移除其他元素active
      bus.$emit('remove-selected');
      // 触发设置showid
      bus.$emit('set-elementId', this.id);
      // 隐藏右键操作框
      bus.$emit('button2-menu-hide');
      // 设置模版tab：编辑状态
      bus.$emit('change-tab', 'second');
        // this.isEditable=true;
      this.isActive = true;
    },
    // 右键选择元素
    rightClick(e) {
      if (e.button === 2) {
        this.selectElement();
            // 显示右键操作菜单
        bus.$emit('button2-menu-show', e, this.id);
        return false;
      }
    },
    // 拖拽更新位置
    handleDrag(event) {
      const x = event.clientX;
      const y = event.clientY;
      this.cursorLeft = x - this.startPos[0] + this.cursorLeft;
      this.cursorTop = y - this.startPos[1] + this.cursorTop;
      this.startPos = [x, y];
    },
    // 修改json，触发更新json父元素方法
    triggerApp() {
      this.json.position.top = this.cursorTop;
      this.json.position.left = this.cursorLeft;
      this.json.content = this.content;
      this.json.width = this.elWidth;
      this.json.height = this.elHeight;
      this.json.text.rotate = this.rotate;
      let data = this.parseJson(this.showJson);
      data = this.converJson(data);
      data[this.id] = this.json;
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
    },

    whichAnimationEvent() {
      let t;
      const el = document.createElement('fakeelement');
      const animations = {
        animation: 'animationend',
        Webkitanimation: 'webkitAnimationEnd'
      }

      for (t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    },
    // 更新animateIndex并播放动画
    // handleAniIndex(index) {
    //     let ani = this.json.animate;
    //     if (ani && ani.length - 1 > index) {
    //         this.animateIndex = index + 1;
    //         this.initJson(true);
    //     }
    // },
    // 动画结束调用下一个动画
    addAnimateEnd(e) {
      const animationEvent = this.whichAnimationEvent();
      if (animationEvent) {
        e.addEventListener(animationEvent, e => {
          const animate = this.json.animate;
          const len = animate.length;
           // 判断播放全部动画时是最后一个结束||单个动画结束
          if (animate && len) {
            if ((this.animateAll === true && e.animationName === animate[len - 1].animationName) || this.animateAll === false) {
              this.animateJson = {};
            }
          }
        });
      }
    //   animationEvent && e.addEventListener(animationEvent, e => {
    //     const animate = this.json.animate;
    //     const len = animate.length;
    //                 // 判断播放全部动画时是最后一个结束||单个动画结束
    //     if (animate && len) {
    //       if ((this.animateAll === true && e.animationName === animate[len - 1].animationName) || this.animateAll === false) {
    //         this.animateJson = {};
    //       }
    //     }

    // // this.animateJson={};
    //   });
    }

  },
// computed: {
//     imgWidth:function() {
//       return this.elWidth;
//     },
//     imgHeight:function() {
//       return this.elHeight;
//     }
// },
  mounted() {
            // 绑定结束事件
    const target = this.$el.querySelector('.ishow-elementWrapper_main');
    this.addAnimateEnd(target);
    this.initJson();

    draggable(this.$el, {
      start: event => {
        this.startPos = [event.x, event.y];
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
      },
      stop: (event, element) => {
              // 判断是右键点击或者不是可拖拽元素就不拖
        if (element !== event.target && event.target.className.indexOf('ishow-elementItem_drap') === -1) {
          return false;
        }
        if (event.button === 2) {
          return false;
        }
        return true;
      }
    });
  }
};
</script>
