var stage = document.querySelector('.stage')
var game_start = document.querySelector('.stage .game_start')
var sceneGame = document.querySelector('.stage .game')
var button = document.querySelector('.stage .game_start .start')
var span = document.querySelector('.stage .score span')
var ranking = document.querySelector('.stage .game .ranking')
var resurgence = document.querySelector(".game .resurgence");
var restart = document.querySelector(".game .restart");
var dead = document.querySelector(".game .dead");

// 我方飞机属性
var propertyOurPlane = {
    src: './images/our-plane.gif',
    boom: './images/our-plane-boom.gif',
    width: 66,
    height: 80,
    blood: 3,
    delay: 60
}

// 我方子弹属性
var propertyOurBullet = {
    src: './images/our-bullet.png',
    boom: './images/boom.png',
    width: 6,
    height: 14,
    speed: -10,
    blood: 1
}

// 敌方小飞机属性
var propertyEnemyPlaneS = {
    src: './images/enemy-plane-s.png',
    boom: './images/enemy-plane-s-boom.gif',
    hint: './images/enemy-plane-s-boom.gif',
    width: 34,
    height: 24,
    speed: 4,
    blood: 1,
    delay: 30,
    grade: 1
}

// 敌方中等飞机属性
var propertyEnemyPlaneM = {
    src: './images/enemy-plane-m.png',
    boom: './images/enemy-plane-m-boom.gif',
    hit: './images/enemy-plane-m-hit.png',
    width: 46,
    height: 60,
    speed: 3,
    blood: 3,
    delay: 50,
    grade: 2
}

// 敌方大飞机属性
var propertyEnemyPlaneL = {
    src: './images/enemy-plane-l.png',
    boom: './images/enemy-plane-l-boom.gif',
    hit: './images/enemy-plane-l-hit.png',
    width: 110,
    height: 164,
    speed: 2,
    blood: 5,
    delay: 70,
    grade: 3
}

// 元素构造
// src/boom/hit：存放元素不同状态图片的路径  width/height:元素的宽和高  b:元素的原始血量(不变)  blood:元素的血量(可变)
// speed:元素的速度  d:元素原始的延时销毁时间(不变)  delay:元素延时销毁的时间(不变)  grade:元素携带的分数(主要用于敌方飞机)
// score:元素的成绩  x:元素出现时的初始x轴位置   y:元素出现时的初始y轴位置  bullets:存放子弹的数组
function Element(element, x, y) {
    this.src = element.src
    this.boom = element.boom
    this.hit = element.hit
    this.width = element.width
    this.height = element.height
    this.b = element.blood
    this.blood = element.blood
    this.speed = element.speed
    this.d = element.delay
    this.delay = element.delay
    this.grade = element.grade
    this.score = 0
    this.x = x
    this.y = y
    this.bullets = []
}


// 创建元素，并将其添加到画布
Element.prototype.draw = function () {
    this.node = document.createElement('img')
    this.node.src = this.src
    this.updataAttribute()
    sceneGame.appendChild(this.node)
}


// 更新元素的位置
Element.prototype.updataAttribute = function () {
    this.node.style.left = this.x - this.width / 2 + 'px'
    this.node.style.top = this.y - this.height / 2 + 'px'
}


// 移动所有的子弹
Element.prototype.bulletMove = function () {
    this.bullets.forEach(function (bullet) {
        bullet.y += bullet.speed
        bullet.updataAttribute()
    })
}


// 创建子弹,并将其放入子弹数组
Element.prototype.createBullet = function (element) {
    var bullet = new Element(propertyOurBullet, element.x, element.y)
    if (game.buff === true) {
        // 判断飞机是否有buff,如果有，在飞机的导弹两个位置也生成子弹
        var leftBullet = new Element(propertyOurBullet, element.x + 20, element.y)
        var rightBullet = new Element(propertyOurBullet, element.x - 20, element.y)
        leftBullet.draw()
        rightBullet.draw()
        this.bullets.push(leftBullet, rightBullet)
    }
    bullet.draw()
    this.bullets.push(bullet)
}


// 判断子弹是否超出画布
Element.prototype.checkTopOver = function () {
    this.bullets.forEach(function (bullet, index, bullets) {
        // 由于子弹是向上移动的，所以只需要判断子弹是否超出画布的顶部
        if (bullet.y < -bullet.height / 2) {
            sceneGame.removeChild(bullet.node)
            bullets.splice(index, 1)
        }
    })
}


// 游戏构造器
// gameBgPosY : 背景移动时Y轴的位置  scenceW/scenceH：屏幕的宽和高   bulletThick:子弹生成的时间间隔
// enemyDensity:敌方飞机生成的时间间隔  buff:飞机的buff  frame：判断帧数  enemys:存放敌方飞机的数组
function Game() {
    this.gameBgPosY = 0
    this.scenceW = window.innerWidth
    this.scenceH = window.innerHeight
    this.bulletThick = 10
    this.enemyDensity = 50
    this.buff = false
    this.frame = 0
    this.enemys = []
}


// 创建敌方飞机，并将其放入敌方飞机数组
Game.prototype.createEnemy = function (enemy) {
    var randomNum = Math.floor(Math.random() * game.scenceW)
    var enemy = new Element(enemy, randomNum, -enemy.height / 2)
    enemy.draw()
    this.enemys.push(enemy)
}


// 移动所有敌方飞机
Game.prototype.enemyAllMove = function () {
    this.enemys.forEach(function (enemy) {
        enemy.y += enemy.speed
        enemy.updataAttribute()
    })
}


// 判断敌方飞机是否超出画布
Game.prototype.checkButtomOver = function () {
    this.enemys.forEach(function (enemy, index, enemys) {
        if (enemy.y > (game.scenceH + enemy.height / 2)) {
            // 由于敌方飞机是向下移动，所以只需要判断敌方飞机是否超出画布的底部
            sceneGame.removeChild(enemy.node)
            enemys.splice(index, 1)
        }
    })
}


// 检测两个元素是否碰撞
Game.prototype.checkCrash = function (ele1, ele2) {
    var x = Math.abs(ele1.x - ele2.x) < (ele1.width + ele2.width) / 2
    var y = Math.abs(ele1.y - ele2.y) < (ele1.height + ele2.height) / 2
    return x && y
}


// 两个元素碰撞之后的结果
Game.prototype.crashResult = function () {
    this.enemys.forEach(function (enemy) {
        if (enemy.blood > 0) {
            if (game.checkCrash(enemy, ourPlane)) {
                // 我方飞机与敌方飞机相撞，敌方飞机血量变0，我方飞机血条-1，并且将图片变为爆炸时的图片
                enemy.blood = 0
                ourPlane.blood--
                ourPlane.node.src = ourPlane.boom
            }
            ourPlane.bullets.forEach(function (bullet) {
                if (game.checkCrash(enemy, bullet)) {
                    // 子弹与敌方飞机相撞，敌方飞机、子弹的血量-1
                    enemy.blood--
                    bullet.blood--
                }
            })
        }
    })
}


// 检测敌方飞机、子弹的血量
Game.prototype.checkBlood = function () {
    this.enemys.forEach(function (enemy) {

        if (enemy.blood < enemy.b && enemy.blood > 0) {
            // 当敌方飞机的血量小于原始血量，但是不为0时，将其图片更换为被击打后的图片
            enemy.node.src = enemy.hit
        } else if (enemy.blood <= 0 && !enemy.die) {
            // 如果敌方飞机的血量<=0，且没有被标记死亡
            enemy.die = true
            // 标记死亡
            enemy.node.src = enemy.boom
            // 将其图片更换为爆炸时的图片
            ourPlane.score += enemy.grade
            // 增加玩家得分
        }
        // if (enemy.blood <= 0 && !enemy.die) {
        //     enemy.die = true
        // } else if (enemy.blood <= 0 && enemy.die && enemy.delay > 0) {
        //     enemy.delay > 0
        // } else if (enemy.blood <= 0 && enemy.die && enemy.delay <= 0) {
        //     sceneGame.removeChild(enemy.node)
        //     enemys.splice(index, 1)
        // }
    })
    ourPlane.bullets.forEach(function (bullet, index) {
        if (bullet.blood <= 0) {
            // 当子弹的血量<=0时，删除子弹的节点，并在子弹数组中删除该项
            sceneGame.removeChild(bullet.node)
            ourPlane.bullets.splice(index, 1)
        }
    })
}

// 清楚所有死亡的飞机
Game.prototype.clearAllDead = function () {
    this.enemys.forEach(function (enemy, index, enemys) {
        if (enemy.die) {
            // 判断敌方飞机是否有死亡标记
            if (enemy.delay > 0) {
                // 当敌方飞机的延时销毁时间>0时，敌方飞机的延时销毁时间-1
                enemy.delay--
            } else {
                // 当敌方飞机的延时销毁时间 <=0时,删除敌方飞机的节点，并在敌方飞机数组中删除该项
                sceneGame.removeChild(enemy.node)
                enemys.splice(index, 1)
            }
        }
    })
    if ((ourPlane.blood < ourPlane.b) && (ourPlane.blood > 0)) {
        // 当我方飞机血条>0且<原始血条时(即我方飞机还有生命)
        if (ourPlane.delay > 0) {
            // 当我方飞机延时时间>0时,延时时间-1
            ourPlane.delay--
        } else if (ourPlane.delay <= 0) {
            // 当我方飞机延时时间<=0时，我方飞机重新恢复初始状态(图片换为初始状态，延时时间重新变为30)
            ourPlane.node.src = propertyOurPlane.src
            ourPlane.delay = 30
        }
    }
    if (ourPlane.blood <= 0) {
        // 当我方飞机血条<=0时，游戏结束
        game.gameOver()
    }
}

// 游戏暂停
Game.prototype.pause = function () {
    // 停止定时器
    clearInterval(this.setIntervalId)
    // 将停止标记变为0(表示游戏已经停止))
    this.state = 0
    // 将排行榜显示出来
    ranking.style.top = 2 * ranking.offsetHeight + 'px'
}

// 游戏结束
Game.prototype.gameOver = function () {
    // 暂停游戏
    this.pause()
    // 将游戏结束后的选择按钮显示出来
    dead.style.bottom = '100px'
}


// 开始游戏
Game.prototype.gameStart = function () {
    var _this = this
    this.setIntervalId = window.setInterval(function () {
        game.state = 1
        // 将停止标记变为1(表示游戏已经开始))
        game.frame++
        span.innerText = '玩家得分：' + ourPlane.score
        if (ourPlane.score > _this.getCookie(performance)) {
            _this.setCookie('performance',ourPlane.score,1000)
        }
        if (game.frame % game.bulletThick === 0) {
            // 每隔 ? 帧生成一个子弹
            ourPlane.createBullet(ourPlane)
        }

        if (game.frame % game.enemyDensity === 0) {
            // 每隔 ? 帧生成一架敌方飞机

            var randomNum = Math.floor(Math.random() * 100)
            // 生成随机数，根据随机数所处的方位判断这次生成的敌方飞机的型号
            if (randomNum < 70) {
                game.createEnemy(propertyEnemyPlaneS)
            } else if (randomNum < 95) {
                game.createEnemy(propertyEnemyPlaneM)
            } else {
                game.createEnemy(propertyEnemyPlaneL)
            }
        }
        ourPlane.bulletMove()
        // 子弹移动
        ourPlane.checkTopOver()
        // 判断子弹是否超出画布
        game.enemyAllMove()
        // 敌方飞机移动
        game.checkButtomOver()
        // 判断敌方飞机是否超出画布
        game.crashResult()
        // 超出画布的结果
        game.checkBlood()
        // 检测所有元素的血量/血条
        game.clearAllDead()
        // 清理所有已经死亡的飞机
    }, 30)
    ranking.style.top = -2 * ranking.offsetHeight + 'px'
    // 将排行榜隐藏
}

Game.prototype.setCookie = function (key, value, exdays) {
    if (exdays) {
        var d = new Date()
        var f = d.getTime() + 24 * 60 * 60 * 1000 * exdays
        document.cookie = key + '=' + value + ';expires=' + new Date(f)
    } else {
        document.cookie = key + '=' + value
    }
    return '创建成功'
}


Game.prototype.getCookie = function (key) {
    var str = document.cookie
    // 先获取所有的cookie值
    var value
    // 创建变量用来接收键值
    str.split(';').forEach(function (keyValue, index, strArray) {
        // 将str用；分隔开，成为一个键值队的数组
        var subArray = keyValue.split('=')
        // 将键值队用=分隔开成为一个数组，成为当个键名或者键值,用subArray接收
        if (subArray[0].trim() === key) {
            // 判断数组中的第一个值(第一个值都为键名)是否与参数相同
            value = subArray[1]
            // 用value接收数组中的第二个值(都为键值)
            // console.log(value)

            for (var i = 2; i < subArray.length; i++) {
                // 防止键值中存在'='，会干扰数组分隔，会分隔很多的元素，
                // 所以将第二个值之后的所有的值都用'='连接起来
                value = value.concat('=', subArray[i])
                // console.log(value)
            }
        }
    })
    return value
}

sceneGame.ontouchmove = function (event) {
    var x = event.touches[0].pageX
    var y = event.touches[0].pageY
    // 获取当前手指拖动的x轴和y轴位置


    x = x > game.scenceW ? game.scenceW : x
    x = x < 0 ? 0 : x
    y = y > game.scenceH ? game.scenceH : y
    y = y < 0 ? 0 : y
    // 三元运算，判断当前手指的位置是否超出画布，如果超出，将位置的值定在边界值

    ourPlane.x = x
    ourPlane.y = y
    // 将当前手指拖动的位置赋值给我方飞机的位置


    ourPlane.node.style.left = ourPlane.x - ourPlane.width / 2 + 'px'
    ourPlane.node.style.top = ourPlane.y - ourPlane.height / 2 + 'px'
    // 更新我方飞机的位置
}

var game
var ourPlane

button.onclick = function () {
    stage.style.marginLeft = '-100%'
    game = new Game()
    ourPlane = new Element(propertyOurPlane, game.scenceW / 2, game.scenceH - propertyOurPlane.height / 2)
    ourPlane.draw()
    game.gameStart()
    // 开始游戏
}

sceneGame.ontouchstart = function (start) {

    var startX = start.touches[0].pageX
    var startY = start.touches[0].pageY
    sceneGame.ontouchend = function (end) {
        var endX = end.changedTouches[0].pageX
        var endY = end.changedTouches[0].pageY

        if ((startX === endX) && (startY === endY)) {
            // 当手指移入和手指移出时的位置是一样的时候，判断其为点击
            if (game.state === 0) {
                // 当游戏停止标记为0时，判断为游戏停止，开始游戏
                game.gameStart()
            } else {
                // 反之，判断为游戏开始，停止游戏
                game.pause()
            }
        }
    }
}

restart.onclick = function () {
    window.location.reload()
    // 刷新页面
}
resurgence.onclick = function () {
    ourPlane.blood = ourPlane.b
    // 初始化我方飞机的血条
    dead.style.bottom = -dead.offsetHeight + 'px'
    // 隐藏按钮
    ourPlane.node.src = propertyOurPlane.src
    // 将我方飞机的图片重新换成初始图片
}
span.onclick = function () {
    // 彩蛋，点击分数，给我方飞机添加buff
    game.buff = true
    setTimeout(function () {
        // 10秒后，buff消失
        game.buff = false
    }, 10000)
}






