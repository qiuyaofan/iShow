<template>
    <div class="navbar-main" @click="validateOut">
        <!-- 下啦选择弹层类型 -->
        <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">文本&nbsp;<i class="fa fa-font" aria-hidden="true"></i></el-menu-item>
            <el-menu-item index="2">
                <div @click="showTool('picTool')">图片&nbsp;<i class="fa fa-picture-o" aria-hidden="true"></i></div>
            </el-menu-item>
            <el-menu-item index="4">视频&nbsp;<i class="fa fa-video-camera" aria-hidden="true"></i></el-menu-item>
            <el-menu-item index="5">音频&nbsp;<i class="fa fa-music" aria-hidden="true"></i></el-menu-item>
            <el-submenu index="3">
                <template slot="title">表单&nbsp;<i class="fa fa-bars" aria-hidden="true"></i></template>
                <el-menu-item index="3-1">输入框</el-menu-item>
                <el-menu-item index="3-2">单选</el-menu-item>
                <el-menu-item index="3-3">多选</el-menu-item>
                <el-menu-item index="3-4">下拉框</el-menu-item>
                <el-menu-item index="3-5">按钮</el-menu-item>
            </el-submenu>
            <el-menu-item index="6" >
                <picTool :type="'bg'" :picJson="picJson" ref="picTool2" :addBg="addBg" :ratio="0.695">
                    <div @click="showTool('picTool2')" id="J-open-bg">背景&nbsp;<i class="fa fa-file-image-o" aria-hidden="true"></i></div>
                </picTool>
            </el-menu-item>
        </el-menu>
        <!-- 打开图片裁切页面的钩子 -->
        <!-- <div id="J-open-corp" @click="openPicHandle" class="hide"></div> -->
       
        <!-- 输入框 -->
        <el-dialog title="输入框" v-model="formDialogVisible1" size="auto" @close="closeDialog">
            <div class="layer-content clearfix">
                <div class="layer-main">
                    <input-layer :radio-json="inputJson" ref="inputLayer" :input-default="validateDefault[inputType]"></input-layer>
                    <div class="layer-main_footer">
                        <el-button @click="formDialogVisible1 = false">取 消</el-button>
                        <el-button type="primary" @click="addInputComfirm">确 定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="单选" v-model="formDialogVisible2" size="auto" @close="closeDialog">
            <div class="layer-content clearfix">
                <div class="layer-main">
                    <radio-layer ref="radioLayer" :radio-json="radioJson"></radio-layer>
                    <div class="layer-main_footer">
                        <el-button @click="closeDialog">取 消</el-button>
                        <el-button type="primary" @click="addRadioComfirm(4)">确 定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="多选" v-model="formDialogVisible3" size="auto" @close="closeDialog">
            <div class="layer-content clearfix">
                <div class="layer-main">
                    <radio-layer ref="radioLayer" :radio-json="radioJson"></radio-layer>
                    <div class="layer-main_footer">
                        <el-button @click="closeDialog">取 消</el-button>
                        <el-button type="primary" @click="addRadioComfirm(5)">确 定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="下拉框" v-model="formDialogVisible4" size="auto" @close="closeDialog">
            <div class="layer-content clearfix">
                <div class="layer-main">
                    <select-layer :radio-json="selectJson" ref="selectLayer" :select-defaults="validateDefault[selectType]"></select-layer>
                    <div class="layer-main_footer">
                        <el-button @click="closeDialog">取 消</el-button>
                        <el-button type="primary" @click="addRadioComfirm(6)">确 定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="按钮" v-model="formDialogVisible5" size="auto" @close="closeDialog">
            <div class="layer-content clearfix">
                <div class="layer-main">
                    <button-layer :radio-json="buttonJson" ref="buttonLayer"></button-layer>
                    <div class="layer-main_footer">
                        <el-button @click="closeDialog">取 消</el-button>
                        <el-button type="primary" @click="addRadioComfirm(7)">确 定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <picTool :type="'pic'" :picJson="picJson" ref="picTool" :addElement="addPicElement"></picTool>
    </div>
</template>
<script>

import bus from 'views/ishow/js/bus';
import navarJson from 'views/ishow/js/navbar/navbar.json';
import radioLayer from './radio-layer.vue';
import selectLayer from './select-layer.vue';
import buttonLayer from './button-layer.vue';
import inputLayer from './input-layer.vue';
// import picLayer from './pic-layer.vue';
// import crop from 'views/ishow/global/crop/crop.vue';
import picTool from 'views/ishow/global/picTool/index.vue';
import {
    getImgList,
    getValidateList
} from 'api/ishow';
const maxRadio = 8;
const loadingUrl = "static/loading.gif";
const initJson = {
    default:false,
    name:'',
    cname: '',
    required: false,
    dire: 'v',
    options: ['', '', ''],
    validate: []
};
const initSelectJson = {
    name:'none',
    cname: '',
    required: false,
    validate: [],
    selectedVal: 0,
    default:false,
    options: ['请选择', '请输入内容', '请输入内容', '请输入内容']
};
let initInputJson = {
    name: 'customize',
    cname: '自定义',
    required: false,
    default:false,
    validate: []
};
const initButtonJson = {
    name: '提交',
    tip: '感谢您的参与',
    link: '',
    time: '',
    noRepeat: false
};
export default {
    data() {
            return {
                activeIndex: '',
                dialogVisible: false,
                dialogVisible3:false,
                formDialogVisible1: false,
                formDialogVisible2: false,
                formDialogVisible3: false,
                formDialogVisible4: false,
                formDialogVisible5: false,
                dialogVisible2:false,
                previewPicSrc:'',
                // currentPage: 4,
                isActive: false,
                activeName: 'upload',
                navbarJson: navarJson["navbarJsons"],
                picJson: [],
                isBg:false,
                // uploadUrl: this.$store.state.app.uploadUrl,
                //单选
                radioJson: this.parseJson(initJson),
                selectJson: this.parseJson(initSelectJson),
                buttonJson: this.parseJson(initButtonJson),
                inputJson: this.parseJson(initInputJson),
                isUpdate: false,
                key: false,
                temp: [],
                validateDefault:[],
                inputType:3,
                selectType:6,
                updateId:'',
                //背景图片裁切
                crood:'',
                croodUrl:'',
                //图片裁切
                dialogVisible4:false,
                croodUrl2:'',
                cropType:''
            };
        },
        props: ['showId', 'renderJson','showJson'],
        components: {
            radioLayer,
            selectLayer,
            buttonLayer,
            inputLayer,
            picTool
            // picLayer,
            // crop
        },
        created() {
            //更新renderJson
            bus.$on('update-radio-layer', function(data, type) {
                if(this.judgeCnameExist(type,data)===true){
                    this.$message.error('中文名重复了，请修改');
                    return false;
                }
                let result = this.parseJson(data);
                this.addElement(type, {
                    form: result
                });
            }.bind(this));

            //预览图片
            bus.$on('navbar-preview', function(src) {
                this.dialogVisible2=true;
                this.previewPicSrc=src;
            }.bind(this));

            //编辑
            bus.$on('update-target', function(data,id) {
                this.updateId=id;
                this.setInput(data, true);
            }.bind(this));

            //图片关闭弹层
            bus.$on('handle-navbar-layer', function(name,isShow) {
                this[name]=isShow;
            }.bind(this));
            //背景裁切使用
            bus.$on('navbar-bg-handle', function(isShow,url) {
                this.dialogVisible3=isShow;
                console.info(url)
                this.croodUrl=url;
            }.bind(this));
            //图片裁切
            bus.$on('navbar-image-handle', function(isShow,url) {
                this.dialogVisible4=isShow;
                console.info(url)
                this.croodUrl2=url;
            }.bind(this));

            //获取图片列表
            this.fetchImgList();
            //获取验证字段
            this.fetchValidateJson();
        },
        watch: {},
        methods: {
            //打开图片选择工具
            showTool(name,cropUrl) {
                this.$refs[name].openTool(cropUrl);
            },
            
            //判断是否重命名
            judgeCnameExist(type,data) {
                let cname=[];
                let update=this.isUpdate===true;
                for (let i = 0; i < this.showJson.length; i++) {
                    let temp=this.showJson[i];
                    //编辑状态&&不是同一个id或非编辑
                    if((update&&temp.id!==this.updateId)||!update){
                        //要验证的表单&&cname一样
                        let isRepeat=temp.type>=3&&temp.type<=6&&temp.form.cname===data.cname;
                        if(isRepeat){
                            return true;
                        }
                    }
                    
                }
                return false;
            },
            fetchValidateJson() {
                getValidateList().then(response => {
                    console.info(response.data)
                    this.validateDefault=this.handleValidateDefault(response.data);
                }).catch(err => {
                    console.info(err)
                });
            },
            //转换获取的验证默认值为json
            handleValidateDefault(data) {
                let result={};
                let type,len=data.length;
                for (let i = 0; i < len; i++) {
                    result[data[i].type]=[]; 
                }
                result[this.inputType].push({
                    "cname":"自定义",
                    "name":"customize",
                    "type":this.inputType
                });
                //console.info(result)
                for (let i = 0; i < len; i++) {
                    type=data[i].type;    
                    result[type].push(data[i]);
                }

                return result;
            },
            //鼠标移入验证
            validateOut(index) {
                this.validateIndex = false;
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
            //编辑回填数据
            setInput(data, isUpdate,id) {
                let type = data.type;
                //图片
                if(type===2){
                    this.showTool('picTool');
                    //this.handleSelect('2', ['2'], true) 
                    return false;
                }
                //表单
                let temp = data.form;

                //表单部分填充编辑数据
                if (type === 3) {
                    this.inputJson = this.parseJson(temp);
                    //更新选择的验证
                    this.$refs.inputLayer.updateGroups(temp);
                }
                if (type === 4 || type === 5) {
                    this.radioJson = this.parseJson(temp);
                }
                if (type === 6) {
                    this.selectJson = this.parseJson(temp);
                }
                if (type === 7) {
                    this.buttonJson = this.parseJson(temp);
                }
                if (type >= 3 && type <= 7) {
                    let key = 3 + '-' + (type - 2);
                    let keyPath = ['3', key];
                    this.handleSelect(key, keyPath, isUpdate);
                }
            },
            //弹层确定按钮更新数据
            addElement(type, params) {
                this.dialogVisible = false;
                this.formDialogVisible1 = false;
                this.formDialogVisible2 = false;
                this.formDialogVisible3 = false;
                this.formDialogVisible4 = false;
                this.formDialogVisible5 = false;
                //编辑
                if (this.isUpdate === true) {
                    let temp = this.parseJson(this.renderJson);
                    Object.assign(temp[this.showId], params);
                    bus.$emit('update-json', temp);
                    if(type===2){
                        bus.$emit('navbar-pic-update', temp[this.showId]);
                    }
                    this.isUpdate = false;
                } else {
                    bus.$emit('add-json', type, params);
                }
                this.isBg=false;
                bus.$emit('change-tab', 'second');
            },
            closeDialog() {
                this.dialogVisible = false;
                this.formDialogVisible1 = false;
                this.formDialogVisible2 = false;
                this.formDialogVisible3 = false;
                this.formDialogVisible4 = false;
                this.formDialogVisible5 = false;
                this.isUpdate = false;
                this.isBg=false;
            },
            //限制输入框为自定义时才可修改名称，验证
            inputValChange() {
                if (this.inputJson.name !== 'customize') {
                    return false;
                }
            },
            //点击下啦打开相应的弹层
            handleSelect(key, keyPath, isUpdate) {
                //文本
                if (key === '1') {
                    this.addElement(1);
                }
                //表单
                if (keyPath[0] === '3') {
                    if (this.$refs.inputLayer && isUpdate !== true) {
                        this.$refs.inputLayer.resetGroups();
                    }
                    this.handleForm(key, isUpdate);
                }
                //编辑状态
                if (isUpdate === true) {
                    this.isUpdate = true;
                }
            },
            //处理表单
            handleForm(key, isUpdate) {
                let index = key.split('3-')[1];
                this.key = index;
                //新建重置
                if (isUpdate !== true) {
                    this.resetRadioJson(index);
                }
                //打开弹层
                this.addForm(index);
            },
            //重置json
            resetRadioJson(index) {
                if (index === "1") {
                    //输入框
                    //this.$refs.inputLayer.resetGroups();
                    this.inputJson = this.parseJson(initInputJson);
                } else if (index === "4") {
                    //下拉框
                    this.selectJson = this.parseJson(initSelectJson);
                } else if (index === "5") {
                    //按钮
                    this.buttonJson = this.parseJson(initButtonJson);
                } else {
                    //单选，多选
                    this.radioJson = this.parseJson(initJson);
                }
            },
            //添加表单
            addForm(index) {
                this['formDialogVisible' + index] = true;
            },
            //点击输入框确定
            addInputComfirm() {
                this.$refs.inputLayer.triggerApp(3);
            },
            //点击单选确定
            addRadioComfirm(type) {
                if (type === 4 || type === 5) {
                    this.$refs.radioLayer.submitForm('json',type);
                }
                if (type === 6) {
                    this.$refs.selectLayer.triggerApp(type);
                }
                if (type === 7) {
                    this.$refs.buttonLayer.triggerApp(type);
                }
            },

            //深拷贝
            parseJson(json) {
                return JSON.parse(JSON.stringify(json));
            },

            addPicElement(url) {
                this.addElement(2, {content:url});
                console.info('添加图片',url)
            },
            // addElementCrop(json) {
            //     console.info('添加裁切图片',json)
            // },
            addBg(data) {
                var json={
                    bgImage:{
                        url:data.url,
                        coord:data.crood,
                        backgroundColor:''
                    }
                };
                let tag=data.tag||'';
                let name='update-pageJson'+tag;
                bus.$emit(name,json);
                // setTimeout(function(){
                //     bus.$emit('mainShow-update-img');
                // },200);
                bus.$emit('change-tab','second');
                console.info('添加背景',json)
            }
        }
};
</script>
