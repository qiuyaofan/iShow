<template>
    <div class="ishow-mainSetting">
        <transition name="fade">
            <div v-if="disable" class="ishow-mainSetting--bg" @click="toggle"></div>
        </transition>
        
        <transition name="slide-fade">
            <div v-if="disable" class="ishow-mainSetting--info">
                <el-tabs type="card" v-model="activeName">
                    <el-tab-pane label="常用设置" name="first">
                        <div class="p10">
                            <el-form :label-position="'left'" label-width="46px"  :model="settingForm" ref="settingForm" :rules="ruleState">
                                <el-form-item 
                                label="封面"
                                prop="settingPic">
                                    <div class="c-cover" @click="changePic">
                                        <img :src="coverUrl" width="100%" height="100%">
                                        <div class="c-cover--btn">更换封面</div>
                                    </div>
                                </el-form-item>
                                <el-form-item 
                                label="标题"
                                prop="settingTitle">
                                    <el-input v-model="settingForm.settingTitle" placeholder="请输入标题"></el-input>
                                </el-form-item>
                                <el-form-item 
                                label="简介"
                                prop="settingSummary">
                                    <el-input v-model="settingForm.settingSummary" placeholder="请输入简介"></el-input>
                                </el-form-item>
                                <div class="tc">
                                    <el-button @click="toggle">取消</el-button>
                                    <el-button type="primary" @click="submitSetting('settingForm')">保存配置</el-button>
                                </div>
                            </el-form>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="分享设置" name="second">
                    </el-tab-pane>
                </el-tabs>
            </div>
        </transition>

        <transition name="slide-fade">
            <div v-if="disable" class="ishow-mainSetting--phone">
                <div class="ishow-mainSetting--screen">
                    <iframe width="100%" height="100%" border="none" src="/"></iframe>
                </div>
            </div>
        </transition>
        <picTool :type="'picCrop'" :picJson="picJson" ref="picTool" :addElementCrop="addElementCrop"></picTool>
        
    </div>
</template>
<script>
import picTool from 'views/ishow/global/picTool/index.vue';
import {
    getImgList,
    savePageConfig
} from 'api/ishow';
export default {
  data() {
    return {
      disable: false,
      activeName: 'first',
      coverUrl: '',
      picJson: [],
      settingForm: {
        settingTitle: '',
        settingSummary: '',
        settingPic: ''
      },
      ruleState: {
        settingTitle: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        settingSummary: [{ required: true, message: '简介不能为空', trigger: 'blur' }]
      }

    };
  },
  created() {
    this.fetchImgList().then(() => {
      this.$refs.picTool.setLoading(false);
    });
  },
  components: {
    picTool
  },
  methods: {
    // 提交表单
    submitSetting(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.fetchPageConfig();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 提交配置
    fetchPageConfig() {
      console.info('this.$store', this.$store, this.$store.getters.activityId)
      if (!this.$store.getters.activityId) {
        this.$message('保存当前场景后保存的配置才能生效');
        return false;
      }
      const data = {
        id: this.$store.getters.activityId || '',
        paramJson: JSON.stringify(this.settingForm)
      };
      const _this = this;
      savePageConfig(data).then(response => {
        console.info(response)
        _this.toggle();
      }).catch(err => {
        console.info(err)
      });
    },
        // 获取本地图片
    fetchImgList() {
      return getImgList().then(response => {
        this.picJson = this.changeToArray(response.data);
      }).catch(err => {
        console.info(err)
      });
    },
    toggle() {
      this.disable = !this.disable;
    },
    addElementCrop(json) {
      this.coverUrl = json.url;
      console.info('addElementCrop')
    },
    // json key 值返回
    changeToArray(json) {
      let url;
      const result = [];
      for (url in json) {
        result.push(url);
      }
      return result;
    },
    changePic() {
      this.$refs.picTool.openTool(this.coverUrl);
    }
  }
};
</script>


