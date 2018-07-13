<template>
    <div>
        <div class="form-group">
            <label>动画</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-select v-model="animateSelect" placeholder="请选择" @change="animateNameChange">
                        <el-option label="无" value="">
                        </el-option>
                        <el-option-group v-for="(group, index2) in animateOptions" :label="group.label" :key="index2" v-if="(ctype===1&&group.label==='特殊')||group.label!=='特殊'">
                            <el-option v-for="(item, index3) in group.options" :label="item.label" :value="item.value" :disabled="item.disabled" :key="index3">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="isDire">
            <label>方向</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-select v-model="direName" placeholder="请选择" @change="animateNameChange">
                        <el-option v-for="(item, index) in direOptions" :label="item.label" :value="item.value" :disabled="item.disabled" :key="index">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="animateName">
            <label v-if="isTypewriter">间隔时间</label>
            <label v-else>时长</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="time" :max="timeMax" show-input @change="timeChange">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="animateName">
            <label>延时</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="delay" :max="delayMax" show-input @change="delayChange">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>次数</label>
            <div class="clearfix">
                <div class="form-center mr10">
                    <el-input-number size="small" v-model="animateCount"></el-input-number>
                </div>
                <div><el-checkbox v-model="isInfinite" @change="changeInfinite">循环播放</el-checkbox></div>
            </div>
        </div>
    </div>
    
</template>
<script>
import bus from 'views/ishow/js/bus';
export default {
  data() {
    return {
      activeNames: 'ani1',
      animateJson: '',
      animateName: '',
      animateCount: 1,
      jsonAnimateCount: 1,
      isInfinite: false,
      animateSelect: '',
      json: '',
      id: this.showId,
      isDire: false,
      direName: 'Right',
      hasDireOptions: {},
      animateOptions: [{
        label: '进入',
        options: [{
          value: 'fadeIn',
          label: '淡入',
          dire: false
        }, {
          value: 'fadeIn-dire',
          label: '移入',
          dire: true
        }, {
          value: 'bounceIn-dire',
          label: '弹入',
          dire: true
        }, {
          value: 'flipInY',
          label: '翻转进入',
          dire: false
        }, {
          value: 'bounceIn',
          label: '中心弹入',
          dire: false
        }, {
          value: 'zoomIn',
          label: '中心放大'
        }, {
          value: 'rollIn-dire',
          label: '翻滚进入',
          dire: true
        }, {
          value: 'flipInX',
          label: '翻开进入',
          dire: false
        }, {
          value: 'lightSpeedIn-dire',
          label: '光速进入',
          dire: true
        }, {
          value: 'twisterInDown-dire',
          label: '魔幻进入',
          dire: true
        }, {
          value: 'puffIn',
          label: '缩小进入',
          dire: false
        }, {
          value: 'twisterInUp-dire',
          label: '旋转进入',
          dire: true
        }]
      }, {
        label: '强调',
        options: [{
          value: 'wobble',
          label: '摇摆',
          dire: false
        }, {
          value: 'rubberBand',
          label: '抖动',
          dire: false
        }, {
          value: 'rotateIn',
          label: '旋转',
          dire: false
        }, {
          value: 'flip',
          label: '翻转',
          dire: false
        }, {
          value: 'swing',
          label: '悬摆',
          dire: false
        }, {
          value: 'flash',
          label: '闪烁',
          dire: false
        }, {
          value: 'tada',
          label: '放大抖动',
          dire: false
        }, {
          value: 'jello',
          label: '倾斜摆动',
          dire: false
        }, {
          value: 'slideDown',
          label: '下滑',
          dire: false
        }, {
          value: 'slideUp',
          label: '上滑',
          dire: false
        }]
      }, {
        label: '退出',
        options: [{
          value: 'fadeOut',
          label: '淡出',
          dire: false
        }, {
          value: 'fadeOut-dire',
          label: '移出',
          dire: true
        }, {
          value: 'bounceOut-dire',
          label: '弹出',
          dire: true
        }, {
          value: 'flipOutY',
          label: '翻转消失',
          dire: false
        }, {
          value: 'bounceOut',
          label: '中心消失',
          dire: false
        }, {
          value: 'zoomOut',
          label: '中心缩小',
          dire: false
        }, {
          value: 'rollOut-dire',
          label: '翻滚退出',
          dire: true
        }, {
          value: 'flipOutX',
          label: '翻开消失',
          dire: false
        }, {
          value: 'lightSpeedOut-dire',
          label: '光速退出',
          dire: true
        }, {
          value: 'puffOut',
          label: '放大退出',
          dire: false
        }, {
          value: 'hingeRight-dire',
          label: '悬挂脱落',
          dire: true
        }]
      }, {
        label: '特殊',
        options: [{
          value: 'j-typewriter',
          label: '打字机',
          dire: false
        }]
      }],
      direOptions: [{
        label: '从左到右',
        value: 'Right'
      }, {
        label: '从上到下',
        value: 'Down'
      }, {
        label: '从右到左',
        value: 'Left'
      }, {
        label: '从下到上',
        value: 'Up'
      }],
      time: 1,
      timeOld: 1,
      delay: 0,
      delayOld: 0,
      timeMax: 20,
      delayMax: 20,
      idChange: false,
      isTypewriter: false,
      ctype: false
    };
  },
  props: ['renderJson', 'showId', 'aniJson', 'aniIndex'],
  created() {
    this.json = this.parseJson(this.renderJson);
    this.getDireOptions();
    this.setInput();
  },
  watch: {
    animateCount(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      console.info('animateCount', val)
      this.jsonAnimateCount = val || 1;
    },
    jsonAnimateCount(val) {
      this.json[this.id].animate[this.aniIndex].animationIterationCount = val;
      this.triggerApp();
    },
    animateName(val) {
      this.json[this.id].animate[this.aniIndex].animationName = val;
      this.triggerApp();
    },
    time(val) {
      this.json[this.id].animate[this.aniIndex].animationDuration = val;
      this.triggerApp();
    },
    delay(val) {
      this.json[this.id].animate[this.aniIndex].animationDelay = val;
      this.triggerApp();
    },
    renderJson: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.json = this.parseJson(this.renderJson);
          this.setInput();
        }
      },
      deep: true

    },
    showId() {
      this.id = this.showId;
      this.idChange = true;
      this.setInput();
      // 兼容因为json改变触发change事件
      setTimeout(() => {
        this.idChange = false;
      }, 100);
    },
    animateSelect() {
      this.splitAnimateSelect();
    },
    direName() {
      this.splitAnimateSelect();
    },
    isDire() {
      if (this.isDire === true && this.direName === '') {
        this.direName = 'Right';
      }
    }

  },
  methods: {
    changeInfinite(event) {
      this.jsonAnimateCount = event.target.checked ? 'infinite' : this.animateCount;
    },
    onlyNum(val) {
      if (!/^[0-9]+([.][0-9]+){0,1}$/.test(val)) {
        return false;
      }
    },
    timeChange(val) {
      if (this.onlyNum(val) === false) {
        this.time = this.timeOld;
        return false;
      }
      this.showAnimateEffect();
      this.timeOld = this.time;
    },
    delayChange(val) {
      if (this.onlyNum(val) === false) {
        this.delay = this.delayOld;
        return false;
      }
      this.showAnimateEffect();
      this.delayOld = this.delay;
    },
    showAnimateEffect(func) {
      if (this.idChange !== true) {
        if (func) {
          func();
        }
        bus.$emit('animate-change', this.aniIndex);
        this.idChange = false;
      }
    },
    animateNameChange() {
      this.showAnimateEffect(() => {
        this.judgeSpecial();
        this.time = this.isTypewriter ? 0 : 1;
      })
    },
    // 初始化拼接json
    getDireOptions() {
      let temp;
      for (let i = 0, len = this.animateOptions.length; i < len; i++) {
        const group = this.animateOptions[i].options;
        for (let j = 0, len2 = group.length; j < len2; j++) {
          if (group[j].dire === true) {
            temp = group[j].value.split('-dire')[0];
            this.hasDireOptions[temp] = group[j].value;
          }
        }
      }
    },
    // 赋值
    setInput() {
      const json = this.json[this.id];
      this.ctype = json.type;
      if (json.animate && json.animate.length) {
        const animate = json.animate[this.aniIndex];
        this.animateJson = animate;
        this.animateName = animate.animationName;
        this.time = animate.animationDuration;
        this.delay = animate.animationDelay;
        this.animateSelect = this.animateName;
        animate.animationIterationCount = animate.animationIterationCount || 1;
        if (animate.animationIterationCount !== 'infinite') {
          this.animateCount = animate.animationIterationCount;
        }
        this.isInfinite = animate.animationIterationCount === 'infinite';
        // this.jsonAnimateCount = animate.animationIterationCount || 1;
        if (this.animateName) {
          this.animateNameToSelect();
        }
      }
    },
    triggerApp() {
      bus.$emit('update-json', this.json);
    },
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
    // 切割分析animateSelect值
    splitAnimateSelect() {
      const temp = this.animateSelect.split('-dire');
      if (temp.length > 1) {
        this.animateName = temp[0] + this.direName;
        this.isDire = true;
      } else {
        this.animateName = this.animateSelect;
        this.isDire = false;
      }
    },
    // 判断是否是打字机
    judgeSpecial() {
      const special = this.animateSelect.split('j-');
      // 打字机
      this.isTypewriter = special.length === 2 && special[1] === 'typewriter';
    },
    // animateName转换为animateSelect值
    animateNameToSelect() {
      let temp;
      for (const key in this.hasDireOptions) {
        temp = this.animateName.split(key);
        if (temp.length > 1 && temp[1].length) {
          this.animateSelect = key + '-dire';
          this.direName = temp[1];
          this.isDire = true;
          return false;
        }
      }
    },
    // json是否相等
    jsonEq(val1, val2) {
      return JSON.stringify(val1) === JSON.stringify(val2);
    }
  }
};
</script>
