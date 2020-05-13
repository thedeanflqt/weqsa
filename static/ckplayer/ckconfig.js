var _CK_;
var playerWidth = '100%';
var playerHeight = 524;
var FLContainer = "a1";
var flvurl = '';
var index_data = '';
var index = '';
var timeout = '';
var video_width = "580";
var video_height = "400";

// 播放器大小计算
var vdiv = jQuery('.video-container');
if(vdiv[0]) {
    var width = vdiv.width();
    if(width > 580){
        width = '580';
    }
    var height =  Math.round(width / (video_width / video_height));
    vdiv.css({"width":width,'height':video_height});
}

var nowTime=0,parentTime=3;
var counter=0;
var timeSet=null;
var yunark = {
    mobile: !1,
    autostart: !1,
    setup: function(el) {
		if (this.mobile) {
            var t = document.createElement(FLContainer);
            t.style.height = window.playerHeight + "px";
        }
       var flashvars={
			f:'/static/ckplayer/m3u8.swf',
			m3u8:window.flvurl,
			c:0,
			e:2,
			s:4,
			p:this.autostart,
			loaded:'loadedHandler'
			};
		var video=[window.flvurl];
		CKobject.embed('/static/ckplayer/ckplayer.swf',FLContainer,'ckplayer_a1',window.playerWidth,'100%',false,flashvars,video);
    }
};
function loadedHandler(){
	_CK_=CKobject.getObjectById('ckplayer_a1');
	_CK_.addListener('time','timeHandler');
}
function timeHandler(t){
	if(!t) t=0;
	if(t===nowTime && timeSet===null){
		console.log(counter);
		counter++;
		if(counter>60){
			counter=0;
			_CK_.videoSeek(nowTime+parentTime);
			_CK_.sendNetstreame();
			timeSet=window.setTimeout(timeSetJs,3500);
		}
	}
	if(nowTime!==t){
		counter=0;
	}
	nowTime=t;
}
function timeSetJs(){
	timeSet=null;
}

// 视频请求
var play_init = function() {
    jQuery.ajax({
        'tpye':'GET',
        'url':'/play.php?callback=?',
        'dataType':'json',
        'data':{
            'tid':tid,
            'rand':Math.random()
        },
        'success':function(d){
            if(d.k){
                flvurl = d.data.flvurl;
                yunark.setup(jQuery.FLContainer);
                index_data = d.data.index_data;
                timeout = d.data.timeout;
                index = get_index();
                if (!index) return;
                pre_load();
            } else {
                if(d.msg){
                    jQuery('#v-loading').html(d.msg);
                } else {
                    jQuery('#v-loading').html('系统繁忙，请刷新重试。');
                }
            }
        }
    });
};

// 视频流文件
var get_index = function() {
    var min_index = parseInt(getcookie('min_index')) || 0;
    for (var key in index_data) {
        if (index_data[key].id < min_index) continue;
        if (index_data[key].id > min_index + 4) break; // 防止过度加载
        var result = {
            id: index_data[key].id,
            url: index_data[key].url,
        };
        delete index_data[key];
        return result;
    }
    return null;
};

// 视频预加载
setcookie('min_index', 1);
var pre_load = function() {
    var index = get_index();
    if (!index) {
        setTimeout(function() {
            pre_load();
        }, 5000);
    } else {
        var vod_url = index.url;
        jQuery.ajax({
            url: vod_url,
            type: 'GET',
            cache: true,
            timeout: timeout,
            success: function() {
                pre_load();
            }
        });
    }
};

play_init();