<template>
    <div class="c-crop">
      <div class="c-crop--main" :style="{height:height+'px',width:width+'px'}">
          <div
              class="c-crop--area"
              :style="{
                  width:imgW+'px',
                  height:imgH+'px',
                  'margin-top':(height-imgH)/2+'px',
                  'margin-left':(width-imgW)/2+'px'
              }"
          >
              <img
                :src="url"
                alt="原始图片"
                width="100%"
                v-if="url"
              >
              <div
                class="c-crop--cut"
                v-if="url"
                :style="{
                    width:elWidth+'px',
                    height:elHeight+'px',
                    left:cursorLeft+'px',
                    top:cursorTop+'px'
                }"
                @click.stop
              >
                  <img
                    :src="url"
                    alt="裁切后图片"
                    class="c-crop--cut_img"
                    :style="{
                        width:imgW+'px',
                        height:imgH+'px',
                        left:-cursorLeft+'px',
                        top:-cursorTop+'px'
                    }"
                  >
                  <VueCropTool
                    :crop-json="cropJson"
                    :el-width="elWidth"
                    :el-height="elHeight"
                    :cursor-top="cursorTop"
                    :cursor-left="cursorLeft"
                    @updateSize="drapSizeUpdate"
                    @afterCrop="afterCrop"
                  >
                  </VueCropTool>
              </div>
          </div>
      </div>
      <div
        class="c-crop--preview"
        v-if="previewJson.length"
      >
        <div
          class="c-crop--preview_item"
          v-for="(item,index) in previewJson"
          :key="index"
          :style="{height:item.height+'px',width:item.width+'px'}"
          :class="{'c-crop--radius':item.radius}"
        >
          <img
            :src="url"
            alt=""
            v-if="url&&previewImgSize&&previewImgSize.length"
            :style="{
                width:previewImgSize[index].w+'px',
                height:previewImgSize[index].h+'px',
                left:previewImgSize[index].l+'px',
                top:previewImgSize[index].t+'px'
            }"
          >
        </div>
      </div>
      <div class="c-crop--hide_main">
        <img id="c-crop--hide_img" :src="url" alt=""/>
      </div>
  </div>
</template>
<script>
import VueCropTool from './VueCropTool.vue'
export default {
  name: 'VueCrop',
  data() {
    return {
      previewImgSize: null,
      originImgSize: null,
      elWidth: 0,
      elHeight: 0,
      cursorTop: 0,
      cursorLeft: 0,
      // startPos: [0, 0],
      imgH: 0,
      imgW: 0,
      url: this.cropUrl,
      // isDraping: false,
      scale: 1,
      coord: null,
      cropJson: {
        cw: null,
        ch: null,
        w: null,
        h: null,
        r: null
      }
      // cropTimer: null
    }
  },
  props: {
    cropUrl: String,
    ratio: {
      type: null,
      default: false
    },
    width: null,
    height: null,
    coordWidth: null,
    coordHeight: null,
    previewJson: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    VueCropTool
  },
  created() {
  },
  watch: {
    cropUrl(val) {
      this.url = val
      setTimeout(() => {
        this.setSize()
      }, 200)
    }
  },
  methods: {
    drapSizeUpdate(w, h, t, l) {
      // 更新裁切框尺寸
      this.elWidth = w
      this.elHeight = h
      this.cursorTop = t
      this.cursorLeft = l
      // 根据当前选区获取原始图片缩放前的尺寸（还原原始图片的宽高以获取最终裁切数据）
      this.coord = this.getCoord(l, t, w, h)
      // 更新预览尺寸
      this.setPreviewSize(this.coord)
    },
    // 裁切完毕回调
    afterCrop() {
      this.$emit('afterCrop', this.coord, this.url)
    },
    // 设置preview尺寸
    setPreviewSize(coord) {
      if (!this.previewJson.length) {
        return false
      }
      const result = this.previewJson.map(data => {
        const scale = data.width / coord.w
        return {
          scale,
          l: -scale * coord.l,
          t: -scale * coord.t,
          w: scale * this.originImgSize.w,
          h: scale * this.originImgSize.h
        }
      })
      this.previewImgSize = result
    },
    // 设置裁切显示的图片尺寸，存储scale值
    async setSize() {
      if (!this.url) {
        return
      }
      const imgSize = await this.getSize(this.url)
      this.originImgSize = imgSize
      this.setCoordRange()
      this.scale = imgSize.w / this.imgW
      this.cursorTop = 0
      this.cursorLeft = 0
      const json = { ...this.cropJson }
      json.w = this.imgW
      json.h = this.imgH
      if (this.ratio) {
        json.r = this.ratio
        // 有固定比例，则按比例截取
        if (json.w > json.h) {
          const r = json.h * this.ratio / json.w
          if (r > 1) {
            json.ch = json.h / r
            json.cw = json.ch * this.ratio
          } else {
            json.ch = json.h
            json.cw = json.ch * this.ratio
          }
        } else {
          const r = json.w / this.ratio / json.h
          if (r > 1) {
            json.cw = json.w / r
            json.ch = json.cw / this.ratio
          } else {
            json.cw = json.w
            json.ch = json.cw / this.ratio
          }
        }
      } else {
        json.cw = json.w
        json.ch = json.h
      }
      // 裁切框的尺寸
      this.elWidth = json.cw / 2
      this.elHeight = json.ch / 2
      this.cursorTop = json.ch / 4
      this.cursorLeft = json.cw / 4
      this.cropJson = { ...json }
      this.drapSizeUpdate(this.elWidth, this.elHeight, this.cursorTop, this.cursorLeft)
    },
    setCoordRange() {
      const size = { ...this.originImgSize }
      const ratio1 = this.width / this.height
      const ratio2 = size.r
      if (ratio2 > ratio1) {
        this.imgW = this.width
        this.imgH = this.width / size.r
      } else {
        this.imgH = this.height
        this.imgW = this.height * size.r
      }
    },
    // 获取裁切后的原始坐标宽高（裁切看到的宽高不是原始图片的宽高）
    getCoord(l, t, w, h) {
      l = this.scale * l
      t = this.scale * t
      w = this.scale * w
      h = this.scale * h
      return {
        p0: [l, t],
        p1: [l + w, t],
        p2: [l + w, t + h],
        p3: [l, t + h],
        w,
        h,
        l,
        t
      }
    },
    // 获取是src图片的尺寸
    getSize(src) {
      const _this = this
      const img = this.$el.querySelector('#c-crop--hide_img')
      return new Promise(resolve => {
        if (src && img) {
          img.onload = function() {
            // 兼容获取不到尺寸的情况
            const size = _this.getSizeImg(img)
            resolve(size)
          }
          img.src = src
        } else {
          resolve({
            w: 0,
            h: 0,
            r: 0
          })
        }
      })
    },
    getSizeImg(img) {
      const w = img.width
      const h = img.height
      const r = w === 0 && h === 0 ? 0 : w / h
      return {
        w,
        h,
        r
      }
    }

  },
  mounted() {
    this.setSize()
  }
}

</script>
<style  lang="scss" scoped>
$zindex:100 200 300 400 999 2000 9999;

.c-crop {
  display: inline-block;
  *{
    box-sizing: border-box;
  }
  img {
    pointer-events: none;
  }
  @at-root {
    .c-crop--radius{
      border-radius:50%;
    }
    .c-crop--hide_main{
      width: 0;
      height: 0;
      overflow: hidden;
    }
    .c-crop--main {
      width: 100%;
      text-align: center;
      border: 1px solid #ccc;
      display: inline-block;
      background: #eee;
    }
    .c-crop--area {
      position: relative;
      height: 100%;
      display: inline-block;
      &:after {
        content: '';
        position: absolute;
        width:100%;
        height:100%;
        background: rgba(0, 0, 0, 0.4);
        z-index: nth($zindex, 1);
        top: 0;
        left: 0;
      }
    }
    .c-crop--cut {
      position: absolute;
      overflow: hidden;
      z-index: nth($zindex, 2);
      background: #fff;
    }
    .c-crop--cut_img {
      position: absolute;
    }
    .drap-resize_main {
      pointer-events: none;
    }
  }
}
.c-crop--preview{
    vertical-align: bottom;
}
.c-crop--preview_right .c-crop--preview{
  display: inline-block;
  margin:20px 0 0 20px;

  @at-root{
    .c-crop--preview_item{
      position: relative;
      overflow: hidden;
      border:1px solid #ccc;
      display: inline-block;
      margin-right: 20px;
      background: #eee;
      &>img{
        position: absolute;
      }
    }
  }
}

</style>
