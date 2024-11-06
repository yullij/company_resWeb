//공통소스 231115 김진솔

let lang = $('html').attr('lang');
    console.log(lang);
(function($) {
    let userDeviceType = navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|android/i) ? 'mo' : 'pc';
    console.log(userDeviceType);

    $(function() {
        //gnb불러오기
        $.ajax({
            type: 'GET',
            url: '/data/yuhancare/inc/json/menu_'+lang+'.json',
            async: false,
            dataType: 'json',
            success: function(data) {
                let depth1 = data.depth1,
                    depth2 = data.depth2,
                    depth3 = data.depth3,
                    depthlink = data.link,
                    depthEle = '';

                for(var i=0;i<depth1.length;i++) {
                    depthEle += `<li class="depth_item depth1_item"><a class="depth_text depth1_text" href="${depthlink[depth1[i]]}">${depth1[i]}</a>`;

                    if(typeof depth2[depth1[i]] != 'undefined') {
                        depthEle += `<div class="depth depth2"><ul class="depth_list depth2_list">`;
                        for(var j=0;j<depth2[depth1[i]].length;j++) {
                            depthEle += `<li class="depth_item depth2_item"><a class="depth_text depth2_text" href="${depthlink[depth2[depth1[i]][j]]}">${depth2[depth1[i]][j]}</a>`;

                            if(depth3 && typeof depth3[depth2[depth1[i]][j]] != 'undefined') {
                                depthEle += `<div class="depth depth3"><ul class="depth_list depth3_list">`;
                                for(var k=0;k<depth3[depth2[depth1[i]][j]].length;k++) {
                                    depthEle += `<li class="depth_item depth3_item"><a class="depth_text depth3_text" href="${depthlink[depth3[depth2[depth1[i]][j]][k]]}">${depth3[depth2[depth1[i]][j]][k]}</a></li>`;

                                }
                                depthEle += `</ul></div>`;
                            }
                            depthEle += `</li>`;
                        }
                        depthEle += `</ul></div>`;
                    }
                    depthEle += `</li>`;
                }
                $('#header .depth1_list').html(depthEle);

                // gnb
                $('.depth_item').each(function() {
                    $(this).has('.depth').addClass('has');
                });
            },
            error: function(request, status, error) {
                console.log(error);
            }
        });

        if(userDeviceType == 'pc') {
            if(location.href.includes('people') || location.href.includes('recruit') || location.href.includes('faq')) $('.depth3').eq(0).parents('.depth2_item').addClass('active');
            if(location.href.includes('instagram') || location.href.includes('youtube') || location.href.includes('magazine')) $('.depth3').eq(1).parents('.depth2_item').addClass('active');
        }


        //맨위인지 판단
        var thisTop = $(document).scrollTop();
        if (thisTop > 0) {
            $('body').attr('data-top','no-top');
        }

        $(window).scroll( function() {
            thisTop = $(document).scrollTop();

            if (thisTop > 0) {
                $('body').attr('data-top','no-top');
            } else {
                $('body').attr('data-top','top');
            }
        });

        //스크롤 업다운 체크
        let nowScrollTop = 0,
            prevScrollTop = 0;

        let wheelMove = function() {
            return prevScrollTop - nowScrollTop > 0 ? 'up' : 'down';
        };
        $(window).scroll(function() {
            if($(document).scrollTop() > 0) {
                nowScrollTop = $(this).scrollTop();
                if(wheelMove() === 'up') {
                    $('html').removeClass('scroll_down');
                } else {
                    $('html').addClass('scroll_down');
                }
                prevScrollTop = nowScrollTop;
            } else {
                $('html').removeClass('scroll_down');
            }
        });

        //pc 1차메뉴 펼치기
        $('#header').on('mouseenter', function() {
            if(window.innerWidth > 1200) {
                $('html').addClass('gnb_open');
            }
        }).on('mouseleave', function() {
            if(window.innerWidth > 1200) {
                $('html').removeClass('gnb_open');
            }
        });

        //pc 메뉴 펼치기
        $(document).on('click','.depth_text',function(e) {
            var isHas = $(this).parent().hasClass('has'),
                isActive = $(this).parent().hasClass('active');
            if(isHas) {
                if(window.innerWidth > 1200) {
                    if($(this).hasClass('depth2_text')) {
                        e.preventDefault();
                        if(isActive) {
                            $(this).parent().removeClass('active');
                        } else {
                            $('.depth2_item').removeClass('active');
                            $(this).parent().addClass('active');
                        }
                    }
                } else {
                    e.preventDefault();
                    if(isActive) {
                        $(this).parent().removeClass('active');
                    } else {
                        $('.depth2_item').removeClass('active');
                        $(this).parent().addClass('active').siblings().removeClass('active');
                    }
                }
            }
        });
        $(document).on('focusin','.depth1_text',function() {
            $('html').addClass('gnb_open');
        });
        $(document).on('focusout','.depth1_item:last-child .depth_item:last-child .depth_text',function() {
            $('html').removeClass('gnb_open');
        });

        //gnb 열기
        $('.menu_open').on('click', function() {
            $('html').addClass('gnb_open');
        });
        //gnb 닫기
        $('.menu_close').on('click', function() {
            $('html').removeClass('gnb_open');
            $('.depth_item').removeClass('active');
        });


        var langOpen = '',
            lagnClose = '';
        if(lang == 'ko') {
            langOpen = '열기';
            lagnClose = '닫기';
        } else if(lang == 'en') {
            langOpen = 'open';
            lagnClose = 'close';
        }
        //언어설정 열기
        $('.lang_select').on('click', function() {
            if($(this).attr('title') === langOpen) {
                $(this).addClass('on').attr('title',lagnClose);
            } else if($(this).attr('title') === lagnClose) {
                $(this).removeClass('on').attr('title',langOpen);
            }
        });

        //패밀리사이트
        $('.link_open').on('click', function() {
            if($(this).attr('title') === langOpen) {
                // $('.link_open').attr('title',langOpen).removeClass('on');
                // $('.link_open + ul').removeClass('active');
                $(this).attr('title',lagnClose).addClass('on').siblings('ul').addClass('active');
            } else {
                $(this).attr('title',langOpen).removeClass('on').siblings('ul').removeClass('active');
            }
        });



        //반응형 테이블
        $('.table.responsive').each(function() {
            let $th = $(this).find('th');
            $(this).find('tbody tr').each(function(index, v) {
                for(var i=0;i<$th.length;i++) {
                    let $thText = $th.eq(i).text();
                    $(v).find('td').eq(i).attr('data-content',$thText + ' : ');
                }
            });
        });

        //풀사이즈 레이어 팝업 닫기
        $('.full_layer .ly_close, .full_layer .fix_close').on('click',function() {
            $('#container, #footer').show();
            $(this).parents('.full_layer').removeClass('active');
            window.scrollTo(0,$('#content button.pop_'+$(this).attr('name')).offset().top - 300);
            $('#content button.pop_'+$(this).attr('name')).focus();
        });

        document.querySelectorAll('.link_icon').forEach((v,i) => {
            v.insertAdjacentHTML('beforeend', '<div class="link_deco"></div>');
        });
    });
})(jQuery);