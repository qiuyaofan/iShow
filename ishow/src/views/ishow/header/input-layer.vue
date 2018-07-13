<template>
    <div class="layer-main_content">
        <div class="layer-main_box form-list">
            <div class="form-group ml100">
                <div>
                    <label>输入框名称</label>
                    <div class="form-item w350">
                        <el-input class :placeholder="radioJson.cname" v-model="radioJson.cname" :disabled="radioJson.name!='customize'"></el-input>
                    </div>
                    <div class="form-item ml10">
                        <el-checkbox v-model="radioJson.required" label="required">必填</el-checkbox>
                    </div>
                </div>
                <div>
                    <el-radio-group v-model="radioJson.name" @change="inputChange">
                       <!--  <el-radio class="radio" :label="'customize'">自定义</el-radio> -->
                        <el-radio class="radio" v-for="item in inputDefault" :label="item.name" :key="item.id">{{item.id}}{{item.cname}}</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <!-- 配置验证规则 -->
            <div class="form-group ml100" v-if="radioJson.name==='customize'">
                <div>配置验证规则</div>
                <el-checkbox-group v-model="validateGroup">
                    <span v-for="(item,index) in validateDefault" :key="index" @mouseover.stop="validateIn(index)" class="inline-b pr" @click.stop>
                        <!-- 循环遍历出验证配置 -->
                        <el-checkbox :label="item.name" :key="item.id" >
                            <span v-if="inputRange[item.name+'Min']||inputRange[item.name+'Max']">{{item.label+'（'+inputRange[item.name+'Min']+'-'+inputRange[item.name+'Max']+'）'}}</span>
                    <span v-else>{{item.label}}</span>
                    </el-checkbox>
                    <div v-if="item.range===true&&index===validateIndex" @mouseover.stop="validateIn(index)" class="ishow-navbarMain_validate">
                        <el-col :span="11">
                            <el-input v-model="inputRange[item.name+'Min']" placeholder="最小值" size="mini"></el-input>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-input v-model="inputRange[item.name+'Max']" placeholder="最大值" size="mini"></el-input>
                        </el-col>
                    </div>
                    </span>
                </el-checkbox-group>
            </div>
        </div>
    </div>
</template>
<script>
// import bus from 'views/ishow/js/bus';
import navarJson from 'views/ishow/js/navbar/navbar.json';

export default {
  data() {
    return {
      json: this.parseJson(this.radioJson),
             // input输入框--默认选中第0个
            // inputDefaultJson: navarJson["inputDefault"],
      validateDefault: navarJson.validateDefault,
      validateGroup: [],
      validateIndex: false,
      isUpdate: false,
      inputRange: {
        validateStringMin: '',
        validateStringMax: '',
        numberMin: '',
        numberMax: ''
      }
    };
  },
  props: ['radioJson', 'inputDefault'],
  created() {
    this.setInput();
  },
  watch: {
    radioJson: {
      handler() {
        this.setInput();
      },
      deep: true
    }
  },
  methods: {
    setInput() {
      this.json = this.parseJson(this.radioJson);
    },
    updateGroups(temp) {
      this.isUpdate = true;
      const result = [];
      for (let i = 0; i < temp.validate.length; i++) {
        result.push(temp.validate[i].name);
      }
      this.validateGroup = this.parseJson(result);
    },
    resetGroups() {
      this.validateGroup = [];
    },
        // 深拷贝
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
        // 修改输入框
    inputChange(value) {
      if (this.isUpdate !== true || value !== 'customize') {
        this.getLabel(value);
      }
      if (value === 'customize') {
        this.radioJson.default = false;
      } else {
        this.radioJson.default = true;
      }
      this.isUpdate = false;
    },
        // 获取名字
    getLabel(value) {
      const temp = this.inputDefault;
      for (let i = 0, len = temp.length; i < len; i++) {
        if (temp[i].name === value) {
                    // this.inputVal = temp[i].label;
          this.radioJson.name = temp[i].name;
          this.radioJson.cname = temp[i].cname;
          return false;
        }
      }
    },

        // 鼠标移出
    validateIn(index) {
      this.validateIndex = index;
    },
        // 同步父元素
        // triggerApp(type) {
        //     bus.$emit('update-radio-layer',this.json,type);
        // },
    triggerApp(type) {
            // 添加验证规则
      const validateGroup = this.parseJson(this.validateGroup);
      let temp = {}, rangeMin, rangeMax;
      const result = [];
      const json = this.parseJson(this.radioJson);
      for (let i = 0; i < validateGroup.length; i++) {
        temp = {};
        rangeMin = this.inputRange[validateGroup[i] + 'Min'];
        rangeMax = this.inputRange[validateGroup[i] + 'Max'];
        temp.name = validateGroup[i];
        temp.range = rangeMax || rangeMin ? rangeMin + ',' + rangeMax : false;
        result.push(temp);
      }
      json.validate = result;
      this.$parent.$parent.confirmForm(json, type);
           // bus.$emit('update-radio-layer',json,type);
    }

  }
};
</script>
