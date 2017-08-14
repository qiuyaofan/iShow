<template>
    <div class="text-wrapper">
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="1111普通样式" name="normal">
                <normal-editor></normal-editor>
            </el-collapse-item>
            <el-collapse-item title="边框样式" name="border">
                <border-editor></border-editor>
            </el-collapse-item>
            <el-collapse-item title="阴影样式" name="shadow">
                <shadow-editor></shadow-editor>
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
        components: {
            normalEditor,
            borderEditor,
            shadowEditor
        }
};
</script>
