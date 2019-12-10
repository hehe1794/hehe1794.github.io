var img = new Image()
img.src = './preloadsheet.png'
var ballArr = []
// 存放随机生成的球的数组

var sortArr = []

var frame = 0
// 帧数

var ballMinR = 1
// 生成小球的最小半径
var ballMaxR = 40
// 生成小球的最大半径

/**  @type {HTMLCanvasElement} */
var canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')



// 游戏参数
var game = {
    stageW: 360,
    stageH: 640,
    score: 0,
    upgrade: true,
    center: {
        x: 360 / 2,
        y: 640 / 2
    },
    start: false
}

// 颜色
var colorArr = [
    "#FF9966",
    "#FF6666",
    "#99CCFF",
    "#666633",
    "#6699CC",
    "#CCCCFF",
    "#CC3399",
    "#66CCCC",
    "#CC0066"
]

// 游戏开始界面的大圆的参数
var ballA = {
    r: 50,
    maxR: 50,
    minR: 40,
    x: game.stageW / 2 - 40,
    y: game.stageH / 2 - 50,
    color: randomColor(),
    zoom: false
}

// 游戏开始界面的小圆的参数
var ballB = {
    r: 30,
    maxR: 30,
    minR: 20,
    x: game.stageW / 2 + 20,
    y: game.stageH / 2 - 30,
    color: randomColor(),
    zoom: false
}



// 游戏开始界面 开始按钮参数
var start_btn = {
    name: 'start_btn_png',
    w: game.stageW / 2,
    h: ((file['start_btn_png'].h / file['start_btn_png'].w) * (game.stageW / 2)),
    x: (game.stageW - game.stageW / 2) / 2,
    y: game.stageH / 2 + 100
}

// 游戏结束结算界面
var balance_base = {
    name: 'balance_base_bg_png',
    w: game.stageW,
    h: ((file['balance_base_bg_png'].h / file['balance_base_bg_png'].w) * game.stageW),
    x: 0,
    y: game.stageH / 2 - 200
}


// 设置画布大小
function canvasSize() {
    canvas.width = game.stageW
    canvas.height = game.stageH
}


// 生成一个m~n之间的随机整数
function randomNum(m, n) {
    return (Math.floor(Math.random() * (n - m)) + m)
}


// 生成一个m~n之间的随机数
function randomFloat(m, n) {
    return ((Math.random() * (n - m)) + m)
}


// 修改画布背景色
function drawBg() {
    ctx.fillStyle = '#eaeaea'
    ctx.fillRect(0, 0, game.stageW, game.stageH)
}


// 生成随机颜色
function randomColor() {
    return colorArr[randomNum(0, 9)]
}

// 绘制圆
function drawCircle(ball) {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = ball.color
    ctx.fill()
}

// 绘制圆环
function drawLoop(x, y, r, color) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.closePath()
    ctx.strokeStyle = color
    ctx.stroke()
}

// 更新圆/圆环的大小
function updateSize(obj) {
    if (!obj.zoom) {
        obj.r -= 0.3
        // 判断圆的大小是否达到最小值
        obj.zoom = obj.r < obj.minR ? true : false
    } else {
        obj.r += 0.3
        // 判断圆的大小是否达到最大值
        obj.zoom = obj.r > obj.maxR ? false : true
    }
}



// 绘制按钮
function drawBtn(obj) {
    // drawImage(img,sx,sy,swidth,sheight,x,y,width,height)
    // 绘制图像、画布、视频
    // 参数: img:绘制的图像/画布/视频  sx: 开始剪切的x坐标位置  xy: 开始剪切的y坐标位置 
    // swidth: 被剪切图像的宽度  sheight: 被剪切图片的高度  x: 在画布上放置图像的x坐标位置  
    // y: 在画布上放置图像的y坐标位置  width:要使用图像的宽度(即剪切出来之后的图像的宽度)  height:要使用图像的高度

    ctx.drawImage(
        img,
        file[obj.name].x,
        file[obj.name].y,
        file[obj.name].w,
        file[obj.name].h,
        obj.x,
        obj.y,
        obj.w,
        obj.h
    )
}


// 构造器，生成小球
function Ball(m, n) {
    this.r = randomFloat(m, n)
    this.color = randomColor()
    this.over = false
    this.death = false
}

// 随机生成小球的初始位置
Ball.prototype.generateCoord = function () {
    var num = randomNum(0, 3)
    // 根据小球初始位置在canvas不同的边，其随机坐标也不相同
    switch (num) {
        // 根据小球随机生成的位置,判断小球的坐标
        case 0:
            // 上面
            this.x = randomNum(0, game.stageW)
            this.y = - this.r
            break;
        case 1:
            // 右边
            this.x = game.stageW + this.r
            this.y = randomNum(0, game.stageW)

            break;
        case 2:
            // 下面
            this.x = randomNum(0, game.stageW)
            this.y = game.stageH + this.r
            break;
        case 3:
            // 左边
            this.x = - this.r
            this.y = randomNum(0, game.stageW)
            break;
    }
}


// 随机生成小球的速度
Ball.prototype.generateSpeed = function () {
    // 根据小球初始位置在canvas不同的边，其随机速度也不相同
    if (this.x < 0) {
        this.sx = 3
        this.sy = randomNum(-3, 3)
    }
    if (this.x > game.stageW) {
        this.sx = -3
        this.sy = randomNum(-3, 3)
    }
    if (this.y < 0) {
        this.sy = 3
        this.sx = randomNum(-3, 3)
    }
    if (this.y > game.stageH) {
        this.sy = -3
        this.sx = randomNum(-3, 3)
    }
}


// 小球移动
Ball.prototype.move = function () {
    this.x = this.x + this.sx
    this.y = this.y + this.sy
}

// 检测小球是否超出画布
Ball.prototype.checkOver = function () {
    var topOver = this.y < -this.r
    var bottomOver = this.y > game.stageH + this.r
    var leftOver = this.x < -this.r
    var rightOver = this.x > game.stageW + this.r

    return topOver || bottomOver || leftOver || rightOver
}


// 检测碰撞
Ball.prototype.checkCrash = function (frame) {
    var distance = Math.sqrt((this.x - ourBall.x) * (this.x - ourBall.x) + ((this.y - ourBall.y) * ((this.y - ourBall.y))))
    if (distance < (this.r + ourBall.r) && !this.death) {
        this.checkSize(frame)
    }
}


// 判断我方小球和敌方小球的半径大小，并根据大小做出相应处理
Ball.prototype.checkSize = function (frame) {
    if (this.r < ourBall.r) {
        // 如果敌方小球的半径小于我方小球，我方小球的半径、圆环的最大最小半径、得分增加，敌方小球标记死亡
        ourBall.r += this.r / 10
        ourBall.loop.minR += this.r / 10
        ourBall.loop.maxR += this.r / 10
        this.death = true
        game.score++
    } else {
        if (frame > 200) {
            // 如果敌方小球的半径大于或等于我方小球,游戏结束
            gameOver()
        }

    }
}



// 我方小球构造器
function OurBall() {
    this.r = 5;
    this.x = game.stageW / 2 - this.r;
    this.y = game.stageH / 2 - this.r
    this.color = 'black'
    this.loop = {
        // 圆环属性
        r: this.r,
        minR: this.r,
        maxR: this.r + 10,
        color: randomColor(),
        zoom: true
    }
}


// 给数组对象键名排序
function calculate(e) {
    for (var j = 0; j < sortArr.length; j++) {
        if (sortArr.length == 1) {
            for (key1 in e) {

                for (key2 in sortArr[j]) {
                    if ((parseInt(key1) <= (parseInt(key2)))) {
                        sortArr.push(e)
                        return
                    } else {
                        sortArr.splice(j, 0, e)
                        return
                    }
                }


            }
        } else {
            for (key1 in e) {
                for (key2 in sortArr[j]) {
                    if ((parseInt(key1) >= (parseInt(key2)))) {
                        sortArr.splice(j, 0, e)
                        return
                    } else if (j == (sortArr.length - 1)) {
                        sortArr.push(e)
                        return
                    }
                }
            }
        }
    }
}

// 计算排名
function ranking(arr) {
    var sum = 0
    var rank = 0
    for (var i = 0; i < arr.length; i++) {
        for (key in arr[i]) {
            if (game.score <= parseInt(key)) {
                sum += arr[i][key]
            } else {
                sum += arr[i][key]
                rank += arr[i][key]
            }
        }
    }

    console.log(sum, rank);

    return (rank / sum)
}



// 结算界面
function settlement() {

    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(0, 0, 360, 640)

    var rank = parseInt(ranking(sortArr) * 100)
    drawBtn(balance_base)
    ctx.font = "20px Arial";
    ctx.fillStyle = 'white'
    ctx.fillText(rank, 190, game.stageH / 2 + 22);
    ctx.fillText(game.score, 175, game.stageH / 2 - 40);

}


// 游戏准备
function gameReady() {

    // 绘制开始按钮
    drawBtn(start_btn)

    // 更新开始界面大小两个球的尺寸(半径r)
    updateSize(ballA)
    updateSize(ballB)

    // 绘制开始界面的大小两个球
    drawCircle(ballA)
    drawCircle(ballB)
}



// 开始游戏
function gameStart() {
    // console.log('游戏开始');
    frame++

    // 当小球的半径达到一定程度时，增加生成敌方小球的最小最大半径
    if (ourBall.r % 30 > 20) {
        if (game.upgrade) {
            game.upgrade = false
            console.log('难度增加');
            ballMinR += 10
            ballMaxR += 30
        }
    } else {
        game.upgrade = true
    }

    // 每10帧生成一个敌方小球
    if (frame % 10 == 0) {
        var newBall = new Ball(ballMinR, ballMaxR)
        newBall.generateCoord()
        newBall.generateSpeed()

        ballArr.push(newBall)
    }

    // 遍历存放敌方小球的数组
    ballArr.forEach(function (ball) {

        ball.move()
        // 更改小球的坐标
        drawCircle(ball)
        // 重新画出小球

        if (ball.checkOver()) {
            // 判断小球是否超出画布
            ball.over = true
        }
    })


    // 遍历存放敌方小球的数组
    ballArr.forEach(function (ball, index) {
        if (ball.over || ball.death) {
            // 判断敌方小球是否超出画布或者死亡
            // 如果超出或者死亡，则从数组中删除这个元素
            ballArr.splice(index, 1)
        }
        ball.checkCrash(frame)
        // 判断我方小球是否与敌方小球发生碰撞
    })

    // 画出我方小球
    drawCircle(ourBall)

    if (frame < 200) {
        // 画出我方小球的圆环
        drawLoop(ourBall.x, ourBall.y, ourBall.loop.r, ourBall.loop.color)
        // 圆环大小修改
        updateSize(ourBall.loop)
    }


    // 更新得分
    ctx.font = "30px Arial";
    ctx.fillStyle = "#333333";
    ctx.fillText(game.score, 10, 50);
}

// 游戏结束
function gameOver() {
    clearInterval(id)

    if (localStorage.score) {
        console.log('不是第一次');
        // localStorage.clear()
        var oldArr = []
        sortArr = []
        oldArr = JSON.parse(localStorage.score)

        for (var i = 0; i < oldArr.length; i++) {
            for (key in oldArr[i]) {
                if (key == game.score) {
                    oldArr[i][key]++
                    localStorage.score = JSON.stringify(oldArr)

                    sortArr = JSON.parse(localStorage.score)

                    settlement()
                    return
                }
            }
        }



        var newScore = {}
        newScore[game.score] = 1
        oldArr.push(newScore)

        for (var i = 0; i < oldArr.length; i++) {
            if (sortArr.length == 0) {
                sortArr.push(oldArr[i])
            } else {
                calculate(oldArr[i])
            }
        }

        localStorage.score = JSON.stringify(sortArr)


        settlement()

    } else {
        console.log('第一次');

        var newScore = {}
        newScore[game.score] = 1
        localStorage.score = JSON.stringify([newScore])

        sortArr = JSON.parse(localStorage.score)
        drawBtn(balance_base)

        settlement()
    }



}



// 游戏主体
var ourBall = new OurBall()

canvasSize()
var id = setInterval(function () {
    // 每一帧都清空一次画布
    ctx.clearRect(0, 0, game.stageW, game.stageH);

    // 绘制背景颜色
    drawBg()

    if (!game.start) {
        gameReady()
    } else {
        gameStart()
    }

}, 30)



// 开始按钮点击事件
canvas.onclick = function (event) {

    // 判断在canvas点击的位置的x、y坐标是否在按钮范围内，若在，点击开始游戏
    var xCrash = (event.offsetX <= (start_btn.x + start_btn.w)) && (event.offsetX >= start_btn.x)
    var yCrash = (event.offsetY <= (start_btn.y + start_btn.h)) && (event.offsetY >= start_btn.y)

    if (xCrash && yCrash) {
        game.start = true
    }
}


if (window.innerWidth < 500) {
    // 小球拖动事件
    canvas.ontouchmove = function (event) {

        var x = event.touches[0].pageX
        var y = event.touches[0].pageY

        x = x > game.stageW ? game.stageW : x
        x = x < 0 ? 0 : x
        y = y > game.stageH ? game.stageH : y
        y = y < 0 ? 0 : y


        ourBall.x = x
        ourBall.y = y
    }
} else {
    // 小球移动时间
    canvas.onmousemove = function (event) {

        var x = event.offsetX
        var y = event.offsetY

        x = x > game.stageW ? game.stageW : x
        x = x < 0 ? 0 : x
        y = y > game.stageH ? game.stageH : y
        y = y < 0 ? 0 : y


        ourBall.x = x
        ourBall.y = y
    }
}




