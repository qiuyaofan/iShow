<template>
    <div class="layer-main_content">
        <div class="layer-main_box form-list">
            <div class="form-group ml100">
                <div>
                    <label class="w6em">按钮名称</label>
                    <div class="form-item w350">
                        <el-input class placeholder="请填写按钮名称" v-model="radioJson.name"></el-input>
                    </div>
                </div>
            </div>
            <div class="form-group ml100">
                <div>
                    <label class="w6em">提示信息</label>
                    <div class="form-item w350">
                        <el-input class :placeholder="'请填写成功提示信息'" v-model="radioJson.tip"></el-input>
                    </div>
                </div>
            </div>
            <div class="form-group ml100">
                <div>
                    <label class="w6em">添加外链</label>
                    <div class="form-item w350">
                        <el-input class :placeholder="'可选填'" v-model="radioJson.link"></el-input>
                    </div>
                </div>
            </div>
            <div class="form-group ml100">
                <div>
                    <label class="w6em">提交起始时间</label>
                    <div class="form-item">
                        <el-switch v-model="timeOn" on-text="" off-text="" class="mt5"></el-switch>
                    </div>
                    <div class="form-item" v-if="timeOn">
                        <el-col :span="11">
                            <el-input v-model="timeRangeMin" placeholder="起始时间"></el-input>
                        </el-col>
                        <el-col class="line line_center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-input v-model="timeRangeMax" placeholder="结束时间"></el-input>
                        </el-col>
                    </div>
                </div>
            </div>
            <div class="form-group ml100">
                <div>
                    <label class="w6em">禁止重复提交</label>
                    <div class="form-item">
                        <el-switch v-model="radioJson.noRepeat" on-text="" off-text="" class="mt5"></el-switch>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>
<script>
import bus from 'views/ishow/js/bus';
const maxRadio = 8;

export default {
    data() {
        return {
            // radioOptions: [],
            // radioValidate: false,
            json:this.parseJson(this.radioJson),
            //按钮提交时间
            timeOn: false,
            timeRangeMin: '',
            timeRangeMax: ''
            // selectDefaultVal:0
        };
    },
    props: ['radioJson','rType'],
    created() {
        this.setInput();
    },
    computed: {
      timeRange: function () {
        return this.timeRangeMin + ',' + this.timeRangeMax;
      }
    },
    watch: {
        radioJson:{
            handler(val) {
                this.setInput();
            },
            deep: true
        }
    },
    methods: {
        setInput() {
            this.json=this.parseJson(this.radioJson);
        },
        //深拷贝
        parseJson(json) {
            return JSON.parse(JSON.stringify(json));
        },
        //同步父元素
        triggerApp(type) {
            this.$parent.$parent.confirmForm(this.json,type);
            //bus.$emit('update-radio-layer',this.json,type);
        }
    }
};
</script>
