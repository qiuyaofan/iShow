<template>
    <div class="editor-wrapper" @click.stop="">
        <el-tabs v-model="activeName2" @tab-click="handleClick2" type="border-card" v-if="showId">
            <el-tab-pane label="样式" name="first">
                <textEditor :render-json="renderJson" :show-id="showId"></textEditor>
                <!-- <component v-bind:is="currentView" :render-json="renderJson" :show-id="showId"> -->
                <!-- 组件在 vm.currentview 变化时改变！ -->
                <!-- </component> -->
            </el-tab-pane>
            <el-tab-pane label="动画" name="second">
                <animate-editor :render-json="renderJson" :show-id="showId"></animate-editor>
            </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" v-else-if="showBg">
            <el-tab-pane label="背景" name="first">
                <bgEditor :render-json="renderJson" :show-id="showId" :pageJson='pageJson'></bgEditor>
            </el-tab-pane>
        </el-tabs>
    
    </div>
</template>
<script>
import textEditor from './text-editor.vue';
import imageEditor from './image-editor.vue';
import animateEditor from './animate-editor.vue';
import bgEditor from './bg-editor.vue';
import bus from 'views/ishow/js/bus';
let arr = ['textEditor', 'imageEditor', 'animateEditor'];
export default {
    data() {
        return {
            activeName2: 'first',
            id: this.showId,
            activeName: 'first',
            showBg: false
            // currentView: 'textEditor'
        }
    },
    props: ['renderJson', 'showId','pageJson'],
    components: {
        textEditor,
        animateEditor,
        imageEditor,
        bgEditor
    },
    created() {
        this.handleView();
    },
    methods: {
        handleClick() { },
        handleClick2(tab, event) { },
        handleView() {
            this.id = this.showId;
            // if (!this.showId) {
            //     this.currentView = '';
            // } else {
            //     this.currentView = 'textEditor';
            // }
        },
        toggleBgEditor(isActive) {
            if (isActive !== null) {
                this.showBg = isActive;
                return false;
            }
            this.showBg = !this.showBg;
        }
    },
    watch: {
        renderJson: {
            handler(val, oldVal) {
                this.handleView();
            },
            deep: true
        },
        showId(val) {
            this.handleView();
        }
    },
};
</script>
