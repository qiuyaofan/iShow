<template>
    <div class="ishow-modulesContent">
          <div class="ishow-previewMain--module" v-for="(json,index) in moduleJson" :key="index" @click="confirmOpen(json)">
            <div class="ishow-previewPage" :style="getBackground">
                <normalElement v-for="item in json.json" :key="item.id" :child-json="item" :show-json="json.json" :type="item.type">
                </normalElement>
            </div>
        </div>  
    </div>
</template>
<script>
import bus from 'views/ishow/js/bus';
import normalElement from 'views/ishow/preview/normal-template.vue';
import {
    getModuleList
} from 'api/ishow';
export default {
  data() {
    return {
      pageSize: 30,
      pageNum: 1,
      moduleJson: [],
      getBackground: {}
    };
  },
  created() {
    this.fetchModuleList();
  },
  props: ['page'],
  components: {
    normalElement
  },
  methods: {
    confirmOpen(json) {
      this.$confirm('模版会覆盖正在编辑的页面，确定要修改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.chooseModule(json);
      }).catch(err => {
        console.info(err)
      });
    },
    fetchModuleList() {
      getModuleList(this.pageSize, this.pageNum).then(response => {
        const data = response.data;
        console.info('getModuleList', data)
        if (data && data.length) {
          console.info(data)
          for (let i = 0; i < data.length; i++) {
            const temp = typeof data[i].moduleJson === 'object' ? data[i].moduleJson : JSON.parse(data[i].moduleJson);
            data[i].json = temp[0].json;
            data[i].moduleJson = temp;
          }
          this.moduleJson = Object.assign([], data);
        }
      }).catch(err => {
        console.info(err)
      });
    },
    chooseModule(json) {
      json = json.moduleJson[0];
      json.page = this.page;
      bus.$emit('update-pageJson', json);
      bus.$emit('add-histroy');
    }
  }
};
</script>
