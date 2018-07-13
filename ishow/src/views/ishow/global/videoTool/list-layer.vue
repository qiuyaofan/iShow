<template>
    <div class="layer-content clearfix">
        <div class="layer-navbar">
            <div class="layer-navbar_item" :class="{ active: item.activeName===activeName }" v-for="(item,index) in navbarJson" :key="index" @click="selectNavbar(item.activeName)">
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
                        <el-button type="primary" size="small" @click="isManage=true">{{title}}管理</el-button>
                    </div>
                    <div class="fr" v-else>
                        <el-button type="warning" size="small" @click="deleteFn"><i class="el-icon-delete2"></i> 删除</el-button>
                        <el-button type="danger" size="small" @click="clear"><i class="el-icon-close"></i> 清空</el-button>
                        <el-button type="primary" size="small" @click="back"><i class="fa fa-reply" aria-hidden="true"></i> 取消管理</el-button>
                    </div>
                </div>
                <div class="layer-main_box layer-main_box--xs">
                    <div v-if="!isLoading">
                        <div class="c-list1">
                            <div class="c-list1--row" v-for="(item,index) in json" :key="index" @click.stop="toggerSelect(item,index)">
                                {{item.name}}
                                <div class="c-list1--layout" @click.stop="toggerPlay(item.url,index)">
                                    <i  class="fa fa-lg fa-play-circle c-font--default mr10" aria-hidden="true" :class="{'fa-pause-circle':audioPlayList['isActive'+index]}"  @click.stop="toggerPlay(item.url,index)"></i>
                                    <i class="fa fa-times-circle fa-lg c-font--default" aria-hidden="true" @click.stop="deleteFn(item,index)"></i>
                                    <!-- <i  class="fa fa-lg fa-play-circle c-font--default" aria-hidden="true" v-else></i> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="tc"><i class="el-icon-loading"></i> 正在加载{{title}}，请稍后...</div>
                </div>
                <div style="height:16px;">
                    <div v-show="audioSelectItem.name">已选择：<span class="bold">{{audioSelectItem.name}}</span>&nbsp;&nbsp;<i class="fa fa-times-circle fa-lg c-font--default" aria-hidden="true" @click="audioSelectItem=''"></i></div>
                </div>
            </div>
            <div class="layer-main_footer">
                <el-button @click="closeLayer">返回</el-button>
                <el-button type="primary" @click="confirmAudio">确定</el-button>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="18" layout="total, prev, pager, next, jumper" :total="400">
                </el-pagination>
            </div>
        </div>
        <audio :src="audioUrl" controls autoplay loop v-show="false" @oncanplay="oncanplay">
        </audio>    
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
      uploadUrl: '',
      isManage: false,
      isActive: [],
      isHover: [],
      audio: '',
      isAudioPlay: false,
      audioUrl: '',
      audioPlayIndex: '',
      audioList: {},
      audioPlayList: {},
      audioSelectItem: ''
    };
  },
  props: ['jsonData', 'isBg', 'type', 'isLoading'],

  created() {
    // 获取图片列表
    // this.fetchImgList();const uploadUrl=this.$store.state.app;
    this.uploadUrl = this.$store.state.app[this.type + 'UploadUrl'];
    this.title = this.type === 'audio' ? '音频' : '视频';
    this.setInput();
  },
  watch: {
    jsonData: {
      handler() {
        this.setInput();
      },
      deep: true
    }
  },
  mounted() {
    this.audio = this.$el.querySelector('audio');
  },
  methods: {
    // 添加音乐
    confirmAudio() {
      bus.$emit('update-h5Json', {
        bgMusic: this.audioSelectItem
      });
      this.closeLayer();
    },
    // 选择音乐
    toggerSelect(item, index) {
      this.audioSelectItem = item;
      console.info(item, index)
    },
    // 加载完成
    oncanplay() {
      this.audioUrl = url;
      this.audio.play();
    },
    // 切换播放状态
    toggerPlay(url, index) {
      this.isAudioPlay = !this.isAudioPlay;
      const temp = this.parseJson(this.audioPlayList);
      temp['isActive' + this.audioPlayIndex] = false;
      temp['isActive' + index] = this.isAudioPlay;
      this.audioPlayList = temp;
      this.audioPlayIndex = index;
      if (this.isAudioPlay) {
            // 已存在，不需要重新load
        if (this.audioUrl === url) {
          this.audio.play();
          return;
        }
            // 不一样，load
        this.audioUrl = url;
        return;
      }
        // 暂停
      this.audio.pause();
    },
    // 设置loading
    // isLoading(isLoading) {
    //     this.loading=isLoading;
    // },
    setInput() {
      this.json = this.parseJson(this.changeToArray(this.jsonData));
      this.isActive.length = this.json.length;
      this.isHover.length = this.json.length;
    },
    // json key 值返回
    changeToArray(json) {
      let url;
      const result = [];
      for (url in json) {
        result.push({
          url,
          name: json[url]
        });
      }
      return result;
    },
    picHover(index, status) {
      this.isHover.splice(index, 1, status);
    },
    // 关闭弹层
    closeLayer() {
      if (this.isManage === true) {
        this.back()
      }
      this.$parent.$parent.handleLayer('dialogVisible', false);
    },
    fetchDeletePic(data) {
      deleteImgList(data).then(response => {
      }).catch(err => {
        console.info(err)
      });
      this.removeSelect();
    },
    // 删除图片
    deleteFn(item, index) {
      this.fetchDeletePic([item.url]);
      this.json.splice(index, 1);
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
      const type = this.$parent.$parent.type;
      if (type === 'bg') {
            // 背景裁切
        this.$parent.$parent.bgHandle(true, url);
      } else if (type === 'picCrop') {
            // 图片裁切
        this.$parent.$parent.imgHandle(true, url);
      } else {
            // 添加图片元素
        this.$parent.$parent.addElement(url);
        this.$parent.$parent.dialogVisible = false;
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
        this.json.push({ url: loadingUrl, name: '上传中...' });
        // 滚动到底部
        target.scrollTop = target.scrollHeight - target.offsetHeight;
      }
    },
    // 上传图片成功
    uploadImgSuccess(response, file, fileList) {
      console.info('file', file, fileList, response.data)
      const data = { url: this.mapJson(response.data).key[0], name: file.name };
      for (let i = 0; i < this.json.length; i++) {
        console.info(this.json[i].url, loadingUrl)
        if (this.json[i].url === loadingUrl) {
          this.json.splice(i, 1, data);
          return false;
        }
      }
    },
    // 遍历返回
    mapJson(json) {
      let key;
      const keyArr = [],
        valArr = [];
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
    }
  }
};
</script>
