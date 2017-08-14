<template>
    <div class="modules-content">
          <div class="preview-main--module" v-for="json in moduleJson" @click="confirmOpen(json)">
            <div class="preview-page" :style="getBackground">
                <normalElement v-for="item in json.json" :key="item.id" :child-json="item" :show-json="json.json" :type="item.type">
                </normalElement>
            </div>
        </div>  
        <!-- <el-row :gutter="10">
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <img src="~assets/modules.png" alt="modules" class="">
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <img src="~assets/modules.png" alt="modules" class="">
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <img src="~assets/modules.png" alt="modules" class="">
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <img src="~assets/modules.png" alt="modules" class="">
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <img src="~assets/modules.png" alt="modules" class="">
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <img src="~assets/modules.png" alt="modules" class="">
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <img src="~assets/modules.png" alt="modules" class="">
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <img src="~assets/modules.png" alt="modules" class="">
                </div>
            </el-col>
        </el-row> -->
    </div>
</template>
<script>
import bus from 'views/ishow/js/bus';
import normalElement from 'views/ishow/preview/normal-template.vue';
import {
    getModuleList
} from 'api/ishow';
export default {
    data() {
        return {
            pageSize:30,
            pageNum:1,
            moduleJson:[],
            getBackground:{}
        };
    },
    created() {
        this.fetchModuleList();
    },
    props: [ 'page'],
    components: {
        normalElement
    },
    methods:{
        confirmOpen(json) {
            this.$confirm('模版会覆盖正在编辑的页面，确定要修改吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                console.info(333333)
                this.chooseModule(json);
            }).catch(() => {
                     console.info(33222)
            });
        },
        fetchModuleList() {
            getModuleList(this.pageSize,this.pageNum).then(response => {
                //  response.data=[{
                //     "moduleId":45,
                //     "moduleName":"name",
                //     "moduleLink":3,
                //     "createTime":"2017-7-15 00:00:00",
                //     "createUser":3,
                //     "moduleJson":'[{"page":1,"json":[{"type":2,"content":"http://192.168.1.100:8080/uploadfile/1/3/10/4c85ba80-d8e1-4ace-a0d5-4c145d3861cc_demo1-3.png","position":{"top":46,"left":55},"width":175,"height":226.77902621722845,"text":{"backgroundColor":"rgba(0,0,0,0)","opacity":100,"padding":0,"rotate":0,"borderWidth":0,"borderRadius":0,"borderStyle":"solid","shadowColor":"rgba(204, 204, 204,1)","shadowWidth":0,"shadowRadius":10,"shadowDire":0,"borderColor":"rgba(204, 204, 204,1)"},"animate":[],"id":1500954821593,"zIndex":1},{"type":1,"content":"你要编辑的文字","position":{"top":309,"left":10},"width":300,"height":38,"text":{"backgroundColor":"rgba(0,0,0,0)","color":"rgba(51, 51, 51,1)","opacity":100,"padding":0,"lineHeight":1,"fontFamily":"","fontSize":24,"writingMode":"horizontal-tb","textAlign":"left","fontWeight":"normal","fontStyle":"normal","textDecoration":"none","borderWidth":0,"borderRadius":0,"borderColor":"rgba(204, 204, 204,1)","borderStyle":"solid","shadowColor":"rgba(204, 204, 204,1)","shadowWidth":0,"shadowRadius":10,"shadowDire":0,"rotate":0},"animate":[],"id":1500954823321,"zIndex":2}],"bgImage":{}}]'
                // }];
                let data=response.data;
               
                if(data&&data.length){
                    console.info(data)
                    for (let i = 0; i < data.length; i++) {
                        let temp = JSON.parse(data[i].moduleJson);
                        data[i].json=temp[0].json;
                        data[i].moduleJson=temp;
                        // let tempJson={
                        //     moduleId:data[i].moduleId,
                        //     moduleName:data[i].moduleName,
                        //     moduleLink:data[i].moduleLink,
                        //     moduleJson:data[i].moduleJson,
                        //     json:temp[0].json
                        // };
                        
                        //this.moduleJson.push(tempJson);
                    }
                    this.moduleJson=Object.assign([],data);
                }
                console.info(this.moduleJson)
            });
        },
        chooseModule(json) {
            json=json.moduleJson[0];
            json.page=this.page;
            console.info('json',json)
            bus.$emit('update-pageJson', json);
            //this.$parent.$parent.updatePageJson(json.moduleJson);
            
        }
    }
};
</script>
