<template>
    <!-- ctype,id,position,width -->
    <div class="ishow-elementWrapper" v-bind:id="showId" v-bind:ctype="type" :style="{
          top: cursorTop + 'px',
          left: cursorLeft + 'px',
          width: elWidth + 'px',
          height: elHeight + 'px',
          zIndex:zIndex,
          transform:'rotate('+rotate+'deg)'
        }">
        <!-- 各种样式 -->
        <div v-if="type===1" v-bind:style="[textJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem" v-html="content"></div>
            </div>
        </div>
        <!-- 图片 -->
        <div v-if="type===2" v-bind:style="[textJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem">
                    <img :src="content" alt="" class="ishow-elementItem_img ishow-elementItem_drap" :style="{
                    width: elWidth + 'px',
                    height: elHeight + 'px'
                  }">
                </div>
            </div>
        </div>
         <!-- 输入框 -->
        <div v-if="type===3" v-bind:style="[textJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_drap">
                    <textarea :name="json.form.name" :placeholder="json.form.cname" class="ishow-elementItem_textarea" :style="{
                    width: elWidth + 'px',
                    height: elHeight + 'px'
                  }">
                    </textarea>
                </div>
            </div>
        </div>
        <!-- 单选 -->
         <div v-if="type===4" v-bind:style="[textJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_drap ishow-elementItem_radio tl">
                    <div class="ishow-elementItem_title" v-html="json.form.cname" :style="{'background-color':json.text.themeColor}"></div>
                    <el-radio-group :class="{vertical:json.form.dire==='v'}" value='[]'>
                        <el-radio v-for="radioItem in json.form.options" :key="radioItem.id">{{radioItem}}</el-radio>
                    </el-radio-group>
                </div>
            </div>
        </div>
        <!-- 多选 -->
         <div v-if="type===5" v-bind:style="[textJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_drap ishow-elementItem_checkbox tl">
                    <div class="ishow-elementItem_title" v-html="json.form.cname" :style="{'background-color':json.text.themeColor}"></div>
                    <el-checkbox-group  :class="{vertical:json.form.dire==='v'}">
                        <el-checkbox v-for="radioItem in json.form.options" :label="radioItem.id" :key="radioItem.id">{{radioItem}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
        <!-- 下拉框 -->
         <div v-if="type===6" v-bind:style="[textJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_drap ishow-elementItem_select tl">
                    <el-select :value="json.form.options[json.form.selectedVal]" :style="{'font-size':json.text.fontSize+'px'}">
                        <el-option
                              v-for="(selectItem,selectIndex) in json.form.options"
                              :key="selectIndex"
                              :label="selectItem"
                              :value="selectIndex">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <!-- 按钮 -->
        <div v-if="type===7" v-bind:style="[textJson,modifyData]" class="ishow-elementWrapper_main">
            <div class="element-contents text-item">
                <div class="ishow-elementItem ishow-elementItem_drap ishow-elementItem_button tc">
                    <a class="ishow-elementItem_button_a" :href="json.form.link" :style="{
                    width: elWidth + 'px',
                    height: elHeight + 'px',
                    'line-height':elHeight + 'px',
                    color:json.text.color
                  }">{{json.form.name}}</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// @input="changeText"
// v-html="content"
// import bus from 'views/ishow/js/bus';
export default {
  data() {
    return {
      json: this.parseJson(this.childJson),
      showId: 0,
      textJson: '',
      cursorTop: 0,
      cursorLeft: 0,
      modifyData: {},
      content: this.childJson.content,
      elWidth: this.childJson.width,
      elHeight: this.childJson.height,
      zIndex: this.childJson.zIndex,
      isActive: false,
      isEditable: false,
      lastRange: '',
      caretPos: 0,
      rotate: 0
    }
  },
  props: ['childJson', 'showJson', 'type'],
  created() {
            // 设置showId
            // bus.$on('drap-size-update', function (w,h,t,l) {
            //     this.elWidth=w;
            //     this.elHeight=h;
            //     this.cursorTop=t;
            //     this.cursorLeft=l;
            // }.bind(this));
  },
  mounted() {
    this.initJson();
  },
  watch: {
    childJson: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.initJson();
        }
      },
      deep: true
    }
  },

  methods: {
            // 初始化
    initJson() {
      this.json = JSON.parse(JSON.stringify(this.childJson));
      this.showId = this.json.id;
      this.modifyJson();
      this.textJson = this.json.text;
      this.cursorTop = this.json.position.top;
      this.cursorLeft = this.json.position.left;
      this.zIndex = this.json.zIndex;
      this.elWidth = this.json.width;
      this.elHeight = this.json.height;
      this.content = this.json.content;
      this.rotate = this.textJson.rotate;
    },
            // 修正样式值
    modifyJson() {
      this.modifyData.opacity = this.json.text.opacity * 0.01;
      this.modifyData.boxShadow = this.handleShadowDire();
      for (const val in this.json.text) {
        if (val === 'fontSize' || val === 'padding' || val === 'borderWidth' || val === 'borderRadius') {
          this.modifyData[val] = this.json.text[val] + 'px';
        }
      }
    },
            // 处理阴影方向值
    handleShadowDire() {
      const width = this.json.text.shadowWidth;
      if (!width) {
        return 'none';
      }
      const arr = [
                    [1, -1],
                    [-1, -1],
                    [-1, 1],
                    [1, 1]
      ];
      const result = [];
      const dire = this.json.text.shadowDire;

      const arrVal = [
                    [0, width],
                    [width, 0],
                    [0, -width],
                    [-width, 0]
      ];
      const angle = 90 / width;
      let index = Math.floor(dire / 90);
      const count = Math.floor(dire % 90 / angle);
      if (index === 4) {
        index = 0;
      }
      result[0] = arrVal[index][0] + arr[index][0] * count;
      result[1] = arrVal[index][1] + arr[index][1] * count;
      return this.json.text.shadowColor + ' ' + result[0] + 'px ' + result[1] + 'px ' + this.json.text.shadowRadius + 'px';
    },
            // 转换showJson to renderJson
    converJson(data) {
      const result = {};
      for (let i = 0; i < data.length; i++) {
        result[data[i].id] = data[i];
      }
      return result;
    },
            // 深拷贝
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
            // json是否相等
    jsonEq(val1, val2) {
      return JSON.stringify(val1) === JSON.stringify(val2);
    },
            // 同步this.content
    changeText() {
      this.content = this.$el.querySelector('.ishow-elementItem').innerHTML;
    }

  }
};
</script>
