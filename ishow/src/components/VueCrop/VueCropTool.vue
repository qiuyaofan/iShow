<template>
    <div class="c-crop--drap" >
        <div class="c-crop--drap_main">
            <div class="c-crop--drap_screen"></div>
            <div class="c-crop--drap_eline line" @click.stop>
                <div class="c-crop--drap_e"></div>
            </div>
            <div class="c-crop--drap_sline line" @click.stop>
                <div class="c-crop--drap_s"></div>
            </div>
            <div class="c-crop--drap_wline line" @click.stop>
                <div class="c-crop--drap_w"></div>
            </div>
            <div class="c-crop--drap_nline line" @click.stop>
                <div class="c-crop--drap_n"></div>
            </div>
            <div class="c-crop--drap_ne" @click.stop></div>
            <div class="c-crop--drap_se" @click.stop></div>
            <div class="c-crop--drap_sw" @click.stop></div>
            <div class="c-crop--drap_nw" @click.stop></div>
        </div>
    </div>
</template>
<script>
import draggable from '../utils/draggable'
import movePos from './VueCropMove'
const dragEle = ['.c-crop--drap_eline', '.c-crop--drap_sline', '.c-crop--drap_wline', '.c-crop--drap_nline', '.c-crop--drap_e', '.c-crop--drap_s', '.c-crop--drap_w', '.c-crop--drap_n', '.c-crop--drap_ne', '.c-crop--drap_se', '.c-crop--drap_sw', '.c-crop--drap_nw']

export default {
  data () {
    return {
      width: this.elWidth,
      height: this.elHeight,
      top: this.cursorTop,
      left: this.cursorLeft,
      startPos: [0, 0],
      crop: [],
      cropTimer: null,
      startSize: null
    }
  },
  props: ['elWidth', 'elHeight', 'cursorTop', 'cursorLeft', 'cropJson'],
  created () {},
  watch: {
    elWidth (val) {
      this.width = val
    },
    elHeight (val) {
      this.height = val
    },
    cursorTop (val) {
      this.top = val
    },
    cursorLeft (val) {
      this.left = val
    }
  },

  methods: {
    // 拖拽更新位置
    handleDragLocation (event) {
      let x = event.clientX
      let y = event.clientY
      this.left = x - this.startPos[0] + this.left
      this.top = y - this.startPos[1] + this.top
      this.startPos = [x, y]
      this.handleSize()
      // 更新尺寸
      this.$emit('updateSize', this.width, this.height, this.top, this.left)
      clearTimeout(this.cropTimer)
      this.cropTimer = setTimeout(() => {
        // 调用回调
        this.$emit('afterCrop')
      }, 200)
    },
    // 拖拽改变位置：绑定事件
    dragCallLocation () {
      draggable(this.$el.querySelector('.c-crop--drap_screen'), {
        start: (event) => {
          this.startPos = [event.x, event.y]
        },
        drag: (event) => {
          this.handleDragLocation(event)
        },
        end: (event) => {
          this.handleDragLocation(event)
        }
      })
    },
    // 根据className获取父元素
    getParentElement (p, className) {
      const classNames = p.className
      if (classNames.indexOf(className) === -1) {
        p = p.parentNode
        return this.getParentElement(p, className)
      } else {
        return p
      }
    },
    // 获取拖拽的尺寸
    getDragSize (event) {
      const el = this.$el
      const screen = this.$cropArea.getBoundingClientRect()
      const rect = el.getBoundingClientRect()
      let json = {
        x: event.clientX,
        y: event.clientY,
        t: rect.top,
        b: rect.bottom,
        l: rect.left,
        r: rect.right,
        w: rect.width,
        h: rect.height,
        screen: screen
      }
      json.ratio = json.w / json.h
      return json
    },
    // 拖拽改变大小
    handleDrag (event, i) {
      // 获取坐标
      // console.info('move', i)
      const json = this.getDragSize(event)
      movePos[i](this, json, this.startSize)
      this.handleSize(true)
      this.$emit('updateSize', this.width, this.height, this.top, this.left)
      clearTimeout(this.cropTimer)
      this.cropTimer = setTimeout(() => {
        // 调用回调
        this.$emit('afterCrop')
      }, 200)
    },
    // 拖拽改变大小：绑定事件
    dragCall (i) {
      let target = this.$el.querySelector(dragEle[i])
      draggable(target, {
        start: (event) => {
          // 开始时拖拽框json
          this.startSize = this.getDragSize(event)
        },
        drag: (event) => {
          this.handleDrag(event, i)
        },
        end: (event) => {
          this.handleDrag(event, i)
        }
      })
    },
    // 改变位置大小
    handleSize (isSize) {
      this.left = range2(this.left, this.width, this.cropJson.w)
      this.top = range2(this.top, this.height, this.cropJson.h)
      if (isSize) {
        let d1 = this.cropJson.w - this.left
        let d2 = this.cropJson.h - this.top
        // 按比例裁切
        if (this.cropJson.r) {
          if (d1 < this.width) {
            this.width = d1
            this.height = this.width / this.cropJson.r
          } else if (d2 < this.height) {
            this.height = d2
            this.width = this.height * this.cropJson.r
          }
        } else {
          // 不按比例裁切
          if (d1 < this.width) {
            this.width = d1
          }
          if (d2 < this.height) {
            this.height = d2
          }
        }
      }
    }

  },
  mounted () {
    this.$cropArea = this.getParentElement(this.$el.parentNode, 'c-crop--area')
    // 初始化拖拽改变大小
    for (var i = 0; i < dragEle.length; i++) {
      this.dragCall(i)
    }
    // 初始化拖拽改变位置
    this.dragCallLocation()
  }
}

function range2 (pos, val, mainW) {
  return pos <= 0 ? 0 : pos > mainW - val ? mainW - val : pos
}

</script>
<style lang="scss" scoped>
/* 拖拽的框 */
$zindex:100 200 300 400 999 2000 9999;
.c-crop--drap {
  $cropWidth: 6px;
  $corpHalfWidth: 3px;
  $corpHalfWidthBigger: 4px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: nth($zindex, 1);
  pointer-events: none;
  width:100%;
  height:100%;
  border: 3px solid rgba(0, 0, 0, 0.4);
  .line {
    position: absolute;
    pointer-events: auto;
    &:after {
      content: '';
      position: absolute;
      background: #fff url(./img/Jcrop.gif);
      ;
    }
  }
  @at-root {
    .c-crop--drap_screen {
      width:100%;
      height:100%;
      pointer-events: auto;
    }
    .c-crop--drap_main {
      position: relative;
      width:100%;
      height:100%;
    }
    .c-crop--drap_nline {
      top: 1px;
      left: 0;
      width: 100%;
      height: 6px;
      &:after {
        top: -1px;
        height: 1px;
        width: 100%;
        left: 0;
      }
    }
    .c-crop--drap_eline {
      top: 0;
      right: 0;
      height: 100%;
      width: 6px;
      &:after {
        right: -1px;
        width: 1px;
        height: 100%;
        top: 0;
      }
    }
    .c-crop--drap_sline {
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6px;
      &:after {
        width: 100%;
        bottom: -1px;
        left: 0;
        height: 1px;
      }
    }
    .c-crop--drap_wline {
      top: 0;
      left: 0;
      height: 100%;
      width: 6px;
      &:after {
        left: -1px;
        width: 1px;
        height: 100%;
        top: 0;
      }
    }
    .c-crop--drap_n,
    .c-crop--drap_e,
    .c-crop--drap_w,
    .c-crop--drap_s,
    .c-crop--drap_ne,
    .c-crop--drap_nw,
    .c-crop--drap_se,
    .c-crop--drap_sw {
      width: $cropWidth;
      height: $cropWidth;
      background-color: rgba(51, 51, 51, .6);
      border: 1px #EEE solid;
      position: absolute;
      z-index: nth($zindex, 2);
    }
    .c-crop--drap_n,
    .c-crop--drap_s {
      left: 50%;
      margin-left: -$corpHalfWidth;
    }
    .c-crop--drap_w,
    .c-crop--drap_e {
      top: 50%;
      margin-top: -$corpHalfWidth;
    }
    .c-crop--drap_n,
    .c-crop--drap_s,
    .c-crop--drap_nline,
    .c-crop--drap_sline {
      cursor: ns-resize;
    }
    .c-crop--drap_w,
    .c-crop--drap_e,
    .c-crop--drap_wline,
    .c-crop--drap_eline {
      cursor: ew-resize;
    }
    .c-crop--drap_n {
      top: -$corpHalfWidthBigger;
    }
    .c-crop--drap_e {
      right: -$corpHalfWidthBigger;
    }
    .c-crop--drap_s {
      bottom: -$corpHalfWidthBigger;
    }
    .c-crop--drap_w {
      left: -$corpHalfWidthBigger;
    }
    .c-crop--drap_ne {
      right: -$corpHalfWidth;
      top: -$corpHalfWidth;
      cursor: nesw-resize;
      pointer-events: auto;
    }
    .c-crop--drap_nw {
      left: -$corpHalfWidth;
      top: -$corpHalfWidth;
      cursor: nwse-resize;
      pointer-events: auto;
    }
    .c-crop--drap_se {
      right: -$corpHalfWidth;
      bottom: -$corpHalfWidth;
      cursor: nwse-resize;
      pointer-events: auto;
    }
    .c-crop--drap_sw {
      left: -$corpHalfWidth;
      bottom: -$corpHalfWidth;
      cursor: nesw-resize;
      pointer-events: auto;
    }
  }
}
</style>
