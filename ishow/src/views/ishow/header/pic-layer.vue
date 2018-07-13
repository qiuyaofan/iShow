<template>
    <div class="layer-content clearfix">
        <div class="layer-navbar">
            <div class="layer-navbar_item" :class="{ active: item.activeName===activeName }" v-for="(item,index) in navbarJson"  :key="index" @click="selectNavbar(item.activeName)">
                <a href="javascript:;">{{item.name}}</a>
            </div>
        </div>
        <div class="layer-content--btn">
            <el-upload :action="uploadUrl" :name="'file'" :multiple="true" :show-file-list="false" :on-progress="uploadImgProgress" :on-success="uploadImgSuccess">
                <el-button size="large" type="primary">点击上传</el-button>
            </el-upload>
            <!-- <el-button size="large" @click="upload" class="wp100">上传</el-button> -->
            <el-button size="large" type="default" @click="addLink" class="wp100">添加外链</el-button>
        </div>
        <div class="layer-main_pic">
            <div class="layer-main_content">
                <div class="layer-main-header mb10">
                    <div class="fr" v-if="!isManage">
                        <el-button type="primary" size="small" @click="isManage=true">图片管理</el-button>
                    </div>
                    <div class="fr" v-else>
                        <el-button type="warning" size="small" @click="deleteFn"><i class="el-icon-delete2"></i> 删除</el-button>
                        <el-button type="danger" size="small" @click="clear"><i class="el-icon-close"></i> 清空</el-button>
                        <el-button type="primary" size="small" @click="back"><i class="fa fa-reply" aria-hidden="true"></i> 取消管理</el-button>
                    </div>
                </div>
                <div class="layer-main_box">
                    <div v-if="json.length>0">
                        <div v-for="(item,index) in json" :key="index" class="layer-main_item" :class="{ 'selected': isActive[index]}" :style="{ 'background-image': 'url(' + item + ')' }" :data-url="item"  @mouseover="picHover(index,true)" @mouseout="picHover(index,false)">
                            
                            <div v-show="isHover[index]" class="layer-main_item--pic">
                                <div class="tc">
                                    <el-button type="primary" @click="addElement(item,index)" class="mt20">
                                        <span v-if="isActive[index]">取消</span>
                                        <span v-else>选择</span>
                                    </el-button>
                                </div>
                                <div class="tc">
                                    <el-button @click="preview(item,index)" class="mt5" size="small"><i class="fa fa-eye" aria-hidden="true"></i> 预览</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="tc"><i class="el-icon-loading"></i> 正在加载图片，请稍后...</div>
                </div>
                
            </div>
            <div class="layer-main_footer">
                <!-- <el-button @click="closeLayer">取 消</el-button> -->
                <el-button type="primary" @click="closeLayer">返回</el-button>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="18" layout="total, prev, pager, next, jumper" :total="400">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>

import bus from 'views/ishow/js/bus';
import navarJson from 'views/ishow/js/navbar/navbar.json';
const loadingUrl = 'static/loading.gif';
import {
    deleteImgList
} from 'api/ishow';
export default {
  data() {
    return {
      activeName: 'upload',
      navbarJson: navarJson.navbarJsons,
      json: [],
      currentPage: 4,
      uploadUrl: this.$store.state.app.uploadUrl,
      isManage: false,
      isActive: [],
      isHover: []
    };
  },
  props: ['picJson', 'isBg'],

  created() {
    // 获取图片列表
    // this.fetchImgList();
    this.setInput();
  },
  watch: {
    picJson: {
      handler() {
        this.setInput();
      },
      deep: true
    }
  },
  methods: {
    setInput() {
      this.json = this.parseJson(this.picJson);
      this.isActive.length = this.picJson.length;
      this.isHover.length = this.picJson.length;
    },
    picHover(index, status) {
      this.isHover.splice(index, 1, status);
    },
    // 关闭弹层
    closeLayer() {
      if (this.isManage === true) {
        this.back();
      }
      bus.$emit('handle-navbar-layer', 'dialogVisible', false);
    },
    fetchDeletePic(data) {
      deleteImgList(data).then(() => {
      }).catch(err => {
        console.info(err)
      });
      this.removeSelect();
        // getValidateList().then(response => {
        //     this.validateDefault=this.handleValidateDefault(response.data);
        // }).catch(err => {
        //     console.info(err)
        // });
    },
    // 删除图片
    deleteFn() {
      const len = this.isActive.length;
      const result = [];
      for (let i = 0; i < len; i++) {
        if (this.isActive[i] === true) {
          result.push(this.json[i]);
        }
      }
      if (!result.length) {
        this.$message.error('请先选择图片哦');
        return false;
      }
      this.fetchDeletePic(result);
    },
    // 清空
    clear() {

    },
    // 返回
    back() {
      this.isManage = false;
      this.removeSelect();
    },
    removeSelect() {
      this.isActive = this.setAll(this.isActive, false);
    },
    // 添加元素
    addElement(url, index) {
      // 是否是管理状态
      if (this.isManage === false) {
        this.confirmPic(url);
      } else {
        // 选择图片打勾
        this.isActive.splice(index, 1, !this.isActive[index]);
      }
    },

    confirmPic(url) {
      if (this.isBg === 1) {
        // 背景裁切
        bus.$emit('navbar-bg-handle', true, url);
      } else {
        // 添加图片元素
        bus.$emit('update-image-layer', 2, { content: url });
      }
    },

    // 选择navbar
    selectNavbar(name) {
      this.activeName = name;
    },

    // 翻页修改
    handleCurrentChange() {

    },
    // 翻页页数
    handleSizeChange() {

    },

    // 深拷贝
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
    upload() {

    },
    addLink() {

    },
    // 上传中
    uploadImgProgress(event, file, fileList) {
      const target = document.querySelector('.layer-main_box');
      for (let i = 0; i < fileList.length; i++) {
        this.json.push(loadingUrl);
    // 滚动到底部
        target.scrollTop = target.scrollHeight - target.offsetHeight;
      }
    },
    // 上传图片成功
    uploadImgSuccess(response) {
      const data = this.mapJson(response.data).key[0];
      for (let i = 0; i < this.json.length; i++) {
        if (this.json[i] === loadingUrl) {
          this.json.splice(i, 1, data);
          return false;
        }
      }
    },
    // 遍历返回
    mapJson(json) {
      let key;
      const keyArr = [];
      const valArr = [];
      for (key in json) {
        keyArr.push(key);
        valArr.push(json[key]);
      }
      return {
        key: keyArr,
        value: valArr
      }
    },
    setAll(data, value) {
      const result = Object.assign([], data);
      let i;
      const n = result.length;
      for (i = 0; i < n; ++i) {
        result[i] = value;
      }
      return result;
    },
    // 预览图片
    preview(src) {
      bus.$emit('navbar-preview', src);
    }
  }
};
</script>
