/**
 * jQuery's jqfaceedit Plugin
 *
 * @author cdm
 * @version 0.2
 * @copyright Copyright(c) 2012.
 * @date 2012-08-09
 */
(function($) {
    var em = [
                {'id':1,'phrase':':hehe:','url':'1.png'},
				{'id':2,'phrase':':haha:','url':'2.png'},
                {'id':3,'phrase':':tushe:','url':'3.png'},
				{'id':4,'phrase':':a:','url':'4.png'},
				{'id':5,'phrase':':ku:','url':'5.png'},
				{'id':6,'phrase':':nu:','url':'6.png'},
				{'id':7,'phrase':':kaixin:','url':'7.png'},
				{'id':8,'phrase':':han:','url':'8.png'},
				{'id':9,'phrase':':lei:','url':'9.png'},
				{'id':10,'phrase':':heixian:','url':'10.png'},
				{'id':11,'phrase':':bishi:','url':'11.png'},
				{'id':12,'phrase':':bugaoxing:','url':'12.png'},
				{'id':13,'phrase':':zhenbang:','url':'13.png'},
				{'id':14,'phrase':':qian:','url':'14.png'},
				{'id':15,'phrase':':yiwen:','url':'15.png'},
				{'id':16,'phrase':':yinxian:','url':'16.png'},
				{'id':17,'phrase':':tu:','url':'17.png'},
				{'id':18,'phrase':':yi:','url':'18.png'},
				{'id':19,'phrase':':weiqu:','url':'19.png'},
				{'id':20,'phrase':':huaxin:','url':'20.png'},
				{'id':21,'phrase':':leng:','url':'21.png'},
				{'id':22,'phrase':':taikaixin:','url':'22.png'},
				{'id':23,'phrase':':huaji:','url':'23.png'},
				{'id':24,'phrase':':kuanghan:','url':'24.png'},
				{'id':25,'phrase':':guai:','url':'25.png'},
				{'id':26,'phrase':':shuijiao:','url':'26.png'},
				{'id':27,'phrase':':jingku:','url':'27.png'},
				{'id':28,'phrase':':shengqi:','url':'28.png'},
				{'id':29,'phrase':':jingya:','url':'29.png'},
				{'id':30,'phrase':':peng:','url':'30.png'},
            ];
    //textarea设置光标位置
    function setCursorPosition(ctrl, pos) {
        if(ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        } else if(ctrl.createTextRange) {// IE Support
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

    //获取多行文本框光标位置
    function getPositionForTextArea(obj)
    {
        var Sel = document.selection.createRange();
        var Sel2 = Sel.duplicate();
        Sel2.moveToElementText(obj);
        var CaretPos = -1;
        while(Sel2.inRange(Sel)) {
            Sel2.moveStart('character');
            CaretPos++;
        }
       return CaretPos ;

    }

    $.fn.extend({
        jqfaceedit : function(options) {
            var defaults = {
                txtAreaObj : '', //TextArea对象
                containerObj : '', //表情框父对象
                textareaid: 'needmessage',//textarea元素的id
                popName : '', //iframe弹出框名称,containerObj为父窗体时使用
                emotions : em, //表情信息json格式，id表情排序号 phrase表情使用的替代短语url表情文件名
                top : 0, //相对偏移
                left : 0 //相对偏移
            };
            
            var options = $.extend(defaults, options);
            var cpos=0;//光标位置，支持从光标处插入数据
            var textareaid = options.textareaid;
            
            return this.each(function() {
                var Obj = $(this);
                var container = options.containerObj;
                if ( document.selection ) {//ie
                    options.txtAreaObj.bind("click keyup",function(e){//点击或键盘动作时设置光标值
                        e.stopPropagation();
                        cpos = getPositionForTextArea(document.getElementById(textareaid)?document.getElementById(textareaid):window.frames[options.popName].document.getElementById(textareaid));
                    });
                }
                $(Obj).bind("click", function(e) {
                    e.stopPropagation();
                    var faceHtml = '<div id="face">';
                    faceHtml += '<div id="facebox">';
                    faceHtml += '<div id="face_detail" class="facebox clearfix"><ul>';

                    for( i = 0; i < options.emotions.length; i++) {
                        faceHtml += '<li text=' + options.emotions[i].phrase + ' type=' + i + '><img title=' + options.emotions[i].phrase + ' src="template/ymg6.com_1482816295/touch/style/bq/'+ options.emotions[i].url + '"  style="cursor:pointer; position:relative;"   /></li>';
                    }
                    faceHtml += '</ul></div>';
                    faceHtml += '</div><div class="arrow arrow_t"></div></div>';

                    container.find('#face').remove();
                    container.append(faceHtml);
                    
                    container.find("#face_detail ul >li").bind("click", function(e) {
                        var txt = $(this).attr("text");
                        var faceText = txt;

                        //options.txtAreaObj.val(options.txtAreaObj.val() + faceText);
                        var tclen = options.txtAreaObj.val().length;
                        
                        var tc = document.getElementById(textareaid);
                        if ( options.popName ) {
                            tc = window.frames[options.popName].document.getElementById(textareaid);
                        }
                        var pos = 0;
                        if( typeof document.selection != "undefined") {//IE
                            options.txtAreaObj.focus();
                            setCursorPosition(tc, cpos);//设置焦点
                            document.selection.createRange().text = faceText;
                            //计算光标位置
                            pos = getPositionForTextArea(tc); 
                        } else {//火狐
                            //计算光标位置
                            pos = tc.selectionStart + faceText.length;
                            options.txtAreaObj.val(options.txtAreaObj.val().substr(0, tc.selectionStart) + faceText + options.txtAreaObj.val().substring(tc.selectionStart, tclen));
                        }
                        cpos = pos;
                        setCursorPosition(tc, pos);//设置焦点
                        container.find("#face").remove();

                    });
                    //处理js事件冒泡问题
                    $('body').bind("click", function(e) {
                        e.stopPropagation();
                        container.find('#face').remove();
                        $(this).unbind('click');
                    });
                    if(options.popName != '') {
                        $(window.frames[options.popName].document).find('body').bind("click", function(e) {
                            e.stopPropagation();
                            container.find('#face').remove();
                        });
                    }
                    container.find('#face').bind("click", function(e) {
                        e.stopPropagation();
                    });
                    var offset = $(e.target).offset();
                    offset.top += options.top;
                    offset.left += options.left;
                    container.find("#face").css(offset).show();
                });
            });
        },
    })
})(jQuery);

