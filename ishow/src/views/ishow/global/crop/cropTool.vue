<template>
    <div class="c-crop--drap" >
        <div class="c-crop--drap_main">
            <div class="c-crop--drap_screen"></div>
            <div class="c-crop--drap_eline line" @click.stop="">
                <div class="c-crop--drap_e"></div>
            </div>
            <div class="c-crop--drap_sline line" @click.stop="">
                <div class="c-crop--drap_s"></div>
            </div>
            <div class="c-crop--drap_wline line" @click.stop="">
                <div class="c-crop--drap_w"></div>
            </div>
            <div class="c-crop--drap_nline line" @click.stop="">
                <div class="c-crop--drap_n"></div>
            </div>
            <div class="c-crop--drap_ne" @click.stop=""></div>
            <div class="c-crop--drap_se" @click.stop=""></div>
            <div class="c-crop--drap_sw" @click.stop=""></div>
            <div class="c-crop--drap_nw" @click.stop=""></div>
        </div>
        <!-- :style="{
        width: width + 'px',
        height: height + 'px'
      }" -->
    </div>
</template>
<script>
// @input="changeText"
// v-html="content"
// import bus from 'views/ishow/js/bus';
import draggable from 'views/ishow/js/draggable';
import movePos from './move';
const dragEle = ['.c-crop--drap_eline', '.c-crop--drap_sline', '.c-crop--drap_wline', '.c-crop--drap_nline', '.c-crop--drap_e', '.c-crop--drap_s', '.c-crop--drap_w', '.c-crop--drap_n', '.c-crop--drap_ne', '.c-crop--drap_se', '.c-crop--drap_sw', '.c-crop--drap_nw'];
function range2(pos, val, mainW) {
    // console.info('range2',pos,val,mainW);
  return pos <= 0 ? 0 : pos > mainW - val ? mainW - val : pos;
}

export default {
  data() {
    return {
      width: this.elWidth,
      height: this.elHeight,
      top: this.cursorTop,
      left: this.cursorLeft,
      startPos: [0, 0],
      crop: []
    }
  },
  props: ['elWidth', 'elHeight', 'cursorTop', 'cursorLeft', 'cropJson'],
  watch: {
    elWidth(val) {
      this.width = val;
    },
    elHeight(val) {
      this.height = val;
    },
    cursorTop(val) {
      this.top = val;
    },
    cursorLeft(val) {
      this.left = val;
    }
  },

  methods: {
            // 拖拽改变大小
    handleDrag(event, i) {
      const el = this.$el;
      const screen = document.getElementsByClassName('c-crop--area')[0].getBoundingClientRect();
      const rect = el.getBoundingClientRect();
                // let width, height, left, top;
      const json = {
        x: event.clientX,
        y: event.clientY,
        t: rect.top,
        b: rect.bottom,
        l: rect.left,
        r: rect.right,
        w: rect.width,
        h: rect.height,
        screen
      };
      json.ratio = json.w / json.h;
                // 获取坐标
                // console.info('move',i)
      movePos[i](this, json);
      this.handleSize(true);
      this.$parent.drapSizeUpdate(this.width, this.height, this.top, this.left);
                // bus.$emit('drap-size-update', this.width, this.height, this.top, this.left);
    },
            // 改变位置大小
    handleSize(isSize) {
      this.left = range2(this.left, this.width, this.cropJson.w);
      this.top = range2(this.top, this.height, this.cropJson.h);
      if (isSize) {
        const d1 = this.cropJson.w - this.left;
        const d2 = this.cropJson.h - this.top;
        if (this.cropJson.r) {
          if (d1 < this.width) {
            this.width = d1;
            this.height = this.width / this.cropJson.r;
          } else if (d2 < this.height) {
            this.height = d2;
            this.width = this.height * this.cropJson.r;
          }
        } else {
          if (d1 < this.width) {
            this.width = d1;
          }
          if (d2 < this.height) {
            this.height = d2;
          }
        }
      }
    },
            // 拖拽更新位置
    handleDrag2(event) {
      const x = event.clientX;
      const y = event.clientY;
      this.left = x - this.startPos[0] + this.left;
      this.top = y - this.startPos[1] + this.top;
      this.startPos = [x, y];
      this.handleSize();
      this.$parent.drapSizeUpdate(this.width, this.height, this.top, this.left);
    },
    dragCall(i) {
      const target = this.$el.querySelector(dragEle[i]);
      draggable(target, {
        drag: event => {
          this.handleDrag(event, i);
        },
        end: event => {
          this.handleDrag(event, i);
        }
      });
    }
  },
  mounted() {
    for (let i = 0; i < dragEle.length; i++) {
      this.dragCall(i);
    }
            // console.info(this.$el.querySelector('.c-crop--drap_screen'))
    draggable(this.$el.querySelector('.c-crop--drap_screen'), {
      start: event => {
        this.startPos = [event.x, event.y];
      },
      drag: event => {
        this.handleDrag2(event);
      },
      end: event => {
        this.handleDrag2(event);
      }
    });
            // this.update();
  }
};
</script>
