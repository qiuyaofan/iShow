//主要变动：animate修复，layer修改touchstart事件
(function ($, window, document, undefined) {
    /**
    utils：通用方法
    */

    var isIE = document.all && !window.atob;
    window.IUI_UTILS = {
        animateEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        transitionEnd: 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd',
        isPlaceholder: function () {
            var input = document.createElement('input');
            return 'placeholder' in input;
        },
        throttle: function (func, wait, options) {
            var context, args, result;
            var timeout = null;
            // 上次执行时间点
            var previous = 0;
            if (!options) options = {};
            // 延迟执行函数
            var later = function () {
                // 若设定了开始边界不执行选项，上次执行时间始终为0
                previous = options.leading === false ? 0 : new Date().getTime();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function () {
                var now = new Date().getTime();
                // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
                if (!previous && options.leading === false) previous = now;
                // 延迟执行时间间隔
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
                // remaining大于时间窗口wait，表示客户端系统时间被调整过
                if (remaining <= 0 || remaining > wait) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                    //如果延迟执行不存在，且没有设定结尾边界不执行选项
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        debounce: function (func, wait, immediate) {
            var timeout, args, context, timestamp, result;

            var later = function () {
                var last = new Date().getTime() - timestamp;
                if (last < wait && last > 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };

            return function () {
                context = this;
                args = arguments;
                timestamp = new Date().getTime();
                var callNow = immediate && !timeout;
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        },
        scrollBarWidth: (function () {
            var scrollbarWidth;
            var $scrollDiv = $('<div/>');
            $scrollDiv.css({
                'width': 100,
                'height': 100,
                'overflow': 'scroll',
                'position': 'absolute',
                'top': -9999
            });
            $('html').append($scrollDiv);
            scrollbarWidth = $scrollDiv[0].offsetWidth - $scrollDiv[0].clientWidth;
            $scrollDiv.remove();
            return scrollbarWidth;
        }()),
        animateEndShim: function (el, fn, animate) {
            if (isIE || animate) {
                fn();
            } else {
                el.on(IUI_UTILS.animateEnd, fn);
            }
        },
        transitionEndShim: function (el, fn, animate) {
            if (isIE || animate) {
                fn();
            } else {
                el.on(IUI_UTILS.transitionEnd, fn);
            }
        },
        //错误信息循环获取
        joinErrorInfo: function (res, errArr) {
            var errStr = res.err;
            var str, info = '';
            errArr = errArr || ['name', 'sex', 'mobile'];
            if (!res.err) {
                return res.msg;
            }
            for (var i = 0, length = errArr.length; i < length; i++) {
                str = errStr[errArr[i]];
                if (str) {
                    info += str;
                    break;
                }
            }
            info = info !== '' ? info : res.info;
            return info;
        },
        //获取form表单数据URL格式
        getUrlVars: function (url) {
            var hash;
            var myJson = {};
            var hashes = decodeURIComponent(url).slice(url.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                myJson[hash[0]] = hash[1];
            }
            return myJson;
        },
        //预加载图片
        loadImages: function (pics, callback, len) {
            var _loadProgress, _drawLoadProgress, _loadImages, _completeCall;
            var self = this;
            len = len || pics.length;

            // 监听实际的加载情况
            _loadProgress = function (begin, all) {
                var loadinterval = setInterval(function () {
                    if (window._pandaImageLoadArray.length != 0 && window._pandaImageLoadArray.length != begin) {
                        _drawLoadProgress((begin - window._pandaImageLoadArray.length) / all);
                    } else if (window._pandaImageLoadArray.length == 0) {
                        _completeCall();
                        clearInterval(loadinterval);
                    }


                }, 300);
            }
            //加载的的数值
            _drawLoadProgress = function (w) {
                var num = Math.floor(w * 100) >= 100 ? 100 : Math.floor(w * 100);
                //输出加载了百分之多少
                $('body').find('.loading-txt').text(num + '%');
            }
            _completeCall = function () {
                _drawLoadProgress(1);
                setTimeout(function () {
                    callback.call(window);
                }, 500);
            }
            if (pics.length) {
                var IMG = new Image(),
                    picelem = pics.shift();

                if (window._pandaImageLoadArray) {
                    window._pandaImageLoadArray = window._pandaImageLoadArray;
                } else {
                    window._pandaImageLoadArray = [];
                }
                window._pandaImageLoadArray.push(picelem);
                IMG.src = picelem;
                // 从数组中取出对象的一刻，就开始变化滚动条
                _drawLoadProgress(window._pandaImageLoadArray.length / (len * len));
                // 缓存处理
                if (IMG.complete) {
                    window._pandaImageLoadArray.shift();
                    return self.loadImages(pics, callback, len);
                } else {
                    // 加载处理
                    IMG.onload = function () {
                        window._pandaImageLoadArray.shift();
                        IMG.onload = null; // 解决内存泄漏和GIF图多次触发onload的问题
                    };
                    // 容错处理 todo 应该如何处理呢?
                    // 目前是忽略这个错误，不影响正常使用
                    IMG.onerror = function () {
                        window._pandaImageLoadArray.shift();
                        IMG.onerror = null;
                    };
                    return self.loadImages(pics, callback, len);
                }
                return;
            }
            if (window._pandaImageLoadArray) {
                if (callback) { _loadProgress(window._pandaImageLoadArray.length, len) };
            } else {
                _completeCall();
            };

        }
    };

    window.IUI = {};


    $.fn.IUI = function () {
        var arg = arguments;
        var method = arguments[0];
        if (IUI[method]) {
            method = IUI[method];
            arg = Array.prototype.slice.call(arg, 1);
            return method.apply(this, arg);
        } else if (typeof (method) == 'object' || !method) {
            for (var name in method) {
                IUI = $.extend(IUI, method);
                method = IUI[name];
                break;
            }
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.IUI Plugin');
            return this;
        }
    };

    /**
     * pub_sub
     * 发布/订阅模式
     */
    var o = $({});

    $.extend({
        sub: function () {

            o.on.apply(o, arguments);
        },
        unsub: function () {
            o.off.apply(o, arguments);
        },
        pub: function () {
            o.trigger.apply(o, arguments);
        }
    });


    //动画渲染
    /*
    $.animate({
        json:[[{
            target:'.J-ani-title',
            addClass:'animated slideInDown',
            removeClass:''
        },{
            target:'.J-ani-title',
            addClass:'animated slideInDown',
            removeClass:''
        }],[{
            target:'.J-ani-intro',
            addClass:'animated slideInDown',
            removeClass:''
        }]]
    })
     */
    $.extend({
        animate: function (options) {
            var config = $.extend({
                json: [],
            }, options);
            if (!config.json.length) {
                return false;
            }

            var api = {};
            api.config = config;
            api.index = 0;
            api.len = config.json.length;
            //添加动画类
            api.handle = function (temp) {
                for (var i = 0; i < temp.length; i++) {
                    handleClass(temp[i]);
                    //绑定结束事件
                    api.on(temp[i]);
                    //有下一个动画时，绑定事件
                    var id = temp[0].id;
                    if (hasNext(i, id, api)) {
                        api.on(config.json[id][0], config.json[id + 1]);
                    }
                }
            };

            // 绑定动画结束回调事件
            api.on = function (temp, tempNext) {
                $(temp.target).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (event) {
                    // 去除动画类
                    api.animateEnd(temp, tempNext);
                });
            };
            //动画结束回调
            api.animateEnd = function (temp, tempNext) {
                $(temp.target).removeClass(temp.addClass);
                if (temp.addClassEnd) {
                    $(temp.target).addClass(temp.addClassEnd);
                }
                if (tempNext) {
                    //为下一个动画添加类
                    setTimeout(function () {
                        api.handle(tempNext);
                    }, 50);
                }
            };

            //初始化
            api.init = function () {
                api.addId();
                api.handle(config.json[0]);
            };
            //添加id
            api.addId = function () {
                loop(config, function (json, i) {
                    json[0].id = i;
                });
            };
            //移除动画类
            api.remove = function (config) {
                loop(config, function (json) {
                    remove(json);
                });
            }
            //判断是否有下一个动画
            function hasNext(i, id, api) {
                return (i === 0 && id + 1 < api.len);
            }
            //循环处理，相当于$.each
            function loop(config, callback) {
                for (var i = config.json.length - 1; i >= 0; i--) {
                    callback(config.json[i], i);
                }
            }
            //移除class
            function remove(json) {
                for (var i = json.length - 1; i >= 0; i--) {
                    handleClass(json[i], true);
                }
            }
            //处理动画类
            function handleClass(temp, isReverse) {
                var _remove = temp.removeClass;
                var _add = temp.addClass;
                var removeClass = isReverse ? _add : _remove;
                var addClass = isReverse ? _remove : _add;
                if (temp.removeClass) {
                    $(temp.target).removeClass(removeClass);
                }
                $(temp.target).addClass(addClass);
            }
            api.init();
            return api;
        }
    });


    /**
     * tip 组件
     * @param {String,jQuery Object}        obj         被提示的对象，可传 id 或 jQuery 对象
     * @param {String}                      text        文本
     * @param {Number}                      timeout     多少毫秒后隐藏提示
     * @param {Boolean}                     status      状态，success or error
     * @param {Boolean}                     position    自定义位置，当它为 true 时， obj 将成为tip的位置参照物
     * @param {Array}                       offset      自定义位置微调值，offset[0] = x, offset[1] = y
     * @param {Function}                    callback    回调函数 - hide 时触发
     *
     */
    $.extend({
        tip: function (options) {
            var param = $.extend({
                obj: "#global-tip",
                text: '',
                timeout: 3000,
                status: true,
                position: false,
                offset: [0, 5],
                callback: null
            }, options);

            var obj = param.obj instanceof $ ? param.obj : $(param.obj);
            var status = param.status ? 'success' : 'error';
            var count = obj.data('count') || 1;
            var id = new Date().getTime();
            var objWidth = obj.outerWidth();
            var objHeight = obj.outerHeight();
            var x = obj.offset().left;
            var y = obj.offset().top;
            var tip;

            clearTimeout(obj.data('count'));

            if (param.position) {
                if (typeof obj.attr('data-tip') === 'undefined') {

                    $('<div class="tips" id="tip_' + id + '" style="left:' + (x + param.offset[0]) + 'px;top:' + (y + objHeight + param.offset[1]) + 'px"></div>').appendTo('body');
                    obj.attr('data-tip', id);

                }
                tip = $('#tip_' + obj.attr('data-tip'));

            }

            var target = param.position === 'custom' ? tip : obj;

            target.html('<span class="' + status + '">' + param.text + '</span>').removeClass('hide');

            obj.data('count', setTimeout(function () {

                target.addClass('hide');

                if (param.callback) {
                    param.callback();
                }

            }, param.timeout));

        }
    });



    /*!
     * JavaScript Cookie v2.1.2
     * https://github.com/js-cookie/js-cookie
     *
     * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
     * Released under the MIT license
     */
    ;
    (function ($) {
        function extend() {
            var i = 0;
            var result = {};
            for (; i < arguments.length; i++) {
                var attributes = arguments[i];
                for (var key in attributes) {
                    result[key] = attributes[key];
                }
            }
            return result;
        }

        function converter() { }

        var cookie = {
            defaults: {},
            api: function (key, value, attributes) {
                var result;
                var _this = this;
                if (typeof document === 'undefined') {
                    return;
                }

                // Write

                if (arguments.length > 1) {
                    attributes = extend({
                        path: '/'
                    }, _this.defaults, attributes);

                    if (typeof attributes.expires === 'number') {
                        var expires = new Date();
                        expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                        attributes.expires = expires;
                    }

                    // We're using "expires" because "max-age" is not supported by IE
                    attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

                    try {
                        result = JSON.stringify(value);
                        if (/^[\{\[]/.test(result)) {
                            value = result;
                        }
                    } catch (e) { }

                    if (!converter.write) {
                        value = encodeURIComponent(String(value))
                            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                    } else {
                        value = converter.write(value, key);
                    }

                    key = encodeURIComponent(String(key));
                    key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                    key = key.replace(/[\(\)]/g, escape);

                    var stringifiedAttributes = '';

                    for (var attributeName in attributes) {
                        if (!attributes[attributeName]) {
                            continue;
                        }
                        stringifiedAttributes += '; ' + attributeName;
                        if (attributes[attributeName] === true) {
                            continue;
                        }
                        stringifiedAttributes += '=' + attributes[attributeName];
                    }
                    return (document.cookie = key + '=' + value + stringifiedAttributes);
                }

                // Read

                if (!key) {
                    result = {};
                }

                // To prevent the for loop in the first place assign an empty array
                // in case there are no cookies at all. Also prevents odd result when
                // calling "get()"
                var cookies = document.cookie ? document.cookie.split('; ') : [];
                var rdecode = /(%[0-9A-Z]{2})+/g;
                var i = 0;

                for (; i < cookies.length; i++) {
                    var parts = cookies[i].split('=');
                    var cookie = parts.slice(1).join('=');

                    if (cookie.charAt(0) === '"') {
                        cookie = cookie.slice(1, -1);
                    }

                    try {
                        var name = parts[0].replace(rdecode, decodeURIComponent);
                        cookie = converter.read ?
                            converter.read(cookie, name) : converter(cookie, name) ||
                            cookie.replace(rdecode, decodeURIComponent);

                        if (this.json) {
                            try {
                                cookie = JSON.parse(cookie);
                            } catch (e) { }
                        }

                        if (key === name) {
                            result = cookie;
                            break;
                        }

                        if (!key) {
                            result[name] = cookie;
                        }
                    } catch (e) { }
                }
                //console.info(result)

                return result;
            },
            set: function (key, value, attributes) {
                return cookie.api.call(cookie, key, value, attributes);
            },
            get: function (key) {
                return cookie.api.call(cookie, key);
            },
            getJson: function () {
                return cookie.api.apply({
                    json: true
                }, [].slice.call(arguments));
            },
            remove: function (key, attributes) {
                cookie.api(key, '', extend(attributes, {
                    expires: -1
                }));
            },
            clear: function () {
                var json = cookie.getJson();
                for (var key in json) {
                    cookie.remove(key);
                }

            }
        }

        $.extend({
            cookie: cookie
        });
    }(jQuery));



    /**
     * loading 组件
     * @param {Boolean}     display         显示或隐藏 true/false
     * @param {String}      type            选择 css 或 img
     * @param {String}      animateHtml     穿入的css动画,type为css有效
     * @param {String}      src             图片地址，type不为css有效
     * @param {Boolean}     shadow          是否显示阴影
     *
     * @example
     *
     * $.loading(true,'css')或$(selector).loading(true,'css')或
     *
     */

    $.loading = $.fn.loading = function (options, type) {
        var defaults = {
            display: false,
            type: 1,
            animateHtml: '<div class="ball-clip-rotate"><div></div></div>',
            src: 'http://img.yi114.com/201571121314_382.gif',
            shadow: true
        };

        var $context;
        var callType = this instanceof $;
        if (callType) {
            $context = this;
            $context.css('position', 'relative');
        } else {
            $context = $('body');
        }



        var loadingStr = '<div class="IUI-loading">{{hook}}</div>';

        if (typeof options === 'object') {
            $.extend(defaults, options);
        } else {
            if (options !== undefined) {
                defaults.display = options;
            }
            if (type !== undefined) {
                defaults.type = type;
            }
        }

        loadingStr = loadingStr.replace('{{hook}}', defaults.type ? defaults.animateHtml : '<img src="' + defaults.src + '" />');

        if (defaults.shadow) {
            loadingStr = '<div class="IUI-loading-backdrop" ' + (callType ? 'style="position:absolute;"' : '') + '></div>' + loadingStr;
        }


        if (defaults.display) {
            $context.append(loadingStr);
        } else {
            $context.find('>.IUI-loading-backdrop,>.IUI-loading').remove();
        }

    };

    /**
     * layer 组件
     * @param  {String}            container           组件的执行上下文环境，默认是body
     * @param  {Boolean}           cache               是否缓存 ajax 页面
     * @param  {Boolean}           shadow              是否开启阴影层关闭
     * @param  {String}            confirmHandle       确认按钮Class
     * @param  {String}            closeHandle         关闭按钮Class
     * @param  {String}            offsetWidth         layer 宽度
     * @param  {String}            offsetHeight        layer 高度
     * @param  {String}            url                 ajax url
     * @param  {String}            dataType            ajax dataType : html,json,xml ...
     * @param  {String}            method              ajax type : get/post
     * @param  {String}            data                ajax data
     * @param  {Function}          successCall         ajax success callback
     * @param  {Function}          errorCall           ajax error callback
     * @param  {Function}          showCall            回调函数 - 显示触发
     * @param  {Function}          confirmCall         回调函数 - 确认触发
     * @param  {Function}          cancelCall          回调函数 - 关闭触发
     *
     * @method [showLayer]  显示层
     * @method [hideLayer]  隐藏层
     * @method [ajaxLoad]   ajax 弹层
     * @method [cutTo]      切换层
     *
     * @event
     *
     * $('selector').on('layer.show',function(){});
     * $('selector').on('layer.hide',function(){});
     *
     * @example
     *
     * var layerId = $('#layerId').IUI('layer'); // 注意：layerId必须是唯一，当页面中没有div#layerId，将自动创建，并 append 到 container 中
     * layerId.showLayer();
     * layerId.hideLayer();
     * layerId.ajaxLoad();
     *
     * html基本结构
     * div.layer-box.hide#layerId>div.layer-content
     *
     *
     */

    (function ($, window) {
        var version = '3.1.0';
        var scrollBarWidth = IUI_UTILS.scrollBarWidth;
        var $body = $('body');
        var backdrop = $('<div class="layer-backdrop"></div>');

        function Layer(config, selector) {
            var defaults = {
                container: 'body',
                cache: false,
                shadow: true,
                confirmHandle: '.btn-confirm',
                closeHandle: '.btn-cancel,.btn-close',
                offsetWidth: 'auto',
                offsetHeight: 'auto',
                url: $(this).attr('data-url') || false,
                dataType: $(this).attr('data-dataType') || 'html',
                data: '',
                method: 'GET',
                content: '',
                animateDisable: true,
                zIndex: 0,
                showCall: function () { },
                hideCall: function () { },
                successCall: function () { },
                errorCall: function () { },
                confirmCall: function () { },
                cancelCall: function () { }
            };
            this.$selector = selector;
            this.config = $.extend(defaults, config);
            //创建遮罩层
            this.$backdrop = $('<div class="layer-backdrop"></div>');
            this.init();
            this.event();
        }

        Layer.prototype.init = function () {
            var self = this;
            var config = self.config;
            var template = '<div class="layer-box hide" id="{{layerName}}"><div class="layer-content">' + config.content + '</div></div>';
            var $selector = this.$selector = self.$selector.length ? self.$selector : $(template.replace('{{layerName}}', self.$selector.selector.replace('#', ''))).appendTo(config.container);
            var $container = config.container === 'body' ? $body : $(config.container);
            var closeHandle = config.closeHandle;
            var $content = this.$content = $selector.find('.layer-content');
            var layerWidth = Number($selector.attr('data-width')) || config.offsetWidth;
            var layerHeight = Number($selector.attr('data-height')) || config.offsetHeight;

            if (config.zIndex) {
                self.$backdrop.css('z-index', config.zIndex);
                $selector.css('z-index', config.zIndex + 10);
            }

            $content.css({
                width: layerWidth,
                height: layerHeight
            });

            $selector.data('layer', self);


        };

        Layer.prototype.ajaxLoad = function () {
            var self = this;
            var config = self.config;
            var $selector = self.$selector;
            var requestUrl = config.url || '?';
            var method = ($selector.attr('data-method') || config.method).toUpperCase();
            var dataType = config.dataType;

            if (config.cache && $selector.data('success')) {
                self.showLayer();
                return false;
            }

            $.loading(true, true);
            $selector.data('success', 1);

            $.ajax({
                url: requestUrl,
                type: method,
                dataType: dataType,
                data: config.data
            }).then(function (res) {
                $.loading(false);
                config.successCall.apply($selector, [res, this, self]);
                self.showLayer();
            }, function (err) {
                $.loading(false);
                self.hideLayer();
                config.errorCall.apply($selector, [err, this, self]);
            });

            return self;
        };

        Layer.prototype.event = function () {
            var self = this;
            var config = self.config;
            var $selector = self.$selector;

            //确认事件
            $selector.on('touchstart.iui-layer', config.confirmHandle, function (event) {
                event.preventDefault();
                config.confirmCall.apply($selector, [event, self]);
                return false;
            });

            // 阴影层事件
            $selector.on('touchstart.iui-layer', function (event) {
                if ($(event.target).is($selector)) {

                    if (!config.shadow) {
                        return false;
                    }
                    if ($body.find('.layer-loading').length) {
                        return false;
                    }
                    self.hideLayer();
                    config.cancelCall.apply($selector, [event, self]);
                }
            });


            //绑定关闭事件
            $selector.on('touchstart.iui-layer', config.closeHandle, function (event) {
                self.hideLayer();
                config.cancelCall.apply($selector, [event, self]);
                return false;
            });

        };

        Layer.prototype.showLayer = function (cutto) {
            var self = this;
            var config = self.config;
            var $backdrop = self.$backdrop;
            var $body = $('body');
            var screenH = document.documentElement.clientHeight;
            var gtIE10 = document.body.style.msTouchAction === undefined;
            var isCutto = cutto;
            var Q = $.Deferred();
            // 当body高度大于可视高度，修正滚动条跳动
            // >=ie10的滚动条不需要做此修正,tmd :(
            if ($body.height() > screenH & (gtIE10)) {
                $body.data('initstyle', $body.attr('style') || '');
                $body.css({
                    'border-right': scrollBarWidth + 'px transparent solid',
                    'overflow': 'hidden'
                });

            }
            //显示层
            self.$selector.removeClass('hide');
            self.$content.off(IUI_UTILS.animateEnd);

            if (isCutto) {
                self.$content.removeClass('layer-opening');
            } else {
                //插入-遮罩-dom
                self.$selector.after($backdrop);
                //插入-遮罩-显示动画
                $backdrop.attr('style', 'opacity: 1;visibility: visible;');
            }

            //插入-弹层-css3显示动画
            self.$content.addClass('layer-opening');

            IUI_UTILS.animateEndShim(self.$content, function (event) {
                self.$content.removeClass('layer-opening');
                //触发show事件
                self.$selector.trigger('layer.show', [self]);
                //触发showCall回调
                config.showCall.apply(self.$selector, [self]);

                Q.resolve();
            }, config.animateDisable);

            // 绑定 esc 键盘控制
            $(document).on('keyup.iui-layer', function (event) {
                if (event.keyCode === 27) {
                    self.$selector.trigger('click.iui-layer', config.closeHandle);
                }
            });

            //返回Layer对象
            return Q;
        };


        Layer.prototype.hideLayer = function (cutto) {
            var self = this;
            var config = self.config;
            var isCutto = cutto;
            var Q = $.Deferred();
            //插入-弹层-隐藏动画
            self.$content.off(IUI_UTILS.animateEnd);
            self.$content.addClass('layer-closing');
            if (!isCutto) {
                self.$backdrop.removeAttr('style');
                IUI_UTILS.transitionEndShim(self.$backdrop, function () {
                    self.$backdrop.remove();
                }, config.animateDisable);
            }
            IUI_UTILS.animateEndShim(self.$content, function (event) {
                //插入-遮罩-隐藏动画
                self.$content.removeClass('layer-closing');
                //隐藏弹层
                self.$selector.addClass('hide');

                //触发hide事件
                self.$selector.trigger('layer.hide', [this]);
                //触发hideCall回调
                config.hideCall.apply(self.$selector, [self]);
                Q.resolve();
            }, config.animateDisable);


            //恢复 body 滚动条
            $body.attr('style', $body.data('initstyle'));

            // 绑定 esc 键盘控制
            $(document).off('keyup.iui-layer');
            return Q;
        };

        Layer.prototype.cutTo = function (nextId, currentId) {
            var nextLayer = $(nextId).data('layer');
            var currentLayer = (currentId ? $(currentId) : this.$selector).data('layer');
            if (nextLayer.$backdrop.width() === 0) {
                nextLayer.$backdrop = currentLayer.$backdrop;
            }
            currentLayer.hideLayer(true).done(function () {
                nextLayer.showLayer(true);
            });

        };

        Layer.prototype.destroy = function () {
            var self = this;
            var $selector = self.$selector;
            //确认事件
            $selector.remove();
        };


        $.fn.IUI({
            layer: function (config) {
                return new Layer(config, this);
            }
        });

    }(jQuery, window));



    /**
     * share 分享组件
     */
    $.extend({
        share: function (options) {
            var param = $.extend({
                title: null, //分享的标题
                summary: null, //分享的简介
                url: null, //分享url地址
                pic: $('body').find('img').eq(0).attr('src'), //分享的图片，默认拿第一张图片
                copybtn: '#copy-url', //复制按钮
                swbbtn: '.sweibo', //新浪微博按钮
                qzonebtn: '.qzone', //QQ空间按钮
                twbbtn: '.tweibo', //腾讯微博按钮
                dbbtn: '.douban', //豆瓣按钮
                rrbtn: '.renren' //人人网按钮
            }, options);
            var title = encodeURIComponent(param.title);
            var summary = encodeURIComponent(param.summary);
            var pic = encodeURIComponent(document.domain + param.pic);
            var weiboUrl = encodeURIComponent(param.url + '&share=weibo');
            weiboUrl = 'http://service.weibo.com/share/share.php?url=' + weiboUrl + '&title=' + title + '&pic=' + pic + '&appkey=&searchPic=false';
            $(param.swbbtn).attr('href', weiboUrl);
            var qzoneUrl = encodeURIComponent(param.url + '&share=qzone');
            qzoneUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + qzoneUrl + '#qzone&title=' + title + '&summary=' + summary + '&pics=' + pic;
            $(param.qzonebtn).attr('href', qzoneUrl);
            var tweiboUrl = encodeURIComponent(param.url + '&share=tweibo');
            tweiboUrl = 'http://share.v.t.qq.com/index.php?c=share&a=index&url=' + tweiboUrl + '#tweibo&appkey=appkey&title=' + summary + '&pic=' + pic;
            $(param.twbbtn).attr('href', tweiboUrl);
            var doubanUrl = encodeURIComponent(param.url + '&share=douban');
            doubanUrl = 'http://www.douban.com/share/service?image=' + pic + '&href=' + doubanUrl + '#douban&name=' + title + '&text=' + summary;
            $(param.dbbtn).attr('href', doubanUrl);
            var renrenUrl = encodeURIComponent(param.url + '&share=renren');
            renrenUrl = 'http://widget.renren.com/dialog/share?resourceUrl=' + renrenUrl + '&srcUrl=' + renrenUrl + '&title=' + title + '&pic=' + pic + '&description=' + summary;
            $(param.rrbtn).attr('href', renrenUrl);
            $(param.copybtn).val(param.url + '&share=copy');
        }
    });

    /**
     * 拿到url上的参数
     * 调用：$.getQueryString('name');
     */
    $.extend({
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var url = decodeURIComponent(window.location.search);
            var r = url.substr(1).match(reg);
            if (r !== null) return (r[2]);
            return null;
        }
    });

    /**
     * 判断是否显示/隐藏邮箱、手机
     * @param  [description]             container       传body进来;  $('body')
     * @param  [description]             parents         input的父级，用于隐藏/显示
     * @param  [description]             type            判断的类型，邮箱还是手机; 传name
     */
    $.extend({
        exist: function (options) {
            var param = $.extend({
                container: 'body', //传body进来;  $('body')
                parents: '.form-container', //input的父级，用于隐藏/显示
                type: 'email', //判断的类型，邮箱还是手机; 传name
                success: null //成功的回调函数
            }, options);

            var $container = param.container instanceof $ ? param.container : $(param.container);
            var $parents = $container.find('#' + param.type).parents(param.parents);
            var activityId = $container.find('input[name="activityId"]').val();
            var _val = $container.find('#' + param.type).val();
            var csrf = $('meta[name="csrf-param"]').prop('content');
            var csrf_val = $('meta[name="csrf-token"]').prop('content');
            var isemail = _val ? '&' + param.type + '=' + _val : '';

            $.post('/index/init-activity', csrf + '=' + csrf_val + '&activityId=' + activityId + isemail, function (res) {
                if (res.status) {
                    if (_val) {
                        if (res.register) {
                            $parents.find('#' + param.type).val('');
                            $parents.removeClass('hide');
                        } else {
                            $parents.addClass('hide');
                        }
                    }
                    if (param.success) {
                        param.success(res);
                    }
                }
            });
        }
    });

    /**
     * 手机归属地
     */
    $.extend({
        ownership: function (options) {
            var param = $.extend({
                container: 'body', //传body进来或者$('body')
                mobile: null, //手机号码
                success: null, //成功的回调函数
                error: null //错误的回调函数
            }, options);

            var $container = param.obj instanceof $ ? param.obj : $(param.obj);
            var csrf = $('meta[name="csrf-param"]').prop('content');
            var csrf_val = $('meta[name="csrf-token"]').prop('content');
            var activityId = $container.find('input[name="activityId"]').val();
            var _val = $container.find('#' + param.type).val();
            var ismobile = param.mobile ? param.mobile : _val;

            $.post('/index/mobile-info', csrf + '=' + csrf_val + '&activityId=' + activityId + '&mobile=' + ismobile, function (res) {
                if (res.status) {
                    if (param.success) {
                        param.success(res);
                    }
                } else {
                    if (param.error) {
                        param.error(res);
                    }
                }
            });
        }
    });

    /**
     * 手机验证码
     */
    // $.extend({
    //     verification: function(options) {
    //         var param = $.extend({
    //             obj: 'body',             //传body进来;  $('body')
    //             field: 'mobileCode',    //手机验证码字段
    //             scenario: '2',          //验证场景(1-所有，2-新增，3-修改)
    //             mobile: null,           //手机号码
    //             success: null,          //成功的回调函数
    //             error: null             //错误的回调函数
    //         }, options);

    //         var $container = param.obj instanceof $ ? param.obj : $(param.obj);
    //         var csrf = $('meta[name="csrf-param"]').prop('content');
    //         var csrf_val = $('meta[name="csrf-token"]').prop('content');
    //         var activityId = $container.find('input[name="activityId"]').val();

    //         $.post('index/sms-code', csrf +'='+ csrf_val +'&field='+ param.field +'&scenario='+ param.scenario +'&activityId='+ activityId +'&mobile='+ param.mobile, function(res) {
    //             if (res.status == 1) {
    //                 if (param.success) {
    //                     param.success(res);
    //                 }
    //             }else {
    //                 if (param.error) {
    //                     param.error(res);
    //                 }
    //             }
    //         });
    //     }
    // });

    /**
     * 错误提示组件
     * @param {String,jQuery Object}        obj         被提示的对象，可传 id 或 jQuery 对象
     * @param {String}                      data        后台返回的data数据
     * @param {Number}                      timeout     多少毫秒后隐藏提示
     * @param {Boolean}                     status      状态，success or error 默认true
     */
    // $.extend({
    //     ajaxError: function(options) {
    //         var _selt = this;
    //         var item_arr = []; //存页面要验证的字段
    //         var param = $.extend({
    //             obj: '#global-tip',
    //             data: null, //插入后台的data数据
    //             timeout: 3000, //设置多少时间隐藏提示
    //             status: false,
    //             errorCall: function() {},
    //             hideCall: function() {}
    //         }, options);
    //         var obj = param.obj instanceof $ ? param.obj : $(param.obj);
    //         var status = param.status ? 'success' : 'error';
    //         var msg = ''; //提示信息
    //         if (param.data.error.constructor !== Object) {
    //             //'验证已经全部通过，不再执行往下方法'
    //             if (param.data.info !== '新增成功' || param.data.info !== '修改成功') {
    //                 msg = param.data.info;
    //                 $.alert({
    //                     obj: param.obj,
    //                     text: msg,
    //                     timeout: param.timeout,
    //                     status: param.status,
    //                     callback: param.hideCall
    //                 });
    //             }
    //             return false;
    //         }

    //         $.each(_selt.find('.val-error'), function(index, title) { //循环页面的字段，拿到字段名存在item_arr数组里
    //             var _aname = $(title).attr('name');
    //             var _dname = $(title).attr('data-name');
    //             var _sname = _dname ? _dname : _aname;
    //             item_arr.push(_sname);
    //         });

    //         if (item_arr) {
    //             $.each(item_arr, function(key, value) {
    //                 $.each(param.data.error, function(item, val) {
    //                     if (value === item) {
    //                         msg = val;
    //                         return msg;
    //                     }
    //                 });
    //                 if (msg) {
    //                     param.errorCall.apply(obj, [msg]);
    //                     $.alert({
    //                         obj: param.obj,
    //                         text: msg,
    //                         timeout: param.timeout,
    //                         status: param.status,
    //                         callback: param.hideCall
    //                     });
    //                     return false;
    //                 }
    //             });
    //         }
    //     }
    // });

    /**
     * ajaxForm 组件
     * @param {String}      url
     * @param {String}      method
     * @param {String}      type
     * @param {Function}    before
     * @param {Function}    success
     * @param {Function}    error
     * @param {Function}    pending
     * @param {Function}    always
     */
    $.fn.IUI({
        ajaxForm: function (options) {
            return this.each(function () {
                var $selector = $(this);
                var defaults = {
                    url: $selector.attr('action'),
                    method: $selector.attr('method') || 'POST',
                    type: $selector.attr('data-type') || 'json',
                    timeout: 15000,
                    data: null,
                    ajax2: false,
                    before: function () { },
                    success: function () { },
                    error: function () { },
                    pending: function () { },
                    always: function () { }
                };

                var config = $.extend({}, defaults, options);

                $selector.data('deferred', config);

                $selector.on('submit', function (event) {
                    event.preventDefault();
                    if ($selector.hasClass('disabled')) {

                        config.pending.call($selector, config);

                        return false;
                    }

                    var beforeResult = config.before.call($selector, event, config);

                    var args = {
                        url: config.url,
                        type: config.method,
                        data: config.data || $selector.serialize(),
                        timeout: config.timeout
                    };
                    config.contentType ? args.contentType = config.contentType : false;

                    // ajax2
                    if (config.ajax2) {
                        args.data = new FormData($selector[0]);
                        args.cache = false;
                        args.contentType = false;
                        args.processData = false;
                    }

                    if (beforeResult === false) {
                        return false;
                    }
                    $selector.addClass('disabled').prop('disabled', true);
                    $.ajax(args).then(function (res) {
                        $selector.removeClass('disabled').prop('disabled', false);
                        config.success.call($selector, res, config);
                    }, function (err) {
                        $selector.removeClass('disabled').prop('disabled', false);
                        config.error.call($selector, err, config);
                    }).always(function (res) {
                        config.always.call($selector, res, config);
                    });
                });

            });
        }
    });





    /**
     * validate 组件
     *
     * *** options ***
     *
     * @param {Element selector}             globalMessage       全局提示id，若为false，则逐项提示
     * @param {Element selector}             errorClass          验证信息 - 错误 class
     * @param {Element selector}             infoClass           验证信息 - 提示 class  若为false，则无info提示
     * @param {Element selector}             successClass        验证信息 - 成功 class  若为false，则无info提示
     * @param {Array}                        collections         验证规则配置
     * @param {Object}                       strategy            新增验证规则
     *
     *
     * collections 语法：[{验证项},{验证项},{验证项},{验证项}]
     *
     * 验证项 语法：
     *
        {
            required: 'password',                                 // 对应 input[data-required]
            context: '.form-group',                               // data-required的执行上下文
            infoMsg: '请输入您的密码，字符长度为3-16位',             // 提示信息
            matches: {                                           // 组合验证
                isNonEmpty: {                                    // 对应 strategy 中存在的验证方法
                    errMsg: '密码不能为空'                        //  验证错误的返回信息
                },
                between: {
                    errMsg: '密码长度为6-16位',
                    range:[6,16]                                //可自定义字段
                }
            }
        }

     *
     *
     * *** events ***
     *
     * $('any element').on('validate.focus',function(event,matches){});
     *
     * $('any element').on('validate.blur',function(event,matches){});
     *
     *
     *
     * *** methods ***
     *
     *  batch           详情请查阅源码部分
     *  message         详情请查阅源码部分
     *  verify          详情请查阅源码部分
     *
     */
    $.fn.IUI({
        validate: function (options) {
            /**
             *
             * GLOB_STRATEGY    默认验证策略集合
             *
             */
            var GLOB_STRATEGY = {
                isNonEmpty: function (params) {
                    var $target = this.self;
                    var value = $target[0].value;
                    if ($.trim(value).length === 0) {
                        return false;
                    }
                },
                minLength: function (params) {
                    //大于
                    if (this.self[0].value.length < params.minLength) {
                        return false;
                    }
                },
                maxLength: function (params) {
                    //小于
                    if (this.self[0].value.length > params.maxLength) {
                        return false;
                    }
                },
                birthdayRange: function (params) {
                    //生日范围
                    var val = this.self[0].value;
                    var min = params.range[0];
                    var max = params.range[1];
                    if (val < min || val > max) {
                        return false;
                    }
                },
                isBirthday: function (params) {
                    //是否为生日
                    if (!/^[1-9]\d{3}([-|\/|\.])?((0\d)|([1-9])|(1[0-2]))\1(([0|1|2]\d)|([1-9])|3[0-1])$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                isMobile: function (params) {
                    //是否为手机号码
                    if (!/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                isEmail: function (params) {
                    //是否为邮箱
                    if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.self[0].value)) {
                        return false;
                    }
                },
                between: function (params) {
                    var $target = this.self;
                    var length = this.self[0].value.length;
                    var min = params.range[0];
                    var max = params.range[1];
                    if (length < min || length > max) {
                        return false;
                    }

                },
                //纯英文
                onlyEn: function (params) {
                    if (!/^[A-Za-z]+$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //纯中文
                onlyZh: function (params) {
                    if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //非整数
                notInt: function (params) {
                    if (/^[0-9]*$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //数字包含小数
                onlyNum: function (params) {
                    if (!/^[0-9]+([.][0-9]+){0,1}$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //整数
                onlyInt: function (params) {
                    if (!/^[0-9]*$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //至少选中一项 radio || checkbox
                isChecked: function (params) {
                    var result = false;
                    this.self.each(function (index, el) {
                        if (el.checked) {
                            result = void (0);
                        }
                    });
                    return result;
                },
                //昵称
                isNickname: function (params) {
                    if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(this.self[0].value)) {
                        return false;
                    }
                }
            };
            var defaults = {
                globalMessage: false,
                errorClass: '.validate-error',
                infoClass: '.validate-info',
                successClass: '.validate-success',
                collections: [],
                strategy: GLOB_STRATEGY,
                callback: function () { }
            };

            var selector = this;

            function Validate(options) {
                this.container = 'body';
                this.options = $.extend(true, {}, defaults, options);
                this.$selector = selector;
                this.cache = {};
                this.errors = {};
                this.init();
            }


            /**
             * init方法     初始化
             */
            Validate.prototype.init = function () {
                var self = this;
                var statusArr = ['info', 'success', 'error'];

                if (self.options.collections.length === 0) {
                    return false;
                }

                self.add();
                $.each(self.cache, function (name, fields) {
                    if (fields.context.length === 0) {
                        return;
                    }
                    var contextClassName = /validate-context-(info|success|error)/.exec(fields.context[0].className);
                    var initStatus;
                    if (contextClassName) {
                        initStatus = contextClassName[1];
                        fields.self.data('validateStatus', $.inArray(initStatus, statusArr));
                    }
                });
            };


            /**
             * mapping方法      参数修正，将传入进来的数据转化另一种格式，并插入到cache中
             * @param {Object} options      每一项需要验证的配置参数
             *
             */
            Validate.prototype.mapping = function (options) {
                var $dom = this.$selector.find('[data-required=' + options.required + ']');
                var $context = $dom.parents(options.context).eq(0);
                var msg;
                if ($context.length === 0) {
                    msg = '{context:' + options.context + '} is invalid , it may prevent the triggering event';
                    if (window.console) {
                        console.warn(msg);
                    } else {
                        throw msg;
                    }
                }
                //防止重复
                if (this.cache[options.required]) {
                    return false;
                }

                $.extend(true, this.cache, (function () {
                    var item = {};
                    var target = item[options.required] = {};
                    target.matches = {};
                    target.self = $dom;
                    target.context = $context;
                    target.infoMsg = options.infoMsg || '';
                    target.options = options;
                    $.extend(true, target.matches, options.matches);
                    return item;
                }()));
            };


            /**
             * remove方法                  传入 data-required 的值，删除对应的验证
             * @param {String}  target     data-required值
             *
             */
            Validate.prototype.remove = function (target) {
                var self = this;
                var options = self.options;
                var cache = self.cache;
                var queue, i = 0,
                    len, name, src, required, type, $target;

                if (typeof target !== 'string') {
                    return false;
                }

                queue = target.split(' ');

                len = queue.length;

                for (name in cache) {
                    src = cache[name].self;
                    required = src.data('required');
                    type = src[0] ? src[0].type : '';
                    $target = self.$selector.find('[data-required=' + required + ']');

                    if ($.inArray(required, queue) !== -1) {
                        if ($.inArray(type, ['checkbox', 'file', 'radio']) !== -1) {
                            $target.off('change.iui-validate');
                        } else {
                            $target.off('focus.iui-validate blur.iui-validate');
                        }
                        $target.data('event.iui-validate', false);
                        delete cache[name];
                    }
                }
                self.bindEvent();

            };


            Validate.prototype.add = function (options) {
                var self = this;
                var collections = options || self.options.collections;

                for (var i = 0; i < collections.length; i++) {
                    var target = self.$selector.find('[data-required="' + collections[i].required + '"]');
                    var msg = "iui-validate:cannot find element by data-required=\"" + collections[i].required + "\"";

                    if (target.length) {
                        self.mapping(collections[i]);
                    } else {
                        if (window.console) {
                            console.warn(msg);
                        } else {
                            throw msg;
                        }
                    }
                }
                if (options) {
                    $.merge(self.options.collections, options);
                }
                self.bindEvent();
            };


            /**
             * bindEvent     行为方法，如：focus、blur、change
             */
            Validate.prototype.bindEvent = function () {
                var self = this;
                var handleArr = handler.call(this);
                var $selector = self.$selector;
                var changeHandleArr = ['select-one', 'select-multiple', 'radio', 'checkbox', 'file'];

                $.each(handleArr, function (key, value) {
                    var $target = $selector.find(value);
                    var type, requiredName;

                    if ($target[0] === void 0) {
                        return;
                    }

                    type = $target[0].type;

                    requiredName = value.replace('[', '').replace(']', '').split('=')[1];

                    if ($target.data('event.iui-validate')) {
                        return;
                    }

                    if (self.cache[requiredName].options.unchange !== true) {
                        if ($.inArray(type, changeHandleArr) !== -1) {
                            $target.on('change.iui-validate', { self: self }, changeEmitter);
                            $target.data('event.iui-validate', true);
                            return;
                        }
                    }


                    $target.on('focus.iui-validate', { self: self }, focusEmitter);

                    if (self.cache[requiredName].options.unblur !== true) {
                        $target.on('blur.iui-validate', { self: self }, blurEmitter);
                    }

                    $target.data('event.iui-validate', true);

                });

            };

            /**
             * verify  行为触发验证
             * @param  {Object} glob      全局对象 Validate
             * @param  {String} eventName 事件名
             */
            Validate.prototype.verify = function (glob, eventName) {
                var $this = $(this);
                var collections = glob.cache[$this.data('required')];
                var matches = collections.matches;
                var status = false;

                /**
                 * @param {String}      name        验证函数名
                 * @param {Object}      params      验证字段（自定义字段）：errMsg、range
                 */
                $.each(matches, function (name, params) {
                    var result = glob.options.strategy[name].call(collections, params);
                    status = result === void (0) ? 1 : 2;
                    $this.data('validateStatus', result);
                    glob.message(status, collections, name);
                    return status === 2 ? false : true;
                });
                if (glob.errors[$this.attr('data-required')]) {
                    glob.options.callback.call(glob);
                }

                $this.trigger('validate.' + eventName, collections);

                return status;
            };

            /**
             * [message description]
             * @param  {Number} status      验证状态：0 未验证状态，1 验证且通过，2 验证且不通过
             * @param  {Object} options     被转化后的验证参数
             * @param  {String} matchesName 验证函数名
             *
             */
            Validate.prototype.message = function (status, cache, matchesName) {
                var className, contextClass, msg, $target, $msgEl, errors = this.errors;
                // this.activeErrors = '';
                if (status === 0) {
                    className = this.options.infoClass;
                    msg = cache.infoMsg;
                } else if (status === 1) {
                    className = this.options.successClass;
                    msg = '';
                } else if (status === 2) {
                    className = this.options.errorClass;
                    msg = cache.matches[matchesName].errMsg;
                } else {
                    // 后期再考虑 status === anything ...
                }
                if (status === 2) {
                    errors[cache.options.required] = msg;
                    // this.activeErrors = errors;
                    this.activeErrors[cache.options.required] = msg;
                }

                if (!this.options.errorClass) {
                    return false;
                }
                contextClass = ['info', 'success', 'error'];
                $msgEl = this.options.globalMessage ? $(this.options.globalMessage) : cache.context;
                className = className.replace(/\./g, ' ').slice(1);
                $msgEl.removeClass('validate-context-info validate-context-success validate-context-error')
                    .addClass('validate-context-' + contextClass[status]).find('.validate-message').remove();
                $target = $('<div class="validate-message ' + className + '" >' + msg + '</div>');
                $msgEl.append($target);

                // this.options.callback?this.options.callback.call(this,errors):false;
                // console.info(msg)
                //console.info(errors)

            };

            /**
             * batch    批量验证
             * @param  {Boolean}            circulation       强制循环，true：将全部验证，false：其中一个验证不通过将返回false并中断循环
             * @return {Boolean}
             *
             */
            Validate.prototype.batch = function (circulation) {
                var self = this;
                var status = [];
                self.activeErrors = {};
                $.each(this.cache, function (name, target) {
                    if (target.self[0].disabled) {
                        return;
                    }
                    var initStatus = target.self.data('validateStatus');
                    var result = !initStatus ? self.verify.call(target.self, self, 'batch') : initStatus;

                    if (circulation && result === 2) {
                        status.push(result);
                        return false;
                    }

                    status.push(result);
                });
                return $.inArray(2, status) === -1 ? true : false;
            };
            /**
             * handler 生成事件代理对象
             * @return {String}     事件委托目标
             */
            function handler() {
                var queue = [];
                var collections = this.cache;
                for (var name in collections) {
                    queue.push('[data-required=' + name + ']');
                }
                return queue;
            }


            function focusEmitter(event) {
                var self = event.data.self;
                var $this = $(this);
                var _name = $this.data('required');
                var collections = self.cache[_name];
                if (self.options.infoClass) {
                    self.message(0, collections);
                }
                $this.trigger('validate.focus', collections);
            }

            function blurEmitter(event) {
                var $this = $(this);
                var self = event.data.self;
                var requiredName = $this.data('required');
                self.activeErrors = {};
                self.verify.call(this, self, 'blur');
            }

            function changeEmitter(event) {
                var self = event.data.self;
                self.activeErrors = {};
                self.verify.call(this, self, 'change');
            }

            return new Validate(options);
        }
    });

    /**
     * emailSuffix 组件
     * @param {String}      container               组件的执行上下文
     * @param {String}      style                   组件被 append 的位置，若为global，则 append to container，否则将插入到和被调用元素的同一级节点中
     * @param {String}      item                    邮箱后缀列表 li 的 class
     * @param {String}      current                 邮箱后缀列表 li 的选中 class
     * @param {Array}       emails                  常用邮箱后缀，若要增加新邮箱后缀，需要复写原有默认的邮箱，否则数组将会被覆盖
     * @param {Number}      delay                   delay 毫秒后隐藏列表
     * @param {Number}      offsetLeft              组件定位 - left
     * @param {Number}      offsetTop               组件定位 - top
     * @param {Number}      offsetWidth             组件宽度 - width
     * @param {Number}      offsetHeight            组件高度 - height
     * @param {Function}    checkedCall             回调函数，选中后触发
     */


    $.fn.IUI({
        emailSuffix: function (options) {
            return this.each(function () {
                var defaults = {
                    container: 'body',
                    style: 'global',
                    item: 'email-item',
                    current: 'checked',
                    emails: ['163.com', '126.com', 'qq.com', 'gmail.com', 'sina.com', '139.com', '189.com', 'sohu.com'],
                    delay: 300,
                    offsetLeft: $(this).offset().left,
                    offsetTop: $(this).offset().top,
                    offsetWidth: $(this).outerWidth(),
                    offsetHeight: $(this).outerHeight(),
                    checkedCall: function () { }
                };
                var $selector = $(this);
                var config = $.extend({}, defaults, options);
                var $list = $('<ul class="email-list hide"></ul>');
                var $body = $(config.container);
                var time = null;
                var listHtml = function (arr, input) {

                    var str = '';
                    var val = input.value || null;
                    var prefix = val ? val.split('@')[0] : false;
                    var suffix = val ? val.split('@')[1] : false;

                    for (var i = 0; i < arr.length; i++) {
                        email = arr[i];
                        if ((prefix && !suffix) || suffix && email.indexOf(suffix) !== -1) {
                            str += '<li class="' + config.item + '" data-value="' + prefix + '@' + email + '">' + prefix + '@' + email + '</li>';
                        }

                    }
                    return str;
                };

                var keyEvent = function (keyCode, target, obj) {
                    var tmp = [38, 40];
                    if ($.inArray(keyCode, tmp) === -1 || target.hasClass('hide')) {
                        return false;
                    }
                    var direction = $.inArray(keyCode, tmp) >= 1 ? true : false;
                    var $target = target;
                    var len = $target.find('li').length;
                    var $targetCurrent = $target.find('li.checked');
                    $target.find('li').removeClass('checked');

                    if (direction) {
                        //down
                        if ($targetCurrent.length && $targetCurrent.index() !== len - 1) {
                            $targetCurrent.next().addClass('checked');
                        } else {
                            $target.find('li').eq(0).addClass('checked');
                        }
                    } else {
                        //up
                        if ($targetCurrent.index() > 0) {
                            $targetCurrent.prev().addClass('checked');
                        } else {
                            $target.find('li').eq(len - 1).addClass('checked');
                        }
                    }

                    obj.val($.trim($target.find('li.checked').text()));

                    config.checkedCall.apply($selector, [event, config]);
                };
                var resize = function () {
                    var left = config.offsetLeft;
                    var top = config.offsetTop;
                    var width = config.offsetWidth;
                    $list.css({
                        left: left,
                        top: top + config.offsetHeight,
                        width: width
                    });
                };

                resize();

                if (config.style === 'global') {
                    $body.append($list);
                    $(window).on('resize.emailSuffix', resize);
                } else {
                    $selector.parent().css('position', 'relative').append($list);
                }

                $selector.on('keyup.emailSuffix', function (event) {
                    var val = this.value;
                    if (val.charAt(0) !== '@' && val.split('@').length === 2 && $.inArray(event.keyCode, [40, 38, 13]) === -1) {
                        var str = listHtml(config.emails, this);

                        $list.html(str).removeClass('hide').find('li').eq(0).addClass('checked');

                    } else if ($.inArray(event.keyCode, [40, 38, 13]) === -1) {
                        $list.html('').addClass('hide');
                    }
                });

                $selector.on('keydown.emailSuffix', function (event) {
                    var $selected = $list.find('li.checked');
                    keyEvent(event.keyCode, $list, $selector);
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        if ($selected.length) {
                            $selector.val($.trim($selected.text()));
                        }
                        $list.addClass('hide');
                    }
                });

                $selector.on('blur.emailSuffix', function (event) {
                    time = setTimeout(function () {
                        $list.addClass('hide');
                    }, config.delay);
                });

                $list.on('click', '.' + config.item, function (event) {
                    event.preventDefault();
                    clearTimeout(time);
                    $selector.val($(this).attr('data-value')).focus();
                    $list.addClass('hide');
                    config.checkedCall.apply($selector, [event, config]);
                    return false;
                });
            });


        }
    });


    /**
     * hideNavbar 组件
     * @description  滚动隐藏导航
     */
    $.fn.IUI({
        hideNavbar: function (options) {


            var $this = this;

            var $navbar = $(".navbar");

            var height = $navbar.outerHeight() / 2;

            var hideNavbar = this.hasClass('hide-navbar-on-scroll');

            var previousScroll, currentScroll, scrollHeight, offsetHeight, reachEnd, action, navbarHidden, direction, wait;

            if (!hideNavbar && !$navbar.length) {
                return false;
            }


            previousScroll = currentScroll = Math.abs($this.scrollTop());

            wait = IUI_UTILS.throttle(handleScroll, 100);

            $this.on('scroll', wait);


            function handleScroll(event) {
                currentScroll = $this.scrollTop();

                scrollHeight = this.scrollHeight;

                offsetHeight = this.offsetHeight;

                navbarHidden = $navbar.hasClass('navbar-hidden');
                //direction : true => up
                direction = previousScroll <= currentScroll;

                previousScroll = currentScroll;


                if (currentScroll < height || previousScroll > currentScroll) {
                    behavior(false);
                    return false;
                }

                // //reachEnd : true => 滚动条到底部
                // reachEnd = currentScroll + offsetHeight >= scrollHeight - 20;

                behavior(direction);



                return false;
            }

            function behavior(direction) {
                //direction => hide
                if (direction) {
                    if ($navbar.hasClass('navbar-hidden')) {
                        return false;
                    }
                    $navbar.addClass('navbar-hidden');
                } else {

                    if (!$navbar.hasClass('navbar-hidden')) {
                        return false;
                    }

                    $navbar.removeClass('navbar-hidden');
                }

            }
        }
    });

    /**
     * fresh 组件
     *
     */

    $.fn.IUI({
        fresh: function (options) {
            var freshDefaults = {
                diretion: true,
                startTouch: function () { },
                afterFresh: function () { }
            };

            function Fresh(ele, options) {
                this.container = ele;
                this.options = $.extend(true, freshDefaults, options);
                this.event();
            }
            Fresh.prototype.event = function () {
                var _this = this;
                var startY, curY, moveY;
                //上拉刷新是禁止页面滚动
                document.body.addEventListener('touchmove', function (event) {
                    if (_this.lock) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }, false);

                this.container.on({

                    touchstart: function (e) {

                        fnTouches(e);

                        startY = e.touches[0].pageY;

                        changeTime.call(_this, 0);

                        _this.options.startTouch.call(_this);

                    },
                    touchmove: function (e) {

                        fnTouches(e);

                        var _translate;

                        curY = e.touches[0].pageY;

                        if (_this.options.diretion) {
                            freshBottom.call(_this, startY, curY, moveY);
                            //freshBottom();
                        } else {
                            freshTop.call(_this, startY, curY, moveY);
                        }

                    },

                    touchend: function (e) {

                        if (_this.lock) {

                            changeTime.call(_this, 300);

                            _translateY(_this.container, 0);

                            _this.lock = 0;

                            _this.options.afterFresh.call(_this);
                        }
                    }
                });
            };

            function freshBottom(startY, curY, moveY) {
                var $this = this.container;
                var height = $this.height();
                var childHeight = $this.find('[role="freshList"]').height();
                //向上
                if (curY > startY) {

                    this.lock = 0;
                }

                //向下且滚动到底部了
                if (curY < startY && $this.scrollTop() + height >= childHeight) {

                    if (!this.lock) {

                        this.lock = 1;
                    }

                    moveY = curY - startY;

                    _translate = Math.round(moveY * 0.5);

                    if (moveY < -10) {

                        _translate = Math.round((moveY * 0.5 + 10) * 0.3 - 10);

                    }

                    _translateY($this, _translate);
                }
            }

            function freshTop(startY, curY, moveY) {
                var $this = this.container;
                //向下
                if (curY < startY) {

                    this.lock = 0;
                }

                //向上且到顶部
                if (curY > startY && $this.scrollTop() <= 0) {

                    if (!this.lock) {

                        this.lock = 1;
                    }

                    moveY = curY - startY;

                    _translate = Math.round(moveY * 0.5);

                    if (moveY > 10) {

                        _translate = Math.round((moveY * 0.5 + 10) * 0.3 - 10);

                    }

                    _translateY($this, _translate);
                }
            }
            // touches
            function fnTouches(e) {

                if (!e.touches) {
                    e.touches = e.originalEvent.touches;
                }
            }

            function _translateY(obj, y) {
                obj.css({
                    "-webkit-transform": 'translateY(' + y + 'px)',
                    transform: 'translateY(' + y + 'px)'
                });
            }

            function changeTime(times) {
                this.container.css({
                    '-webkit-transition-duration': times + 'ms',
                    'transition-duration': times + 'ms'
                });
            }
            return new Fresh(this, options);
        }
    });

    /**
     * mPicker 组件
     *
     * *** options ***
     *
     * @param {Str}                                 display    显示的方式，默认是显示在底部    'bottom'/'modal'
     * @param {Boolean}                             shadow     点击遮罩隐藏组件 - 默认为false;若为false，则禁止点击遮罩隐藏组件
     * @param {Number}                              level      显示的层级，默认：1
     * @param {Number}                              rows       picker显示的行数，默认：4
     * @param {Boolean}                             Linkage    选择联动 - 若为false，则不联动
     * @param {Array}                               dataJson   渲染picker的json - 有规定的格式，可查看json文件。不联动默认遍历获取第一个json
     * @param {Number}                              height     每一行的高度
     * @param {Boolean}                             idDefault  匹配默认值 - 若为false，则不匹配
     * @param {Str}                                 splitStr   设置分割value的符号，与默认值和显示在input里的值有关
     * @param {Boolean}                             isshort    是否开启简写，默认是关闭的
     * @param {Element selector}                    header     picker头部html
     *@param {function}                             confirm: function() {}
     *@param {function}                             cancel: function() {}
     *
     * *** 关于json格式 ***
     *jsonChange.js是针对campaign里的json做的格式转换
     *
     * *** 关于value值 ***
     *
     *$('.select-value').data('value1')：第一级的value值
     *$('.select-value').data('value2')：第二级的value值
     *
     *
     * *** methods ***
     *
     *  show                详情请查阅源码部分
     *  hide                详情请查阅源码部分
     *  updateData          详情请查阅源码部分
     *
     */
    function __dealCssEvent(eventNameArr, callback) {
        var events = eventNameArr,
            i, dom = this; // jshint ignore:line

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }

    //动画结束事件兼容
    $.fn.animationEnd = function (callback) {
        __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };
    $.fn.transitionEnd = function (callback) {
        __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
        return this;
    };
    $.fn.IUI({
        mPicker: function (options) {
            var mPickerDefaults = {
                display: 'bottom',
                shadow: false,
                level: 1,
                rows: 4,
                Linkage: false,
                dataJson: '',
                height: 36,
                idDefault: false,
                splitStr: ' ',
                isshort: false,
                header: '<div class="mPicker-header"></div>',
                footer: '<div class="mPicker-footer"><a href="javascript:;" class="mPicker-confirm">确定</a><a href="javascript:;" class="mPicker-cancel">取消</a></div>',
                confirm: function () { },
                cancel: function () { }
            };

            var moveStartLock;

            var ulWidth = ['100%', '50%'];

            var $body = $('body');

            var $mask = $('<div class="mPicker-mask hide"></div>');

            var $mPicker = $('<div class="mPicker hide"></div>');

            var lock, timeTouchend;
            /**
             * 添加mPicker容器
             */
            if (!$('.mPicker').length) {
                $body.append($mPicker);
                $mPicker.append($mask);
            }
            /**
             * 阻止默认滚动
             */
            $body.on('touchmove', function (event) {
                if (lock) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
            /**
             * 禁止滚动－－防止滚动选择时页面滚动
             */
            $body.on({
                touchstart: function (event) {
                    event.preventDefault();
                    lock = 1;
                },
                touchmove: function (event) {
                    event.preventDefault();
                    //兼容部分手机有时候没有触发touchend
                    clearTimeout(timeTouchend);
                    timeTouchend = setTimeout(function () {
                        lock = 0;
                    }, 100);
                },
                touchend: function (event) {
                    event.preventDefault();
                    lock = 0;
                }
            }, '.mPicker-main');

            function MPicker(ele, options) {
                if (!ele.length) {
                    return false;
                }
                this.container = ele;
                this.mpicker = $('.mPicker');
                this.mask = this.mpicker.find('.mPicker-mask');
                this.options = $.extend({}, mPickerDefaults, options);
                this.init();
                this.event();
                this.container.data('mPicker', this);

            }


            MPicker.prototype = {
                //初始化MPicker
                init: function (ele, options) {

                    /**
                     * 根据行数计算居中的位置
                     */
                    this.middleRowIndex = parseInt(this.options.rows / 2.5);
                    //展示方式
                    this.disy = this.options.display === 'bottom' ? 'mPicker-bottom down' : 'mPicker-modal';
                },
                //初始化mpicker,根据json渲染html结构,添加遮罩，边框等
                render: function () {
                    /**
                     *  初始化mpicker,根据json渲染html结构
                     *  添加遮罩，边框等
                     */
                    var listStr;
                    var jsonData = [];
                    var mainStr;
                    var self = this;
                    /**
                     * 添加 mPicker-main元素
                     */
                    jsonData.push(self.options.dataJson);
                    if (self.options.level === 2) {
                        var childStr = getChildJson(self.options.dataJson[0]);
                        jsonData.push(childStr);
                    }
                    listStr = concatHtmlList.call(self, jsonData);
                    mainStr = '<div class="mPicker-main ' + self.disy + '" data-pickerId="' + self.pickerId + '">' + self.options.header + '<div class="mPicker-content">' + listStr + '</div><div class="mPicker-shadow"></div>' + self.options.footer + '</div>';
                    self.mpicker.append(mainStr);
                    /**
                     * 设置变量
                     */
                    self.mpickerMain = self.mpicker.find('.mPicker-main');
                    //元素集合
                    var $content = self.mpickerMain.find('.mPicker-content');
                    var $list = self.mpickerMain.find('.mPicker-list');
                    var $listUl = $list.find('ul');
                    //var $itemOne=$listUl.eq(0);
                    //var $itemTwo=self.options.level === 2?$listUl.eq(1):false;
                    //设置多列宽度
                    self.options.level > 1 ? $list.width(ulWidth[self.options.level - 1]) : false;

                    //添加选中的边框
                    $list.append('<div class="mPicker-active-box"></div>');
                    $list.find('.mPicker-active-box').height(self.options.height);
                    /**
                     * 设置选中的边框位置
                     */
                    var activeBoxMarginTop = self.options.rows % 2 === 0 ? -self.options.height - 2 + 'px' : -self.options.height * 0.5 - 2 + 'px';

                    $content.find('.mPicker-active-box').css({
                        'margin-top': activeBoxMarginTop
                    });
                    /**
                     * 设置内容高度
                     */
                    $content.height(self.options.height * self.options.rows);
                    $list.height(self.options.height * self.options.rows);

                },
                showPicker: function () {
                    var self = this;
                    self.mpicker.data('object', self);
                    //元素集合
                    //var $content=this.mpickerMain.find('.mPicker-content');

                    //var $listUl=$list.find('ul');
                    // var $itemOne=$listUl.eq(0);
                    // var $itemTwo=this.options.level === 2?$listUl.eq(1):false;
                    self.render();
                    var $list = self.mpicker.find('.mPicker-list');
                    self.container.focus();
                    self.container.blur();
                    self.mpicker.removeClass('hide');
                    self.mask.removeClass('hide');

                    clearTimeout(self.timer);
                    self.timer = setTimeout(function () {
                        self.mpickerMain.removeClass('down');
                    }, 10);
                    /**
                     * 显示默认值(判断点击确定选择后不再获取默认值)
                     */
                    if (!self.noFirst && self.options.idDefault) {
                        matchDefaultData.call(self);
                    }
                    /**
                     * 获取input的data-id显示选中的元素
                     */
                    var id = [];
                    setTransitionY(self.container, 0);
                    $list.each(function (index, ele) {
                        var dataVal = self.container.data('id' + (index + 1)) ? self.container.data('id' + (index + 1)) : 0;
                        id.push(dataVal);
                    });
                    //获得选中的元素
                    setItemMultiple.call(self, id);
                },
                hidePicker: function (callback) {
                    var self = this;
                    self.mask.addClass('hide');

                    if (self.options.display === 'bottom') {
                        self.mpicker.find('.mPicker-main').addClass('down').transitionEnd(function () {
                            self.mpicker.addClass('hide');
                            self.mpicker.find('.mPicker-main').remove();
                            if (typeof (callback) === 'function') {
                                callback.call(self);
                            }
                        });
                        return false;
                    }

                    self.mpicker.addClass('hide');
                    callback.call(self);
                    self.mpicker.find('.mPicker-main').remove();
                },
                updateData: function (data) {
                    var self = this;
                    if (!data.length) {
                        return;
                    }
                    self.noFirst = false;
                    for (var i = 0; i < self.options.level; i++) {
                        self.container.data('id' + (i + 1), 0);
                        self.container.data('value' + (i + 1), '');
                    }
                    self.options.dataJson = data;
                    self.mpicker.find('.mPicker-main').remove();
                },
                confirm: function () {
                    var self = this;
                    var str = '';
                    var $list = self.mpicker.find('.mPicker-main').find('.mPicker-list');
                    var $listUl = $list.find('ul');
                    self.noFirst = true;
                    $.each($listUl, function (index, ele) {
                        var $active = $(ele).find('.active');
                        var splitStr = index === 0 ? '' : self.options.splitStr;
                        if ($active.length > 0) {
                            index = index + 1;
                            self.container.data('value' + index, $active.data('value'));
                            self.container.data('id' + index, $active.data('id'));
                            str += splitStr + $active.text();
                        }
                    });
                    self.container.val(str);
                    self.hidePicker(self.options.confirm);

                },
                cancel: function () {
                    var self = this;
                    self.hidePicker(self.options.cancel);
                },
                /**
                 *  事件
                 *  取消，确定，点击遮罩，列表滑动事件
                 */
                event: function () {
                    /**
                     * 点击打开选择
                     */
                    var self = this;
                    this.container.off('touchstart.container click.container').on('touchstart.container click.container', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        self.showPicker();
                    });
                    //点击确定
                    this.mpicker.off('touchstart.confirm click.confirm').on('touchstart.confirm click.confirm', '.mPicker-confirm', function (e) {
                        e.preventDefault();
                        var self = $('.mPicker').data('object');
                        self.confirm();
                    });

                    //点击取消
                    this.mpicker.off('touchstart.cancel click.cancel').on('touchstart.cancel click.cancel', '.mPicker-cancel', function (e) {
                        e.preventDefault();
                        var self = $('.mPicker').data('object');
                        self.cancel();
                    });

                    //点击遮罩取消
                    this.mpicker.off('touchstart.mask click.mask').on('touchstart.mask click.mask', '.mPicker-mask', function (e) {
                        e.preventDefault();
                        var self = $('.mPicker').data('object');
                        if (self.options.shadow) {
                            self.cancel();
                        }
                    });

                    //遍历下拉列表
                    var startY;
                    var curY;
                    var moveY;


                    this.mpicker.off('touchstart.list mousedown.list').on('touchstart.list mousedown.list', '.mPicker-list', function (event) {
                        fnTouches(event);
                        var $this = $(this).find('ul');

                        var tranY = getTranslateY($this);
                        startY = getTouches(event).y - tranY;

                        changeTime(0, $this);
                        moveStartLock = true;
                    });

                    this.mpicker.off('touchmove.list mousemove.list').on('touchmove.list mousemove.list', '.mPicker-list', function (event) {
                        event.preventDefault();
                        if (!moveStartLock) {
                            return false;
                        }
                        var self = $('.mPicker').data('object');

                        fnTouches(event);

                        var translate;

                        var $this = $(this).find('ul');

                        var listHeight = $this.height();

                        var itemHeight = self.options.height * self.options.rows;

                        var transMaxY = itemHeight - listHeight - parseInt(self.options.rows / 2) * self.options.height;

                        var transMinY = self.middleRowIndex * self.options.height;

                        curY = getTouches(event).y;

                        moveY = curY - startY;

                        translate = Math.round(moveY);
                        //过了
                        translate = translate > transMinY ? transMinY : translate;
                        translate = translate < transMaxY ? transMaxY : translate;
                        // console.info(self.options.rows)
                        setTransitionY($this, translate);
                        //兼容部分手机有时候没有触发touchend
                        clearTimeout(self.timeTouchend);
                        self.timeTouchend = setTimeout(function () {
                            touchEndFn.call(self, $this);
                        }, 100);
                    });

                    this.mpicker.off('touchend.list mouseup.list').on('touchend.list mouseup.list', '.mPicker-list', function (event) {
                        event.preventDefault();
                        var self = $('.mPicker').data('object');
                        var $this = $(this).find('ul');
                        touchEndFn.call(self, $this);

                    });
                }
            }

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x: event.touches[0].pageX,
                        y: event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x: event.pageX,
                            y: event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x: event.clientX,
                            y: event.clientY
                        };
                    }
                }
            }


            /**
             *  滑动结束执行函数
             *  ele:对应的list==>ul
             *  如果是联动，则更新相应的list html
             */
            function touchEndFn(ele) {
                clearTimeout(this.timeTouchend);
                var result = setActiveItem.call(this, ele);

                var resultId = result.target.data('id');

                var itemIndex = this.mpicker.find('.mPicker-list ul').index(ele);
                // this.lock=0;
                //点第一个联动
                if (this.options.Linkage && itemIndex === 0) {
                    refreshItemTwo.call(this, resultId);
                }
                //回调函数
                // callbackFnName[itemIndex].call(ele, result);

                changeTime(400, ele);

                moveStartLock = false;
            }

            /**
             *  第一次打开匹配默认值
             */
            function matchDefaultData() {
                var self = this;
                var inputVal = this.container.val().split(this.options.splitStr);
                var defaultId = [];
                var defaultValue = [];
                var dataLevel2;
                var hasLevel2;
                //遍历获取id
                var nameEach = function (data, index) {
                    $.each(data, function (key, val) {
                        if (val.name == inputVal[index]) {
                            defaultId[index] = key;
                            defaultValue[index] = val.value;
                            self.container.data('value' + (index + 1), defaultValue[index]);
                            self.container.data('id' + (index + 1), defaultId[index]);
                            return false;
                        }
                    });
                };
                if (typeof (inputVal) !== 'object' || !inputVal.length || !self.mpicker.find('.mPicker-main')) {
                    return;
                }

                //将name值默认匹配成id，一旦匹配就跳出循环，多个匹配取第一个
                //匹配一级
                nameEach(this.options.dataJson, 0);
                //匹配二级
                dataLevel2 = this.options.Linkage ? this.options.dataJson[defaultId[0]] : this.options.dataJson[0];

                if (this.options.Linkage && this.options.level === 2 && defaultId[0] && inputVal.length > 1) {
                    hasLevel2 = 1;
                }

                if (!this.options.Linkage && this.options.level === 2 && inputVal.length > 1) {
                    hasLevel2 = 1;
                }

                if (hasLevel2) {
                    dataLevel2 = getChildJson(dataLevel2);
                    nameEach(dataLevel2, 1);
                }

            }
            /**
             *  滑动结束，设置transtion值，返回当前选中的li index和元素
             *  obj:滑动的元素
             *  val:可有可没有。可传入data-id或不传
             */
            function setActiveItem(obj, val) {
                var result;
                var y = Math.round((getTranslateY(obj) / this.options.height));
                //得到选中的index
                var index = typeof (val) === 'number' ? obj.find('li').index(obj.find('li[data-id="' + val + '"]')) : this.middleRowIndex - y;

                var y2 = -this.options.height * (index - this.middleRowIndex);
                setTransitionY(obj, y2);
                //添加选中样式
                obj.find('li').eq(index).addClass('active').siblings('li').removeClass('active');

                result = {
                    target: obj.find('li').eq(index),
                    index: index
                };
                return result;
            }
            /**
             *  传入第一级index，更新第二级html（联动的情况下）
             */
            function refreshItemTwo(index) {
                //兼容不存在child
                var $itemTwo = this.mpicker.find('.mPicker-list ul').eq(1);
                var data = getChildJson(this.options.dataJson[index]);
                if (this.options.level === 2) {
                    var str = concatHtmlItem.call(this, data);
                    $itemTwo.html(str);
                    setActiveItem.call(this, $itemTwo, 0);
                }
            }
            /**
             *  传入数组，设置多级html
             *  index:数组
             */
            function setItemMultiple(index) {
                var $item = this.mpicker.find('.mPicker-list ul');
                var index1 = index[0] ? index[0] : 0;
                var index2 = index[1] ? index[1] : 0;

                if (this.options.Linkage) {
                    refreshItemTwo.call(this, index1);
                }
                setActiveItem.call(this, $item.eq(0), index1);

                if (this.options.level === 2) {
                    setActiveItem.call(this, $item.eq(1), index2);
                }
            }

            /**
             *  传入json,判断返回json,child
             *  兼容不存在child报错的情况
             */
            function getChildJson(data) {
                if (!data) {
                    return [];
                }
                var result = ({}).hasOwnProperty.call(data, 'child') ? data.child : [];
                return result;
            }
            /**
             *  传入json拼接html，只有li级别
             */
            function concatHtmlItem(data) {
                var str = '';
                var self = this;
                $.each(data, function (index, val) {
                    var name = self.options.isshort ? val.shortName : val.name;
                    str += '<li data-value="' + val.value + '" data-id="' + index + '">' + name + '</li>';
                });
                return str;
            }
            /**
             *  传入li html 拼接ul
             */
            function concatHtmlList(data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var itemStr = concatHtmlItem.call(this, data[i]);
                    html += '<div class="mPicker-list"><ul>' + itemStr + '</ul></div>';
                }
                return html;
            }
            /**
             *  设置运动时间
             */
            function changeTime(times, obj) {
                obj.css({
                    '-webkit-transition-duration': times + 'ms',
                    'transition-duration': times + 'ms'
                });
            }
            /**
             *  touches兼容
             */
            function fnTouches(e) {
                if (!e.touches) {
                    e.touches = e.originalEvent.touches;
                }
            }
            /**
             *  设置translateY
             */
            function setTransitionY(obj, y) {
                obj.css({
                    "-webkit-transform": 'translateY(' + y + 'px)',
                    transform: 'translateY(' + y + 'px)'
                });
            }
            /**
             *  获取translateY
             */
            function getTranslateY(obj) {
                var transZRegex = /\.*translateY\((.*)px\)/i;
                var result;
                if (obj[0].style.WebkitTransform) {
                    result = parseInt(transZRegex.exec(obj[0].style.WebkitTransform)[1]);
                } else if (obj[0].style.transform) {
                    result = parseInt(transZRegex.exec(obj[0].style.transform)[1]);
                }
                return result;
            }


            return this.each(function () {
                new MPicker($(this), options);
            });


        }
    });

    /**
     * verification 验证码发送组件
     *
     * *** options ***
     *
     countSeconds：     阻止发送倒计时秒数
     disabledClass：    阻止发送添加类名      (默认：'disabled')
     countTarget：      阻止发送倒计时显示元素 (默认：$('.J-timeout'))
     getVerCodeSuccess：获取验证码成功回调
     getVerCodeFail：   获取验证码失败回调
     *
     * *** html ***
     *
     *
     <a href="{{path}}/actsubmitrest/sendVerifyCode" class="J-path J-send-verCode">
        发送验证码&nbsp;
        <span class="J-timeout">30s</span>
     </a>
     *
     *
     * *** 调用 ***
     *
     *$('.J-send-verCode').IUI('verification');
     *
     *
     */

    $.fn.IUI({
        verification: function (options) {
            var defaults = {
                countSeconds: 60,
                disabledClass: 'disabled',
                countTarget: $('.J-timeout'),
                getVerCodeSuccess: function () { },
                getVerCodeFail: function () { }

            };

            function Verification(ele, options) {
                this.target = ele;
                this.options = $.extend(true, defaults, options);
                this.init();
            }
            Verification.prototype = {
                init: function () {
                    var self = this;
                    self.target.on('click', function (event) {
                        event.preventDefault();
                        //判断是否有手机号，验证码接口必须有手机号
                        var mobile = $('input[name="mobile"]').val();
                        if (!(mobile && /^1[3|4|5|6|7|8][0-9]\d{8}$/.test(mobile))) {
                            $.tip({
                                text: '请填写正确的手机号码',
                                timeout: 2000
                            });
                            return false;
                        }
                        //如果是停止发送状态，则不发送验证码
                        if (self.target.hasClass(self.options.disabledClass)) {
                            return false;
                        }
                        self.target.addClass(self.options.disabledClass);
                        self.getVerCode();
                    });

                },
                //获取验证码
                getVerCode: function () {
                    var self = this;
                    var url = self.target.attr('href') || self.target.data('url');
                    var mobile = $('input[name="mobile"]').val();
                    var activityId = $('meta[name="activityId"]').attr('content');
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: { mobile: mobile, activityId: activityId },
                    })
                        .done(function (data) {
                            if (data.code === 200) {
                                self.options.countTarget ? self.count() : false;
                                self.options.getVerCodeSuccess();
                                return false;
                            }
                            self.target.removeClass(self.options.disabledClass);
                            $.tip({
                                timeout: 2000,
                                text: data.msg
                            });
                            self.options.getVerCodeFail();

                        })
                        .fail(function () {
                            self.target.removeClass(self.options.disabledClass);
                        })
                        .always(function () {

                        });
                },
                //倒计时
                count: function () {
                    var self = this;
                    var $target = $(self.options.countTarget);
                    var Timer;
                    var i = self.options.countSeconds;
                    self.target.addClass(self.options.disabledClass);
                    Timer = setInterval(function () {
                        $target.html(i + 's');
                        i--;
                        if (i < 0) {
                            $target.html('');
                            self.target.removeClass(self.options.disabledClass);
                            clearInterval(Timer);
                        }
                    }, 1000);

                }
            }
            return this.each(function () {
                new Verification($(this), options);
            });
        }

    });

    /**
     * bathpath  根路径替换（因为本地正式，测试线路径根目录不同）
     *
     * *** options ***
     *
     attr：根目录匹配路径－－查找属性 (默认：['href','action','data-url'])
     *
     * *** html ***
     *
     *
     * 第一种：action
     <form action="{{path}}/actsubmitrest/testformSubmit" class="J-path">

     * 第二种：href
     <a href="{{path}}/actsubmitrest/sendVerifyCode" class="J-path"></a>
     *
     *
     * 第三种：data-url
     <div data-url="{{path}}/actsubmitrest/sendVerifyCode" class="J-path"></div>
     *
     * *** 调用 ***
     *
     * 已在iui尾部全局调用
     *$('.J-path').IUI('basepath');
     *
     *
     */

    /**
     * bathpath跟路径替换
     */
    $.fn.IUI({
        basepath: function (options) {
            var defaults = {
                attr: ['href', 'action', 'data-url']
            };
            var param = $.extend({}, defaults, options);
            var $this = $(this);
            var basepath = $('meta[name="basepath"]').attr('content');
            var attr = ['href', 'action', 'data-url'];
            var temp;
            if (!$this.length) {
                return false;
            }

            $.each($this, function (index, el) {
                for (var i = 0; i < attr.length; i++) {
                    temp = $(el).attr(attr[i]);
                    if (temp) {
                        temp = basepath+temp;
                        $(el).attr(attr[i], temp);
                    }
                }
            });

        }
    });


    /**
     * 翻页插件
     */
    $.extend({
        slippage: function (options) {
            
            var defaults = {
                wrapper: '#selector',
                mouseDrag: true,
                touchDrag: true,
                direction: 0,
                swiperStart: function () { },
                swiperMove: function () { },
                swiperEnd: function () { }
            };

            var normalStyle = {
                '-webkit-transform-origin': 'center top 0px',
                '-webkit-transform': 'scale(1)',
                '-webkit-transition': 'none',
                'transform-origin': 'center top 0px',
                'transform': 'scale(1)',
                'transition': 'none'
            };

            function getPage(event) {
                var offset = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                return [offset.pageX, offset.pageY];
            }

            function Slippage(options) {
                var _this = this;
                _this.config = $.extend({}, defaults, options);
                _this.$el = $(_this.config.wrapper);
                statusInit.call(_this);
                statusSave.call(_this);
                this.init();
            }

            Slippage.prototype.init = function () {
                var _this = this;
                if (_this.$el.children().length === 0) {
                    return false;
                }
                _this.$userItems = _this.$el.children();
                _this.itemsAmount = _this.$userItems.length;
                _this.wrapItems();
                _this.$slippageItems = _this.$el.find('.slippage-item');
                _this.$slippageWrapper = _this.$el.find('.slippage-wrapper');
                _this.$slippageItems.eq(0).css(normalStyle).addClass('z-current');
                _this.$slippageItems.find('.slippage-content').scrollTop(1);
                if (_this.$slippageItems.length <= 1) {
                    return false;
                }
                _this.eventTypes();
                _this.gestures();
                //console.log(_this);
            };

            function statusInit() {
                var _this = this;
                _this.pageIndex = _this.prevIndex = _this.nextIndex = _this.arrow = _this.pageHeight = 0;
            }

            function statusStart() {
                var _this = this;
                var amount = _this.itemsAmount;
                var prevIndex = _this.pageIndex - 1;
                var nextIndex = _this.pageIndex + 1;

                // _this.animateStart  = 1;
                _this.prevIndex = prevIndex < 0 ? amount - prevIndex - 2 : prevIndex;
                _this.nextIndex = nextIndex < amount ? nextIndex : 0;
                console.info('prevIndex pageIndex nextIndex', _this.prevIndex, _this.pageIndex, _this.nextIndex)
                _this.pageHeight = _this.$slippageItems.eq(0)[_this.config.direction ? 'outerHeight' : 'outerWidth']();
            }

            function statusMove(direction) {
                var _this = this;
                _this.pageHeight = direction ? Math.abs(_this.pageHeight) : _this.pageHeight > 0 ? -_this.pageHeight : _this.pageHeight;
                _this.animateTarget = direction ? _this.nextIndex : _this.prevIndex;
            }

            function statusSave() {
                var _this = this;
                _this.cache = {
                    pageIndex: _this.pageIndex,
                    prevIndex: _this.prevIndex,
                    nextIndex: _this.nextIndex,
                    arrow: _this.arrow,
                    pageHeight: _this.pageHeight

                };
            }

            function statusRead() {
                var _this = this;
                _this.pageIndex = _this.cache.pageIndex;
                _this.prevIndex = _this.cache.prevIndex;
                _this.nextIndex = _this.cache.nextIndex;
                _this.arrow = _this.cache.arrow;
                _this.pageHeight = _this.cache.pageHeight;
            }

            Slippage.prototype.gestures = function () {
                var _this = this;
                var transition = _this.config.direction ? 'translateY' : 'translateX';

                function swapEvents(type) {
                    if (type === 'on') {
                        $(document).on(_this.eventType.move, dragMove);
                        $(document).on(_this.eventType.end, dragEnd);
                    } else if (type === 'off') {
                        $(document).off(_this.eventType.move);
                        $(document).off(_this.eventType.end);
                    }
                }

                function dragStart(event) {

                    //console.log('start');

                    if (!_this.$slippageItems.hasClass('z-active')) {
                        var $this = _this.$eventTarget = $(this);
                        _this.mouseInit = getPage(event)[_this.config.direction];
                        swapEvents('on');
                        $this.css(normalStyle);
                        statusStart.call(_this);
                        _this.config.swiperStart.call(_this);
                    }
                }

                function dragMove(event) {
                    //console.log('move');
                    var arrows = getPage(event)[_this.config.direction];
                    var offset = arrows - _this.mouseInit;
                    // let $next        = _this.$slippageItems.eq(_this.nextIndex);
                    // let $prev        = _this.$slippageItems.eq(_this.prevIndex);
                    var direction = arrows < _this.mouseInit;
                    // let $scrollEl    = _this.$eventTarget.find('.slippage-content');
                    // let scrollAmount = $scrollEl.length ? $scrollEl[0].scrollHeight - $scrollEl[0].offsetHeight : 0;

                    _this.$slippageItems.removeClass('z-active');
                    _this.arrow = arrows;
                    statusMove.call(_this, direction, event);
                    _this.$slippageItems.eq(_this.animateTarget).addClass('z-active');
                    _this.$slippageItems.eq(_this.animateTarget).css({
                        '-webkit-transition': 'none',
                        'transition': 'none',
                        '-webkit-transform': transition + '(' + (_this.pageHeight + offset) + 'px)',
                        'transform': transition + '(' + (_this.pageHeight + offset) + 'px)'
                    });
                    _this.config.swiperMove.call(_this);
                }

                function dragEnd(event) {
                    if (_this.$slippageItems.eq(_this.animateTarget).hasClass('z-active')) {
                        var rollback = Math.abs(_this.arrow - _this.mouseInit) < 100;
                        var offsetEnd = rollback ? _this.pageHeight + 'px' : '0px';
                        // let direction     = _this.arrow < _this.mouseInit;
                        var $scrollEl = _this.$eventTarget.find('.slippage-content');

                        if (rollback) {
                            _this.pageHeight = 0;
                        } else {
                            _this.pageIndex = _this.animateTarget;
                            _this.$slippageItems.eq(_this.animateTarget).addClass('z-current');
                        }

                        $scrollEl.scrollTop($scrollEl.length && $scrollEl[0].scrollTop ? $scrollEl[0].scrollTop - 1 : 1);

                        _this.$slippageItems.eq(_this.animateTarget).css({
                            '-webkit-transition': '-webkit-transform .4s linear',
                            'transition': 'transform .4s linear',
                            '-webkit-transform': transition + '(' + offsetEnd + ')',
                            'transform': transition + '(' + offsetEnd + ')'
                        });

                        _this.$slippageItems.eq(_this.animateTarget).on(IUI_UTILS.transitionEnd, function (event) {
                            $(this).removeClass('z-active');
                            if (rollback) {
                                _this.$eventTarget.addClass('z-current');
                            } else {
                                _this.$eventTarget.removeClass('z-current');
                            }
                            _this.$eventTarget.css(normalStyle);
                            _this.$slippageItems.eq(_this.animateTarget).off(IUI_UTILS.transitionEnd);
                        });
                        
                        statusSave.call(_this);
                        _this.config.swiperEnd.call(_this);
                    } else {
                        statusRead.call(_this);
                    }

                    swapEvents('off');

                    //console.log('end');
                }

                _this.$el.on(_this.eventType.start, '.slippage-item', dragStart);
            };

            Slippage.prototype.wrapItems = function () {
                var _this = this;
                _this.$userItems.wrapAll('<div class="slippage-wrapper">').wrap('<div class="slippage-item"></div>');
                _this.$el.css('display', 'block');
            };

            Slippage.prototype.eventTypes = function () {
                var _this = this,
                    types = ['s', 'e', 'x'],
                    isMobile = navigator.userAgent.toLocaleLowerCase().indexOf('mobile') !== -1;

                _this.eventType = {};

                if (isMobile) {
                    types = ['touchstart.slippage', 'touchmove.slippage', 'touchend.slippage touchcancel.slippage'];
                } else {
                    types = ['mousedown.slippage', 'mousemove.slippage', 'mouseup.slippage'];
                }

                _this.eventType.start = types[0];
                _this.eventType.move = types[1];
                _this.eventType.end = types[2];
            };

            return new Slippage(options);
        }
    });


}(jQuery, window, document, undefined));
$('.J-path').IUI('basepath');
