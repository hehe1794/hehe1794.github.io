var y = 0
var current = 0
var canWheel = true
var angle = 360
var judge = true

function createDot() {
    $('.stage li').each(function (index, element) {
        $('.stage .pagenation').append('<span></span>');
    });
}
createDot()

function showPic() {
    console.log('xxx');

    $('.stage li').eq(0).animate({
        'margin-top': (current * -100) + 'vh'
    })
        .end()
        .children()
        .children()
        .addClass('active')

    $('.stage .pagenation span')
        .eq(current)
        .addClass('active')
        .siblings()
        .removeClass('active')

}

showPic()



function nextPic() {
    current++
    current = current > 4 ? 4 : current
    showPic()
    // console.log('xxx');
}

function prevPic() {
    current--
    current = current < 0 ? 0 : current
    showPic()
}

$('body').on('wheel', function (e) {
    // console.log(e.originalEvent.deltaY);
    y += e.originalEvent.deltaY
    console.log(y);
    setTimeout(function () {
        if (canWheel) {
            // console.log('xxx');

            canWheel = false
            if (y >= 250) {
                // console.log(y);

                nextPic()
            }
            if (y <= -250) {
                prevPic()
            }
        }
        setTimeout(function () {
            canWheel = true
        }, 500)
        y = 0
    }, 300)
})

$('.stage .pagenation span').click(function () {
    console.log('xxx');

    current = $(this).index()
    showPic()
});

$('.stage li.first .star img').css('transform', 'rotateZ(' + angle + 'deg)')
$('.stage li.second .moon img').css('transform', 'rotateZ(' + angle + 'deg)')
setInterval(function () {
    angle += 360
    $('.stage li.first .star img').css('transform', 'rotateZ(' + angle + 'deg)')
    $('.stage li.second .moon img').css('transform', 'rotateZ(' + angle + 'deg)')

    if (judge) {
        judge = false
        $('.stage .third img').eq(0).css('opacity', 1).siblings().css('opacity', 0);
    } else {
        judge = true
        $('.stage .third img').eq(1).css('opacity', 1).siblings().css('opacity', 0);
    }
    // angle = 0
    // $('.stage li.first .star img').css('transition', 'none')
    // $('.stage li.second .moon img').css('transition', 'none')
    // $('.stage li.first .star img').css('transform', 'rotateZ(' + angle + 'deg)')
    // $('.stage li.second .moon img').css('transform', 'rotateZ(' + angle + 'deg)')
    // $('.stage li.first .star img').css('transition', 'all 3s linear')
    // $('.stage li.second .moon img').css('transition', 'all 3s linear')
}, 3000)


$('.stage li.fourth').mousemove(function (e) {
    if (e.clientX > document.body.offsetWidth / 2) {
        $('.stage li.fourth .left .connection .f3b').css('width', 130 + (e.clientX - document.body.offsetWidth / 2) / 10 + 'px');
    } else {
        $('.stage li.fourth .left .connection .f2b').css('width', 130 + (document.body.offsetWidth / 2 - e.clientX) / 10 + 'px');
    }

    $('.stage li.fourth .left .connection .bg').css('left', (e.clientX - document.body.offsetWidth / 2) / 10 + 'px');
    $('.stage li.fourth .left .connection .bg').css('top', (e.clientY - document.body.offsetHeight / 2) / 10 + 'px');

});

$('.stage li.fifth .cloud').mousemove(function (e) {

    $('.stage li.fifth .cloud').css('left', (e.clientX - document.body.offsetWidth / 2) / 30 + 'px');
    $('.stage li.fifth .cloud img').eq(1).css('left', (e.clientX - document.body.offsetWidth / 2) / 20 + 'px');
    $('.stage li.fifth .cloud img').eq(1).css('top', (e.clientY - document.body.offsetHeight / 2) / 20 + 'px');
    $('.stage li.fifth .cloud img').eq(0).css('transform', 'rotateZ(' + (36 - (e.clientY - document.body.offsetHeight / 2) / 5) + 'deg)');

})
