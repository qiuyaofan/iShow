<template>
    <div class="layer-main_content">
        <div class="layer-main_box v-scrollBox form-list">
            <el-form ref="json" :model="json">
                <div class="form-group ml100">
                    <div>下拉框默认字段</div>
                    <div>
                        <el-radio-group v-model="json.name" @change="inputChange">
                            <el-radio class="radio" :label="'none'">无</el-radio>
                            <el-radio class="radio" v-for="item in selectDefaults" :label="item.name" :key="item.id">{{item.cname}}</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <!-- 下拉框 -->
                <div class="form-group ml100">
                    <div>选择默认选项</div>
                    <div>
                        <div class="form-item w460">
                             <el-select v-model="json.selectedVal" placeholder="请选择" class="wp100">
                                <el-option
                                  v-for="(selectItem,selectIndex) in json.options"
                                  :key="selectIndex"
                                  :label="selectItem"
                                  :value="selectIndex">
                                </el-option>
                              </el-select>
                        </div>
                        <div class="form-item ml10">
                            <el-checkbox v-model="json.required" label="required">必填</el-checkbox>
                        </div>
                    </div>
                </div>
                <div class="form-group ml100">
                    <div>空选项（每个选项最多请不要超过41字）</div>
                    <div>
                        <div class="form-item w460">
                             <el-form-item 
                            prop="options.0"
                            :rules="[
                              { required: true, message: '空选项不能为空', trigger: 'blur' }
                            ]"
                            >
                           <!--  <div class="form-textarea mb10 pr" v-for="(radioItem, index) in json.options" v-if="index===0"> -->
                                <el-input type="textarea" :placeholder="'请选择'" :value="json.options[0]" :maxlength="41" v-model="json.options[0]"></el-input>
                            <!-- </div> -->
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div class="form-group ml100">
                    <div>其他选项（每个选项最多请不要超过41字）</div>
                    <div>
                        <div class="form-item w460">
                            <el-form-item 
                            v-if="index!==0"
                            v-for="(radioItem, index) in json.options"
                            :key="index"
                            :prop="'options.'+index"
                            :rules="[
                              { required: true, message: '选项'+index+'不能为空', trigger: 'blur' }
                            ]"
                            >
                                <div class="form-textarea mb10 pr">
                                    <el-input type="textarea" :value="radioItem" :maxlength="41" :key="radioItem.id" @change="updateRadioJson(index,$event)" v-model="json.options[index]"></el-input>
                                    <div class="vertical-icon">
                                        <i class="fa fa-arrow-up" aria-hidden="true" @click="moveRadioJson(index-1,index)"></i>
                                        <i class="fa fa-arrow-down" aria-hidden="true" @click="moveRadioJson(index,index+1)"></i>
                                    </div>
                                    <div class="vertical-button">
                                        <el-button type="success" icon="plus" size="mini" @click="addRadioJson(index)">添加</el-button>
                                        <el-button type="danger" icon="delete" size="mini" @click="deleteRadioJson(index)">删除</el-button>
                                    </div>
                                </div>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
    
</template>
<script>
import bus from 'views/ishow/js/bus';
import navarJson from 'views/ishow/js/navbar/navbar.json';
const maxRadio = 8;

export default {
    data() {
            return {
                // radioOptions: [],
                // radioValidate: false,
                json:this.parseJson(this.radioJson),
                emptyLabel:'请选择',
                selectOptions:this.parseJson(navarJson.selectDefaults)
                // selectDefaultVal:0
            };
        },
        props: ['radioJson','selectDefaults'],
        created() {
            this.setInput();
            // bus.$on('trigger-radio-layer', function(type) {
            //     if(type===6){
            //         this.triggerApp(type);
            //     }
                
            // }.bind(this));
            // console.info(this.selectDefaults)
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
            inputChange(value) {
                let temp = this.selectDefaults;
                if(value==='none'){
                    this.setInput();
                    return false;
                }
                for (let i = 0, len = temp.length; i < len; i++) {
                    let target=temp[i];
                    let name=target.name;
                    if (name === value) {
                        this.json.cname = target.cname;
                        this.json.options=this.selectOptions[name];
                        this.json.default=true;
                        console.info(this.json)
                        return false;
                    }
                }
            },
            setInput() {
                this.json=this.parseJson(this.radioJson);
            },
            //深拷贝
            parseJson(json) {
                return JSON.parse(JSON.stringify(json));
            },
            //添加选项
            addRadioJson(index) {
                this.json.options.splice(index + 1, 0, "请输入内容");
                setTimeout(function() {
                    this.scrollPos(index + 1);
                }.bind(this), 0)

            },
            //删除选项
            deleteRadioJson(index) {
                this.json.options.splice(index, 1);
            },
            //修改选项值
            updateRadioJson(index, $event) {
                this.json.options.splice(index, 1, $event);
            },
            moveRadioJson(start, end) {
                if (start < 0 || end > this.json.options.length - 1) {
                    return false;
                }
                let json = this.parseJson(this.json.options);
                let temp = json[start];
                json[start] = json[end];
                json[end] = temp;
                this.json.options = json;
            },
            
            //滚动到底部
            scrollPos(index) {
                let box = this.$el.querySelector('.v-scrollBox');
                let target = box.getElementsByClassName('form-textarea')[index-1];
                let top = target.offsetTop + target.offsetHeight - box.offsetTop - box.offsetHeight;
                box.scrollTop = top < 0 ? 0 : top;
            },
            submitForm(formName,type) {
                console.info(this)
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    this.triggerApp(type);
                  } else {
                    return false;
                  }
                });
            },
            //同步父元素
            triggerApp(type) {
                this.$parent.$parent.confirmForm(this.json,type);
                //bus.$emit('update-radio-layer',this.json,type);
            }

        }
};
</script>
