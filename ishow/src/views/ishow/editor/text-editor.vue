<template>
    <div class="text-wrapper">
        <el-collapse v-model="activeName" accordion @change="handleTitle">
            <el-collapse-item title="普通样式" name="normal">
                <normal-editor :render-json="renderJson" :show-id="showId"></normal-editor>
            </el-collapse-item>
            <el-collapse-item title="边框样式" name="border">
                <border-editor :render-json="renderJson" :show-id="showId"></border-editor>
            </el-collapse-item>
            <el-collapse-item title="阴影样式" name="shadow">
                <shadow-editor :render-json="renderJson" :show-id="showId"></shadow-editor>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import normalEditor from './normal-editor.vue';
import borderEditor from './border-editor.vue';
import shadowEditor from './shadow-editor.vue';
export default {
    data() {
            return {
                activeName: 'normal'
            };
        },
        props: ['renderJson', 'showId'],
        components: {
            normalEditor,
            borderEditor,
            shadowEditor
        },
        methods: {
            handleTitle(activeNames) {
                // console.info(activeNames)
                // console.info(this.renderJson)
            }
        }
};
</script>
