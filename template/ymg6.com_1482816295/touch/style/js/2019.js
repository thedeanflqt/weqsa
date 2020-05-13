$("ul.tabs li").click(function() {
    $("ul.tabs li").removeClass("active");
    $(this).addClass("active");
    $(".tab_content").hide();
    var activeTab = $(this).find("a").attr("href");
    $(activeTab+'_content').fadeIn();
});

$('.show-text a, #links a, .js-appJump').click(function() {
    if (window.android != null && typeof (window.android) != "undefined") {
        var url = $(this).attr('href');
        window.android.callAndroid(url);
        return false;
    }
});

$(document).ready(function() {
    $(".tab_content").hide();
    var trace = location.href.split("#");
    if(trace[1] && trace[1].indexOf("tab") >= 0){
        $("ul.tabs li#a_"+trace[1]).addClass("active").show();
        $('#'+trace[1]+'_content').fadeIn();
    } else {
        $("ul.tabs li:first").addClass("active").show();
        $(".tab_content:first").show();
    }
    // 随机背景
    if ($('.js-randomBg')) {
        var colors = ["#db2a3a", "#e05125", "#e97424", "#e59e0e", "#4abca3", "#46b4cd", "#4293ee", "#255fcd", "#643dd4", "#a033ca", "#e15197", "#66676b", "#8d8b7e", "#7e899f", "#8c1fb8", "#ee3d8d", "#55565a", "#4764cf"];
        var bgs = document.getElementsByClassName("js-randomBg");
        for (var i = 0; i < bgs.length; i++) {
            var r = Math.floor(Math.random() * 18);
            bgs[i].style.backgroundColor = colors[r];
        }
    }
});
