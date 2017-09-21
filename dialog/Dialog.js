$(function(){
        (function(){
            /*
            * @param {string} 要传入的标签
            * @param {string} 地址
            * */
            function loading(tag,src,callback){
                var iDxCss = document.createElement(tag);
                if (tag === 'link') {
                    iDxCss.href = src;
                    iDxCss.type = "text/css";
                    iDxCss.rel = "stylesheet";
                }else if (tag === 'script'){
                    iDxCss.src = src;
                    iDxCss.async = 'async';
                }
                iDxCss.onload = function () {
                    callback && callback();
                };
                document.getElementsByTagName('head')[0].appendChild(iDxCss);
            }
            loading('link','//at.alicdn.com/t/font_410754_6zacn7e4x0p5jyvi.css');
            loading('link','./index.css',function(){
                const call_service_url = "http://192.168.1.10:7573/nls/qas";
                function Dialog(){
                    this.container = $('<div class="dialog"></div>');
                    this.dialogFlag = $('<img class="dialogFlag" src="http://img002.qufenqi.com/products/de/d5/ded5814896a12a29328a814dda1e8c6d.png"></img>');
                    this.dialogFlexBox = $('<div class="dialog-flex-box"></div>');
                    this.header = $('<div class="dialog-header"></div>');
                    this.service =$('<span class="dialog-service">客服中心</span>');
                    this.date = $('<span class="dialog-date"></span>');
                    this.log = $('<span class="dialog-log">关闭</span>');
                    this.dialogueBox = $('<div class="dialog-dialogue-box"></div>');
                    this.dialogue = $('<div class="dialog-dialogue left">');
                    this.icon = $('<span class="iconfont icon-kefu icon"></span>');
                    this.trangle = $('<span class="triangle left"></span>');
                    this.message = $('<span class="dialog-message left">你好，小趣在此等主人很久了，有什么烦恼快和小趣说说吧～</span>');
                    this.footer = $('<div class="dialog-footer"></div>');
                    this.inputText = $('<textarea type="text" name="message" value="" class="dialogMes"></textarea>');
                    this.submitBox = $('<div class="dialog-submit"></div>');
                    this.showMessage = $('<span>按下回车键发送</span>');
                    this.send = $('<button>发送</button>');
                }
                Dialog.prototype.init = function(){
                    this.date.html(getCurTime());
                    this.header.append(this.service).append(this.date).append(this.log);
                    this.dialogue.append(this.icon).append(this.trangle).append(this.message);
                    this.dialogueBox.append(this.dialogue);
                    this.submitBox.append(this.showMessage).append(this.send);
                    this.footer.append(this.inputText).append(this.submitBox);
                    this.dialogFlexBox.append(this.header).append(this.dialogueBox).append(this.footer);
                    this.container.append(this.dialogFlag).append(this.dialogFlexBox);
                    $('body').append(this.container).append(this.dialogFlag);
                };
                function MsgDia(){//定义一个消息类
                    this.dialogue = $('<div class="dialog-dialogue">');
                    this.icon = $('<span class="iconfont icon"></span>');
                    this.trangle = $('<span class="triangle"></span>');
                    this.message = $('<span class="dialog-message"></span>');
                }
                MsgDia.prototype.setMsg = function(msg,bFlag,color){//参数一：消息内容； 参数二：标识客服发的为service； 参数三：为true时消息内容以红色字体显示
                    if(bFlag === 'service'){
                        this.dialogue.addClass('left');
                        this.icon.addClass('icon-kefu');
                        this.trangle.addClass('left');
                        this.message.addClass('left');
                    }else{
                        this.dialogue.addClass('right');
                        this.icon.addClass('icon-yonghu');
                        this.trangle.addClass('right');
                        this.message.addClass('right');
                    }
                    if(color){
                        this.message.addClass('select');
                    }
                    this.message.html(msg);
                    this.dialogue.append(this.icon).append(this.trangle).append(this.message);
                    return this.dialogue;
                };
                function Msgmulti(){
                    this.dialogue = $('<div class="dialog-dialogue left">');
                    this.ol = $('<ol></ol>');
                    this.title = $('<h3>相关搜索</h3>');
                    this.content = $('<li></li>');
                    this.description = $('<a href="#"></a>');
                }
                Msgmulti.prototype.setMsg = function(msg){
                    if(Array.isArray(msg) && msg.length){
                        this.ol.append(this.title);
                        for(var i=0; i<msg.length; i++){
                            var  $description = $('<a href="#"></a>');
                            $description.html(i+1 + "、" + msg[i]);
                            this.content.append($description);
                            this.ol.append(this.content);
                        }
                        return this.dialogue.append(this.ol);
                    }
                    return
                };
                //初始化组件
                var dialog = new Dialog();
                dialog.init();
                //点击是否展示组价
                var bFlag = false;
                var $Dialog = $('.dialog');
                var $dialogFlexBox = $('.dialog-flex-box');
                $(".dialogFlag").on('click',function(){
                    if(!bFlag){
                        $dialogFlexBox.css({
                            display: "block"
                        });
                    }else{
                        $dialogFlexBox.css({
                            display: "none"
                        });
                    }
                    bFlag = !bFlag;
                });
                $(".dialog-log").on('click',function(){
                    $dialogFlexBox.css({
                        display: "none"
                    });
                    bFlag = !bFlag;
                });
                //提交问题
                $('.dialog-submit button').on('click',function(e,submenu){
                    var oMessage = $('.dialogMes').val();
                    $dialogBox = $('.dialog-dialogue-box');
                    var data = {    //要传递给后端的参数
                        question: "下单审核"
                    };
                    data.question = oMessage;
                    $(".dialog-date").html(getCurTime());
                    if(oMessage || submenu){
                        if(submenu){
                            oMessage = submenu.split('、')[1];
                            data.question = oMessage;
                        }
                        var oMsg = new MsgDia();
                        $(".dialog-dialogue-box").append(oMsg.setMsg(oMessage,'yonghu'));
                        $dialogBox.scrollTop(10000000);
                        $.ajax({
                            type: "POST",
                            url: call_service_url,
                            data: JSON.stringify(data),
                            success: function(data){
                                var oDialogBox = $(".dialog-dialogue-box");
                                var msg = '';
                                var color = '';
                                var oMsg = new MsgDia();
                                if(data.code === 200){
                                    msg = data.data.answer;
                                    var oMsgmulti = new Msgmulti();
                                    oDialogBox.append(oMsg.setMsg(msg,'service',color));
                                    oDialogBox.append(oMsgmulti.setMsg(data.data.related_questions));

                                }else{
                                    msg = '无答案';
                                    color = true;
                                    oDialogBox.append(oMsg.setMsg(msg,'service',color));

                                }
                                $dialogBox.scrollTop(10000000);
                            },
                            error: function(){
                                var msg = '网络错误';
                                var oMsg = new MsgDia();
                                $(".dialog-dialogue-box").append(oMsg.setMsg(msg,'service',true));
                                $dialogBox.scrollTop(10000000);
                            },
                            dataType: 'json'
                        });
                    }
                    $('.dialogMes').val('');
                });
                $(document).on('keydown',function(e){
                    if(e.keyCode === 13){
                        $('.dialog-submit button').trigger('click');
                        return false;
                    }
                });
                $("body").on('click','.dialog-dialogue.left ol li a',function(){
                    var data = $(this).html();
                    $('.dialog-submit button').trigger('click',data);
                });


                //拖拽窗口
                var oDialog = $(".dialog-header").get(0);
                var oDialogbox = $(".dialog").get(0);
                var oDialogFlag = $(".dialogFlag").get(0);
                oDialog.onmousedown = function(e){
                    e = e || window.event;
                    var iDisX = e.clientX - oDialogbox.offsetLeft;
                    var iDisY = e.clientY - oDialogbox.offsetTop;
                    document.onmousemove = function(e){
                        e = e || window.event;
                        var iLeft = e.clientX - iDisX;
                        var iTop = e.clientY - iDisY;
                        oDialogbox.style.left = iLeft + "px";
                        oDialogbox.style.top = iTop + "px";
                        return false;
                    }
                    oDialog.onmouseup = function(){
                        document.onmousemove = null;
                        oDialog.onmouseup = null;
                        return false;
                    }
                    return false;
                };

                //1. 获取当前时间
                // 2.返回类型string
                function getCurTime(){
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();
                    var hour = date.getHours();
                    var min = date.getMinutes();
                    return ("更新于： " + year +"-" + month +"-"+ day +" "+ hour+":" + min);
                }
            });
        })();
    });