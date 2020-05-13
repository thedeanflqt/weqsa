jQuery= jQuery.noConflict();

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
                new DPlayer({
                    container: document.getElementById('a1'),
                    video: {
                        url: d.data.flvurl,
                        type: 'hls'
                    },
                    hlsjsConfig: {
                        p2pConfig: {
                            logLevel: true,
                            live: false,
                        }
                    },
                });
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