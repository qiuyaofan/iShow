<template>
    <div class="ishow-leftContainer mt5">
        <div class="ishow-modulesWrapper">
            <el-tabs type="border-card" v-model="activeName">
                <el-tab-pane label="模版管理" name="first">
                    <el-input placeholder="请输入内容齐全" icon="search" v-model="input2"></el-input>
                    <content-modules :page="page"></content-modules>
                </el-tab-pane>
                <el-tab-pane label="编辑状态" name="second">
                    <view-page :page-json="pageJson" :page="page"></view-page>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import contentModules from './content-modules.vue';
import viewPage from './view-page.vue';
import bus from 'views/ishow/js/bus';
export default {
  data() {
    return {
      activeName: 'first',
      input2: ''
    };
  },
  props: ['pageJson', 'page'],
  components: {
    contentModules,
    viewPage
  },
  created() {
            // 绑定修改tab事件
    bus.$on('change-tab', name => {
      this.activeName = name;
                // console.info(this.pageJson)
    });
  },
  methods: {
    // handleIconClick(tab, event) {}
  }
};
</script>
