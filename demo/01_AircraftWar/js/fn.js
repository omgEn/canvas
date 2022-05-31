/**
 * @description 加载图片
 * @bgUrl {String} 图片路径
 * @canvas {Object}
 * @completeCallback {fn} 回调函数
 */
function loadBackground(bgURL,canvas,completeCallback){
	var context = canvas.getContext('2d');
	var width = canvas.width;
	var height = canvas.height;
	var image = new Image();
	image.onload = function(){
		context.drawImage(this,0,0,width,height)
		context.drawImage(this,0,-height,width,height)
		completeCallback&&completeCallback(image)
	}
	image.src = bgURL
}

var backgroundOffset = 0
// 实现背景滚动
function animateBackground(canvas,image,speed){
	var context = canvas.getContext('2d');
	var width = canvas.width;
	var height = canvas.height;
	
	// 清除画布
	context.clearRect(0,0,width,height)
	// 存储状态
	context.save();
	
	// 更新位置
	backgroundOffset += speed;
	if(backgroundOffset>=height){
		backgroundOffset = 0
	}
	context.translate(0,backgroundOffset)
	
	// 绘制图片
	context.drawImage(image,0,0,width,height)
	context.drawImage(image,0,-height,width,height)
	
	// 获取存储的状态
	context.restore()
}

// 创建飞机
function createPlane(w,h,canvas,imageURL,completeCallback){
	var context = canvas.getContext('2d');
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	
	// 飞机坐标位置，水平居中，离底部20px
	var x = canvasWidth/2 - w/2 
	var y = canvasHeight - h - 20 
	
	var plane = new Plane(x,y,w,h,imageURL,completeCallback);
	
	document.onkeydown = function(event){
		var event = event || windiw.event;
		switch(event.keyCode){
			case 37: { plane.left = true; break}
			case 38: { plane.up = true; break}
			case 39: { plane.right = true; break}
			case 40: { plane.down = true; break}
		}
	}
	
	document.onkeyup = function(event){
		var event = event || windiw.event;
		switch(event.keyCode){
			case 37: { plane.left = false; break}
			case 38: { plane.up = false; break}
			case 39: { plane.right = false; break}
			case 40: { plane.down = false; break}
		}
	}
	
	timer = setInterval(function(){
		var {x,y} = plane;
		if(plane.left) {
			if(x<=0) return
			plane.x -= 2
		}
		if(plane.up) {
			if(y<=0)return
			plane.y -= 2
		}
		if(plane.right) {
			if(x>=canvasWidth-w) return
			plane.x += 2
		}
		if(plane.down){
			if(y>=canvasHeight-h)return
			plane.y += 2
		} 
	},10)
	
	return plane
}

// 飞机类
class Plane {
	constructor(x,y,w,h,imageURL,completeCallback) {
		this.x = x<0?0:x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.image = new Image()
		// 加载图片
		this.image.onload = function(){
			completeCallback&&completeCallback()
		}
		this.image.src = imageURL;
		
		// 图片开关
		this.switchBool = true
	}
	// 绘制飞机；canvas： 画布对象
	draw(canvas){ 
		var context = canvas.getContext('2d');
		var {x,y,w,h,image,switchBool} = this
		// drawImage: 前四个参数对图片截取的位置大小，后四个参数图片摆放的地址
		context.drawImage(image,x,y*switchBool,w,h)
		this.switchBool = -1*switchBool
	}
}

// 创建子弹
function createBullet(bWidth,bHeight,bURL,plane){
	var x = plane.x + plane.w/2 - bWidth/2
	var y = plane.y - bHeight
	var bullet = new Bullet(x,y,bWidth,bHeight,bURL)
	// 子弹的声音
	// var bSound = new Audio('路径')
	// bSound.play()
	return bullet
}	

class Bullet {
	constructor(x,y,w,h,imageURL) {
		this.x = x;
		this.y = y;
		this.w = w
		this.h = h
		this.image = new Image()
		this.image.onload = function(){}
		this.image.src = imageURL
	}
	// 生成子弹
	draw(canvas){
		var context = canvas.getContext('2d');
		var {x,y,w,h,image} = this
		// drawImage: 图片摆放的地址
		context.drawImage(image,x,y,w,h)
	}
	// 让子弹移动
	move(){
		this.y -= 10;
	}
	// 子弹是否出屏幕
	isOutOfScreen(){
		return this.y < -this.h
	}
}

function getRandomEnemy(min,max){
	return Math.round(Math.random()*(max-min)+min)
}	


// 创建敌机
function createEnemy(w,h,url,canvas){
	// 变量名不能与类名一致否则报错：enemyPlane is not constructor,有空查下原因。
	var enemy = new enemyPlane(w,h,url,canvas)
	return enemy
}

// 碰撞检测
function isEnemyHitPlane(obj1,obj2) {
	if(!obj1||!obj2)return
	var minX1 = obj1.x
	var minY1 = obj1.y
	var maxX1 = obj1.x + obj1.w
	var maxY1 = obj1.y + obj1.h
	
	var minX2 = obj2.x
	var minY2 = obj2.y
	var maxX2 = obj2.x + obj2.w
	var maxY2 = obj2.y + obj2.h
	
	var minX = Math.max(minX1,minX2)
	var minY = Math.max(minY1,minY2)
	var maxX = Math.min(maxX1,maxX2)
	var maxY = Math.min(maxY1,maxY2)
	
	return minX<maxX&&minY<maxY
}

// 敌机类
class enemyPlane{
	constructor(w,h,url,canvas) {
		this.x = getRandomEnemy(0,canvas.width-w)
		this.y = h;
		this.w = w
		this.h = h
		
		this.speed = getRandomEnemy(3,10)
		this.image = new Image()
		this.image.onload = function(){}
		this.image.src = url
	}
	draw(canvas){
		var context = canvas.getContext('2d');
		var {x,y,w,h,image} = this
		context.drawImage(image,x,y,w,h)
	}
	move(){
		this.y += this.speed;
	}
	// 是否出屏
	isOutOfScreen(canvas) {
		return this.y > canvas.height 
	}
	// 被击中
	crash() {
		// var endSound = new Audio('')
		// endSound.play()
	}
}