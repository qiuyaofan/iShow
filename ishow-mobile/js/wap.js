
$(function () {
	var $window = $(window);
	var designW = 320;
	var designH = 460;
	var ww = $window.width();
	var wh = $window.height();
	var viewH,viewW;
	var pageJson;
	var tpl = {
		page: '<div class="page">{{html}}</div>',
		text: '<p class="text-item" style="{{style}}">{{html}}</p>',
		img: '<div class="img-item" style="{{style}}"><img width="100%" height="100%" src="{{src}}"></div>'
	};
	var animatePrefix='-webkit-animation-';

	var $wrapper = $('.swiper-wrapper');

	function init() {
		pageJson = handelJson(json2);
		renderHtml();
		// animateJson=pageJson.animate;
		//设置viewport content scale
		viewport();
		// initSlippage();
		var len=pageJson.page.length;
		if(!len){
			return;
		}
		for(var i=0;i<len;i++){
			runAnimate(i);
		}
		// for(var i=0,len=pageJson.page.length-1;i<=len;i++){
		// 	runAnimate(i);
		// }
		initSlippage();
		
		//animateStart();
	}
	//调用slippage
	function initSlippage() {
		//swiper调用
		$('.swiper-slide').height(window.innerHeight);
		var mySwiper = new Swiper('.swiper-container', {
				direction: 'vertical',
				loop: false,
				speed:500,
				noSwiping: true,
				noSwipingClass: 'stop-swiping',
				pagination : '.swiper-pagination',
				onTransitionStart: function(swiper){
					 var $item=$('.swiper-slide').eq(swiper.activeIndex).find('.page-item');
					 $item.each(function(index,elm){
						 var newone = elm.cloneNode(true);
						 elm.parentNode.replaceChild(newone, elm);
					 })
					 runSpecialAnimate(swiper.activeIndex);
				 },
				 onTransitionEnd: function(swiper){
					 console.info(333)
				 },
				onSlideChangeEnd: function(swiper) {
					 //  $body.find('.swiper-arrow').removeClass('none');
					 //  if(swiper.activeIndex === 4){
					 // 		 $body.find('.swiper-arrow').addClass('none');
					 //  }
				}
		});
	 //  mySwiper.lockSwipes();
 }
	//渲染html
	function renderHtml() {
		var html = template('tpl-1', pageJson);
		// animateJson=pageJson.animate;
		$wrapper.html(html);
	}
	//运行动画
	function runAnimate(index) {
		var json = pageJson.animate[index];
		for (var id in json) {
			//存在id
			if (json[id]) {
				//特殊：打字机
				if(json[id][animatePrefix+'name']==='j-typewriter'){
					typeWriter($('#' + id).find('.item-text'),pageJson.json[index][id]);
				}else{
					$('#' + id).css(json[id]);
				}
			}
		}
	}
	// //运行动画
	function runSpecialAnimate(index) {
		var json = pageJson.animate[index];
		for (var id in json) {
			//存在id
			if (json[id]&&json[id][animatePrefix+'name']==='j-typewriter') {
				//特殊：打字机
				typeWriter($('#' + id).find('.item-text'),pageJson.json[index][id]);
			}
		}
	}

	//设置viewport
	function viewport() {
		//宽度计算出缩放比
		viewW=ww;
		var scale1 = ww / designW;
		var scale2=wh/designH;
		var scale;
		$('.page').height(wh);
		if(scale1<=scale2){
			scale=scale1;
			viewW=ww;
			viewH=scale*designH;
			//手机太高，内容垂直上需要居中
			var top=(wh-viewH)/2;
			$('.J-page').css('padding-top',top);
			$('.page-content').height(viewH);
		}else{
			scale=scale2;
			viewH=wh;
			viewW=scale*designW;
			//手机不够高，原html高度适应手机，宽度变小，水平居中
			var left=(ww-viewW)/2;
			$('.J-page').css('padding-left',left);
		}
		var content = "width=320, initial-scale=" + scale + ", maximum-scale=" + scale + ", user-scalable=no";
		$('[name="viewport"]').attr('content', content);
	}
	

	//打字机效果
	function typeWriter($target,json) {
		var arr = json.content.split('<br>');
		var brIndex = [];
		var duration = json.json.animate[0].animationDuration||0.1;
		var html = '';
		var timer1,timer2;
		//提取换行的位置
		for (var k = 0, len = arr.length; k < len; k++) {
				var index = k === 0 ? arr[k].length - 1 : brIndex[k - 1] + arr[k].length;
				brIndex.push(index);
		}
		//延时
		clearTimeout(timer1);
		timer1=setTimeout(function() {
				var content = arr.join('').split('');
				var len = arr.join('').length;
				var i = 0;
				var j = 0;
				//定时循环
				timer2 = setInterval(function() {
						html += content[i];
						if (i === brIndex[j]) {
								html += '<br>';
								j++;
						}
						$target.html(html);
						i++;
						if (i >= len) {
								clearInterval(timer2);
								//data.isActive = false;
						}
				}, duration * 1000);
		}, json.json.animate[0].animationDelay * 1000);
	}

	//处理渲染json
	function handelJson(json) {
		var temp,
			html = '',
			result = {},
			page = [],
			pageResult,
			tempResult,
			animatePage = [],
			animateSingle,
			jsonPage=[],
			jsonSingle;
		for (var i = 0; i < json.length; i++) {
			tempResult = {};
			temp = json[i].json;
			pageResult = [];
			animateSingle = {};
			jsonSingle={};
			for (var j = 0; j < temp.length; j++) {
				//动画部分
				animateSingle[temp[j].id] = renderAnimate(temp[j]);
				//样式部分
				tempResult.json = temp[j];
				tempResult.form = temp[j].form;
				tempResult.id = temp[j].id;
				tempResult.type = temp[j].type;
				tempResult.content = temp[j].content;
				tempResult.theme = temp[j].text.themeColor;
				tempResult.style = renderStyle(temp[j]);
				tempResult.style['z-index'] = temp[j].zIndex;
				tempResult.style['box-shadow'] = handleShadow(temp[j].text);
				tempResult.style.transform = rotate(temp[j].text);
				tempResult.style = styleToString(tempResult.style);
				pageResult.push(parseJson(tempResult));
				jsonSingle[temp[j].id]=parseJson(tempResult);
			}
			//动画部分
			animatePage.push(animateSingle);
			//json部分
			jsonPage.push(jsonSingle);
			//样式部分
			page.push({ list: $.extend([], pageResult) });

		}

		return {
			page: page,
			animate: animatePage,
			json:jsonPage
		};
	}
	//渲染动画样式
	function renderAnimate(json) {
		var animate = json.animate;
		var result = {
			'-webkit-animation-timing-function': 'ease'
		};
		var delay = [],
			duration = [],
			name = [],
			mode = [],
			delayTime;

		if (animate && animate.length) {
			for (var i = 0; i < animate.length; i++) {
				name.push(animate[i].animationName);
				duration.push(animate[i].animationDuration + 's');
				//0%是否是opacity:0
				if (animate[i].isOut === true || i === 1) {
					mode.push('forwards');
				} else {
					mode.push('both');
				}

				//判断延迟是否需要加前面的值
				if (i === 0) {
					delayTime = animate[i].animationDelay + 's';
				} else {
					delayTime = animate[i - 1].animationDelay + animate[i].animationDelay + animate[i - 1].animationDuration + 's';
				}
				delay.push(delayTime);
			}
			result['-webkit-animation-name'] = name.join(',');
			result['-webkit-animation-duration'] = duration.join(',');
			result['-webkit-animation-fill-mode'] = mode.join(',');
			result['-webkit-animation-delay'] = delay.join(',');
			return result;
		}
		return '';
	}
	//style json转换为字符串格式
	function styleToString(style) {
		var result = '';
		for (var key in style) {
			result += (key + ':' + style[key] + ';');
		}
		return result;
	}
	//旋转样式添加
	function rotate(textJson) {
		return 'rotate(' + textJson.rotate + 'deg)';
	}

	//生成阴影的样式
	function handleShadow(json) {
		var width = json.shadowWidth;
		if (!width) {
			return 'none';
		}
		var arr = [
			[1, -1],
			[-1, -1],
			[-1, 1],
			[1, 1]
		];
		var result = [];
		var dire = json.shadowDire;

		var arrVal = [
			[0, width],
			[width, 0],
			[0, -width],
			[-width, 0]
		];
		var angle = 90 / width;
		var index = Math.floor(dire / 90);
		var count = Math.floor(dire % 90 / angle);
		if (index === 4) {
			index = 0;
		}
		result[0] = arrVal[index][0] + arr[index][0] * count;
		result[1] = arrVal[index][1] + arr[index][1] * count;
		return json.shadowColor + ' ' + result[0] + 'px ' + result[1] + 'px ' + json.shadowRadius + 'px';
	}
	//渲染style
	function renderStyle(json) {
		var style = '';
		var temp = {
			width: autoJudge(json.width),
			height: autoJudge(json.height),
			left: px(json.position.left),
			top: px(json.position.top),
			position: 'absolute'
		};
		for (var key in json.text) {
			if (unlessText(key) !== true) {
				if (key === 'opacity') {
					json.text[key] = json.text[key] / 100;
				}
				var tempKey = UpperCaseToLine(key);
				temp[tempKey] = judgePx(key, json.text[key]);
			}
		}
		return temp;
	}
	//不需要渲染的样式
	function unlessText(key) {
		var keyArr = ['shadowColor', 'shadowWidth', 'shadowRadius', 'shadowDire', 'rotate'];
		for (var i = 0; i < keyArr.length; i++) {
			if (keyArr[i] === key) {
				return true;
			}
		}
	}

	//判断需要加px
	function judgePx(key, val) {
		var keyArr = ['padding', 'fontSize', 'borderWidth', 'borderRadius'];
		for (var i = 0; i < keyArr.length; i++) {
			if (keyArr[i] === key) {
				return val + 'px';
			}
		}

		return val;
	}
	//判断为大写
	function isUpperCase(str) {
		return str === str.toUpperCase();
	}
	//大写转化为横杠
	function UpperCaseToLine(val) {
		val = val.split('');
		for (var i = 0; i < val.length; i++) {
			if (isUpperCase(val[i])) {
				val[i] = '-' + val[i].toLowerCase();
			}
		}
		return val.join('');
	}
	//判断添加px
	function autoJudge(val) {
		return val !== 'auto' ? val + 'px' : val;
	}
	//添加px
	function px(val) {
		return val + 'px';
	}
	//深拷贝
	function parseJson(json) {
		return JSON.parse(JSON.stringify(json));
	}
	init();
})
