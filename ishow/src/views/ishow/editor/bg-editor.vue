<template>
    <div class="ishow-bgStyle">
        <div class="form-group">
            <div>图片背景</div>
            <div class="el-upload el-upload--picture-card ishow-bgStyle--main mt10" @click="changeImage">
                <i class="el-icon-plus"></i>
                <img :src="pageJson.bgImage.url" alt="" v-if="pageJson.bgImage.url">
            </div>
            <div class="mt10 tr" v-if="pageJson.bgImage.url">
                <el-button type="default" size="mini" @click="deleteImage">删除图片</el-button>
                <el-button type="default" size="mini" @click="changeImage">修改图片</el-button>
            </div>
        </div>
    
        <div class="form-group">
            <label>纯色背景</label>
            <div class="clearfix">
                <div class="form-center w35">
                    <el-color-picker v-model="json.bgImage.backgroundColor" show-alpha @change="setColor"></el-color-picker>
                </div>
                <div class="form-right w140">
                    <el-input v-model="json.bgImage.backgroundColor" placeholder=""></el-input>
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
      json: {
        bgColorInput: ''
      },
      id: this.showId,
      url: ''
    };
  },
  props: ['renderJson', 'showId', 'pageJson'],
  created() {
    this.setInput();
  },
  watch: {
    pageJson: {
      handler() {
        this.setInput();
      },
      deep: true
    }
  },
  methods: {
        // 触发历史纪录
        // addHistroy() {
        //     bus.$emit('add-histroy');
        // },
    triggerApp() {
            // bus.$emit('update-json', this.json);
    },
    parseJson(json) {
      return JSON.parse(JSON.stringify(json));
    },
    setInput() {
      this.json = this.parseJson(this.pageJson);
    },
    changeImage() {
      document.getElementById('J-open-bg').click();
    },
    deleteImage() {
      bus.$emit('update-pageJson', {
        bgImage: {
          url: '',
          coord: ''
        }
      });
    },
    setColor(val) {
      bus.$emit('update-pageJson', {
        bgImage: {
          url: '',
          coord: '',
          backgroundColor: val
        }
      });
    }
  }
};
</script>
