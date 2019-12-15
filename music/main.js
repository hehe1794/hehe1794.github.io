var current = 0


// json数据
var musics = {
    playlist: [{
        file: "./audio/jq22com1.mp3",
        thumb: "./images/01.jpg",
        trackName: "Dusk",
        trackArtist: "Tobu & Syndec",
        trackAlbum: "Single",
    },
    {
        file: "./audio/jq22com2.mp3",
        thumb: "./images/02.jpg",
        trackName: "Blank",
        trackArtist: "Disfigure",
        trackAlbum: "Single",
    },
    {
        file: "./audio/jq22com3.mp3",
        thumb: "./images/03.jpg",
        trackName: "Fade",
        trackArtist: "Alan Walker",
        trackAlbum: "Single",
    }
    ],
    autoPlay: true
}


// 播放音乐
function playMusic(element) {

    // 给audio添加路径
    $('.audioPlayer .music audio').attr('src', element.file);

    // 给对应的歌曲添加active，增加样式
    $('.playList .item').removeClass('active')
    $('.playList .item').eq(current).addClass('active')

    // 显示暂停按钮，隐藏播放按钮
    $('.audioPlayer .controls div .wrap i.play').css('display', 'block');
    $('.audioPlayer .controls div .wrap i.pause').css('display', 'none');
}



// 修改播放信息
function changeInformation(element) {

    setTimeout(function () {

        // 更新当前播放时间和总的播放时间
        var elapsed = $('.audioPlayer .music audio')[0].currentTime
        var total = $('.audioPlayer .music audio')[0].duration

        // 更新歌曲背景
        $('.audioPlayer .ui').css('background-image', 'url(' + element.thumb + ')')

        // 更新进度条
        $('.progress_bar input').attr('value', parseInt((elapsed / total) * 1000));
        $('.progress_bar .played').css('width', $('.progress_bar input').attr('value') / 10 + '%');


        var m1 = parseInt(elapsed / 60)
        var s1 = parseInt(elapsed % 60)
        if (m1 < 10) {
            if (s1 < 10) {
                var t1 = '0' + m1.toString() + ':' + '0' + s1.toString()
            } else {
                var t1 = '0' + m1.toString() + ':' + s1.toString()
            }
        } else {
            var t1 = m1.toString() + ':' + s1.toString()
        }

        $('.audioPlayer .ui .status_bar .time .elapsed').text(t1);

        var m2 = parseInt(total / 60)
        var s2 = parseInt(total % 60)
        if (m2 < 10) {
            if (s2 < 10) {
                var t2 = '0' + m2.toString() + ':' + '0' + s2.toString()
            } else {
                var t2 = '0' + m2.toString() + ':' + s2.toString()
            }
        } else {
            var t2 = m2.toString() + ':' + s2.toString()
        }

        $('.audioPlayer .ui .status_bar .time .total').text(t2);



        // 修改歌曲名称和作者信息
        $(' .audioPlayer .ui .status_bar .details .name').text(element.trackName);
        $(' .audioPlayer .ui .status_bar .details .artist').text(element.trackArtist);


    }, 50)

}



function prevAudio() {
    // 播放上一首歌曲
    current--
    current = current < 0 ? 2 : current
    playMusic(musics.playlist[current])
}

function nextAudio() {
    // 播放下一首歌曲
    current++
    current = current > 2 ? 0 : current
    playMusic(musics.playlist[current])
}

function pausedAudio() {
    // 暂停播放歌曲
    $('.audioPlayer .music audio')[0].pause()
    $('.audioPlayer .controls div .wrap i.pause').css('display', 'none');
    $('.audioPlayer .controls div .wrap i.play').css('display', 'block');
}

function playAudio() {
    // 开始播放歌曲
    $('.audioPlayer .music audio')[0].play()
    $('.audioPlayer .controls div .wrap i.play').css('display', 'none');
    $('.audioPlayer .controls div .wrap i.pause').css('display', 'block');
}


function init() {
    // 初始化
    playMusic(musics.playlist[0])
    changeInformation(musics.playlist[0])

    // 周期执行信息更替
    setInterval(function () {
        changeInformation(musics.playlist[current])
    }, 100);

    // 初始化音乐音量
    document.querySelector('.audioPlayer .music audio').volume = 0.5
}

init()

// 点击播放上一首歌曲
$('.audioPlayer .controls div i.prev').click(function (e) {

    e.preventDefault();
    prevAudio()
});

// 点击播放下一首歌曲
$('.audioPlayer .controls div i.next').click(function (e) {

    e.preventDefault();
    nextAudio()
});


// 点击暂停播放歌曲
$('.audioPlayer .controls div i.pause').click(function (e) {
    e.preventDefault();
    pausedAudio()
});

// 点击开始/继续播放歌曲
$('.audioPlayer .controls div i.play').click(function (e) {

    e.preventDefault();
    playAudio()
});


// 点击歌曲菜单，播放对应歌曲
$('.audioPlayer .playList .item').click(function (e) {
    e.preventDefault();
    current = $(this).index()
    playMusic(musics.playlist[current])
});


// 歌曲进度条跟随input range的value移动
$('.progress_bar input').on('input propertychange', function () {

    $('.progress_bar .played').css('width', this.value / 10 + '%');
    $('.audioPlayer .music audio')[0].currentTime = this.value / 1000 * $('.audioPlayer .music audio')[0].duration
});


// 音量进度条跟随input range的value移动
$('.volume_bar input').on('input propertychange', function () {

    $('.volume_bar .played').css('width', this.value * 10 + '%');
    document.querySelector('.audioPlayer .music audio').volume = this.value / 10

});


// 当当前歌曲播放完毕时，自动播放下一首歌曲
document.querySelector('.audioPlayer .music audio').onended = function () {
    console.log('xxx');
    nextAudio()
}

