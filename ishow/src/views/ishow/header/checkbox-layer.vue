<template>
    <div class="layer-main_content">
        <div class="layer-main_box v-scrollBox form-list">
            <!-- 单选 -->
            <div class="form-group ml100">
                <label>方向</label>
                <div class="form-item w460">
                    <el-radio-group v-model="json.dire">
                        <el-radio class="radio" :label="'v'">纵向</el-radio>
                        <el-radio class="radio" :label="'h'">横向</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="form-group ml100">
                <div>标题</div>
                <div>
                    <div class="form-item w460">
                        <el-input type="textarea" class="form-textarea" placeholder="请填写标题" v-model="json.cname"></el-input>
                    </div>
                    <div class="form-item ml10">
                        <el-checkbox v-model="this.json.required" label="required">必填</el-checkbox>
                    </div>
                </div>
            </div>
            <div class="form-group ml100">
                <div>选项（您可以添加八个选项，每个选项最多请不要超过41字）</div>
                <div>
                    <div class="form-item w460">
                        <div class="form-textarea mb10 pr" v-for="(radioItem, index) in json.options">
                            <el-input type="textarea" :placeholder="'选项'+(index+1)" :value="radioItem" :maxlength="41" :key="radioItem.id" @change="updateRadioJson(index,$event)"></el-input>
                            <div class="vertical-icon">
                                <i class="fa fa-arrow-up" aria-hidden="true" @click="moveRadioJson(index-1,index)"></i>
                                <i class="fa fa-arrow-down" aria-hidden="true" @click="moveRadioJson(index,index+1)"></i>
                            </div>
                            <div class="vertical-button">
                                <el-button type="success" icon="plus" size="mini" @click="addRadioJson(index)">添加</el-button>
                                <el-button type="danger" icon="delete" size="mini" @click="deleteRadioJson(index)">删除</el-button>
                            </div>
                        </div>
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
                json:this.parseJson(this.radioJson),
                emptyLabel:'请选择',
                selectDefaultVal:0
            };
        },
        props: ['radioJson'],
        created() {
            this.setInput();
            // bus.$on('trigger-radio-layer', function(type) {
            //     if(type===5||type===4){
            //         this.triggerApp(type);
            //     }
            // }.bind(this));
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
            //添加选项
            addRadioJson(index) {
                if (this.json.options.length >= maxRadio) {
                    return false;
                }
                this.json.options.splice(index + 1, 0, "");
                setTimeout(function() {
                    this.scrollPos(index + 2);
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
                let target = box.getElementsByClassName('form-textarea')[index];
                let top = target.offsetTop + target.offsetHeight - box.offsetTop - box.offsetHeight;
                box.scrollTop = top < 0 ? 0 : top;
            },
            //同步父元素
            triggerApp(type) {
                this.$parent.$parent.confirmForm(this.json,type);
                //bus.$emit('update-radio-layer',this.json,type);
            }

        }
};
</script>
