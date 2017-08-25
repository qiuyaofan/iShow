<template>
    <div class="ishow-pageMain">
        <main-show v-for="item in pageJson" :key="item.id" :show-json="item.json" :page="item.page" :active-page="page" :page-json="pageJson"></main-show>
        <div class="ishow-pageCreate" @click="addPage">
            <i class="el-icon-plus"></i>
        </div>
    </div>
</template>
<script>
import bus from 'views/ishow/js/bus';
import mainShow from 'views/ishow/preview/main-show.vue';
export default {
    data() {
        return {
            // json: {},
            // activePage: 1
        };
    },
    props: ['pageJson', 'page'],
    components: {
        mainShow
    },
    created() {
        // this.json = this.parseJson(this.pageJson);
    },
    watch: {
        pageJson: {
            handler(val) {
                ////this.json = this.parseJson(this.pageJson);

                //this.showJson=this.pageJson[this.page].json
            },
            deep: true
        },
        // page() {
        //     this.activePage = this.page;
        // }
    },
    methods: {
        //深拷贝
        // parseJson(json) {
        //     return JSON.parse(JSON.stringify(json));
        // },
        addPage() {
            bus.$emit('add-page');
        }
    }

};
</script>
