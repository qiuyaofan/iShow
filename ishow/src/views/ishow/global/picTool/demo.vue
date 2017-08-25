<template>
    <div class="ishow-mainSetting">
        <!-- picTool使用例子 -->
        <picTool :type="'pic'" :picJson="picJson" ref="picTool" :addElement="addElement">
            <el-button @click="showTool('picTool')">图片选择</el-button>
        </picTool>
        <picTool :type="'picCrop'" :initUrl="cropUrl" :picJson="picJson" ref="picTool1" :addElementCrop="addElementCrop">
            <el-button @click="showTool('picTool1',cropUrl)">图片裁切</el-button>
        </picTool>
        <picTool :type="'bg'" :picJson="picJson" ref="picTool2" :addBg="addBg">
            <el-button @click="showTool('picTool2')">背景裁切</el-button>  
        </picTool>
        <!-- <el-button>图片选择</el-button>
        <el-button>图片裁切</el-button>
        <el-button>背景裁切</el-button>                   -->
    </div>
</template>
<script>
import picTool from 'views/ishow/global/picTool/index.vue';
import {
    getImgList,
    getActivityList
} from 'api/ishow';
export default {
    data() {
        return {
            picJson: [],
            cropUrl:'http://192.168.1.100:8080/uploadfile/1/15/5/17aeb9fe-ebaa-4a96-8b21-cc903e8a8813_7.pic.jpg'
        };
    },
    created() {
        //获取图片列表
         this.fetchImgList();
         this.fetchActivityList();
    },
    components: {
        picTool
    },
    methods:{
        //获取列表
        fetchActivityList() {
            getActivityList(30,1).then(response => {
                if(response.data&&response.data.length){
                    console.info(response.data)
                }
                //console.info(response)
                //console.info(JSON.parse(response.data))
            });
        },
        showTool(name,cropUrl) {
            this.$refs[name].openTool(cropUrl);
        },
        //获取本地图片
        fetchImgList() {
            getImgList().then(response => {
                this.picJson = this.changeToArray(response.data);
            }).catch(err => {
                console.info(err)
            });
        },
        //json key 值返回
        changeToArray(json) {
            let url,
                result = [];
            for (url in json) {
                result.push(url);
            }
            return result;
        },
        addElement() {
            console.info('添加图片')
        },
        addElementCrop(json) {
            console.info('添加裁切图片',json)
        },
        addBg(json) {
            console.info('添加背景',json)
        }
    }
};
</script>
