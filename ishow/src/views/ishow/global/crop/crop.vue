<template>
    <div class="c-crop">
        <div class="c-crop--main" :style="{height:height+'px',width:width+'px'}">
            <div class="c-crop--area">
                <img :src="url" alt="" height="100%">
                <div class="c-crop--cut" 
                :style="{
                    width:elWidth+'px',
                    height:elHeight+'px',
                    left:cursorLeft+'px',
                    top:cursorTop+'px'
                }"
                @click.stop="">
                    <img 
                    :src="url" 
                    alt="" 
                    class="c-crop--cut_img"
                    :style="{
                        width:imgW+'px',
                        height:mainH+'px',
                        left:-cursorLeft+'px',
                        top:-cursorTop+'px'
                    }">
                    <cropTool :crop-json="cropJson" :el-width="elWidth" :el-height="elHeight" :cursor-top="cursorTop" :cursor-left="cursorLeft"></cropTool>
                </div>
            </div>
        </div>
    </div>
    
</template>
<script>
// @input="changeText"
//v-html="content"
import bus from 'views/ishow/js/bus';
import draggable from 'views/ishow/js/draggable';
import cropTool from './cropTool.vue';

export default {
    data() {
            return {
                elWidth: 50,
                elHeight: 50,
                cursorTop: 0,
                cursorLeft: 0,
                startPos: [0, 0],
                mainH:460,
                imgW:0,
                url:this.croodUrl,
                isDraping:false,
                scale:1,
                cropJson:{
                    cw:null,
                    ch:null,
                    w:null,
                    h:null,
                    r:null
                }
            }
        },
        //props:['croodUrl'],
        props: {
            croodUrl:String,
            ratio:{
                type: null,
                default: false
            },
            width:null,
            height:null,
            coordWidth:null,
            coordHeight:null,
            //裁切完图片选择回调
            afterCrop: {
                type: Function,
                default: function(){}
            },
        },
        components:{
            cropTool
        },
        created() {
            // bus.$on('crop-draping', function(isDraping) {
            //     this.isDraping=isDraping;
            //     // this.triggerApp();
            // }.bind(this));
            
            //设置showId 
            // bus.$on('drap-size-update', function(w, h, t, l) {
            //     this.elWidth = w;
            //     this.elHeight = h;
            //     this.cursorTop = t;
            //     this.cursorLeft = l;
            //     let url=this.url;
            //     let coord=this.getCoord(l,t,w,h);
            //     this.afterCrop(coord,url);
            // }.bind(this));
        },
        watch: { 
            croodUrl(val) {
                console.info(3333,val)
                this.url = val;
                this.setSize();
            }
        },

        methods: {
            //设置变化后尺寸
            drapSizeUpdate(w, h, t, l) {
                this.elWidth = w;
                this.elHeight = h;
                this.cursorTop = t;
                this.cursorLeft = l;
                console.info('drapSizeUpdate',w, h, t, l)
                let url=this.url;
                // console.info(this)
                let coord=this.getCoord(l,t,w,h);
                //console.info(coord)
                this.afterCrop(coord,url);
            },
            setSize() {
                let imgSize=this.getSize(this.url);
                this.imgW=imgSize.r*this.mainH;
                this.scale=imgSize.w/this.imgW;
                this.cursorTop = 0;
                this.cursorLeft = 0;
                let json=this.cropJson;
                // json.w=this.width?this.width:json.w=this.$el.width;
                // json.h=this.height?this.height:json.h=this.$el.height;
                //可裁切宽度，图片宽度
                //var rect=this.$el.querySelectorAll('.c-crop--area')[0].getBoundingClientRect();
                json.w=this.imgW;
                json.h=this.mainH;
                //console.info('rect',json.w)
                if(this.ratio){
                    json.r=this.ratio;
                    //有固定比例，则按比例截取
                    if(json.w>json.h){
                        let r=json.h*this.ratio/json.w;
                        if(r>1){
                            json.ch=json.h/r;
                            json.cw=json.ch*this.ratio;
                        }else{
                            json.ch=json.h;
                            json.cw=json.ch*this.ratio;
                        }
                    }else{
                        let r=json.w/this.ratio/json.h;
                        if(r>1){
                            json.cw=json.w/r;
                            json.ch=json.cw/this.ratio;
                        }else{
                            json.cw=json.w;
                            json.ch=json.cw/this.ratio;
                        }
                    }
                }
                this.elWidth=json.cw;
                this.elHeight=json.ch;
                console.info('json',json,this.cropJson,this)
                //console.info(json.w,json.h,json.cw,json.ch);
            },
            getCoord(l,t,w,h) {
                l=this.scale*l;
                t=this.scale*t;
                w=this.scale*w;
                h=this.scale*h;
                return {
                    p0:[l,t],
                    p1:[l+w,t],
                    p2:[l+w,t+h],
                    p3:[l,t+h],
                    w:w,
                    h:h,
                    l:l,
                    t:t
                }
            },
            //拖拽更新位置
            // handleDrag(event) {
            //     let x = event.clientX;
            //     let y = event.clientY;
            //     this.cursorLeft = x - this.startPos[0] + this.cursorLeft;
            //     this.cursorTop = y - this.startPos[1] + this.cursorTop;
            //     this.startPos = [x, y];
            // },
            getSize(src){
                let _this=this;
                let img = new Image();
                img.src = src;
                return img.onload = function(){
                    return _this.getSizeImg(img);
                }();
            },
            getSizeImg(img) {
                let w=img.width;
                let h=img.height;
                return {
                    w:w,
                    h:h,
                    r:w/h
                };
            }

        },
        mounted() {
            this.setSize();
        }
            
};



</script>
