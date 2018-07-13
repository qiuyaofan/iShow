<template>
    <div class="border-style">
        <div class="form-group">
            <label>边框宽度</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="borderWidth" :max="borderWidthMax" show-input @change="addHistroy">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype<3||ctype>6">
            <label>边框颜色</label>
            <div class="clearfix">
                <div class="form-center w35">
                    <el-color-picker v-model="borderColorInput" show-alpha @change="addHistroy"></el-color-picker>
                </div>
                <div class="form-right w140">
                    <el-input v-model="borderColorInput" placeholder=""></el-input>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>边框类型</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-select v-model="borderStyle" placeholder="请选择" @change="addHistroy">
                        <el-option v-for="(item, index) in borderStyleOptions" :label="item.label" :value="item.value" :disabled="item.disabled" :key="index">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>边框圆角</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="borderRadius" :max="borderRadiusMax" show-input @change="addHistroy">
                    </el-slider>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import bus from 'views/ishow/js/bus';
export default {
  data() {
    return {
      ctype: '',
      json: {},
      id: this.showId,
      borderWidth: 0,
      borderRadius: 0,
      borderColorInput: '',
      borderStyle: '',
      borderRadiusMax: 20,
      borderWidthMax: 20,
      borderStyleOptions: [{
        value: 'none',
        label: '--无--'
      }, {
        value: 'solid',
        label: '直线'

      }, {
        value: 'dashed',
        label: '虚线'
      }, {
        value: 'dotted',
        label: '点状线'
      }, {
        value: 'double',
        label: '双划线'
      }, {
        value: 'groove',
        label: '3D凹槽'
      }, {
        value: 'ridge',
        label: '3D垄状'
      }, {
        value: 'inset',
        label: '3D内嵌'
      }, {
        value: 'outset',
        label: '3D外嵌'
      }]

    };
  },
  props: ['renderJson', 'showId'],
  created() {
    this.json = this.parseJson(this.renderJson);
    this.setInput();
  },
  watch: {
    showId() {
      this.id = this.showId;
      this.setInput();
    },
    renderJson() {
      this.json = this.parseJson(this.renderJson);
    },
    borderWidth() {
      this.json[this.id].text.borderWidth = this.borderWidth;
      this.triggerApp();
    },
    borderRadius() {
      this.json[this.id].text.borderRadius = this.borderRadius;
      this.triggerApp();
    },
    borderColorInput() {
      this.json[this.id].text.borderColor = this.borderColorInput;
                // this.addHistroy();
      this.triggerApp();
    },
    borderStyle() {
      this.json[this.id].text.borderStyle = this.borderStyle;
                // this.addHistroy();
      this.triggerApp();
    }
  },
  methods: {
            // 触发历史纪录
    addHistroy() {
      bus.$emit('add-histroy');
    },
    triggerApp() {
      bus.$emit('update-json', this.json);
    },
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
    setInput() {
      const json = this.renderJson[this.showId];
      this.ctype = json.type;
      this.borderWidth = json.text.borderWidth;
      this.borderRadius = json.text.borderRadius;
      this.borderColorInput = json.text.borderColor;
      this.borderStyle = json.text.borderStyle;
      this.borderRadiusMax = json.text.width;
    }
  }
};
</script>
