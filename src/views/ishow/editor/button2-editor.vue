<template>
    <div v-if="isActive" class="button2-menu" :style="{
    	top:top+'px',
    	left:left+'px'
    }">
        <div class="button2-menu_item" @click.stop="update" v-if="cType!==1">
            <a>编辑</a>
        </div>
        <div class="button2-menu_item" @click.stop="countIndex(1)">
            <a>向上一层</a>
        </div>
        <div class="button2-menu_item" @click.stop="countIndex(-1)">
            <a>向下一层</a>
        </div>
        <div class="button2-menu_item" @click.stop="setIndexTop()">
            <a>置顶</a>
        </div>
        <div class="button2-menu_item" @click.stop="setIndex(1)">
            <a>置底</a>
        </div>
    </div>
</template>
<script>
import bus from 'views/ishow/js/bus';
export default {
    data() {
            return {
                isActive: false,
                top: 0,
                left: 0,
                zIndex: 0,
                id: this.showId,
                cType:1
            };
        },
        props: ['showJson', 'renderJson', 'showId'],
        created() {
            //显示菜单
            bus.$on('button2-menu-show', function(event, _id) {
                this.id = _id;
                this.show(event);
            }.bind(this));
            //隐藏菜单
            bus.$on('button2-menu-hide', function() {
                this.hide();
            }.bind(this));
        },
        watch: {
            showId(val, oldvalue) {
                this.id = this.showId;
            }
        },
        methods: {
            show(event) {
                let rect = this.$parent.$el.getBoundingClientRect();
                this.zIndex = this.renderJson[this.id].zIndex;
                this.left = event.clientX - rect.left;
                this.top = event.clientY - rect.top;
                this.isActive = true;
                this.cType=this.renderJson[this.id].type;
            },
            hide() {
                this.isActive = false;
            },
            //加减
            countIndex(count) {
                this.zIndex = this.zIndex + count;
                if (this.zIndex < 1) {
                    this.zIndex = 1;
                }
                this.triggerApp();
            },
            setIndex(index) {
                this.zIndex = index;
                this.triggerApp();
            },
            //置顶
            setIndexTop() {
                let max = this.zIndex;
                let index;
                for (let i = 0, len = this.showJson.length; i < len; i++) {
                    index = this.showJson[i].zIndex;
                    if (max < index) {
                        max = index;
                    }
                }
                if (max > this.zIndex) {
                    this.zIndex = max + 1;
                    this.triggerApp();
                } else {
                    this.hide();
                }

            },
            //深拷贝
            parseJson(json) {
                return JSON.parse(JSON.stringify(json));
            },
            triggerApp() {
                let json = this.parseJson(this.renderJson);
                json[this.showId].zIndex = this.zIndex;
                bus.$emit('update-json', json);
                this.hide();
            },
            update() {
                bus.$emit('update-target', this.renderJson[this.id],this.id);
                this.hide();
            }
        }
};
</script>
