<template>
    <div class="drap-resize_main" >
        <div class="drap-resize_eline line">
            <div class="drap-resize_e"></div>
        </div>
        <div class="drap-resize_sline line">
            <div class="drap-resize_s"></div>
        </div>
        <div class="drap-resize_wline line">
            <div class="drap-resize_w"></div>
        </div>
        <div class="drap-resize_nline line">
            <div class="drap-resize_n"></div>
        </div>
        <div class="drap-resize_ne"></div>
        <div class="drap-resize_se"></div>
        <div class="drap-resize_sw"></div>
        <div class="drap-resize_nw"></div>
        <!-- :style="{
        width: width + 'px',
        height: height + 'px'
      }" -->
    </div>
</template>
<script>
// @input="changeText"
// v-html="content"
import bus from 'views/ishow/js/bus';
import draggable from 'views/ishow/js/draggable';
const dragEle = ['.drap-resize_eline', '.drap-resize_sline', '.drap-resize_wline', '.drap-resize_nline', '.drap-resize_e', '.drap-resize_s', '.drap-resize_w', '.drap-resize_n', '.drap-resize_ne', '.drap-resize_se', '.drap-resize_sw', '.drap-resize_nw'];

function range(value) {
  return value < 0 ? 0 : value;
}

function rangeMax(value, max) {
  return value > max ? max : value;
}
export default {
  data() {
    return {
      width: this.elWidth,
      height: this.elHeight,
      top: this.cursorTop,
      left: this.cursorLeft
    }
  },
  props: ['elWidth', 'elHeight', 'cursorTop', 'cursorLeft'],
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
    // 拖拽更新位置
    handleDrag(event, i) {
      const el = this.$el;
      const screen = document.getElementsByClassName('ishow-screen')[0].getBoundingClientRect();
      // const target = this.$el.querySelector(dragEle[i]);
      const rect = el.getBoundingClientRect();
      let width, height, left, top;
      const x = event.clientX;
      const y = event.clientY;
      const t = rect.top;
      const b = rect.bottom;
      const l = rect.left;
      const r = rect.right;
      const w = rect.width;
      const h = rect.height;
      const ratio = w / h;
                // e
      if (i === 0 || i === 4) {
        width = x - l;
        this.width = range(width);
      }
                // s
      if (i === 1 || i === 5) {
        height = y - t;
        this.height = range(height);
      }
                // w
      if (i === 2 || i === 6) {
        width = r - x;
        left = x - screen.left;
        this.left = rangeMax(left, r);
        this.width = range(width);
      } // n
      if (i === 3 || i === 7) {
        height = b - y;
        top = y - screen.top;
        this.top = rangeMax(top, b);
        this.height = range(height);
      }
                // ne
      if (i === 8) {
        height = b - y;
        top = y - screen.top;
        this.top = rangeMax(top, b);
        this.height = range(height);
        this.width = ratio * this.height;
      }
                // se
      if (i === 9) {
        height = y - t;
        this.height = height < 0 ? 0 : height;
        this.width = ratio * this.height;
      }
                // sw
      if (i === 10) {
        width = r - x;
        left = x - screen.left;
        this.left = rangeMax(left, r);
        this.width = range(width);
        this.height = this.width / ratio;
      }
                // nw
      if (i === 11) {
        height = b - y;
        width = r - x;
        if (height - h > width - w) {
          top = y - screen.top;
          const changeTop = top - this.top;
          this.top = rangeMax(top, b);
          this.height = range(height);
          this.width = ratio * this.height;
          this.left = changeTop * ratio + this.left;
        } else {
          left = x - screen.left;
          const changeLeft = left - this.left;
          this.left = rangeMax(left, r);
          this.width = range(width);
          this.height = this.width / ratio;
          this.top = changeLeft * ratio + this.top;
        }
      }
      bus.$emit('drap-size-update', this.width, this.height, this.top, this.left);
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
    // this.update();
  }
};

</script>
