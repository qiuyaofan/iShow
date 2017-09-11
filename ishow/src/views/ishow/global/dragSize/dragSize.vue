<template>
    <div class="drap-resize_main" >
        <div class="line" :class="direction.e">
            <div class="drap-resize_e"></div>
        </div>
        <div class="drap-resize_sline line" :class="direction.s">
            <div class="drap-resize_s"></div>
        </div>
        <div class="drap-resize_wline line" :class="direction.w">
            <div class="drap-resize_w"></div>
        </div>
        <div class="drap-resize_nline line" :class="direction.n">
            <div class="drap-resize_n"></div>
        </div>
        <div class="drap-resize_ne" :class="direction.ne"></div>
        <div class="drap-resize_se" :class="direction.se"></div>
        <div class="drap-resize_sw" :class="direction.sw"></div>
        <div class="drap-resize_nw" :class="direction.nw"></div>
        <!-- :style="{
        width: width + 'px',
        height: height + 'px'
      }" -->
    </div>
</template>
<script>
// @input="changeText"
//v-html="content"
import bus from 'views/ishow/js/bus';
import draggable from 'views/ishow/js/draggable';
import movePos from './move';
const dragEle = ['.drap-resize_eline', '.drap-resize_sline', '.drap-resize_wline', '.drap-resize_nline', '.drap-resize_e', '.drap-resize_s', '.drap-resize_w', '.drap-resize_n', '.drap-resize_ne', '.drap-resize_se', '.drap-resize_sw', '.drap-resize_nw'];
const lineArr=['drap-resize_eline','drap-resize_sline','drap-resize_wline','drap-resize_nline'];
const pointArr=['drap-resize_ne','drap-resize_se','drap-resize_sw','drap-resize_nw'];
export default {
    data() {
            return {
                width: this.elWidth,
                height: this.elHeight,
                top: this.cursorTop,
                left: this.cursorLeft,
                startPos:{},
                direction:{
                    e:'drap-resize_eline',
                    s:'drap-resize_sline',
                    w:'drap-resize_wline',
                    n:'drap-resize_nline',
                    ne:'drap-resize_ne',
                    se:'drap-resize_se',
                    sw:'drap-resize_sw',
                    nw:'drap-resize_nw'
                }
            }
        },
        props: ['elWidth', 'elHeight', 'cursorTop', 'cursorLeft','rotate'],
        created() {
        },
        watch: {
             elWidth(val) {
                this.width = val;
            },
            elHeight(val) {
                this.height = val;
            }, 
            cursorTop(val) {
                this.top = val;
            },
            cursorLeft(val) {
                this.left = val;
            }
        },

        methods: {
            setDire() {

            },
            //拖拽更新位置
            handleDrag(event, i) {
                let width, height, left, top;
                
                let json=this.setPos(event);
                let _this=this;
                let rotateType=this.rotate/45;
                //初始化left,top
                let startPos={
                    top:this.startPos.t-json.screen.top,
                    left:this.startPos.l-json.screen.left,
                };
                //获取旋转后的值
                let j=rotateChange(rotateType,i);
                //获取值movePos.get--旋转后的返回值
                //console.info(j)
                let posResult=movePos.get[j](_this,json);
                //console.info('ooo',i,j)
                //获取参数
                let result=moveParams(rotateType,i,posResult,startPos);
                //设置值movePos.set
                movePos.set[i](_this,json,result);
                bus.$emit('drap-size-update', this.width, this.height, this.top, this.left);
                //this.startPos.pos=[x,y]
            },
            dragCall(i) {
                let target = this.$el.querySelector(dragEle[i]);
                let isStart;
                draggable(target, {
                    start: (event) => {
                        this.startPos=this.setPos(event);
                    },
                    drag: (event) => {
                        this.handleDrag(event, i);
                    },
                    end: (event) => {
                        //this.handleDrag(event, i);
                        this.startPos=this.setPos(event);
                    }
                });
            },
            setPos(event) {
                let el = this.$el;
                let screen = document.getElementsByClassName('ishow-screen')[0].getBoundingClientRect();
                //let target = this.$el.querySelector(dragEle[i]);
                let rect = el.getBoundingClientRect();
               
                let json={
                    x:event.clientX,
                    y:event.clientY,
                    t:rect.top,
                    b:rect.bottom,
                    l:rect.left,
                    r:rect.right,
                    w:rect.width,
                    h:rect.height,
                    screen:screen,
                    pos:[event.clientX,event.clientY]
                };
                 //console.info('screen',json.w ,json.h,json.w /json.h)
                json.ratio=json.w /json.h;
                return json;
                // this.startPos.x = event.clientX;
                // this.startPos.y = event.clientY;
                // this.startPos.t = rect.top;
                // this.startPos.b = rect.bottom;
                // this.startPos.l = rect.left;
                // this.startPos.r = rect.right;
                // this.startPos.w = rect.width;
                // this.startPos.h = rect.height;
                // this.startPos.ratio = this.startPos.w / this.startPos.h;
                // this.startPos.pos=[event.clientX,event.clientY];
            },
            //深拷贝
            parseJson(json) {
                return JSON.parse(JSON.stringify(json));
            }
        },
        mounted() {
            for (var i = 0; i < dragEle.length; i++) {
                this.dragCall(i);
            }
            //this.update();
        }
};
function moveParams(rotateType,i,posResult,startPos){
    //n-e
    //e--旋转前状态
    if (i === 0 || i === 4) {
        if(rotateType>=1&&rotateType<3||rotateType>=5&&rotateType<7){
            return [posResult.height];
        }
        return [posResult.width];
    }
    //s
    if (i === 1 || i === 5) {
        if(rotateType>=1&&rotateType<3||rotateType>=5&&rotateType<7){
            return [posResult.width];
        }
        return [posResult.height];
    }
    //w
    if (i === 2 || i === 6) {
        if(rotateType===0){
            return [posResult.height,posResult.left];
        }
        if(rotateType>=1&&rotateType<3||rotateType>=5&&rotateType<7){
            return [posResult.height,startPos.left];
        }
        return [posResult.width,startPos.left];
    } 
    //n
    if (i === 3 || i === 7) {
        if(rotateType===0){
            return [posResult.height,posResult.top];
        }
        if(rotateType>=1&&rotateType<3||rotateType>=5&&rotateType<7){
            return [posResult.width,startPos.left];
        }
        return [posResult.height,startPos.top];
    }
    //ne
    if (i === 8) {
        if(rotateType===0){
            return [posResult.width,posResult.height,posResult.top];
        }
        return [posResult.width,posResult.height,startPos.top];
    }
    //se
    if (i === 9) {
        return [posResult.width,posResult.height];
    }
    //sw
    if (i === 10) {
        if(rotateType===0){
            return [posResult.width,posResult.height,posResult.left];
        }
        return [posResult.width,posResult.height,startPos.left];
    }
    //nw
    if (i === 11) {
        if(rotateType===0){
            return [posResult.width,posResult.height,posResult.left,posResult.top];
        }
        return [posResult.width,posResult.height,startPos.left,startPos.top];
    }
    return [];
}
function range(value) {
    return value < 0 ? 0 : value;
}

function rangeMax(value, max) {
    return value > max ? max : value;
}

function rotateChange(rotateType,j){
    if(rotateType>=1&&rotateType<3){
        //n-e
        j+=1;
        j=j%4===0?j-4:j;
    }else if(rotateType>=3&&rotateType<5){
        //n-s
        j+=2;
        j=j%4===0||j%4===1?j-4:j;
    }else if(rotateType>=5&&rotateType<7){
        //n-w
        j-=1;
        j=j===-1?3:j===3?7:j===7?11:j;
    }
    return j;
}
</script>
