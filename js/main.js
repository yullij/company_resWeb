let setVideo;
//let videoEle = document.querySelector('#slide_video');

let visualSlide = new Swiper('.visual_slide', {
    speed : 1000,
    allowTouchMove: true,
    loop: true,
    loopAdditionalSlides : 1,
    mousewheel: false,
    watchSlidesProgress: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    on : {
        progress: function() {
            for (var i = 0; i < this.slides.length; i++) {
                var slideProgress = this.slides[i].progress;
                var innerOffset = this.width * 0.5;
                var innerTranslate = slideProgress * innerOffset;
                this.slides[i].querySelector('.bg').style.transform = `translate3d(${innerTranslate}px,0,0)`;
            }
        },
        setTransition: function(swiper,speed) {
            for (var i = 0; i < this.slides.length; i++) {
                this.slides[i].style.transition = speed + 'ms';
                this.slides[i].querySelector('.bg').style.transition = speed + 'ms';
            }
        },
        slideChange : function() {
            $('.visual_slide .slide_paging li').eq(this.realIndex).addClass('active').siblings().removeClass('active on');
            $('.visual_slide .slogan span').eq(this.realIndex).addClass('active').siblings().removeClass('active');
            // if(this.realIndex === 3) {
            //     $('.visual_slide .holding .change').addClass('on');
            //     this.autoplay.stop();
            // } else {
            $('.visual_slide .holding .change').eq(this.realIndex).addClass('on').siblings().removeClass('on');
                // clearInterval(setVideo);
                // this.autoplay.start();
                // videoEle.pause();
            // }
        },
        slideChangeTransitionEnd : function() {
            $('.slide_paging li').eq(this.realIndex).addClass('on');
            // if(this.realIndex === 3) {
            //     videoEle.play();
            //     videoEle.playbackRate = 1.5;
            //     setVideo = setInterval(function() {
            //         document.querySelector('.slide_paging .video-slide .btn_bar').style.width = videoEle.currentTime/videoEle.duration*100 + '%';
            //     },500);
            // }
        }
    }
});
// videoEle.addEventListener('ended', function() {
//     visualSlide.slideNext();
//     this.currentTime = 0;
// });

$.ajax({
    type: 'GET',
    url: '/data/yuhancare/inc/json/news.json',
    dataType: 'json',
    async:false,
    success: function(data) {
        let newsItem = '';
        for(var i=0;i<3;i++) {
            newsItem += `<div class="news_item">
                <a href="/media/news_view?key=${data[i].no}">
                    <div class="news_thumb link_icon">
                        <img src="${data[i].img}" alt="${data[i].title}">
                    </div>
                    <div class="news_title">${data[i].title}</div>
                </a>
            </div>`;
        }

        document.querySelector('.sec03 .news_conbox .news_list').innerHTML = newsItem;
    }
});

$.ajax({
    type: 'GET',
    url: '/data/yuhancare/inc/json/youtube.json',
    dataType: 'json',
    async:false,
    success: function(data) {
        let youtubeItem = '';
        for(var i=0;i<5;i++) {
            youtubeItem += `<div class="youtube_item">
                <a href="${data[i].url}" target="_blank" title="새창" class="link_icon">
                    <img src="${data[i].img}" alt="${data[i].title}">
                </a>
            </div>`;
        }

        document.querySelector('.sec03 .youtube_conbox').innerHTML = youtubeItem;
    }
});

$('.sec03 .analects .imgbox img:first-child').nextAll().hide();

let analectLength = $('.sec03 .analects .analects_text p').length,
    analectNumber = Math.floor(Math.random() * analectLength);
$('.sec03 .analects .analects_text').append($('.sec03 .analects .analects_text p').eq(analectNumber).prevAll());
$('.sec03 .analects .analects_text p').eq(0).nextAll().hide();

$(function() {
    setInterval(() => {
        let imgFirst = $('.sec03 .analects .imgbox img').eq(0);
        imgFirst.eq(0).fadeOut(1000).next().fadeIn(1000);
        $('.sec03 .analects .imgbox').append(imgFirst);

        let txtFirst = $('.sec03 .analects .analects_text p').eq(0);
        txtFirst.eq(0).fadeOut(1000).next().fadeIn(1000);
        $('.sec03 .analects .analects_text').append(txtFirst);
    },4000);

    $('.waypoint').each(function (i, v) {
        $(this).waypoint(function () {
            $(v).addClass('on')
        }, {
            offset: '90%'
        })
    });

    $('.slide_paging li button').on('click',function() {
        let thisIndex = $(this).parent().index();
        visualSlide.slideToLoop(thisIndex);
    });

    $('.sec02 .tab_box .brand_tab').on('click',function() {
        let thisIndex = Number($(this).index()) + 1;
        $(this).addClass('active').siblings().removeClass('active');
        $('.sec02 .mask_text').removeClass('type1 type2 type3 type4 type5').addClass('type'+thisIndex).find('.zoom_circle'+thisIndex).addClass('on').siblings().removeClass('on');
        $('.sec02 .matchbox .matchtext').eq(thisIndex - 1).addClass('active').siblings().removeClass('active');

        let route = '';
        if(lang != 'ko') route = lang;
        if(thisIndex === 1) {
            $('.sec02 .linkbox a').attr('href',route+'/corporation/about_yuhancare');
        } else if(thisIndex === 2) {
            $('.sec02 .linkbox a').attr('href',route+'/value/brand');
        } else {
            $('.sec02 .linkbox a').attr('href','/culture/talent');
        }
    });
});

(function(){
    function includeHtml() {
        const includeTarget = document.querySelectorAll('.includeJs');
        includeTarget.forEach(function(el, idx) {
            const targetFile = el.dataset.includeFile;
            if(targetFile){
                let xhttp = new XMLHttpRequest();
            
                xhttp.onreadystatechange = function() {
                    if (this.readyState === XMLHttpRequest.DONE) {
                        this.status === 200 ? (el.innerHTML = this.responseText) : null
                        this.status === 404 ? (el.innerHTML = 'include not found.') : null
                    }
                }
                xhttp.open('GET', targetFile, true);
                xhttp.send();
                return;
            }
        });
    };

    includeHtml();
})();