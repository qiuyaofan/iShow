<template>
    <div class="shadow-style">
        <div class="form-group">
            <label>阴影颜色</label>
            <div class="clearfix">
                <div class="form-center w35">
                    <el-color-picker v-model="shadowColorInput" show-alpha></el-color-picker>
                </div>
                <div class="form-right w140">
                    <el-input v-model="shadowColorInput" placeholder=""></el-input>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>阴影大小</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="shadowWidth" :max="shadowWidthMax" show-input @change="addHistroy">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>模糊半径</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="shadowRadius" :max="shadowRadiusMax" show-input @change="addHistroy">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>阴影方向</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <el-slider v-model="shadowDire" :max="shadowDireMax" show-input @change="addHistroy">
                    </el-slider>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import bus from 'views/ishow/js/bus';
export default {
    data() {
            return {
                json: {},
                id: this.showId,
                shadowWidth: this.renderJson[this.showId].text.shadowWidth,
                shadowRadius: this.renderJson[this.showId].text.shadowRadius,
                shadowDire: this.renderJson[this.showId].text.shadowDire,
                shadowColorInput: this.renderJson[this.showId].text.shadowColor,
                shadowWidthMax: 20,
                shadowRadiusMax: 20,
                shadowDireMax: 360
            };
        },
        props: ['renderJson', 'showId'],
        created() {
            this.json = this.parseJson(this.renderJson);
        },
        watch: {
            shadowWidth() {
                this.json[this.id].text.shadowWidth = this.shadowWidth;
                this.triggerApp();
            },
            shadowRadius() {
                this.json[this.id].text.shadowRadius = this.shadowRadius;
                this.triggerApp();
            },
            shadowDire() {
                this.json[this.id].text.shadowDire = this.shadowDire;
                this.triggerApp();
            },
            shadowColorInput() {
                this.json[this.id].text.shadowColor = this.shadowColorInput;
                this.addHistroy();
                this.triggerApp();
            },
            showId() {
                this.id = this.showId;
                this.json = this.parseJson(this.renderJson);
                this.setInput();
            },
            renderJson() {
                this.json = this.parseJson(this.renderJson);
            }
        },
        methods: {
            //触发历史纪录
            addHistroy() {
                bus.$emit('add-histroy');
            },
            triggerApp() {
                bus.$emit('update-json', this.json);
            },
            parseJson(json) {
                return JSON.parse(JSON.stringify(json));
            },
            setInput() {
                this.shadowWidth = this.renderJson[this.showId].text.shadowWidth;
                this.shadowRadius = this.renderJson[this.showId].text.shadowRadius;
                this.shadowDire = this.renderJson[this.showId].text.shadowDire;
                this.shadowColorInput = this.renderJson[this.showId].text.shadowColor;
            }
        }
};
</script>
