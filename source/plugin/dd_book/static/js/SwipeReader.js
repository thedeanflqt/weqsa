
function SwipeReader(t) {

    t || (t = {}), this.option = t.option, this.$wrapper = $(t.wrapperSelector), this.$scroller = function () {
        return this.$wrapper.find(t.scrollerSelector)
    }.bind(this), this.$pager = $(t.pagerSelector), this.onSwipePrev = t.onSwipePrev || r, this.onSwipeNext = t.onSwipeNext || r, this.gap = t.gap || 16, this.pager = {
        cur: 1,
        max: 1
    }, this.enabled = 1, this.initEvents(), this.initPager()

}
var r = function () {
};
SwipeReader.prototype = {
    initEvents: function () {
        var t, r = this,
            i = r.$wrapper,
            n = r.$scroller,
            a = 1,
            s = {},
            o = 0;
        i.on({
            touchstart: function (i) {
                if (r.enabled) {
                    var l = i.target || {};
                    /^(?:a|input|label|i|use|svg)$/i.test(l.tagName) || $(l).parents("a").length || (a = !0, t = i.originalEvent.targetTouches[0] || i, s.x1 = t.pageX, s.y1 = t.pageY, o = n().data("left") || 0)
                }
            },
            touchmove: function (e) {
                if (a) {
                    e.preventDefault(), t = e.originalEvent.targetTouches[0] || e, s.x2 = t.pageX, s.y2 = t.pageY;
                    var r = o - (s.x2 - s.x1);
                    n().css({
                        "-webkit-transform": "translateX(" + -r + "px)",
                        transform: "translateX(" + -r + "px)"
                    })
                }
            },
            touchend: function () {
                if (a) {
                    a = !1;
                    var e = s.x2 - s.x1,
                        i = r.gap;
                    if (!s.x2 || Math.abs(e) < i) {
                        var n = window.innerWidth,
                            l = [n / 3, 2 * n / 3];
                        s.x1 <= l[0] ? r.turnLeft() : s.x1 >= l[1] ? r.turnRight() : (r.scrollTo(o))
                    } else e > i ? r.turnLeft() : e < i ? r.turnRight() : r.scrollTo(o);
                    t = null, s = {}, o = 0
                }
            }
        })
    },
    initPager: function () {
        this.resetPager(), this.refreshPager(), this.turnTo(1)
    },
    resetPager: function () {
        var t = this.$scroller()[0],
            e = this.pager,
            r = this.gap;
        var o_max = e.max, o_cur = e.cur;
        //e.cur = 1,
        e.max = Math.round((t.scrollWidth + r) / (t.clientWidth + r));
        if (o_max > e.max) {
            if (o_cur > e.max) {
                e.cur = e.max;
                this.turnTo(e.cur);
            }
        }
    },
    refreshPager: function () {
        var t = this.pager;
        this.$pager.html([t.cur, t.max].join("/"))
    },
    scrollTo: function (t) {
        var e = this.$scroller(),
            r = e.data("left") || 0,
            i = function () {
                r += .5 * (t - r), Math.abs(t - r) < 1 ? e.data("left", t).css({
                        "-webkit-transform": "translateX(" + -t + "px)",
                        transform: "translateX(" + -t + "px)"
                    }) : (e.css({
                        "-webkit-transform": "translateX(" + -r + "px)",
                        transform: "translateX(" + -r + "px)"
                    }), window.requestAnimationFrame ? requestAnimationFrame(i) : setTimeout(i, 17))
            };
        i()
    },
    turnTo: function (t) {
        t = parseInt(t);
        localStoreSetItem('read_chapter_' + this.option.book_id, this.option.chapter.current_colum_id + ':' + t + ':' + (new Date().getTime()/1000));
        var e = this.pager,
            r = this.gap,
            i = this.$scroller().width();
        e.cur = t, this.scrollTo((t - 1) * (i + r)), this.refreshPager()
    },
    turnLeft: function () {
        var t = this,
            e = t.pager,
            r = e.cur - 1;
        r < 1 ? (e.cur = 1, t.enabled = !1, t.onSwipePrev(function () {
                var r = t.$scroller(),
                    i = r[0].scrollWidth - r.width();
                t.enabled = !0, t.$scroller().data("left", i).css({
                    "-webkit-transform": "translateX(" + -i + "px)",
                    transform: "translateX(" + -i + "px)"
                }), t.initPager(), e.cur = 1, t.refreshPager()
            }, function () {
                t.enabled = !0
            })) : this.turnTo(r)
    },
    turnRight: function () {
        var t = this,
            e = t.pager,
            r = parseInt(e.cur) + 1;
        r > e.max ? (e.cur = 1, t.enabled = !1, t.onSwipeNext(function () {
                t.enabled = !0, t.turnTo(e.max)
            }, function () {
                t.enabled = !0
            })) : (t.turnTo(r))
    },
    enable: function () {
        this.enabled = !0, this.refresh()
    },
    disable: function () {
        this.enabled = !1, this.$scroller().css({
            "-webkit-transform": "",
            transform: ""
        })
    },
    refresh: function () {
        this.initPager()
    },
    restart: function () {
        this.$scroller().css({
            "-webkit-transform": "",
            transform: ""
        }), this.initPager()
    }
};
