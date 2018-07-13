<template>
    <div class="ishow-animateEditor--main">
        <el-collapse v-model="activeNames">
            <el-collapse-item :name="'ani'+(index+1)" v-for="(aniJson, index) in animateJson" :key="index">
            	<template slot="title" v-if='aniJson'>
		            动画 {{index+1}} <i class="ishow-animateEditor--close el-icon-close" @click.stop="removeAnimate(index)"></i>
		        </template>
                <animateSingle v-if='aniJson' :aniJson="aniJson" :render-json="renderJson" :show-id="showId" :aniIndex="index"></animateSingle>
            </el-collapse-item>
        </el-collapse>
        <div class="tc ptb20">
            <el-button type="success" @click="addAnimate">添加动画</el-button>
            <el-button type="primary" @click="preview">预览动画</el-button>
        </div>
    </div>
</template>
<script>
import bus from 'views/ishow/js/bus';
import animateSingle from './animate-single.vue';
export default {
  data() {
    return {
      activeNames: [],
      animateJson: '',
      json: '',
      id: this.showId
    };
  },
  props: ['renderJson', 'showId'],
  components: {
    animateSingle
  },
  created() {
    this.initJson();
  },
  watch: {
    renderJson: {
      handler() {
        this.initJson();
      },
      deep: true
    },
    showId() {
      this.id = this.showId;
      this.setInput();
    }

  },
  methods: {
    initJson() {
      this.json = this.parseJson(this.renderJson);
      this.setInput();
    },
    // 赋值
    setInput() {
      if (this.json[this.id] && this.json[this.id].animate && this.json[this.id].animate.length) {
        this.animateJson = this.json[this.id].animate;
        this.showAllAnimate();
      } else {
        this.animateJson = [];
      }
    },
    triggerApp() {
      bus.$emit('update-json', this.json);
    },
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
    // 预览动画
    preview() {
      bus.$emit('animate-preview');
    },

     // 展开全部动画
    showAllAnimate() {
      const result = [];
      for (let i = 0, len = this.animateJson.length; i < len; i++) {
        result.push('ani' + (i + 1));
      }
      this.activeNames = result;
    },
    addAnimate() {
      const result = {
        animationName: '',
        animationDuration: 1,
        animationTimingFunction: 'ease',
        animationDelay: 0,
        animationFillMode: 'both',
        animationPlayState: 'initial'
      };
      this.json[this.id].animate.push(result);
      this.triggerApp();
    },
    removeAnimate(index) {
      const json = this.parseJson(this.json[this.id].animate);
      json.splice(index, 1);
      this.json[this.id].animate = this.parseJson(json);
      this.triggerApp();
    }

  }
};
</script>
