// $('section.benefits .container .row .wrap')('active');
// $('section.benefits .container .row .wrap').click(function (e) { 
//     e.preventDefault();

//     $('section.benefits .container .row .wrap').removeClass('active');
//     $(this).addClass('active')     
// });

$(window).scroll(function () {
    if ($(window).scrollTop() > 0 && $(window).width() > 768) {
        console.log('xxx');
        $('nav.navbar').height(50);
        $('nav.navbar').css('padding','20px 0');
        $('nav.navbar').css('background', 'rgba(255, 255, 255, 0.9)');
        $('nav.navbar ul.navbar-right li a').css('color','black');
        $('nav.navbar .navbar-header a img').attr('src','./asset/images/logo-dark.png');

    }else {
        $('nav.navbar').height(50);
        $('nav.navbar').css('padding','35px 0');
        $('nav.navbar').css('background', 'none');
        $('nav.navbar ul.navbar-right li a').css('color','white');
        $('nav.navbar .navbar-header a img').attr('src','./asset/images/logo.png');
    }


});



if ($(window).width() < 768) {
    $('nav .container .navbar-brand img').attr('src', './asset/images/logo-free.png');
}

$('section.works .container-fluid .row .wrap #range').on('input', function () {
    console.log(parseInt($(this).val()) / 6750);
    $('section.works .container-fluid .row .wrap span').css('left', $(this).val() / 6750 * 97 + '%');
    $('.scroll-content').css('right', $(this).val() / 6750 * ($('.scroll-content').width() - $('.scroll-pane').width()) + 'px');
});


// $('ul.skills li').css('width', $(this).find('span.progress-percent').text());

