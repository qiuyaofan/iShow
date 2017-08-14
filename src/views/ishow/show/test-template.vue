<template>
    <div @mouseover="addAnimate" v-bind:style="[aniStyle]">
        测试文字 测试文字 测试文字 测试文字
    </div>
</template>
<script>
// @input="changeText"
//v-html="content"
export default {
    data() {
            return {
                aniStyle: {}
            }
        },
        props: [],
        components: {},
        created() {

        },
        watch: {

        },

        methods: {
            addAnimate() {
                this.aniStyle = {
                    animationName: 'fadeInUp',
                    animationDuration: '2s',
                    animationTimingFunction: 'ease',
                    animationDelay: '1.3s',
                    animationFillMode: 'both',
                    animationPlayState: 'initial'
                };
                // this.aniStyle={
                //   animationName: 'fadeIn',
                //   animationDuration: '2s',
                //   animationTimingFunction: 'ease',
                //   animationDelay: '0.6s',
                //   animationFillMode: 'both',
                //   animationPlayState: 'initial'
                // };
            }

        },
        mounted() {

        }
};
</script>
