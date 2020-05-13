// 视频初始化
var playerWidth = '100%';
var playerHeight = 524;
var FLContainer = "flash";
var flvurl = '';
var index_data = '';
var index = '';
var timeout = '';
var video_width = "480";
var video_height = "270";
var vdiv = jQuery('.video-container');
var width = vdiv.width();
height =  Math.round(width / (video_width / video_height));
vdiv.css("height",height);

// 视频请求
var play = function() {
    jQuery.ajax({
        'tpye':'GET',
        'url':'/play.php?callback=?',
        'dataType':'json',
        'data':{
            'vid':vid,
            'rand':Math.random()
        },
        'success':function(d){
            if(d.k){
                flvurl = d.data.flvurl;
                index_data = d.data.index_data;
                timeout = d.data.timeout;
                index = get_index();
                if (!index) return;
                jQuery.flvurl = flvurl;
                yunark.setup(jQuery.FLContainer);
                pre_load();
            }else{
                alert('系统繁忙，请刷新重试。');
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
setcookie('min_index', 0);
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
            },
        });
    }
};
jQuery(function(){
    play();
});