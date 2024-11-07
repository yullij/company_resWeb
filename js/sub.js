//서브페이지 공용 소스 231101 김진솔

(function($) {
    let fileRoot = window.location.href.split('/'),
        fileName = fileRoot[fileRoot.length-1].includes('view') ? fileRoot[fileRoot.length-1].split('_')[0] : fileRoot[fileRoot.length-1];

    //패스박스 불러오기
    $.ajax({
        type: 'GET',
        url: '/data/yuhancare/inc/json/menu_'+lang+'.json',
        async:false,
        dataType: 'json',
        success: function(data) {

            let pathlink = data.link;

            //키값 역추적
            let obj1 = Object.keys(pathlink),
                obj2 = Object.keys(data.depth2),
                obj3 = Object.keys(data.depth3);

            let nowPageKey = obj1.find((key) => pathlink[key].includes(fileName) === true),
                isDepth3 = typeof obj3.find((key) => data.depth3[key].includes(nowPageKey) === true) !== 'undefined', //3차메뉴 검증
                parentPageKey = isDepth3 ? obj3.find((key) => data.depth3[key].includes(nowPageKey) === true) : nowPageKey,
                rootPageKey = obj2.find((key) => data.depth2[key].includes(parentPageKey) === true);

            let path1 = rootPageKey,
                path2 = parentPageKey,
                path3 = isDepth3 ? nowPageKey : undefined;

            let pathEle1 = '',
                pathEle2 = '';

            if(document.querySelector('h2.page_name')) {
                document.querySelector('h2.page_name').innerText = nowPageKey;
            }

            if(lang == 'ko') document.querySelector('head title').innerText = nowPageKey + '│유한건강생활';
            if(lang == 'en') document.querySelector('head title').innerText = nowPageKey + '│Yuhan Care';

            for(var j=0;j<data.depth2[path1].length;j++) {
                if(nowPageKey == data.depth2[path1][j] || parentPageKey == data.depth2[path1][j]) {
                    pathEle1 += `<li class="path_item active"><a class="path_text" href="${pathlink[data.depth2[path1][j]]}"><span>${data.depth2[path1][j]}</span></a></li>`;
                } else {
                    pathEle1 += `<li class="path_item"><a class="path_text" href="${pathlink[data.depth2[path1][j]]}"><span>${data.depth2[path1][j]}</span></a></li>`;
                }
            }

            if(document.querySelector('.path_wrap .path_list')) {
                document.querySelector('.path_wrap .path_list').innerHTML = pathEle1;
            }

            if(typeof path3 !== 'undefined'){
                document.querySelector('#content').insertAdjacentHTML('afterbegin', '<div class="sub_tabbox"><ul class="tab_list"></ul></div>');
                for(var k=0;k<data.depth3[path2].length;k++) {
                    if(data.depth3[path2][k] === nowPageKey) {
                        pathEle2 += `<li class="active"><a class="tab_btn" href="${pathlink[data.depth3[path2][k]]}">${data.depth3[path2][k]}</a></li>`;
                    } else {
                        pathEle2 += `<li><a class="tab_btn" href="${pathlink[data.depth3[path2][k]]}">${data.depth3[path2][k]}</a></li>`;
                    }
                }

                if(document.querySelector('.sub_tabbox .tab_list')) {
                    document.querySelector('.sub_tabbox .tab_list').innerHTML = pathEle2;
                }
            }
        }
    });

    const url = location.href.split('#')[0];
    if(location.hash) {
        const hashNumber = Number(location.hash.split('#')[1]);
        $('.sub_tabbox .tab_list li').eq(hashNumber-1).addClass('active').siblings().removeClass('active');
        $('.tab_match .matchbox').eq(hashNumber-1).addClass('active').siblings().removeClass('active');
    }

    $(function() {
        $('.sub_tabbox .tab_list li button.tab_btn').on('click', function() {
            let parentIndex = Number($(this).parent().index());
            $(this).parent().addClass('active').siblings().removeClass('active');
            $('.tab_match .matchbox').eq(parentIndex).addClass('active').siblings().removeClass('active');

            location.href = url + '#' + (parentIndex+1);

            $(this).parents('.tab_list').animate({
                scrollLeft : $(this).offset().left
            },200);

            $('html, body').animate({
                scrollTop : $('.sub_tabbox').offset().top + 10,
            },300,'swing');
        });

        if($('.sub_tabbox').length > 0) {
            $(window).scroll(function() {
                let nowTop = $(document).scrollTop();

                if(nowTop > $('.sub_tabbox').offset().top) {
                    $('.sub_tabbox .tab_list').addClass('fixed');
                } else {
                    $('.sub_tabbox .tab_list').removeClass('fixed');
                }
            });
        }
    });
})(jQuery);