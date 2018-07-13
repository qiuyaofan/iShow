<template>
    <div class="layer-main_content">
        <div class="layer-main_box v-scrollBox form-list">
            <el-form ref="json" :model="json">
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
                            <el-form-item 
                            prop="cname"
                            :rules="[
                              { required: true, message: '标题名称不能为空', trigger: 'blur' }
                            ]"
                            >
                                <el-input type="textarea" class="form-textarea" placeholder="请填写标题" v-model="json.cname"></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item ml10">
                            <el-checkbox v-model="json.required" label="required">必填</el-checkbox>
                        </div>
                    </div>
                </div>
                <div class="form-group ml100">
                    <div>选项（您可以添加八个选项，每个选项最多请不要超过41字）</div>
                    <div>
                        <div class="form-item w460">
                            <el-form-item 
                            v-for="(radioItem, index) in json.options"
                            :key="index"
                            :prop="'options.'+index"
                            :rules="[
                              { required: true, message: '选项'+(index+1)+'不能为空', trigger: 'blur' }
                            ]"
                            >
                                <div class="form-textarea mb10 pr" >
                                        <el-input type="textarea" :placeholder="'选项'+(index+1)" :value="radioItem" :maxlength="41" :key="index" @change="updateRadioJson(index,$event)" v-model="json.options[index]"></el-input>
                                    
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
                <!-- <el-button type="primary" @click.native="submitForm('json')">立即创建</el-button> -->
            </el-form>
        </div>
    </div>
    
</template>
<script>
import bus from 'views/ishow/js/bus';
const maxRadio = 8;
const optionsRule = [{
  required: true, message: '选项不能为空', trigger: 'blur'
}];
export default {
  data() {
    return {
      json: this.parseJson(this.radioJson),
      emptyLabel: '请选择',
      selectDefaultVal: 0
    };
  },
  props: ['radioJson'],
  created() {
    this.setInput();
            // this.$set(this.temp,"jobs",22);
    console.info(this.json)
  },
  watch: {
    radioJson: {
      handler(val) {
        this.setInput();
      },
      deep: true
    }
  },
  methods: {
    setInput() {
      this.json = this.parseJson(this.radioJson);
    },
            // 深拷贝
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
            // 添加选项
    addRadioJson(index) {
      if (this.json.options.length >= maxRadio) {
        return false;
      }
      this.json.options.splice(index + 1, 0, '');
      setTimeout(() => {
        this.scrollPos(index + 2);
      }, 0)
    },
            // 删除选项
    deleteRadioJson(index) {
      this.json.options.splice(index, 1);
    },
            // 修改选项值
    updateRadioJson(index, $event) {
      this.json.options.splice(index, 1, $event);
    },
    moveRadioJson(start, end) {
      if (start < 0 || end > this.json.options.length - 1) {
        return false;
      }
      const json = this.parseJson(this.json.options);
      const temp = json[start];
      json[start] = json[end];
      json[end] = temp;
      this.json.options = json;
    },

            // 滚动到底部
    scrollPos(index) {
      const box = this.$el.querySelector('.v-scrollBox');
      const target = box.getElementsByClassName('form-textarea')[index];
      const top = target.offsetTop + target.offsetHeight - box.offsetTop - box.offsetHeight;
      box.scrollTop = top < 0 ? 0 : top;
    },
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.triggerApp(type);
        } else {
          return false;
        }
      });
    },
            // 同步父元素
    triggerApp(type) {
      this.$parent.$parent.confirmForm(this.json, type);
               // bus.$emit('update-radio-layer',this.json,type);
    }

  }
};
</script>
