var video_width = "580"
    ,video_height = "400";

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
                var videoObject = {
                    container: "#a1",
                    variable: 'player',
                    size: '960,160',
                    video:d.data.flvurl
                };
                var player = new ckplayer(videoObject);
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

play_init();