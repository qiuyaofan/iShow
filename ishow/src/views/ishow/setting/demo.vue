<template>
    <div class="ishow-mainSetting">
        <transition name="fade">
            <div v-if="disable" class="ishow-mainSetting--bg" @click="toggle"></div>
        </transition>
        
        <transition name="slide-fade">
            <div v-if="disable" class="ishow-mainSetting--info">
                <el-tabs type="card" v-model="activeName">
                    <el-tab-pane label="常用设置" name="first">
                        <div class="p10">
                            <el-form :label-position="'left'" label-width="46px"  :model="settingForm" ref="settingForm">
                                <el-form-item 
                                label="封面"
                                prop="pic">
                                    <div class="c-cover" @click="changePic">
                                        <div class="c-cover--btn">更换封面</div>
                                    </div>
                                </el-form-item>
                                <el-form-item 
                                label="标题"
                                prop="title"
                                :rules="[
                                { required: true, message: '标题不能为空', trigger: 'blur' }
                                ]">
                                    <el-input v-model="settingForm.title" placeholder="请输入标题"></el-input>
                                </el-form-item>
                                <el-form-item 
                                label="简介"
                                prop="summary"
                                :rules="[
                                { required: true, message: '简介不能为空', trigger: 'blur' }
                                ]">
                                    <el-input v-model="settingForm.summary" placeholder="请输入简介"></el-input>
                                </el-form-item>
                                <div class="tc">
                                    <el-button>取消</el-button>
                                    <el-button type="primary">保存配置</el-button>
                                    <el-button>图片选择</el-button>
                                    <el-button>图片裁切</el-button>
                                    <el-button>背景裁切</el-button>
                                </div>
                            </el-form>
                            
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="分享设置" name="second">
                    </el-tab-pane>
                </el-tabs>
            </div>
        </transition>

        <transition name="slide-fade">
            <div v-if="disable" class="ishow-mainSetting--phone">
                <div class="ishow-mainSetting--screen">23435</div>
            </div>
        </transition>
        
    </div>
</template>
<script>
import {
    getModuleList
} from 'api/ishow';
export default {
    data() {
        return {
            disable:false,
            activeName:'first',
            settingForm:{
                title:'',
                summary:'',
                pic:''
            }

        };
    },
    created() {
    },
    methods:{
        toggle() {
            this.disable=!this.disable;
        },
        changePic() {
            document.getElementById('J-open-corp').click();
        }
    }
};
</script>
