$(function () {
    //节流阀 互斥锁 这个方式发现是有bug的
    let flag = true
    let recommend_top = $('.recommend').offset().top
    console.log(recommend_top);
    // $(window).scroll()
    fixedtool();
    function fixedtool() {
        if ($(document).scrollTop() >= recommend_top) {
            $('.fixedtool').stop().fadeIn()
        } else {
            $('.fixedtool').stop().fadeOut()
        }
    }
    //let _temp = []
    $(window).on('scroll', function (e) {//触发至少两次滚动才进入 一次滚动事件不进入 也可以解决bug
        fixedtool();
       // _temp.push(e)
        //console.log('length',_temp.length);
        if (flag) {
        // if (flag && _temp.length > 1) {
            console.log(e);
            //console.log(flag, '滚动事件',_temp.length);
            $('.floor .w').each(function (i, item) {
                // if($(document).scrollTop() >= $(item).offset().top){
                    // console.log(i);
               // if ($(document).scrollTop() >= $(item).offset().top) { //Math.ceil修复bug scrollTop文档顶部在屏幕外的距离 offset().top元素距离文档顶部的距离 前者大于等于后者说明已滚动到当前元素
                 if (Math.ceil($(document).scrollTop()) >= parseInt($(item).offset().top)) { //Math.ceil修复bug最简单 像素值有小数导致的bug
                    $('.fixedtool li').eq(i).addClass('current').siblings().removeClass('current')
                    console.log('进入分支的',i);
                    //_temp = []
                }
            })
        }
    })
    //第一种绑定方式
    // $('.fixedtool ul').on('click','li',function(){
    //     console.log($(this));
    //     $(this).siblings().removeClass('current')
    //     $(this).addClass('current')
    // })

    //第二种绑定方式 电梯导航颜色切换
    // $('.fixedtool li').on('click', function () {
    //     $(this).siblings().removeClass('current')
    //     $(this).addClass('current')
    //     // $('html,body').scrollTop($('.jiadian').offset().top)
    //     let classname = $(this).attr('data-type')
    //     console.log(classname);
    //     let top = $(`.${classname}`).offset().top
    //     $('html,body').stop().animate({
    //         scrollTop:top
    //     },500)
    // })

    //根据索引号也可以操作 更简单
    $('.fixedtool li').on('click', function () {
        _temp = []
        flag = false;
        // console.log(flag);
        $(this).addClass('current').siblings().removeClass('current')
        let top = $('.floor .w').eq($(this).index()).offset().top
        console.log(parseInt(top));
        // $('html,body').stop().animate({
        $('html').stop().animate({
            // scrollTop:top
            scrollTop: parseInt(top)
        }, function () {
            flag = true
            //_temp = [] //动画结束清空事件 
            console.log('点击事件2',flag);
        })
        console.log('点击事件1',flag);
    })
})