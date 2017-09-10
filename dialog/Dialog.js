(function(){
    $(function(){
        //定义一个组件类
        function Dialog(){
            this.defaultSettings = {
                width : 400
            };
            this.container = $('<div class="dialog"></div>');
            this.dialogFlag = $('<img class="dialogFlag" src="http://img003.qufenqi.com/products/c7/1f/c71fdf369cbe48617dc7af8ba721109f.gif"></img>');
            this.header = $('<div class="dialog-header"></div>');
            this.service =$('<span class="dialog-service">客服中心</span>');
            this.date = $('<span class="dialog-date"></span>');
            this.log = $('<span class="dialog-log">日志</span>');
            this.dialogueBox = $('<div class="dialog-dialogue-box"></div>');
            this.dialogue = $('<div class="dialog-dialogue left">');
            this.icon = $('<span class="iconfont icon-kefu icon"></span>');
            this.trangle = $('<span class="triangle left"></span>');
            this.message = $('<span class="dialog-message left">你好，小蜜在此等主人很久了，有什么烦恼快和小蜜说说吧～</span>');
            this.footer = $('<div class="dialog-footer"></div>');
            this.inputText = $('<textarea type="text" name="message" value="" class="dialogMes"></textarea>');
            this.submitBox = $('<div class="dialog-submit"></div>');
            this.showMessage = $('<span>按下回车键发送</span>');
            this.send = $('<button>发送</button>');
        }
        Dialog.prototype.init = function(){
            this.container.append(this.dialogFlag);
            this.date.html(getCurTime());
            this.header.append(this.service).append(this.date).append(this.log);
            this.dialogue.append(this.icon).append(this.trangle).append(this.message);
            this.dialogueBox.append(this.dialogue);
            this.submitBox.append(this.showMessage).append(this.send);
            this.footer.append(this.inputText).append(this.submitBox);
            this.container.append(this.dialogFlag).append(this.header).append(this.dialogueBox).append(this.footer);
            this.container.width(0);
            $('body').append(this.container);
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
        //初始化组件
        var dialog = new Dialog();
        dialog.init();
        //点击是否展示组价
        var bFlag = false;
        var $Dialog = $('.dialog');
        $(".dialogFlag").on('click',function(){
            if(!bFlag){
                $Dialog.width(400);
            }else{
                $Dialog.width(0);
            }
            bFlag = !bFlag;
        });
        //提交问题
        $('.dialog-submit button').on('click',function(){
            var oMessage = $('.dialogMes').val();
            $dialogBox = $('.dialog-dialogue-box');
            var data = {    //要传递给后端的参数
                question: "下单审核",
                sign: "call_center",
                sign_id: 123,
                domains: "",
                app: "call_center"
            };
            data.question = oMessage;
            $(".dialog-date").html(getCurTime());
            if(oMessage){
                var oMsg = new MsgDia();
                $(".dialog-dialogue-box").append(oMsg.setMsg(oMessage,'yonghu'));
                $dialogBox.scrollTop(10000000);
                $.ajax({
                    type: "POST",
                    url: 'http://192.168.1.10:7800/nls/qas',
                    data: JSON.stringify(data),
                    success: function(data){
                        var msg = '';
                        var color = '';
                        if(data.code === 200){
                            msg = data.data.data;
                        }else{
                            msg = '无答案';
                            color = true;
                            $message.addClass('select');
                        }
                        var oMsg = new MsgDia();
                        $(".dialog-dialogue-box").append(oMsg.setMsg(msg,'service',color));
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
    })
})();