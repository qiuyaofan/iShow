<template>
    <div class="ishow-headerBtn">
        <el-button size="small" @click.stop="setting">设置</el-button>
        <el-button size="small" @click.stop="publish(2)">保存为模版</el-button>
        <el-button size="small" @click.stop="publish(1)">保存h5</el-button>
        <el-button size="small" @click.stop="quitOut">退出</el-button>
        <img src="https://ad.doubleclick.net/ddm/ad/N366601.452584BUYSELLADS.COM/B9719141.131867274;sz=180x150;ord=[timestamp];dc_lat=;dc_rdid=;tag_for_child_directed_treatment=?" id="img-eeee" style="display:none">
        <!-- <el-button size="small" @click.stop="publish">发布</el-button> -->
    </div>
</template>
<script>
import html2canvas from 'assets/js/html2canvas/html2canvas';
import bus from 'views/ishow/js/bus';
import pinyin from "vendor/pinyin/web-pinyin";
import {postH5Page} from 'api/ishow';
const pinyinOptions={
  style: pinyin.STYLE_NORMAL
};
const animateOut=['fadeOut','bounceOut','flipOutY','zoomOut','rollOut','flipOutX','lightSpeedOut','puffOut','hingeRight'].join('***');
export default {
    data() {
            return {
                resultJson:[],
                show:true
            };
        },
        props: ['showJson', 'pageJson','page','h5Json'],
        created() {
            //console.info(this.showJson)
            //this.resultJson=this.parseJson(this.pageJson);
        },
        methods: {
            //退出
            quitOut() {
                this.$router.push('/');
            },
            //发布提交
            fetchPublish(data,type) {
                data=JSON.stringify(data);
                console.info('json',JSON.stringify(this.resultJson));
                let json={
                    data,
                    type
                };
                postH5Page(json).then(response => {
                    this.$message('发布成功');
                    if(type===1){
                        console.info(response.data.id)
                        this.$store.commit('SET_ACTIVITYID', response.data.id);
                    }
                    console.info(response.data)
                }).catch(err => {
                    console.info(err)
                });
            },
            publish(type) {
                //this.getBase64Image(document.querySelector('#img-eeee'));
                // type=type?type:1;
                let json={};
                this.resultJson=this.parseJson(this.pageJson);
                const len=this.resultJson.length;
                let temp;
                let len2;
                for (let i = 0; i < len; i++) {
                    temp=this.resultJson[i].json;
                    len2=temp.length;
                    for (let j = 0; j < len2; j++) {
                        let form=temp[j].form;
                        let animate=temp[j].animate;
                        if(form){
                            //处理表单必填验证
                            if(form.required===true){
                                form.validate.push({
                                    name:'required',
                                    range:false
                                });
                            }
                            //处理表单默认值
                            if(form.default===false){
                                form.name=pinyin(form.cname).join('');
                                console.info('form-name',form)
                            }
                        }
                        if(animate.length){
                            for (let i = 0; i < animate.length; i++) {
                                animate[i].isOut=animateOut.indexOf(animate[i].animationName.replace(/up|down|left|right/gi,''))!==-1;
                                 console.info(animate[i].animationName,animate.isOut)
                            }
                        }
                    }
                }
                //模版
                if(type===2){
                    //获取第一页
                    this.resultJson=[this.resultJson[this.page-1]];
                }
                // let data={
                //     data:this.resultJson,
                //     type:type
                // };
                json.page=this.parseJson(this.resultJson);
                json.setting=this.h5Json;
                this.fetchPublish(json,type);

                //this.html2canvasTool();
                //console.info(JSON.stringify(this.resultJson,type))
                //bus.$emit('save-json', 1);
            },
            //深拷贝
            parseJson(json) {
                return JSON.parse(JSON.stringify(json));
            },
            //设置页面标题，内容等
            setting() {
                console.info(this.$parent.$parent.$refs.setting.toggle())
            },
            html2canvasTool() {
                let _this=this;
                let downloadCanvas = document.querySelector('.ishow-leftContainer .preview-page');
                console.info('downloadCanvas[0]',downloadCanvas)
                //调用html2canvas
                html2canvas(downloadCanvas).then(function(canvas) {
                    //$('.J-downloadCanvas').remove();
                    _this.dataURIToBlob(canvas, _this.callback);
                });
            },
            // 根据canvas生成图片形式的Blob
            dataURIToBlob: function(canvas, callback) {
                //document.append(canvas)
                
                var binStr = atob(canvas.toDataURL('image/png', 1).split(',')[1]),
                    len = binStr.length,
                    arr = new Uint8Array(len);

                for (var i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }
                //调用下载功能
                callback(new Blob([arr], {
                    type: 'image/png'
                }));
            },
             //生成长图回调函数
            callback: function(blob) {
                let reader = new window.FileReader();
                reader.readAsDataURL(blob); 
                reader.onloadend = function() {
                    let base64data = reader.result;                
                    console.log('url',base64data );
                }
                //console.info('url',blob,URL.createObjectURL(blob));

            }
        }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
</style>

