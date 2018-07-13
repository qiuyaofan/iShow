<template>
    <div class="normal-style">
        <div class="form-group" v-if="ctype===1||ctype===3">
            <label>文字内容</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-input type="textarea" class placeholder="请输入内容" v-model="content" @change="addHistroy" @focus="contentChange(true)" @blur="contentChange(false)"></el-input>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===2">
            <div class="ishow-editorImg" :style="{ 'background-image': 'url(' + content + ')' }"></div>
            <div class="mt10 tc">
                <el-button size="small" type="primary" @click="updateImg"><i class="fa fa-refresh mr10" aria-hidden="true"></i>修改图片</el-button>
                <el-button size="small" type="default" @click="openCrop"><i class="fa fa-scissors mr10" aria-hidden="true"></i>裁切图片</el-button>
            </div>
        </div>
        <div class="form-group" v-if="ctype>=3&&ctype<=6">
            <label>主题色</label>
            <div class="clearfix">
                <div class="form-center w35">
                    <el-color-picker v-model="themeColorInput" show-alpha @change="addHistroy"></el-color-picker>
                </div>
                <div class="form-right w140">
                    <el-input v-model="themeColorInput" placeholder=""></el-input>
                </div>
            </div>
            <div>
                <el-button class="ishow-editorBtn" size="small" @click="changeThemecolorAll">主题色应用到所有表单</el-button>
            </div>
        </div>
        <div class="form-group">
            <label>背景颜色</label>
            <div class="clearfix">
                <div class="form-center w35">
                    <el-color-picker v-model="bgColorInput" show-alpha @change="addHistroy"></el-color-picker>
                </div>
                <div class="form-right w140">
                    <el-input v-model="bgColorInput" placeholder=""></el-input>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1||ctype===3||ctype===7">
            <label>文字颜色</label>
            <div class="clearfix">
                <div class="form-center w35">
                    <el-color-picker v-model="textColorInput" show-alpha @change="addHistroy"></el-color-picker>
                </div>
                <div class="form-right w140">
                    <el-input v-model="textColorInput" placeholder=""></el-input>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1">
            <label>字体</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-select v-model="fontFamily" placeholder="请选择" @change="addHistroy">
                        <el-option v-for="(item, index) in familyOptions" :label="item.label" :value="item.value" :disabled="item.disabled" :key="index">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1">
            <label>对齐方式</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-select v-model="textAlign" placeholder="请选择" @change="addHistroy">
                        <el-option v-for="(item, index) in textAlignOptions" :label="item.label" :value="item.value" :disabled="item.disabled" :key="index">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>透明度</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="valueOpacity" show-input @change="addHistroy">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype!==7">
            <label>边距</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="valuePadding" :max="valuePaddingMax" show-input @change="addHistroy">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1">
            <label>行高</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="valueLineH" :max="valueLineHMAx" show-input @change="addHistroy">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1||ctype===6||ctype===7">
            <label>大小</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="fontSize" :max="fontSizeMAx" show-input @change="addHistroy">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>旋转角度</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="rotate" :max="rotateMax" show-input @change="addHistroy">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1">
            <el-tooltip class="bold" effect="dark" content="加粗" placement="bottom">
                <el-button :class="{ active: boldActive }" @click="toggleActive('boldActive','fontWeight','bolder','normal')">B</el-button>
            </el-tooltip>
            <el-tooltip class="italic" effect="dark" content="斜体" placement="bottom">
                <el-button :class="{ active: italicActive }" @click="toggleActive('italicActive','fontStyle','italic','normal')">I</el-button>
            </el-tooltip>
            <el-tooltip class="underline" effect="dark" content="下划线" placement="bottom">
                <el-button :class="{ active: underlineActive }" @click="toggleActive('underlineActive','textDecoration','underline','none')">U</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="清除格式" placement="bottom">
                <el-button @click="resetStyle"><i class="el-icon-delete"></i></el-button>
            </el-tooltip>
        </div>
        
    </div>
</template>
<script>
// import mainEditor from './main-editor.vue';
import bus from 'views/ishow/js/bus';
export default {
  data() {
    return {
      boldActive: false,
      italicActive: false,
      underlineActive: false,
      id: this.showId,
      ctype: '',
      json: {},
      content: '',
      bgColorInput: '',
      textColorInput: '',
      valueOpacity: 1,
      valuePadding: 0,
      fontSize: 0,
      fontFamily: '',
      valueLineH: 1,
      textAlign: '',
      rotate: 0,
      themeColorInput: '',
      valueLineHMAx: 3,
      valuePaddingMax: 20,
      fontSizeMAx: 100,
      rotateMax: 360,
      familyOptions: [{
        value: 'none',
        label: '默认字体'
      }, {
        value: 'Microsoft YaHei',
        label: '微软雅黑'

      }, {
        value: 'HT',
        label: '黑体'
      }],

      textAlignOptions: [{
        value: 'left',
        label: '居左'
      }, {
        value: 'center',
        label: '居中'

      }, {
        value: 'right',
        label: '居右'
      }]
    }
  },
  props: ['renderJson', 'showId'],
  created() {
    this.json = this.parseJson(this.renderJson);
    this.setInput();

    bus.$on('navbar-pic-update', data => {
      this.content = data.content;
    });
  },
  watch: {
    content() {
      this.json[this.id].content = this.content.replace(/\n/g, '<br>');
      this.triggerApp();
    },
    bgColorInput() {
      this.json[this.id].text.backgroundColor = this.bgColorInput;
      this.triggerApp();
    },
    textColorInput() {
      this.json[this.id].text.color = this.textColorInput;
      this.triggerApp();
    },
    valueOpacity() {
      this.json[this.id].text.opacity = this.valueOpacity;
      this.triggerApp();
    },
    valuePadding() {
      this.json[this.id].text.padding = this.valuePadding;
      this.triggerApp();
    },
    valueLineH() {
      this.json[this.id].text.lineHeight = this.valueLineH;
      this.triggerApp();
    },
    fontFamily() {
      this.json[this.id].text.fontFamily = this.fontFamily;
      this.triggerApp();
    },
    fontSize() {
      this.json[this.id].text.fontSize = this.fontSize;
      this.triggerApp();
    },
    textAlign() {
      this.json[this.id].text.textAlign = this.textAlign;
      this.triggerApp();
    },
    rotate() {
      this.json[this.id].text.rotate = this.rotate;
      this.triggerApp();
    },
    renderJson() {
      this.json = this.parseJson(this.renderJson);
    },
    showId() {
      this.id = this.showId;
      this.setInput();
    },
    themeColorInput(val) {
      this.json[this.id].text.borderColor = val;
      this.json[this.id].text.themeColor = val;
      this.triggerApp();
    }
  },
  methods: {
    openCrop() {
      bus.$emit('navbar-image-crop', true, this.content);
    },
    // // 确定裁切图片
    // setPicCorp() {
    //   this.dialogVisible3 = false;
    //   // 如果有提交，加上提交裁切数据到后台返回裁切后的图片路径，传给更新图片url,例如如下：
    //  //   this.croodUrl=post(this.croodUrl,this.crood);
    //   this.$emit('update-crop-pic', this.croodUrl);
    //   console.info(this.croodUrl, this.crood)
    // },
    // // 获取裁切数据
    // afterCrop(json, url) {
    //   this.crood = json;
    //   this.croodUrl = url;
    //   console.info('afterCrop', json, url)
    // },
    // 更改图片
    updateImg() {
      bus.$emit('update-target', this.json[this.id], this.id);
    },
    // 应用所有表单以主题色
    changeThemecolorAll() {
      bus.$emit('update-themecolor', this.json[this.id].text.themeColor);
    },
    // 调整高度为auto
    contentChange(isFocus) {
      bus.$emit('show-text-resize', isFocus);
    },
    // 添加历史
    addHistroy() {
      bus.$emit('add-histroy');
    },
    triggerApp() {
      bus.$emit('update-json', this.json);
    },
    toggleActive(active, jsonKey, value, isDefault) {
      if (this[active]) {
        this[active] = false;
        this.json[this.id].text[jsonKey] = isDefault;
      } else {
        this[active] = true;
        this.json[this.id].text[jsonKey] = value;
      }
      this.addHistroy();
      bus.$emit('update-json', this.json);
    },
    setInput() {
      const json = this.renderJson[this.showId];
      const text = json.text;
      this.ctype = json.type;
      this.bgColorInput = text.backgroundColor;
      this.valueOpacity = text.opacity;
      this.valuePadding = text.padding;
      this.themeColorInput = text.themeColor;
      if (this.ctype === 1) {
        this.fontFamily = text.fontFamily;
        this.valueLineH = text.lineHeight;
        this.textAlign = text.textAlign;
        this.boldActive = text.fontWeight === 'bolder';
        this.italicActive = text.fontStyle === 'italic';
        this.underlineActive = text.textDecoration === 'underline';
      }
      if (this.ctype === 1 || this.ctype === 6 || this.ctype === 7) {
        this.fontSize = text.fontSize;
      }
      if (this.ctype === 1 || this.ctype === 3 || this.ctype === 7) {
        this.textColorInput = text.color;
        this.content = json.content.replace(/<br>/g, '\n');
      }
      if (this.ctype === 2) {
        this.content = json.content;
      }
      if (this.ctype === 2) {
        this.rotate = text.rotate;
      }
    },
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
    resetStyle() {
      bus.$emit('reset-json');
    }
  }
};
</script>
