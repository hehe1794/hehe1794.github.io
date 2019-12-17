var stage = document.querySelector('.stage')
var thumbs = document.querySelectorAll('.stage .wrap .content .card .thumb')
var cardBgs = document.querySelectorAll('.stage .wrap .content .card .bg')

document.body.onmousemove = function (event) {
    var x = event.clientX - stage.offsetLeft - stage.offsetWidth / 2
    var y = event.clientY - stage.offsetTop - stage.offsetHeight / 2

    stage.style.transform = 'rotateY(' + (x / 20) + 'deg) rotateX(' + (y / 20) + 'deg)'

    thumbs.forEach(function (element, index) {
        if (index == 2) {
            element.style.backgroundPosition = 20 + (x / 20) + 'px ' + (y / 20)+ 'px'
        } else {
            element.style.backgroundPosition = 20 + (x / 20) + 'px ' + (40 + (y / 20)) + 'px'
        }


    })
    cardBgs.forEach(function (element) {

        element.style.backgroundPosition = (-50 - (x / 20)) + 'px ' + (-50 - (y / 20)) + 'px'
    })
}