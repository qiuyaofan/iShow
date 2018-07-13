<template>
    <!-- type:picCrop,pic,bg -->
    <div class="ishow-picToolMain">
         <slot></slot> 
        <!-- 图片素材 -->
        <!-- <pic-layer :pic-json="picJson" ref="picLayer"></pic-layer> -->
        <div v-if="isOpen" style="line-height:1;">
            <el-dialog title="图片素材" v-model="dialogVisible" size="small-1000" :before-close="closePicLayer">
                <pic-layer :pic-json="picJson" ref="picLayer" :is-bg="isBg" :isLoading="isLoading"></pic-layer>
            </el-dialog>

            <el-dialog title="预览图片" v-model="dialogVisible2" size="small-700" top="3%">
                <div class="layer-content clearfix">
                    <img :src="previewPicSrc" alt="" width="100%">
                </div>
                <div class="layer-main_footer">
                    <el-button @click="dialogVisible2=false">关闭</el-button>
                    <el-button type="primary" @click="addPic(previewPicSrc)">使用图片</el-button>
                </div>
            </el-dialog>

            <!-- 裁切弹层 -->
            <el-dialog :title="cropTitle" v-model="dialogVisible3" top="3%" v-if="type!=='pic'">
                <div class="layer-content clearfix">
                    <div class="layer-main_normal">
                        <vue-crop @afterCrop="afterCrop" :crop-url="croodUrl" :ratio="ratio" :height="460" :width="920"></vue-crop>
                    </div>
                </div>
                <div class="layer-main_footer" v-if="type==='picCrop'">
                    <el-button @click="dialogVisible3=false">取消</el-button>
                    <el-button type="primary" @click="setPicCorp">确定</el-button>
                </div>
                <div class="layer-main_footer" v-if="type==='bg'">
                    <el-button @click="dialogVisible3=false">关闭</el-button>
                    <el-button type="primary" @click="setBgImageAll">应用所有</el-button>
                    <el-button type="primary" @click="setBgImage">应用当前页</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
// import {
//     getImgList
// } from 'api/ishow';
import picLayer from './pic-layer.vue';
export default {
  data() {
    return {
      activeIndex: '',
      dialogVisible: false,
      dialogVisible3: false,
      dialogVisible2: false,
      previewPicSrc: '',
      isBg: false,
      // 背景图片裁切
      crood: '',
      croodUrl: '',
      // 图片裁切
      dialogVisible4: false,
      // croodUrl2:'',
      cropType: '',
      isOpen: false,
      cropTitle: '',
      isLoading: true
    };
  },
  props: {
    type: {
      type: String
    },
    picJson: {
      type: Array
    },
    // 选择背景图回调
    addBg: {
      type: Function,
      default() {}
    },
    // 选择图片回调
    addElement: {
      type: Function,
      default() {}
    },
    // 裁切完图片选择回调
    addElementCrop: {
      type: Function,
      default() {}
    },
    initUrl: {
      type: String
    },
    ratio: {
      type: Number,
      default: 1
    }
  },
  components: {
    picLayer
  },
  created() {
    this.cropTitle = this.type === 'bg' ? '背景裁切' : this.type === 'picCrop' ? '图片裁切' : '';
    // 预览图片
    // bus.$on('navbar-preview', function(src) {
    //     this.dialogVisible2=true;
    //     this.previewPicSrc=src;
    // }.bind(this));

    // 编辑
    // bus.$on('update-target', function(data,id) {
    //     this.updateId=id;
    //     this.setInput(data, true);
    // }.bind(this));

    // 图片关闭弹层
    // bus.$on('handle-navbar-layer', function(name,isShow) {
    //     this[name]=isShow;
    // }.bind(this));
  },
  watch: {},
  methods: {
    // 预览使用图片
    navbarPreview(src) {
      this.dialogVisible2 = true;
      this.previewPicSrc = src;
    },
    handleLayer(name, isShow) {
      this[name] = isShow;
    },
    setLoading(isLoading) {
      this.isLoading = isLoading;
    },
    bgHandle(isShow, url) {
      this.dialogVisible3 = isShow;
      this.croodUrl = url;
    },
    imgHandle(isShow, url) {
      this.dialogVisible3 = isShow;
      this.croodUrl = url;
    },
    openTool(url) {
      this.isOpen = true;
      this.croodUrl = url || '';

        // if(this.type==='picCrop'){
        //     this.dialogVisible3=true;
        //     return ;
        // }
      this.dialogVisible = true;
    },
    // 使用背景图片
    bgImage(tag) {
      this.addBg({
        crood: this.parseJson(this.crood),
        url: this.croodUrl,
        tag
      });
      this.dialogVisible = false;
      this.dialogVisible2 = false;
      this.dialogVisible3 = false;
    },

    setBgImage() {
      this.bgImage();
    },
    setBgImageAll() {
      this.bgImage('-all');
    },
    // 确定裁切图片
    setPicCorp() {
      this.dialogVisible = false;
      this.dialogVisible3 = false;
      this.addElementCrop({
        crood: this.parseJson(this.crood),
        url: this.croodUrl
      });
    },
    // 获取裁切数据
    afterCrop(json, url) {
      // 如果有提交，加上提交裁切数据到后台返回裁切后的图片路径，传给更新图片url,例如如下：
      // this.croodUrl=post(this.croodUrl,this.crood);
      this.crood = json;
      this.croodUrl = url;
      console.info('afterCrop', json, url)
    },
    // 预览使用图片
    addPic() {
      this.$refs.picLayer.confirmPic(this.previewPicSrc);
      this.dialogVisible2 = false;
    },
    // 关闭图片弹层
    closePicLayer() {
      this.$refs.picLayer.closeLayer();
    },

    // 添加图片元素
    addImage(isBg) {
      this.isBg = isBg;
      this.dialogVisible = true;
    },

    closeDialog() {
      this.dialogVisible = false;
      this.isUpdate = false;
      this.isBg = false;
    },
    // 限制输入框为自定义时才可修改名称，验证
    inputValChange() {
      if (this.inputJson.name !== 'customize') {
        return false;
      }
    },
    openPicHandle() {
      this.addImage(2);
    },

    // 深拷贝
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    }
  }
};
</script>

