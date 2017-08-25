<template>
    <!-- type:picCrop,pic,bg -->
    <div class="ishow-picToolMain">
         <slot></slot> 
        <!-- 图片素材 -->
        <!-- <pic-layer :pic-json="jsonData" ref="videoLayer"></pic-layer> -->
        <div v-if="isOpen" style="line-height:1;">
            <el-dialog :title="title+'素材'" v-model="dialogVisible" size="small-1000" :before-close="closeVideoLayer">
                <list-layer :json-data="jsonData" ref="videoLayer" :is-bg="isBg" :type="type" :isLoading="isLoading"></list-layer>
            </el-dialog>

            <el-dialog :title="'预览'+title" v-model="dialogVisible2" size="small-700" top="3%">
                <div class="layer-content clearfix">
                    <img :src="previewPicSrc" alt="" width="100%">
                </div>
                <div class="layer-main_footer">
                    <el-button @click="dialogVisible2=false">关闭</el-button>
                    <el-button type="primary" @click="addPic(previewPicSrc)">使用图片</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
// import {
//     getImgList
// } from 'api/ishow';
import bus from 'views/ishow/js/bus';
import listLayer from './list-layer.vue';
import crop from 'views/ishow/global/crop/crop.vue';
const loadingUrl = "static/loading.gif";
export default {
    data() {
            return {
                activeIndex: '',
                dialogVisible: false,
                dialogVisible2:false,
                previewPicSrc:'',
                // currentPage: 4,
                // jsonData: [],
                isBg:false,
                // uploadUrl: this.$store.state.app.uploadUrl,

                //背景图片裁切
                crood:'',
                croodUrl:'',
                //图片裁切
                dialogVisible4:false,
                //croodUrl2:'',
                cropType:'',
                isOpen:false,
                title:'',
                isLoading:true
            };
        },
        props:{
            'type':{
                type: String,
            },
            'jsonData':{},
            //选择图片回调
            'addElement': {
                type: Function,
                default: function(){}
            },
            'initUrl': {
                type: String
            }
        },
        components: {
            listLayer,
            crop
        },
        created() {
            this.title=this.type==='audio'?'音频':'视频';
            //预览图片
            // bus.$on('navbar-preview', function(src) {
            //     this.dialogVisible2=true;
            //     this.previewPicSrc=src;
            // }.bind(this));

            //编辑
            // bus.$on('update-target', function(data,id) {
            //     this.updateId=id;
            //     this.setInput(data, true);
            // }.bind(this));

            //图片关闭弹层
            // bus.$on('handle-navbar-layer', function(name,isShow) {
            //     this[name]=isShow;
            // }.bind(this));
            
        },
        watch: {},
        methods: {
            handleLayer(name,isShow) {
                this[name]=isShow;
            },
            setLoading(isLoading) {
                this.isLoading=isLoading;
            },
            bgHandle(isShow,url) {
                this.dialogVisible3=isShow;
                this.croodUrl=url;
            },
            imgHandle(isShow,url) {
                this.dialogVisible3=isShow;
                this.croodUrl=url;
            },
            openTool(url) {
                this.isOpen=true;
                this.croodUrl=url||'';
                
                // if(this.type==='picCrop'){
                //     this.dialogVisible3=true;
                //     return ;
                // }
                this.dialogVisible=true;
              
            }, 
            //预览使用图片
            addPic() {
                this.$refs.videoLayer.confirmPic(this.previewPicSrc);
                this.dialogVisible2=false;
            },
            //关闭图片弹层
            closeVideoLayer() {
                this.$refs.videoLayer.closeLayer();
            },
     
            //添加图片元素
            addImage(isBg) {
                this.isBg=isBg;
                this.dialogVisible = true;
            },
           
            closeDialog() {
                this.dialogVisible = false;
                this.isUpdate = false;
                this.isBg=false;
            },
            //限制输入框为自定义时才可修改名称，验证
            inputValChange() {
                if (this.inputJson.name !== 'customize') {
                    return false;
                }
            },
            openPicHandle() {
                this.addImage(2);
            },

            //深拷贝
            parseJson(json) {
                return JSON.parse(JSON.stringify(json));
            },
        }
};
</script>

